/* Registro de distracciones: durante el foco apuntas qué te ha distraído y en Progreso ves qué te distrae más */
'use strict';

const DIST_CATS={
 movil:{e:'📱',l:'Móvil',tip:'Deja el móvil en otra habitación o en modo avión durante el bloque. Si no lo ves, no lo coges.'},
 mensajes:{e:'💬',l:'Mensajes',tip:'Silencia los chats mientras estudias y contesta todo junto en el descanso.'},
 redes:{e:'📺',l:'Redes y vídeos',tip:'Cierra sesión en las redes del ordenador o usa un bloqueador de webs durante el foco.'},
 internet:{e:'🌐',l:'Buscar en internet',tip:'Cuando te surja una duda, apúntala y búscala en el descanso. No abras el navegador a mitad del bloque.'},
 ruido:{e:'🔊',l:'Ruido',tip:'Prueba con tapones o con el ruido marrón de la pestaña Sonidos.'},
 personas:{e:'👥',l:'Personas',tip:'Avisa en casa de cuándo estás en foco: 25 minutos sin interrupciones y luego estás disponible.'},
 mente:{e:'💭',l:'Pensamientos',tip:'Ten un papel al lado: apunta lo que te venga a la cabeza y vuelve al tema. Ya lo mirarás luego.'},
 cansancio:{e:'😴',l:'Cansancio',tip:'Revisa tus horas de sueño y haz el descanso de pie: estírate, bebe agua, que te dé la luz.'},
 hambre:{e:'🍪',l:'Hambre o sed',tip:'Prepara agua y algo de picar antes de empezar el bloque.'},
 otro:{e:'✏️',l:'Otra cosa',tip:'Mira qué tienen en común tus «otras cosas» y ponle remedio antes de empezar.'}};

const distToday=()=>state.dist.filter(x=>x.d===today()).length;
function renderDistBtns(){const n=distToday();$$('[data-act="dist-open"]').forEach(b=>{b.innerHTML=`${ico('alert')}Me he distraído${n?`<i class="dist-n">${n} hoy</i>`:''}`;});}

/* ---- Ventana para apuntar ---- */
function openDist(){const m=$('#distModal');if(!m)return;
 const run=state.timer.running&&state.timer.mode==='work';
 $('#distBody').innerHTML=`<div class="eyebrow">${run?'Sin parar el reloj':'Registro de distracciones'}</div><h2 class="dist-title">¿Con qué te has distraído?</h2>
 <div class="dist-grid">${Object.entries(DIST_CATS).map(([k,c])=>`<button class="dist-cat" data-act="dist-log" data-c="${k}"><span class="dist-e" aria-hidden="true">${c.e}</span>${c.l}</button>`).join('')}</div>
 <label class="dist-note" for="distTxt"><span>Detalle <span class="ex-opt">· opcional, se guarda con lo que pulses</span></span><input class="inp" id="distTxt" maxlength="80" placeholder="Ej.: WhatsApp del grupo de clase"></label>
 <button class="btn ghost" data-act="dist-close">Cancelar</button>`;
 m.hidden=false;const f=m.querySelector('.dist-cat');if(f)f.focus();}
function closeDist(){const m=$('#distModal');if(m)m.hidden=true;}
function logDist(c){const t=($('#distTxt')&&$('#distTxt').value.trim().slice(0,80))||'';
 state.dist.push({at:Date.now(),d:today(),c,t,run:state.timer.running&&state.timer.mode==='work'});if(state.dist.length>1500)state.dist.splice(0,state.dist.length-1500);
 closeDist();toast(`<b>Apuntado: ${DIST_CATS[c].e} ${esc(DIST_CATS[c].l)}</b> · Respira y vuelve al foco.`,'target');
 afterAction();renderDistBtns();}

/* ---- Estadísticas en Progreso ---- */
function distStats(days){const from=addDays(today(),-(days-1));const L=state.dist.filter(x=>x.d>=from);
 const by={};L.forEach(x=>by[x.c]=(by[x.c]||0)+1);
 const cats=Object.entries(by).sort((a,b)=>b[1]-a[1]);
 const fr={m:0,t:0,n:0};L.forEach(x=>{const h=new Date(x.at).getHours();if(h>=6&&h<14)fr.m++;else if(h>=14&&h<20)fr.t++;else fr.n++;});
 let pomos=0;for(let d=from;d<=today();d=addDays(d,1)){const g=state.log[d];if(g)pomos+=g.pomos;}
 return {L,cats,fr,pomos};}
