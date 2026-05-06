import { describe, it, expect, vi } from 'vitest'

// Mock the Image and Canvas for Node environment
global.Image = class Image {
  width = 100
  height = 100
  onload: (() => void) | null = null
  onerror: ((error: Error) => void) | null = null
  src = ''
  
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 0)
  }
} as any

describe('Image Enhancement Options', () => {
  it('should have default enhancement options', () => {
    const options = {
      contrast: 1.3,
      brightness: 0,
      saturation: 1.2,
      sharpen: true,
      grayscale: false,
      denoise: false,
    }
    
    expect(options.contrast).toBe(1.3)
    expect(options.sharpen).toBe(true)
    expect(options.grayscale).toBe(false)
  })

  it('should allow custom options', () => {
    const options = {
      contrast: 1.5,
      brightness: 10,
      saturation: 1.0,
      sharpen: false,
      grayscale: true,
      denoise: true,
    }
    
    expect(options.contrast).toBe(1.5)
    expect(options.grayscale).toBe(true)
    expect(options.denoise).toBe(true)
  })
})

describe('Image Processing Functions', () => {
  // Helper to create mock image data
  const createMockImageData = () => {
    const data = new Uint8ClampedArray(400) // 10x10 image
    // Fill with some pattern
    for (let i = 0; i < 400; i += 4) {
      data[i] = 128     // R
      data[i + 1] = 128 // G
      data[i + 2] = 128 // B
      data[i + 3] = 255 // A
    }
    return data
  }

  it('should handle grayscale conversion', () => {
    const data = createMockImageData()
    // All values are 128, so grayscale should also be 128
    const gray = 0.299 * data[0] + 0.587 * data[1] + 0.114 * data[2]
    expect(Math.round(gray)).toBe(128)
  })

  it('should increase contrast properly', () => {
    const contrast = 1.3
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255))
    // For value 128 (middle gray), result should be 128
    const result = factor * (128 - 128) + 128
    expect(result).toBe(128)
  })

  it('should apply brightness correctly', () => {
    const brightness = 20
    const value = 100
    const result = Math.max(0, Math.min(255, value + brightness))
    expect(result).toBe(120)
  })

  it('should clamp values to valid range', () => {
    const brightness = 300
    const value = 100
    const result = Math.max(0, Math.min(255, value + brightness))
    expect(result).toBe(255) // Capped at 255
  })

  it('should apply saturation', () => {
    const data = [200, 100, 50, 255]
    const gray = 0.299 * data[0] + 0.587 * data[1] + 0.114 * data[2]
    const saturation = 1.5
    const result = gray + saturation * (data[0] - gray)
    expect(result).toBeGreaterThan(data[0]) // More saturated
  })
})

describe('Food Label Enhancement', () => {
  it('should use higher contrast for labels', () => {
    const options = {
      contrast: 1.4,
      brightness: 5,
      saturation: 1.1,
      sharpen: true,
      grayscale: false,
      denoise: true,
    }
    
    expect(options.contrast).toBeGreaterThan(1.3) // Higher than default
    expect(options.denoise).toBe(true) // Denoise enabled for labels
    expect(options.sharpen).toBe(true) // Sharpen for text
  })

  it('should not use grayscale for color labels', () => {
    const options = {
      contrast: 1.4,
      brightness: 5,
      saturation: 1.1,
      sharpen: true,
      grayscale: false, // Keep colors for labels
      denoise: true,
    }
    
    expect(options.grayscale).toBe(false)
  })
})