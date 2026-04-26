// FILE: src/lib/imageUtils.ts

/**
 * Compresses a base64 image string using the browser Canvas API.
 * - Resizes to maxSidePx on the longest edge (default 1024px)
 * - Re-encodes as JPEG at given quality (default 0.82)
 * 
 * Safe to call in any "use client" component.
 * Returns the compressed base64 string (without the data: prefix).
 */
export async function compressImageBase64(
  base64: string,
  maxSidePx = 1024,
  quality   = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img

      // Compute target dimensions — preserve aspect ratio
      const scale  = Math.min(1, maxSidePx / Math.max(w, h))
      const width  = Math.round(w * scale)
      const height = Math.round(h * scale)

      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas 2D context unavailable')); return }

      ctx.drawImage(img, 0, 0, width, height)

      const dataUrl    = canvas.toDataURL('image/jpeg', quality)
      const compressed = dataUrl.split(',')[1]

      const origKB = Math.round(base64.length * 0.75 / 1024)
      const compKB = Math.round((compressed?.length ?? 0) * 0.75 / 1024)
      console.log(`[imageUtils] Compressed: ${origKB}KB → ${compKB}KB (${width}×${height})`)

      resolve(compressed)
    }

    img.onerror = () => {
      console.warn('[imageUtils] Image load failed — returning original uncompressed')
      resolve(base64) // safe fallback: send original rather than crashing
    }

    // Accepts base64 with or without data: prefix
    img.src = base64.startsWith('data:')
      ? base64
      : `data:image/jpeg;base64,${base64}`
  })
}