function renderDistStats(){const el=$('#distCard');if(!el)return;
 const S=distStats(30),tot=S.L.length;
 const ws=weekStart(today()),thisW=state.dist.filter(x=>x.d>=ws).length,lastW=state.dist.filter(x=>x.d>=addDays(ws,-7)&&x.d<ws).length;
 const head=`<div class="card-head"><h3 class="card-title">${ico('alert')}Qué te distrae</h3><span class="chip">Últimos 30 días · ${tot}</span></div>`;
 if(!tot){el.innerHTML=head+`<div class="empty"><strong>Aún no has apuntado distracciones</strong>Durante un pomodoro, pulsa «Me he distraído» (o la tecla D) y elige qué ha sido. El reloj sigue corriendo. Aquí verás qué te roba más el foco y cómo evitarlo.</div>`;return;}
 const [topK,topN]=S.cats[0],T=DIST_CATS[topK],max=topN;
 const frArr=[['Mañana',S.fr.m],['Tarde',S.fr.t],['Noche',S.fr.n]],frMax=Math.max(...frArr.map(x=>x[1]));
 const frTop=frArr.find(x=>x[1]===frMax)[0];
 const per=S.pomos?tot/S.pomos:0;
 const diff=thisW-lastW;
 el.innerHTML=head+`<div class="dist-top"><span class="dist-top-e" aria-hidden="true">${T.e}</span><div><span class="eyebrow">Tu mayor ladrón de foco</span><b>${esc(T.l)} · ${topN} ${topN===1?'vez':'veces'}</b><p>${esc(T.tip)}</p></div></div>
 <div class="dist-kpis">
  <div class="mini-stat"><b>${S.pomos?fmt1(per):'—'}</b><span>Por pomodoro</span></div>
  <div class="mini-stat"><b>${thisW}</b><span>Esta semana</span></div>
  <div class="mini-stat ${diff<0?'good':diff>0?'bad':''}"><b>${lastW||thisW?(diff>0?'+':'')+diff:'—'}</b><span>Vs. semana pasada</span></div>
  <div class="mini-stat"><b>${frTop}</b><span>Cuándo más</span></div>
 </div>
 <ul class="dist-bars">${S.cats.map(([k,n])=>`<li><span class="dist-bl">${DIST_CATS[k].e} ${esc(DIST_CATS[k].l)}</span><span class="dist-bar"><i style="width:${Math.round(n/max*100)}%"></i></span><b>${n}</b></li>`).join('')}</ul>
 <h4 class="bg-sub">Últimas apuntadas</h4>
 <ul class="dist-recent">${state.dist.slice(-6).reverse().map(x=>{const dt=new Date(x.at);return `<li><span class="dist-when">${x.d===today()?'Hoy':x.d===yesterday()?'Ayer':fmtShort(x.d)} · ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}</span><span>${DIST_CATS[x.c].e} ${esc(DIST_CATS[x.c].l)}${x.t?` · <em>${esc(x.t)}</em>`:''}</span><button class="icon-x" data-act="dist-del" data-at="${x.at}" aria-label="Borrar">${ico('x')}</button></li>`;}).join('')}</ul>`;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="dist-"]');if(!el)return;const a=el.dataset.act;
 if(a==='dist-open')openDist();
 else if(a==='dist-close')closeDist();
 else if(a==='dist-log')logDist(el.dataset.c);
 else if(a==='dist-del'){const at=+el.dataset.at;state.dist=state.dist.filter(x=>x.at!==at);save();renderDistStats();renderDistBtns();}});
$('#distModal')&&$('#distModal').addEventListener('click',e=>{if(e.target.id==='distModal')closeDist();});
/* Escape cierra esta ventana antes que el modo foco; la tecla D la abre en Foco */
document.addEventListener('keydown',e=>{const m=$('#distModal');if(!m)return;
 if(!m.hidden){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeDist();}else if(e.key==='Enter'&&document.activeElement&&document.activeElement.id==='distTxt'){e.preventDefault();logDist('otro');}return;}
 const ae=document.activeElement;if((e.key==='d'||e.key==='D')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&(state.ui.tab==='foco'||!$('#zen').hidden)&&!/INPUT|TEXTAREA|SELECT/.test(ae.tagName)&&$('#modal').hidden){e.preventDefault();openDist();}},true);
