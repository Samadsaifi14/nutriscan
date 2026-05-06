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

// Convert to grayscale
function toGrayscale(data: Uint8ClampedArray): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data.length)
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    result[i] = gray
    result[i + 1] = gray
    result[i + 2] = gray
    result[i + 3] = data[i + 3]
  }
  return result
}

// Apply contrast adjustment
function applyContrast(data: Uint8ClampedArray, contrast: number): Uint8ClampedArray {
  const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))
  const result = new Uint8ClampedArray(data.length)
  for (let i = 0; i < data.length; i += 4) {
    result[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128))
    result[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128))
    result[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128))
    result[i + 3] = data[i + 3]
  }
  return result
}

// Apply brightness adjustment
function applyBrightness(data: Uint8ClampedArray, brightness: number): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data.length)
  for (let i = 0; i < data.length; i += 4) {
    result[i] = Math.max(0, Math.min(255, data[i] + brightness))
    result[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness))
    result[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness))
    result[i + 3] = data[i + 3]
  }
  return result
}

// Apply saturation adjustment
function applySaturation(data: Uint8ClampedArray, saturation: number): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data.length)
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    result[i] = Math.max(0, Math.min(255, gray + saturation * (data[i] - gray)))
    result[i + 1] = Math.max(0, Math.min(255, gray + saturation * (data[i + 1] - gray)))
    result[i + 2] = Math.max(0, Math.min(255, gray + saturation * (data[i + 2] - gray)))
    result[i + 3] = data[i + 3]
  }
  return result
}

// Simple sharpening kernel (3x3)
function applySharpen(data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data.length)
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ]
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const kIdx = (ky + 1) * 3 + (kx + 1)
          r += data[idx] * kernel[kIdx]
          g += data[idx + 1] * kernel[kIdx]
          b += data[idx + 2] * kernel[kIdx]
        }
      }
      const idx = (y * width + x) * 4
      result[idx] = Math.max(0, Math.min(255, r))
      result[idx + 1] = Math.max(0, Math.min(255, g))
      result[idx + 2] = Math.max(0, Math.min(255, b))
      result[idx + 3] = data[idx + 3]
    }
  }
  
  // Copy edges from original
  for (let i = 0; i < width; i++) {
    const topIdx = i * 4
    const bottomIdx = ((height - 1) * width + i) * 4
    result[topIdx] = data[topIdx]
    result[topIdx + 1] = data[topIdx + 1]
    result[topIdx + 2] = data[topIdx + 2]
    result[bottomIdx] = data[bottomIdx]
    result[bottomIdx + 1] = data[bottomIdx + 1]
    result[bottomIdx + 2] = data[bottomIdx + 2]
  }
  for (let i = 0; i < height; i++) {
    const leftIdx = (i * width) * 4
    const rightIdx = (i * width + width - 1) * 4
    result[leftIdx] = data[leftIdx]
    result[leftIdx + 1] = data[leftIdx + 1]
    result[leftIdx + 2] = data[leftIdx + 2]
    result[rightIdx] = data[rightIdx]
    result[rightIdx + 1] = data[rightIdx + 1]
    result[rightIdx + 2] = data[rightIdx + 2]
  }
  
  return result
}

// Simple denoise using box blur
function applyDenoise(data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
  const result = new Uint8ClampedArray(data.length)
  const kernelSize = 3
  const half = Math.floor(kernelSize / 2)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0
      
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const nx = x + kx
          const ny = y + ky
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const idx = (ny * width + nx) * 4
            r += data[idx]
            g += data[idx + 1]
            b += data[idx + 2]
            count++
          }
        }
      }
      
      const idx = (y * width + x) * 4
      result[idx] = Math.round(r / count)
      result[idx + 1] = Math.round(g / count)
      result[idx + 2] = Math.round(b / count)
      result[idx + 3] = data[idx + 3]
    }
  }
  return result
}

// Auto levels (stretch histogram)
function applyAutoLevels(data: Uint8ClampedArray): Uint8ClampedArray {
  let min = 255, max = 0
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    if (gray < min) min = gray
    if (gray > max) max = gray
  }
  
  if (max === min) return data
  
  const result = new Uint8ClampedArray(data.length)
  const range = max - min
  
  for (let i = 0; i < data.length; i += 4) {
    result[i] = Math.max(0, Math.min(255, ((data[i] - min) / range) * 255))
    result[i + 1] = Math.max(0, Math.min(255, ((data[i + 1] - min) / range) * 255))
    result[i + 2] = Math.max(0, Math.min(255, ((data[i + 2] - min) / range) * 255))
    result[i + 3] = data[i + 3]
  }
  
  return result
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
      
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let data = imageData.data
      
      // Apply enhancements in order
      if (denoise) {
        data = applyDenoise(data, canvas.width, canvas.height)
      }
      
      if (grayscale) {
        data = toGrayscale(data)
      }
      
      data = applyAutoLevels(data)
      data = applyBrightness(data, brightness)
      data = applyContrast(data, contrast)
      data = applySaturation(data, saturation)
      
      if (sharpen && !grayscale) {
        data = applySharpen(data, canvas.width, canvas.height)
      }
      
      // Copy back to imageData
      for (let i = 0; i < data.length; i++) {
        imageData.data[i] = data[i]
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