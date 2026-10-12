/* App instalable (service worker), actualizaciones y avisos del sistema */
'use strict';

const PWA={reg:null,deferred:null,waiting:null,updating:false};
const isStandalone=()=>{try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}catch(e){return false;}};
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function refreshPwaUI(){try{renderGear();if(state.ui.tab==='ajustes')renderAjustes();}catch(e){}}

/* ---- Instalación ---- */
addEventListener('beforeinstallprompt',e=>{e.preventDefault();PWA.deferred=e;refreshPwaUI();});
addEventListener('appinstalled',()=>{PWA.deferred=null;toast('<b>¡App instalada!</b> Ya la tienes con su propio icono.','check','ach');refreshPwaUI();});
function installApp(){const d=PWA.deferred;if(!d)return;d.prompt();Promise.resolve(d.userChoice).finally(()=>{PWA.deferred=null;refreshPwaUI();});}

/* ---- Service worker y actualizaciones ---- */
function applyUpdate(){const w=PWA.waiting;if(!w)return;PWA.updating=true;w.postMessage('SKIP_WAITING');}
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(PWA.updating){PWA.updating=false;location.reload();}});
 (()=>{
  navigator.serviceWorker.register('sw.js').then(reg=>{
   PWA.reg=reg;
   const ready=w=>{PWA.waiting=w;toast('<b>Hay una versión nueva de la web.</b>','sparkle','',{label:'Actualizar',fn:applyUpdate});refreshPwaUI();};
   if(reg.waiting&&navigator.serviceWorker.controller)ready(reg.waiting);
   reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)ready(w);});});
   document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{});});
   navigator.serviceWorker.ready.then(refreshPwaUI);
   refreshPwaUI();
  }).catch(()=>{});
 })();
}

/* ---- Avisos ---- */
const notifSupported=()=>typeof window.Notification==='function';
function notifStatus(){if(!notifSupported())return 'unsupported';if(Notification.permission==='denied')return 'denied';if(Notification.permission==='granted'&&state.settings.notify)return 'on';return 'off';}
function enableNotif(){if(!notifSupported())return;let done=false;
 const go=p=>{if(done)return;done=true;state.settings.notify=p==='granted';save();refreshPwaUI();
  if(p==='granted')sendNotif('Avisos activados','Te avisaré al terminar cada bloque de foco y cada descanso.',true);
  else if(p==='denied')toast('Has bloqueado los avisos. Puedes permitirlos desde el candado junto a la dirección de la web.','alert');};
 try{const r=Notification.requestPermission(go);if(r&&r.then)r.then(go);}catch(e){}}
function sendNotif(title,body,force){
 if(!notifSupported()||Notification.permission!=='granted')return;
 if(!force&&!state.settings.notify)return;
 const o={body,icon:'icons/icon-192.png',badge:'icons/badge-96.png',tag:'mision-estudio',renotify:true,vibrate:[200,100,200,100,300],lang:'es'};
 const plain=()=>{try{new Notification(title,o);}catch(e){}};
 if('serviceWorker' in navigator&&navigator.serviceWorker.controller){navigator.serviceWorker.ready.then(r=>r.showNotification(title,o)).catch(plain);}else plain();}
function notifyTimer(was,next){
 if(document.visibilityState==='visible'&&document.hasFocus())return;
 const min=Math.round(durOf(next)/60);
 if(was==='work')sendNotif('¡Bloque de foco terminado!',`+25 XP y 10 monedas. Toca ${next==='long'?'descanso largo':'descanso'} de ${min} min.`);
 else sendNotif('Descanso terminado',`A por el siguiente bloque de foco de ${min} min.`);}
