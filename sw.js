const CACHE_NAME = 'vuonchu-offline-v1';

// Lưu sẵn giao diện và truyện vào bộ nhớ đệm
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './truyen.json'
      ]);
    })
  );
  self.skipWaiting();
});

// Khi mất mạng, lấy dữ liệu từ bộ nhớ đệm ra để hiển thị. 
// Khi có mạng, tự động cập nhật dữ liệu mới ngầm bên trong.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Mất mạng thì không báo lỗi, cứ lấy cache
      });
      return cachedResponse || fetchPromise;
    })
  );
});
