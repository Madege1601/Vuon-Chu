var V='vc-v2';
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(['./'])}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(r){if(r&&r.ok){var c=r.clone();caches.open(V).then(function(ch){ch.put(e.request,c)})}return r}).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('./')})}));
});
