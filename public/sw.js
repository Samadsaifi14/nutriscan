const CACHE_NAME = 'nutriscan-v2'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/scan',
  '/history',
  '/profile-setup',
]
const API_CACHE_NAME = 'nutriscan-api-v2'
const API_CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const SCAN_CACHE_PATHS = ['/api/scan', '/api/products']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Determine if a URL matches a cacheable scan/product endpoint
function isCacheableScanApi(url) {
  return SCAN_CACHE_PATHS.some((p) => url.pathname.startsWith(p)) && url.searchParams.has('barcode')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // Scan & product APIs: Cache-First, refresh in background
  if (isCacheableScanApi(url)) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request)
        // If we have a fresh cached response, return it and refresh async
        if (cachedResponse) {
          const cachedDate = new Date(cachedResponse.headers.get('sw-cached-date') || 0).getTime()
          const age = Date.now() - cachedDate
          if (age < API_CACHE_DURATION_MS) {
            // Fire-and-forget refresh
            fetchAndCache(request, cache)
            return cachedResponse
          }
        }
        // Stale or missing — fetch, cache, return
        return fetchAndCache(request, cache).catch(() => cachedResponse || offlineApiResponse())
      })
    )
    return
  }

  // Other API calls (analyze, etc.): Network-First, cache for offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(API_CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || offlineApiResponse())
        )
    )
    return
  }

  // Static assets: Cache-First, update in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => cached)
      return cached || networkFetch
    })
  )
})

function fetchAndCache(request, cache) {
  return fetch(request).then((response) => {
    if (response.ok) {
      // Add a custom header to track when this was cached
      const headers = new Headers(response.headers)
      headers.append('sw-cached-date', new Date().toISOString())
      const cachedBody = response.clone()
      const responseWithDate = new Response(cachedBody.body, { status: cachedBody.status, statusText: cachedBody.statusText, headers })
      cache.put(request, responseWithDate)
    }
    return response
  })
}

function offlineApiResponse() {
  return new Response(
    JSON.stringify({ success: false, error: 'You are offline. Cached data may be available for previously scanned products.', offline: true }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}
