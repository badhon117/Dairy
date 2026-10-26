/* ============================================================
   service-worker.js — Diary PWA
   
   ✅ Network-first for HTML/CSS/JS (নতুন কোড পাবে)
   ✅ Cache-first for images/fonts (দ্রুত load)
   ✅ Offline fallback
   ✅ Version bump-এ পুরনো cache মুছে
   ✅ CDN (html2canvas) cache
   ============================================================ */

const CACHE_VERSION = 'diary-v3.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Local assets — install-এ cache হবে
const LOCAL_ASSETS = [
  './',
  './index.html',
  './diary.html',
  './calendar.html',
  './todo.html',
  './pomodoro.html',
  './timer.html',
  './mood.html',
  './settings.html',
  './profile.html',
  './recycle.html',
  './style.css',
  './app.js',
  './theme.js',
  './language.js',
  './manifest.json',
  './routine.html',
  './routine-view.html',
  './note.html',
  './note-editor.html',
  './music.html',
  './player.html',
  './player-widget.js',
  './lock.js',
  './faq.html',
  './feedback.html',
  './about.html',
  './icon-192.png',
  './icon-512.png'
];

// External CDN — install-এ try, fail হলে skip
const CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// ============================================================
// Install
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);

    // Local assets — সব cache হওয়া উচিত
    try {
      await cache.addAll(LOCAL_ASSETS);
    } catch (err) {
      console.warn('[SW] Some local assets failed:', err);
      // এক এক করে add try করি
      for (const url of LOCAL_ASSETS) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn('[SW] Failed to cache:', url);
        }
      }
    }

    // CDN assets — optional
    for (const url of CDN_ASSETS) {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (res.ok) {
          await cache.put(url, res);
        }
      } catch (e) {
        console.warn('[SW] CDN asset failed:', url);
      }
    }

    // নতুন SW activate হওয়ার অপেক্ষা ছাড়াই নিজে চালু
    await self.skipWaiting();
  })());
});

// ============================================================
// Activate
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => !k.startsWith(CACHE_VERSION))
        .map(k => caches.delete(k))
    );
    // সব client-কে নিয়ন্ত্রণ করি
    await self.clients.claim();
  })());
});

// ============================================================
// Fetch
// ============================================================
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // শুধু GET handle
  if (req.method !== 'GET') return;

  // Same-origin? cross-origin?
  const isSameOrigin = url.origin === self.location.origin;

  // ==== Navigation (HTML page) → Network first, fallback cache → index ====
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigation(req));
    return;
  }

  // ==== HTML, CSS, JS → Network first (নতুন আপডেট পাবে) ====
  if (isSameOrigin && (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname === '/' ||
    url.pathname === ''
  )) {
    event.respondWith(handleNetworkFirst(req));
    return;
  }

  // ==== Image → Cache first (দ্রুত) ====
  if (req.destination === 'image' || /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url.pathname)) {
    event.respondWith(handleCacheFirst(req, IMAGE_CACHE));
    return;
  }

  // ==== Font ====
  if (req.destination === 'font') {
    event.respondWith(handleCacheFirst(req, IMAGE_CACHE));
    return;
  }

  // ==== CDN (html2canvas) → Cache first ====
  if (!isSameOrigin) {
    event.respondWith(handleCacheFirst(req, RUNTIME_CACHE));
    return;
  }

  // ==== বাকি সব → Network first ====
  event.respondWith(handleNetworkFirst(req));
});

// ============================================================
// Strategy: Network first (fresh) → cache fallback
// ============================================================
async function handleNetworkFirst(req) {
  try {
    const res = await fetch(req);
    // সফল হলে cache-এ save (stale-while-revalidate-ish)
    if (res && res.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    // Network fail → cache
    const cached = await caches.match(req);
    if (cached) return cached;

    // HTML-এর জন্য index fallback
    if (req.mode === 'navigate' || (req.headers.get('Accept') || '').includes('text/html')) {
      const fallback = await caches.match('./index.html');
      if (fallback) return fallback;
    }

    // কিছু না → error response
    return new Response(
      JSON.stringify({ error: 'Offline', url: req.url }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// ============================================================
// Strategy: Cache first → network fallback
// ============================================================
async function handleCacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    // Image error → placeholder (transparent 1x1)
    if (req.destination === 'image') {
      return new Response(
        Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), c => c.charCodeAt(0)),
        { headers: { 'Content-Type': 'image/gif' } }
      );
    }
    return new Response('Offline', { status: 503 });
  }
}

// ============================================================
// Strategy: Navigation
// ============================================================
async function handleNavigation(req) {
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    // Cache lookup (URL সহ query সহ)
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    // index fallback
    const fallback = await caches.match('./index.html');
    if (fallback) return fallback;

    return new Response(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title><style>body{font-family:sans-serif;text-align:center;padding:60px 20px;background:#fff0f6;color:#5a3a47}h1{font-size:48px;margin:0 0 16px}p{font-size:16px;line-height:1.6}</style></head><body><h1>📴</h1><p>You are offline.<br>Please check your internet connection and try again.</p></body></html>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}

// ============================================================
// Message handler (skipWaiting from UI)
// ============================================================
self.addEventListener('message', (event) => {
  const data = event.data;
  if (data && data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (data && data.type === 'CLEAR_CACHE') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      if (event.source) {
        event.source.postMessage({ type: 'CACHE_CLEARED' });
      }
    })());
  }
});
