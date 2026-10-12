/* Pasar el progreso a otro dispositivo con códigos QR animados (sin internet ni servidores) */
'use strict';

Object.assign(I,{qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M17 20h4v-3M14 20v.01"/>'});

const QR_CHUNK=850,QR_MS=230;
const sync={timer:null,frames:null,idx:0,stream:null,raf:null,got:null,sid:null,n:0};

function loadScript(src){return new Promise((ok,ko)=>{if(document.querySelector(`script[data-src="${src}"]`)){ok();return;}const s=document.createElement('script');s.src=src;s.dataset.src=src;s.onload=ok;s.onerror=()=>ko(new Error('No se pudo cargar '+src));document.head.appendChild(s);});}
const b64e=u8=>{let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s);};
const b64d=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;};
async function streamBytes(u8,stream){const r=new Blob([u8]).stream().pipeThrough(stream);return new Uint8Array(await new Response(r).arrayBuffer());}
async function packState(){const raw=new TextEncoder().encode(backupPayload());
 if('CompressionStream' in window){try{return 'Z'+b64e(await streamBytes(raw,new CompressionStream('deflate-raw')));}catch(e){}}
 return 'J'+b64e(raw);}
async function unpackState(s){const kind=s[0],u8=b64d(s.slice(1));
 if(kind==='Z'){if(!('DecompressionStream' in window))throw new Error('Este navegador no puede descomprimir la copia. Actualiza el sistema o usa la copia en archivo.');return new TextDecoder().decode(await streamBytes(u8,new DecompressionStream('deflate-raw')));}
 return new TextDecoder().decode(u8);}

function openSync(html){const m=$('#syncModal');$('#syncBody').innerHTML=html;m.hidden=false;}
function closeSync(){const m=$('#syncModal');if(m)m.hidden=true;stopSend();stopScan();}

/* ---------- Enviar: QR que van cambiando ---------- */
async function startSend(){openSync(`<div class="eyebrow">Enviar mi progreso</div><h2 class="sync-title">Preparando los códigos…</h2>`);
 try{await loadScript('js/vendor/qrcode.min.js');}catch(e){openSync(`<h2 class="sync-title">No se ha podido preparar</h2><p class="hint">Abre la web con internet una vez para que se descargue el generador de QR.</p><button class="btn ghost" data-act="sync-close">Cerrar</button>`);return;}
 const data=await packState();const sid=Math.random().toString(36).slice(2,6);const n=Math.ceil(data.length/QR_CHUNK);
 sync.frames=[];for(let i=0;i<n;i++){const q=qrcode(0,'L');q.addData(`ME1|${sid}|${i}|${n}|${data.slice(i*QR_CHUNK,(i+1)*QR_CHUNK)}`,'Byte');q.make();sync.frames.push(q);}
 const kb=Math.max(1,Math.round(data.length*0.75/1024));
 openSync(`<div class="eyebrow">Enviar mi progreso</div><h2 class="sync-title">Escanéalo desde el otro dispositivo</h2>
 <canvas id="qrCanvas" class="qr-canvas" width="560" height="560" aria-label="Código QR animado"></canvas>
 <div class="sync-prog"><span id="qrIdx">1 / ${n}</span><span>${n} códigos · ${kb} KB</span></div>
 <ol class="aj-steps sync-steps"><li>En el otro dispositivo, abre Misión Estudio → <b>Ajustes</b> → <b>Recibir</b>.</li><li>Apunta la cámara a esta pantalla y mantenla quieta hasta que se complete.</li><li>Sube el brillo de esta pantalla si le cuesta leerlo.</li></ol>
 <button class="btn ghost" data-act="sync-close">Cerrar</button>`);
 sync.idx=0;drawFrame();sync.timer=setInterval(drawFrame,QR_MS);}
function drawFrame(){const cv=$('#qrCanvas');if(!cv||!sync.frames){stopSend();return;}const q=sync.frames[sync.idx],c=cv.getContext('2d'),mc=q.getModuleCount(),pad=4,cell=Math.floor(cv.width/(mc+pad*2)),off=Math.floor((cv.width-cell*mc)/2);
 c.fillStyle='#fff';c.fillRect(0,0,cv.width,cv.height);c.fillStyle='#000';for(let r=0;r<mc;r++)for(let k=0;k<mc;k++)if(q.isDark(r,k))c.fillRect(off+k*cell,off+r*cell,cell,cell);
 const t=$('#qrIdx');if(t)t.textContent=`${sync.idx+1} / ${sync.frames.length}`;sync.idx=(sync.idx+1)%sync.frames.length;}
function stopSend(){if(sync.timer){clearInterval(sync.timer);sync.timer=null;}sync.frames=null;}

