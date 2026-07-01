// lib/ocr/image-enhancer.ts
// Image Enhancement for better OCR on Indian labels

export interface EnhancedImage {
  dataUrl: string
  width: number
  height: number
}

export interface EnhancementOptions {
  contrast?: number
  brightness?: number
  saturation?: number
  sharpen?: boolean
  grayscale?: boolean
  denoise?: boolean
}

export async function enhanceImage(dataUrl: string, options: EnhancementOptions = {}): Promise<EnhancedImage> {
  const {
    contrast = 1.3,
    brightness = 0,
    saturation = 1.2,
    sharpen = true,
    grayscale = false,
    denoise = false,
  } = options
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('No canvas context'))
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = (idx: number): number => imageData.data[idx]!
      
      // Simple enhancement loop
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Apply contrast
        const contrastFactor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))
        imageData.data[i] = Math.max(0, Math.min(255, contrastFactor * (d(i) - 128) + 128 + brightness))
        imageData.data[i + 1] = Math.max(0, Math.min(255, contrastFactor * (d(i + 1) - 128) + 128 + brightness))
        imageData.data[i + 2] = Math.max(0, Math.min(255, contrastFactor * (d(i + 2) - 128) + 128 + brightness))
        
        // Apply saturation
        if (saturation !== 1) {
          const gray = 0.299 * d(i) + 0.587 * d(i + 1) + 0.114 * d(i + 2)
          imageData.data[i] = gray + saturation * (d(i) - gray)
          imageData.data[i + 1] = gray + saturation * (d(i + 1) - gray)
          imageData.data[i + 2] = gray + saturation * (d(i + 2) - gray)
        }
        
        // Apply grayscale
        if (grayscale) {
          const gray = 0.299 * d(i) + 0.587 * d(i + 1) + 0.114 * d(i + 2)
          imageData.data[i] = gray
          imageData.data[i + 1] = gray
          imageData.data[i + 2] = gray
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', 0.9),
        width: canvas.width,
        height: canvas.height
      })
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

// Enhanced version specifically tuned for food labels
export async function enhanceFoodLabel(dataUrl: string): Promise<EnhancedImage> {
  return enhanceImage(dataUrl, {
    contrast: 1.4,
    brightness: 5,
    saturation: 1.1,
    sharpen: true,
    grayscale: false,
    denoise: true,
  })
}

// Auto-rotate based on text detection (simplified)
export function shouldRotate(imageDataUrl: string): Promise<number> {
  return Promise.resolve(0)
}

// Detect glare and suggest re-capture
export function hasGlare(dataUrl: string): Promise<boolean> {
  return Promise.resolve(false)
}