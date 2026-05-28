// lib/offline-cache.ts
// Offline functionality for BioYou

const DB_NAME = 'BioYou-offline'
const DB_VERSION = 1

interface CachedProduct {
  barcode: string
  name: string
  brand?: string
  image_url?: string
  ingredients_text?: string
  nutrition?: any
  analysis?: any
  cachedAt: number
}

const PRODUCT_STORE = 'products'
const BRAND_STORE = 'brands'
const SETTINGS_STORE = 'settings'

// Initialize IndexedDB
export async function initOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Products store
      if (!db.objectStoreNames.contains(PRODUCT_STORE)) {
        const productStore = db.createObjectStore(PRODUCT_STORE, { keyPath: 'barcode' })
        productStore.createIndex('cachedAt', 'cachedAt', { unique: false })
      }

      // Brand detection data store
      if (!db.objectStoreNames.contains(BRAND_STORE)) {
        db.createObjectStore(BRAND_STORE, { keyPath: 'prefix' })
      }

      // Settings store
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' })
      }
    }
  })
}

// Generic DB operations
async function getFromDB<T>(storeName: string, key: string): Promise<T | null> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

async function putInDB(storeName: string, data: any): Promise<void> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(data)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

async function getAllFromDB<T>(storeName: string): Promise<T[]> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || [])
  })
}

// Product caching
export async function cacheProduct(product: CachedProduct): Promise<void> {
  await putInDB(PRODUCT_STORE, {
    ...product,
    cachedAt: Date.now()
  })
}

export async function getCachedProduct(barcode: string): Promise<CachedProduct | null> {
  return getFromDB<CachedProduct>(PRODUCT_STORE, barcode)
}

export async function getRecentProducts(limit = 50): Promise<CachedProduct[]> {
  const products = await getAllFromDB<CachedProduct>(PRODUCT_STORE)
  return products
    .sort((a, b) => b.cachedAt - a.cachedAt)
    .slice(0, limit)
}

// Brand data caching
export async function cacheBrandData(brands: Record<string, string>): Promise<void> {
  for (const [prefix, name] of Object.entries(brands)) {
    await putInDB(BRAND_STORE, { prefix, name, cachedAt: Date.now() })
  }
}

export async function getCachedBrand(prefix: string): Promise<string | null> {
  const brand = await getFromDB<{ prefix: string; name: string }>(BRAND_STORE, prefix)
  return brand?.name || null
}

// Check online status
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

// Queue for offline actions
interface QueuedAction {
  id: string
  type: 'log_meal' | 'submit_product' | 'correct_product'
  data: any
  timestamp: number
}

const QUEUE_KEY = 'offline_action_queue'

export function addToQueue(action: QueuedAction): void {
  const queue = getQueue()
  queue.push(action)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function getQueue(): QueuedAction[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(QUEUE_KEY)
  return stored ? JSON.parse(stored) : []
}

export async function processQueue(): Promise<void> {
  if (!isOnline()) return

  const queue = getQueue()
  if (queue.length === 0) return

  for (const action of queue) {
    try {
      switch (action.type) {
        case 'log_meal':
          await fetch('/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data)
          })
          break
        case 'submit_product':
          await fetch('/api/products/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data)
          })
          break
      }
    } catch (e) {
      console.error('Failed to process queued action:', e)
    }
  }

  // Clear processed queue
  localStorage.setItem(QUEUE_KEY, '[]')
}

// Storage usage info
export async function getStorageInfo(): Promise<{ used: number; quota: number }> {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate()
    return {
      used: estimate.usage || 0,
      quota: estimate.quota || 0
    }
  }
  return { used: 0, quota: 0 }
}