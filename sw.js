const CACHE_NAME = 'orcamento-facil-v1';

// Arquivos locais que devem ser cacheados imediatamente
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalação: Cache dos arquivos estáticos
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação: Limpeza de caches antigos caso você mude a versão
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições: Estratégia "Cache First, fallback to Network"
self.addEventListener('fetch', event => {
  // Ignora requisições de outras origens (como as bibliotecas externas e Firebase) para não quebrar o banco de dados
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrou no cache, retorna. Se não, busca na rede.
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Verifica se a resposta é válida antes de fazer o cache
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para colocar no cache e devolver pro navegador
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});