// lib/ocr/image-enhancer.ts
// Step 1: Image Enhancement for better OCR on Indian labels

export interface EnhancedImage {
  dataUrl: string
  width: number
  height: number
}

export async function enhanceImage(dataUrl: string): Promise<EnhancedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('No canvas context'))
        return
      }
      
      // Set canvas size
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw original image
      ctx.drawImage(img, 0, 0)
      
      // Get image data for manipulation
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Apply enhancements
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast (multiply deviation from 128)
        const contrast = 1.3
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))
        
        data[i] = factor * (data[i] - 128) + 128     // R
        data[i + 1] = factor * (data[i + 1] - 128) + 128 // G
        data[i + 2] = factor * (data[i + 2] - 128) + 128 // B
        
        // Slight sharpening via unsharp mask effect (simplified)
        // Boost saturation slightly for better color separation
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        const saturation = 1.2
        data[i] = gray + saturation * (data[i] - gray)
        data[i + 1] = gray + saturation * (data[i + 1] - gray)
        data[i + 2] = gray + saturation * (data[i + 2] - gray)
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

// Auto-rotate based on text detection (simplified)
export function shouldRotate(imageDataUrl: string): Promise<number> {
  // For now, return 0 (no rotation)
  // In production, would use ML to detect orientation
  return Promise.resolve(0)
}

// Detect glare and suggest re-capture
export function hasGlare(dataUrl: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(false)
        return
      }
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // Check for very bright spots (potential glare)
      let brightPixels = 0
      const totalPixels = data.length / 4
      const threshold = 250
      
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > threshold && data[i+1] > threshold && data[i+2] > threshold) {
          brightPixels++
        }
      }
      
      // If more than 10% pixels are very bright, likely has glare
      resolve(brightPixels / totalPixels > 0.1)
    }
    img.onerror = () => resolve(false)
    img.src = dataUrl
  })
}