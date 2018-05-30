// service worker
const CACHE_NAME = 'memory-game-v1'
const urlsToCache = [
    '/memory-game/',
    '/memory-game/index.html',
    '/memory-game/styles.css',
    '/memory-game/functions.js',
    '/memory-game/images/',
    '/memory-game/images/A.png',
    '/memory-game/images/B.png',
    '/memory-game/images/C.png',
    '/memory-game/images/D.png',
    '/memory-game/images/E.png',
    '/memory-game/images/F.png',
    '/memory-game/images/G.png',
    '/memory-game/images/H.png',
    '/memory-game/images/I.png',
    '/memory-game/images/J.png',
    '/memory-game/images/K.png',
    '/memory-game/images/L.png',
    '/memory-game/images/smile.png'
]

self.addEventListener('install', function (event) {
    // Perform install steps

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache')

                return cache.addAll(urlsToCache)
            })
    )
})

self.addEventListener('fetch', function (event) {
    // console.log('WORKER: fetch event in progress.');

    if (event.request.method !== 'GET') { return }
    event.respondWith(
        caches
            .match(event.request)
            .then(function (cached) {
                const networked = fetch(event.request)
                    .then(fetchedFromNetwork, unableToResolve)
                    .catch(unableToResolve)
                console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url)
                return cached || networked

                function fetchedFromNetwork (response) {
                    const cacheCopy = response.clone()
                    console.log('WORKER: fetch response from network.', event.request.url)
                    caches
                        .open(version + 'pages')
                        .then(function add (cache) {
                            cache.put(event.request, cacheCopy)
                        })
                        .then(function () {
                            console.log('WORKER: fetch response stored in cache.', event.request.url)
                        })

                    return response
                }

                function unableToResolve () {
                    console.log('WORKER: fetch request failed in both cache and network.', event.request.url)
                    return new Response('<h1>Service Unavailable</h1>', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/html'
                        })
                    })
                }
            })
    )
})