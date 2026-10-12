/* Service worker de Misión Estudio: guarda la web en el dispositivo para que funcione sin conexión.
   Con conexión siempre carga la última versión; sin conexión usa la copia guardada.
   Si añades o quitas archivos, actualiza la lista APP y sube VERSION. */
const VERSION='2026-10-12.1';
const CACHE='mision-estudio-'+VERSION;
const FONTS='mision-estudio-fuentes';
const APP=[
  './',
  'index.html',
  'css/ajustes.css',
  'css/avatar.css',
  'css/avisos.css',
  'css/base.css',
  'css/cabecera.css',
  'css/componentes.css',
  'css/foco.css',
  'css/habitos.css',
  'css/inicio.css',
  'css/modo-foco.css',
  'css/progreso.css',
  'css/responsive.css',
  'css/sonidos.css',
  'css/temario.css',
  'css/tokens.css',
  'icons/apple-touch-icon.png',
  'icons/badge-96.png',
  'icons/favicon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/icon.svg',
  'js/core/estado.js',
  'js/core/pwa.js',
  'js/core/recompensas.js',
  'js/core/utilidades.js',
  'js/data/avatares.js',
  'js/data/habitos.js',
  'js/data/niveles.js',
  'js/features/ajustes.js',
  'js/features/avatar.js',
  'js/features/habitos.js',
  'js/features/inicio.js',
  'js/features/pomodoro.js',
  'js/features/progreso.js',
  'js/features/sonidos.js',
  'js/features/tareas.js',
  'js/features/temario.js',
  'js/main.js',
  'js/ui/efectos.js',
  'js/ui/fondo.js',
  'js/ui/navegacion.js',
  'manifest.webmanifest'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP.map(u=>new Request(u,{cache:'reload'})))));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('mision-estudio-')&&k!==CACHE&&k!==FONTS).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting();});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);

  // Fuentes de Google: se guardan la primera vez y después salen del dispositivo
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(c=>c.match(req).then(hit=>hit||fetch(req).then(res=>{c.put(req,res.clone());return res;}))));
    return;
  }
  if(url.origin!==self.location.origin)return;

  // Archivos de la web: primero la red (siempre lo último) y, sin conexión o si tarda más de 3 s, la copia guardada
  e.respondWith(networkFirst(req,req.mode==='navigate'?'index.html':null));
});

function networkFirst(req,key){
  return new Promise(resolve=>{
    let done=false;
    const finish=r=>{if(!done&&r){done=true;resolve(r);}};
    const fromCache=()=>caches.match(key||req,{ignoreSearch:true});
    const slow=setTimeout(()=>fromCache().then(finish),3000);
    fetch(req).then(res=>{
      clearTimeout(slow);
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(key||req,copy));}
      finish(res);
    }).catch(()=>{
      clearTimeout(slow);
      fromCache().then(r=>finish(r||Response.error()));
    });
  });
}

// Al tocar un aviso, vuelve a la app (o la abre en Foco)
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus' in c)return c.focus();}
    return self.clients.openWindow('./#foco');
  }));
});
