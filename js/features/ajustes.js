/* Pestaña Ajustes: instalar la app, avisos, copia de seguridad y empezar de cero */
'use strict';

Object.assign(I,{
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 download:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>',
 upload:'<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 17v3h16v-3"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
 bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
 wifi:'<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>',
 shieldCheck:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'
});

const BEFORE_KEY='mision-estudio-v1-anterior';
const FLAG_KEY='mision-estudio-aviso';
let importPreview=null,wipeArmed=false;

function needsBackup(){return (state.xp>0||state.topics.length>0)&&(!state.lastBackup||Date.now()-state.lastBackup>7*864e5);}
function renderGear(){const g=$('#hudGear');if(g)g.innerHTML=ico('gear')+((needsBackup()||PWA.waiting)?'<span class="hud-dot"></span>':'');}
function ago(ts){if(!ts)return 'nunca';const d=Math.floor((Date.now()-ts)/864e5);return d<=0?'hoy':d===1?'ayer':`hace ${d} días`;}
function summary(d){const L=levelInfo(d.xp||0);const days=Object.values(d.log||{}).filter(isActive).length;
 return [['Nivel',L.level],['XP',(d.xp||0).toLocaleString('es-ES')],['Monedas',(d.coins||0).toLocaleString('es-ES')],['Temas',(d.topics||[]).length],['Tarjetas',(d.cards||[]).length],['Días de estudio',days]];}
function readBefore(){try{const s=localStorage.getItem(BEFORE_KEY);if(!s)return null;const d=JSON.parse(s);return `nivel ${levelInfo(d.xp||0).level}, ${(d.xp||0).toLocaleString('es-ES')} XP`;}catch(e){return null;}}
function shareSupported(){try{return !!(navigator.canShare&&navigator.canShare({files:[new File(['{}'],'copia.json',{type:'application/json'})]}));}catch(e){return false;}}

function impHTML(){
 if(importPreview){const p=importPreview;
  const when=p.at?'del '+new Date(p.at).toLocaleString('es-ES',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}):'sin fecha';
  return `<div class="imp-preview"><b>Copia ${when}</b><div class="imp-stats">${summary(p.data).map(([l,v])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div><span class="imp-warn">Esto <b>sustituye</b> tu progreso actual en este dispositivo. Guardaré el actual por si quieres volver atrás.</span><div class="aj-actions"><button class="btn pink" data-act="aj-import-ok">${ico('check')}Reemplazar mi progreso</button><button class="btn" data-act="aj-import-cancel">Cancelar</button></div></div>`;}
 return `<span class="hint">Elige el archivo <code>.json</code> de una copia anterior.</span><label class="dropzone" for="impFile">${ico('upload')}<span>Toca para elegir el archivo<br><span class="hint">o arrástralo aquí</span></span><input type="file" id="impFile" accept=".json,application/json"></label><details class="aj-paste"><summary>¿La tienes copiada como texto? Pégala aquí</summary><textarea class="inp" id="impText" placeholder="Pega aquí el texto de la copia"></textarea><div class="aj-actions"><button class="btn sm" data-act="aj-import-text">Revisar copia</button></div></details>`;}

