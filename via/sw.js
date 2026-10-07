/* =============================================================
 * Via 浏览器主页 · Service Worker
 * 作用：把站点资源（尤其是大图片）缓存到浏览器本地，
 *        之后访问优先从本地读取，提升加载速度并支持离线。
 * 部署路径：https://xxx/via/sw.js  (scope = /via/)
 * ============================================================= */

const VERSION = 'v1';
const CACHE = 'via-pwa-' + VERSION;
const BASE = '/via/';

/* ---------- 1. 预缓存清单 ---------- */
/* 核心外壳（HTML/CSS/JS）+ 全部图片，特别是两个大图片：
 *   - img/google12345.gif  (~2.8MB)
 *   - img/54485964.png     (~488KB 背景图)
 * 安装时即抓取到本地，之后访问直接命中缓存。            */
const PRECACHE_URLS = [
  BASE,                       // /via/ 目录（通常由 index.html 提供）
  BASE + 'index.html',
  BASE + 'min.html',
  BASE + 'css.css',
  BASE + 'cookies.js',
  BASE + 'search.js',
  BASE + 'search-suggest.js',
  // 图标与小图
  BASE + 'img/blog.png',
  BASE + 'img/bd.png',
  BASE + 'img/book.png',
  BASE + 'img/dh.png',
  BASE + 'img/fy.png',
  BASE + 'img/game.png',
  BASE + 'img/history.png',
  BASE + 'img/swipe_for_fb.png',
  BASE + 'img/weather.png',
  // 大图片（优先本地）
  BASE + 'img/mrp.png',          // ~56KB
  BASE + 'img/54485964.png',     // ~488KB 背景图
  BASE + 'img/google12345.gif'    // ~2.8MB
];

/* ---------- 2. install：预缓存，逐条容错 ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // 逐条缓存，单条失败（如网络抖动）不影响整体安装
    await Promise.allSettled(
      PRECACHE_URLS.map((url) => cache.add(url).catch((e) => {
        console.warn('[PWA] 预缓存失败:', url, e);
      }))
    );
    // 安装完成立即生效，无需等旧 SW
    await self.skipWaiting();
  })());
});

/* ---------- 3. activate：清理旧缓存 ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((k) => (k !== CACHE ? caches.delete(k) : null))
    );
    // 立刻接管所有 /via/ 下的页面
    await self.clients.claim();
  })());
});

/* ---------- 4. fetch：缓存策略 ---------- */
function isSameOrigin(req) {
  return new URL(req.url).origin === self.location.origin;
}
function isImage(pathname) {
  return /\.(png|jpe?g|gif|webp|svg|ico|bmp|avif)$/i.test(pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 只处理 /via/ 下的同源 GET 请求
  if (req.method !== 'GET') return;
  if (!isSameOrigin(req)) return; // 跨域（百度联想/一言/天气等）走默认网络
  const url = new URL(req.url);
  if (!url.pathname.startsWith(BASE)) return;

  // (a) 图片：cache-first —— 优先本地，未命中再网络并写回缓存
  if (req.destination === 'image' || isImage(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // (b) HTML 导航：network-first —— 在线取最新，离线回退本地页面
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // (c) CSS / JS 等静态资源：stale-while-revalidate —— 先本地，后台静默更新
  event.respondWith(staleWhileRevalidate(req));
});

/* ---------- 缓存策略实现 ---------- */
async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req, { ignoreVary: true });
  if (cached) return cached;            // 命中本地，立即返回
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return cached || Response.error();
  }
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    // 离线：回退到已缓存的页面
    const fallback =
      (await cache.match(req)) ||
      (await cache.match(BASE + 'index.html')) ||
      (await cache.match(BASE));
    return fallback || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req, { ignoreVary: true });
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  // 有本地则立即返回本地，同时后台更新
  return cached || network;
}
