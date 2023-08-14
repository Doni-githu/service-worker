const staticCacheName = "s-app-v3"
const dynamicCacheName = "d-app-v2"
const assetUrls = [
    '/index.html',
    '/main.js',
    '/index.css',
    '/offline.html'
]
self.addEventListener('install', async (eve) => {
    const cache = await caches.open(staticCacheName)
    await cache.addAll(assetUrls)
})

self.addEventListener('activate', async (eve) => {
    const cacheNames = await caches.keys()
    await Promise.all(
        cacheNames
            .filter(value => value !== staticCacheName)
            .filter(value => value !== dynamicCacheName)
            .map(name => caches.delete(name))
    )
})

self.addEventListener('fetch', async (event) => {
    const {request} = event

    const url = new URL(request.url)

    if(url.origin === location.origin){
        event.respondWith(cacheFirst(request))
    }else{
        event.respondWith(networkFirst(request))
    }

    // event.respondWith(cacheFirst(event.request))
})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    
    return cached ?? await fetch(request)
}

async function networkFirst(request){
    const cache = await caches.open(dynamicCacheName)

    try {
        const response = await fetch(request)
        await cache.put(request, response.clone())
        return response
    } catch (error) {
        const cached = await cache.match(request)
        return cached ?? await caches.match('/offline.html')
    }


}