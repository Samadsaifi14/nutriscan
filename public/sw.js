// Bump this value when the static shell changes. Never cache authenticated API data.
const CACHE_NAME = 'nutriscan-shell-v3'
const STATIC_ASSETS = ['/']

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    // A single missing optional asset must not prevent the worker from installing.
    await Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset)))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((key) => key.startsWith('nutriscan-') && key !== CACHE_NAME).map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // API responses may contain profiles, health information, favourites or scan history.
  // Always send these to the server; never persist them in the shared-device Cache API.
  if (url.pathname.startsWith('/api/')) return

  // Keep navigations network-first. Do not cache personalised HTML documents.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME)
      return (await cache.match('/')) || new Response('You are offline. Reconnect to continue using NutriScan.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }))
    return
  }

  // Cache only successful, explicitly public static assets.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request)
    if (cached) return cached

    const response = await fetch(request)
    const cacheControl = response.headers.get('Cache-Control') || ''
    if (response.ok && !response.headers.has('Set-Cookie') && !/private|no-store/i.test(cacheControl)) {
      await cache.put(request, response.clone())
    }
    return response
  })())
})
