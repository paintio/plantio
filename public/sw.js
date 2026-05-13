self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } })
    })
  )
})