function renderAjustes(){
 const st=isStandalone(),ios=isIOS(),offline=!!(PWA.reg&&navigator.serviceWorker&&navigator.serviceWorker.controller);
 let chip,block;
 if(st){chip='<span class="chip ok">Instalada</span>';block=`<div class="aj-block"><b>${ico('check')} Ya la estás usando como app.</b><span class="hint">Para quitarla, mantén pulsado su icono y elige desinstalar.</span></div>`;}
 else if(PWA.deferred){chip='<span class="chip xp">Lista para instalar</span>';block=`<div class="aj-block"><span class="hint">Se añade a tu pantalla de inicio o a tus aplicaciones y se abre en su propia ventana.</span><div class="aj-actions"><button class="btn pink" data-act="aj-install">${ico('download')}Instalar Misión Estudio</button></div></div>`;}
 else if(ios){chip='<span class="chip">iPhone / iPad</span>';block=`<div class="aj-block"><b>Instálala desde Safari:</b><ol class="aj-steps"><li>Pulsa el botón <b>Compartir</b>, el cuadrado con la flecha hacia arriba.</li><li>Elige <b>Añadir a pantalla de inicio</b>.</li><li>Pulsa <b>Añadir</b> y ábrela siempre desde ese icono.</li></ol></div>`;}
 else if(!PWA.reg){chip='<span class="chip">No disponible aquí</span>';block=`<div class="aj-block"><span class="hint">Para instalarla, ábrela desde tu enlace de GitHub Pages en Chrome, Edge o Safari.</span></div>`;}
 else{chip='<span class="chip">Desde el navegador</span>';block=`<div class="aj-block"><b>Instálala desde el menú del navegador:</b><ol class="aj-steps"><li>Abre el menú (⋮ o ⋯).</li><li>Busca <b>Instalar app</b>, <b>Instalar Misión Estudio</b> o <b>Añadir a pantalla de inicio</b>.</li></ol><span class="hint">Si no aparece, recarga la página una vez y vuelve aquí.</span></div>`;}
 const upd=PWA.waiting?`<div class="aj-block"><b>${ico('sparkle')} Hay una versión nueva de la web.</b><div class="aj-actions"><button class="btn sun" data-act="aj-update">Actualizar ahora</button></div></div>`:'';
 $('#ajApp').innerHTML=`<div class="card-head"><h3 class="card-title">${ico('phone')}Instalar la app</h3>${chip}</div><div class="aj-app"><span class="brand-mark">${ico('bolt')}</span><div style="min-width:0"><b>Misión Estudio</b><p class="hint">Con su propio icono, en pantalla completa y sin la barra del navegador.</p></div></div>${block}${upd}<ul class="aj-checks"><li class="${offline?'ok':'no'}">${ico(offline?'wifi':'x')}${offline?'Funciona sin conexión: ya está guardada en este dispositivo.':'Sin conexión: disponible al abrirla desde GitHub Pages.'}</li></ul>`;

 const ns=notifStatus();
 const chipN={on:'<span class="chip ok">Activados</span>',off:'<span class="chip">Desactivados</span>',denied:'<span class="chip bad">Bloqueados</span>',unsupported:'<span class="chip">No disponibles</span>'}[ns];
 let nb;
 if(ns==='on')nb=`<div class="aj-actions"><button class="btn" data-act="aj-notif-test">${ico('bell')}Probar aviso</button><button class="btn ghost" data-act="aj-notif-off">Desactivar</button></div>`;
 else if(ns==='off')nb=`<div class="aj-actions"><button class="btn pink" data-act="aj-notif-on">${ico('bell')}Activar avisos</button></div>`;
 else if(ns==='denied')nb=`<div class="aj-block"><b>El navegador tiene bloqueados los avisos de esta web.</b><span class="hint">Pulsa el candado o el icono de ajustes junto a la dirección, pon <b>Notificaciones → Permitir</b> y recarga.</span></div>`;
 else nb=`<div class="aj-block"><span class="hint">${ios&&!st?'En iPhone y iPad los avisos solo funcionan con la app instalada. Instálala primero y actívalos desde aquí.':'Este navegador no permite avisos de esta web.'}</span></div>`;
 $('#ajNotif').innerHTML=`<div class="card-head"><h3 class="card-title">${ico('bell')}Avisos del pomodoro</h3>${chipN}</div><p class="hint aj-intro">Te avisa cuando termina un bloque de foco o un descanso aunque estés en otra pestaña o en otra aplicación.</p>${nb}<div class="aj-block aj-gap"><b>Con el móvil bloqueado</b><span class="hint">El sistema pausa las webs para ahorrar batería. En Android, si tienes un sonido ambiente puesto, la app sigue despierta y el aviso llega a su hora; si no, te avisa en cuanto la vuelves a abrir. En iPhone el aviso llega al volver a la app.</span></div>`;

 const before=readBefore();
 $('#ajBackup').innerHTML=`<div class="card-head"><h3 class="card-title">${ico('shieldCheck')}Copia de seguridad</h3><span class="chip ${needsBackup()?'bad':state.lastBackup?'ok':''}">Última copia: ${ago(state.lastBackup)}</span></div>
 <p class="hint aj-intro">Tu progreso se guarda solo en este navegador. Descarga una copia de vez en cuando y úsala para pasarlo a otro dispositivo o recuperarlo si borras los datos.</p>
 <div class="bk-cols"><div class="aj-block"><b>${ico('download')} Exportar</b><span class="hint">Un archivo <code>.json</code> con todo: nivel, monedas, avatares, tareas, temario, tarjetas, errores y estadísticas.</span><div class="aj-actions"><button class="btn sun" data-act="aj-export">${ico('download')}Descargar copia</button>${shareSupported()?`<button class="btn" data-act="aj-share">${ico('share')}Enviar…</button>`:''}<button class="btn ghost" data-act="aj-copy">${ico('copy')}Copiar como texto</button></div><textarea class="inp" id="expText" readonly hidden aria-label="Copia en texto"></textarea></div>
 <div class="aj-block"><b>${ico('upload')} Importar</b>${impHTML()}</div></div>
 ${before?`<div class="aj-block aj-gap"><b>Progreso anterior guardado</b><span class="hint">Antes de la última importación o borrado guardé tu progreso de entonces (${esc(before)}). Puedes volver a él cuando quieras.</span><div class="aj-actions"><button class="btn" data-act="aj-restore">${ico('reset')}Volver al progreso anterior</button></div></div>`:''}`;

 $('#ajDanger').innerHTML=`<div class="card-head"><h3 class="card-title">${ico('alert')}Empezar de cero</h3></div><p class="hint aj-intro">Borra todo tu progreso de este dispositivo: nivel, monedas, avatares, tareas, temario y estadísticas. Te recomiendo descargar antes una copia.</p><button class="btn ${wipeArmed?'pink':''}" data-act="aj-wipe">${ico('trash')}${wipeArmed?'Pulsa otra vez para borrarlo todo':'Borrar todo mi progreso'}</button>`;
 renderGear();
}