/* ---------- Recibir: cámara + lector de QR ---------- */
async function startScan(){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){openSync(`<h2 class="sync-title">Sin cámara disponible</h2><p class="hint">Este navegador no deja usar la cámara desde la web. Usa la copia en archivo de abajo.</p><button class="btn ghost" data-act="sync-close">Cerrar</button>`);return;}
 openSync(`<div class="eyebrow">Recibir progreso</div><h2 class="sync-title">Apunta a los códigos del otro dispositivo</h2>
 <div class="scan-box"><video id="scanVideo" playsinline muted></video><span class="scan-frame"></span></div>
 <div class="sync-bar"><i id="scanBar" style="width:0%"></i></div><div class="sync-prog"><span id="scanTxt">Buscando el primer código…</span></div>
 <p class="hint">Mantén el móvil quieto a unos 30 cm. Los códigos se leen en cualquier orden.</p>
 <button class="btn ghost" data-act="sync-close">Cancelar</button>`);
 try{await loadScript('js/vendor/jsqr.min.js');}catch(e){$('#scanTxt').textContent='Abre la web con internet una vez para descargar el lector de QR.';return;}
 try{sync.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});}
 catch(e){$('#scanTxt').textContent=e&&e.name==='NotAllowedError'?'Has denegado la cámara. Permítela en los ajustes del navegador y vuelve a intentarlo.':'No se ha podido abrir la cámara.';return;}
 const v=$('#scanVideo');if(!v){stopScan();return;}v.srcObject=sync.stream;await v.play().catch(()=>{});
 sync.got={};sync.sid=null;sync.n=0;const cv=document.createElement('canvas'),c=cv.getContext('2d',{willReadFrequently:true});
 const tick=()=>{if(!sync.stream)return;const vv=$('#scanVideo');if(!vv){stopScan();return;}
  if(vv.readyState>=2&&vv.videoWidth){const sc=Math.min(1,720/Math.max(vv.videoWidth,vv.videoHeight));cv.width=Math.round(vv.videoWidth*sc);cv.height=Math.round(vv.videoHeight*sc);c.drawImage(vv,0,0,cv.width,cv.height);
   const img=c.getImageData(0,0,cv.width,cv.height);const r=jsQR(img.data,cv.width,cv.height,{inversionAttempts:'dontInvert'});if(r&&r.data)onFrame(r.data);}
  if(sync.stream)sync.raf=requestAnimationFrame(tick);};
 tick();}
function onFrame(txt){const m=/^ME1\|(\w+)\|(\d+)\|(\d+)\|(.*)$/s.exec(txt);if(!m){$('#scanTxt').textContent='Ese código no es de Misión Estudio.';return;}
 const [,sid,i,n,data]=m;if(sync.sid!==sid){sync.sid=sid;sync.got={};sync.n=+n;}
 if(sync.got[i]==null){sync.got[i]=data;if(navigator.vibrate)navigator.vibrate(15);}
 const k=Object.keys(sync.got).length;$('#scanBar').style.width=(k/sync.n*100)+'%';$('#scanTxt').textContent=k<sync.n?`Leídos ${k} de ${sync.n} · faltan ${sync.n-k}`:'¡Completo! Preparando…';
 if(k===sync.n)finishScan();}
async function finishScan(){const parts=[];for(let i=0;i<sync.n;i++)parts.push(sync.got[i]);stopScan();
 try{const text=await unpackState(parts.join(''));closeSync();setTab('ajustes');previewBackup(text);
  setTimeout(()=>{const b=$('#ajBackup');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});},150);toast('<b>Progreso recibido.</b> Revísalo y pulsa «Reemplazar» para usarlo aquí.','qr','ach');}
 catch(e){openSync(`<h2 class="sync-title">No se ha podido leer</h2><p class="hint">${esc(e.message||'Algo ha fallado al juntar los códigos.')} Prueba otra vez.</p><button class="btn ghost" data-act="sync-close">Cerrar</button>`);}}
function stopScan(){if(sync.raf){cancelAnimationFrame(sync.raf);sync.raf=null;}if(sync.stream){sync.stream.getTracks().forEach(t=>t.stop());sync.stream=null;}}

/* ---------- Tarjeta en Ajustes ---------- */
function renderSyncCard(){const el=$('#ajSync');if(!el)return;
 el.innerHTML=`<div class="card-head"><h3 class="card-title">${ico('qr')}Pasar a otro dispositivo</h3><span class="chip">Sin internet</span></div>
 <p class="hint aj-intro">Cada dispositivo guarda su propio progreso. Para pasarlo, por ejemplo del ordenador al móvil, enseña los códigos en uno y escanéalos con la cámara del otro. Tarda unos segundos.</p>
 <div class="sync-cols"><button class="sync-opt" data-act="sync-send"><span class="cal-ic">${ico('qr')}</span><span><b>Enviar desde aquí</b><span>Muestra los códigos con todo tu progreso</span></span></button>
 <button class="sync-opt" data-act="sync-recv"><span class="cal-ic">${ico('phone')}</span><span><b>Recibir aquí</b><span>Abre la cámara y escanea los códigos</span></span></button></div>
 <p class="hint">Al recibir, te enseño un resumen antes de cambiar nada, y guardo lo que había por si quieres volver atrás.</p>`;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="sync-"]');if(!el)return;const a=el.dataset.act;
 if(a==='sync-send')startSend();else if(a==='sync-recv')startScan();else if(a==='sync-close')closeSync();});
document.addEventListener('keydown',e=>{const m=$('#syncModal');if(m&&!m.hidden&&e.key==='Escape'){e.stopImmediatePropagation();closeSync();}},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&sync.stream)closeSync();});
