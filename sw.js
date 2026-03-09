const CACHE_NAME = 'pwa-offline-v1';

// 根據你提供的檔案列表整理的快取清單
const ASSETS_TO_CACHE = [
  './',
  './favicon.ico',
  './examination.html',
  './index.html',
  './learn.html',
  './material/icon/192.png',
  './material/icon/2475.png',
  './material/icon/512.png',
  './material/icon/fill.png',
  './material/icon/fill_180.png',
  // 外部 CDN 檔案
  'https://unpkg.com/dexie/dist/dexie.js',
  'https://unpkg.com/dexie-export-import@latest/dist/dexie-export-import.js',
  'https://unpkg.com/dompurify@3.2.4/dist/purify.min.js'
];

// 安裝階段：強制將所有檔案寫入快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在預載快取資源...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      // 讓新的 Service Worker 立即進入 activate 狀態，不必等待舊版本關閉
      return self.skipWaiting();
    })
  );
});

// 激活階段：清理舊快取並立即接管頁面
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // 立即接管現有頁面
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('清理舊快取:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
    ])
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // 如果快取有資料，立即回傳 (速度最快)
        // 同時發起網路請求更新資源 (保持最新)
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});