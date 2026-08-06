/*
 * MRP文件编辑器 Service Worker
 * 部署路径: /app/mrpeditor/
 * 全部使用相对路径, 相对于本 sw.js 所在目录解析, 天然适配子路径部署。
 */
const CACHE_NAME = 'mrpeditor-cache-v1';

/* 安装时预缓存的应用外壳资源 */
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './dist/mrpEditor.bundle.js',
    './icon.png',
    './icon-192.png',
    './icon-512.png',
    './favicon.ico',
    './RcEditor/',
    './RcEditor/index.html',
    './RcEditor/dist/RcEditor.bundle.js',
    './BmaViewer/',
    './BmaViewer/index.html',
    './BmaViewer/dist/Map565Viewer.bundle.js',
    /* 第三方 CDN 资源 */
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://code.jquery.com/jquery-3.6.0.min.js'
];

/* 安装: 逐个缓存, 单个失败不影响整体安装 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(
                PRECACHE_URLS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW] 预缓存失败:', url, err);
                    })
                )
            )
        ).then(() => self.skipWaiting())
    );
});

/* 激活: 清理旧版本缓存 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

/* 写入缓存(仅缓存成功/不透明响应) */
function putCache(request, response) {
    if (!response || (!response.ok && response.type !== 'opaque')) return;
    caches.open(CACHE_NAME).then((cache) => cache.put(request, response)).catch(() => {});
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    /* 页面导航请求: 网络优先, 失败时回退缓存, 最终回退到应用首页 */
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    putCache(request, response.clone());
                    return response;
                })
                .catch(() =>
                    caches.match(request).then(
                        (cached) => cached || caches.match('./index.html')
                    )
                )
        );
        return;
    }

    /* 其余资源: 缓存优先, 后台更新(stale-while-revalidate) */
    event.respondWith(
        caches.match(request).then((cached) => {
            const networkFetch = fetch(request)
                .then((response) => {
                    putCache(request, response.clone());
                    return response;
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});
