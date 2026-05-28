const CACHE_NAME = 'orcamento-facil-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
  // Você pode adicionar os caminhos das imagens (icon-192.png, icon-512.png) aqui se quiser
];

// Instalação: Adiciona arquivos básicos no Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto com sucesso');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Ativação: Limpa caches antigos caso a versão mude (v1 para v2, por exemplo)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Apagando cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de Fetch: Retorna do cache se estiver off-line ou busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o arquivo do cache, se existir
        if (response) {
          return response;
        }
        // Se não existir no cache, faz a requisição na rede
        return fetch(event.request);
      })
  );
});