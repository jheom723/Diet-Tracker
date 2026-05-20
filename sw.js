const CACHE_NAME = "diet-tracker-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap",
  "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js",
  "https://unpkg.com/prop-types@15.8.1/prop-types.min.js",
  "https://unpkg.com/recharts@2.12.7/umd/Recharts.js",
  "https://unpkg.com/@babel/standalone@7.23.5/babel.min.js",
];

// 설치: 모든 파일 캐시
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 활성화: 오래된 캐시 삭제
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// fetch: 캐시 우선, 없으면 네트워크
self.addEventListener("fetch", (e) => {
  // Anthropic API 호출은 캐시 안 함
  if (e.request.url.includes("anthropic.com")) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).catch(() => caches.match("./index.html"));
    })
  );
});
