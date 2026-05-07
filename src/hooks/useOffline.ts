// hooks/useOffline.ts
// React hook for offline functionality

import { useState, useEffect, useCallback } from 'react'
import { 
  initOfflineDB, 
  cacheProduct, 
  getCachedProduct, 
  getRecentProducts,
  isOnline,
  processQueue,
  getStorageInfo,
  cacheBrandData
} from '@/lib/offline-cache'

export function useOffline() {
  const [online, setOnline] = useState(true)
  const [cachedProducts, setCachedProducts] = useState<any[]>([])
  const [dbReady, setDbReady] = useState(false)
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0 })

  // Initialize
  useEffect(() => {
    async function init() {
      try {
        await initOfflineDB()
        setDbReady(true)
        
        // Load cached products
        const products = await getRecentProducts(50)
        setCachedProducts(products)
        
        // Get storage info
        const info = await getStorageInfo()
        setStorageInfo(info)
        
        // Try to process any queued actions
        await processQueue()
      } catch (e) {
        console.error('Offline DB init failed:', e)
      }
    }
    init()
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true)
      processQueue() // Process queue when back online
    }
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Cache a product
  const cache = useCallback(async (product: any) => {
    if (!dbReady) return
    await cacheProduct(product)
    // Refresh list
    const products = await getRecentProducts(50)
    setCachedProducts(products)
  }, [dbReady])

  // Get cached product
  const getProduct = useCallback(async (barcode: string) => {
    if (!dbReady) return null
    return getCachedProduct(barcode)
  }, [dbReady])

  // Cache brand data
  const cacheBrands = useCallback(async (brands: Record<string, string>) => {
    if (!dbReady) return
    await cacheBrandData(brands)
  }, [dbReady])

  return {
    online,
    dbReady,
    cachedProducts,
    storageInfo,
    cacheProduct: cache,
    getCachedProduct: getProduct,
    cacheBrands,
    processQueue,
  }
}