/* ---- Exportar ---- */
const backupPayload=()=>JSON.stringify({app:'mision-estudio',format:1,exportedAt:new Date().toISOString(),data:state});
const backupName=()=>`mision-estudio-${today()}.json`;
function markBackup(msg){state.lastBackup=Date.now();save();toast(msg,'shieldCheck','ach');renderAjustes();}
function doExport(){try{const url=URL.createObjectURL(new Blob([backupPayload()],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=backupName();document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);markBackup(`<b>Copia descargada.</b> Está en Descargas como ${backupName()}`);}catch(e){toast('No se ha podido descargar. Prueba con «Copiar como texto».','alert');}}
function doShare(){try{const f=new File([backupPayload()],backupName(),{type:'application/json'});navigator.share({files:[f],title:'Copia de Misión Estudio'}).then(()=>markBackup('<b>Copia enviada.</b>')).catch(err=>{if(!err||err.name!=='AbortError')toast('No se ha podido enviar. Prueba a descargarla.','alert');});}catch(e){toast('No se ha podido enviar. Prueba a descargarla.','alert');}}
function doCopy(){const txt=backupPayload();const manual=()=>{const ta=$('#expText');ta.hidden=false;ta.value=txt;ta.focus();ta.select();toast('Selecciona el texto y cópialo a mano.','copy');};
 try{navigator.clipboard.writeText(txt).then(()=>markBackup('<b>Copia copiada.</b> Pégala en una nota o un correo para guardarla.'),manual);}catch(e){manual();}}

/* ---- Importar, restaurar y borrar ---- */
function parseBackup(text){let o;try{o=JSON.parse(text);}catch(e){return {err:'Ese archivo no se puede leer como copia de seguridad.'};}
 const d=o&&o.app==='mision-estudio'&&o.data?o.data:o;
 if(!d||typeof d!=='object'||typeof d.xp!=='number'||!d.avatar||!Array.isArray(d.tasks))return {err:'Ese archivo no es una copia de Misión Estudio.'};
 return {data:d,at:(o&&o.exportedAt)||null};}
function previewBackup(text){const r=parseBackup(text);if(r.err){toast(r.err,'alert');return;}importPreview=r;renderAjustes();}
function readFile(f){if(!f)return;if(f.size>20*1024*1024){toast('Ese archivo es demasiado grande para ser una copia.','alert');return;}
 const fr=new FileReader();fr.onload=()=>previewBackup(String(fr.result||''));fr.onerror=()=>toast('No se ha podido leer el archivo.','alert');fr.readAsText(f);}
function keepBefore(){try{localStorage.setItem(BEFORE_KEY,JSON.stringify(state));}catch(e){}}
function reloadWith(json,flag){SAVE_LOCK=true;try{Object.keys(A.on).forEach(stopSound);}catch(e){}
 try{if(json==null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,json);sessionStorage.setItem(FLAG_KEY,flag);}
 catch(e){SAVE_LOCK=false;toast('No se ha podido guardar en este navegador.','alert');return;}
 location.reload();}
function doImport(){if(!importPreview)return;const d=importPreview.data;d.lastBackup=Date.now();keepBefore();reloadWith(JSON.stringify(d),'import');}
function doRestore(){let s=null;try{s=localStorage.getItem(BEFORE_KEY);}catch(e){}if(!s)return;keepBefore();reloadWith(s,'restore');}
function doWipe(){if(!wipeArmed){wipeArmed=true;renderAjustes();setTimeout(()=>{if(wipeArmed){wipeArmed=false;if(state.ui.tab==='ajustes')renderAjustes();}},5000);return;}
 wipeArmed=false;keepBefore();reloadWith(null,'wipe');}

(function afterReload(){let f=null;try{f=sessionStorage.getItem(FLAG_KEY);sessionStorage.removeItem(FLAG_KEY);}catch(e){}
 const msg={import:'<b>Copia importada.</b> Ya tienes aquí tu progreso.',restore:'<b>Progreso anterior recuperado.</b>',wipe:'<b>Progreso borrado.</b> Empiezas de cero.'}[f];
 if(msg)setTimeout(()=>toast(msg,f==='wipe'?'trash':'check','ach',{label:'Deshacer',fn:doRestore}),500);})();

/* ---- Eventos ---- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="aj-"]');if(!el||el.disabled)return;
 switch(el.dataset.act){
 case 'aj-install':installApp();break;
 case 'aj-update':applyUpdate();break;
 case 'aj-notif-on':enableNotif();break;
 case 'aj-notif-off':state.settings.notify=false;save();renderAjustes();break;
 case 'aj-notif-test':sendNotif('Así te avisaré','Cuando termine el bloque de foco o el descanso.',true);toast('Aviso enviado. Si no lo ves, revisa el modo No molestar del sistema.','bell');break;
 case 'aj-export':doExport();break;
 case 'aj-share':doShare();break;
 case 'aj-copy':doCopy();break;
 case 'aj-import-text':{const t=$('#impText');if(t&&t.value.trim())previewBackup(t.value.trim());else toast('Pega primero el texto de la copia.','alert');break;}
 case 'aj-import-ok':doImport();break;
 case 'aj-import-cancel':importPreview=null;renderAjustes();break;
 case 'aj-restore':doRestore();break;
 case 'aj-wipe':doWipe();break;
 }});
document.addEventListener('change',e=>{if(e.target&&e.target.id==='impFile'){readFile(e.target.files&&e.target.files[0]);e.target.value='';}});
const zoneOf=e=>e.target&&e.target.closest?e.target.closest('.dropzone'):null;
['dragenter','dragover'].forEach(ev=>document.addEventListener(ev,e=>{const z=zoneOf(e);if(!z)return;e.preventDefault();z.classList.add('over');}));
document.addEventListener('dragleave',e=>{const z=zoneOf(e);if(z)z.classList.remove('over');});
document.addEventListener('drop',e=>{const z=zoneOf(e);if(!z)return;e.preventDefault();z.classList.remove('over');readFile(e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0]);});
