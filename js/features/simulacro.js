/* Simulacro tipo test: preguntas propias o generadas con las flashcards, cronómetro, penalización y fallos al cuaderno de errores */
'use strict';

const OPT_L='ABCDEFGH';
const fmtScore=s=>(Math.round(s*100)/100).toLocaleString('es-ES');
const fmtSecs=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+pad(m):m)+':'+pad(x);};
let simAbortArmed=false;
const bankOpen={add:null,bulk:false};
document.addEventListener('toggle',e=>{const d=e.target;if(d&&d.classList&&d.classList.contains('bank-add'))bankOpen[d.dataset.k]=d.open;},true);

/* ---- Banco de preguntas ---- */
function ownPool(tp){return state.questions.filter(q=>tp==='all'||q.tp===tp).map(q=>({src:'q',ref:q.id,tp:q.tp,q:q.q,opts:q.opts.slice(),ok:q.ok,expl:q.expl||''}));}
function cardPool(tp){const all=state.cards,out=[];
 for(const c of all.filter(c=>tp==='all'||c.tp===tp)){
  const ans=String(c.a||'').trim();if(!ans)continue;
  const same=all.filter(o=>o.id!==c.id&&o.tp===c.tp).map(o=>String(o.a||'').trim());
  const other=all.filter(o=>o.id!==c.id&&o.tp!==c.tp).map(o=>String(o.a||'').trim());
  const seen=new Set([ans.toLowerCase()]),dis=[];
  for(const a of shuffle(same).concat(shuffle(other))){const k=a.toLowerCase();if(!a||seen.has(k))continue;seen.add(k);dis.push(a);if(dis.length===3)break;}
  if(dis.length<2)continue;
  const opts=shuffle([ans,...dis]);out.push({src:'c',ref:c.id,tp:c.tp,q:c.q,opts,ok:opts.indexOf(ans),expl:''});}
 return out;}
function poolFor(cfg){let p=[];if(cfg.src!=='cards')p=p.concat(ownPool(cfg.tp));if(cfg.src!=='own')p=p.concat(cardPool(cfg.tp));return p;}

/* ---- Empezar, contestar y entregar ---- */
function startSim(qs,minutes){
 if(!qs.length){toast('No hay preguntas suficientes con estos filtros.','alert');return;}
 const c=state.simCfg;const min=minutes!=null?minutes:c.min;
 state.simRun={qs,ans:qs.map(()=>null),cur:0,pen:c.pen,started:Date.now(),endAt:min>0?Date.now()+min*60000:null,confirm:false};
 simAbortArmed=false;state.ui.simView='run';save();renderSim();scrollSimTop();}
function scrollSimTop(){const a=$('#simArea');if(a&&a.scrollIntoView&&innerWidth<1000)a.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}
function simAnswer(k){const r=state.simRun;if(!r)return;r.ans[r.cur]=k;r.confirm=false;save();renderSim();
 if(r.cur<r.qs.length-1){const at=r.cur;setTimeout(()=>{const rr=state.simRun;if(rr&&rr.cur===at&&rr.ans[at]===k){rr.cur++;save();renderSim();}},380);}}
function simGo(i){const r=state.simRun;if(!r)return;r.cur=Math.max(0,Math.min(r.qs.length-1,i));r.confirm=false;save();renderSim();}

function finishSim(timeout){
 const r=state.simRun;if(!r)return;
 const n=r.qs.length;let ok=0,ko=0,bl=0;const fails=[];
 r.qs.forEach((q,i)=>{const a=r.ans[i];if(a==null)bl++;else if(a===q.ok)ok++;else{ko++;fails.push(i);}});
 const score=Math.max(0,(ok-(r.pen?ko/r.pen:0))/n*10);
 const secs=Math.round((Date.now()-r.started)/1000);
 const errIds={};let added=0;
 fails.forEach(i=>{const q=r.qs[i];const right=q.opts[q.ok];
  let e=state.errors.find(x=>x.q===q.q&&(x.tp||null)===(q.tp||null));
  if(e){e.fails=(e.fails||0)+1;e.fixed=false;if(!e.a)e.a=right;}
  else{e={id:uid(),tp:q.tp||null,q:String(q.q).slice(0,400),a:String(right).slice(0,600),reason:'nosabia',date:today(),fixed:false,fails:0,cred:false};state.errors.push(e);added++;}
  errIds[i]=e.id;});
 state.tests.push({at:Date.now(),date:today(),n,ok,ko,bl,pen:r.pen,score,secs});
 if(state.tests.length>300)state.tests.shift();
 state.simLast={at:Date.now(),n,ok,ko,bl,pen:r.pen,score,secs,timeout:!!timeout,qs:r.qs,ans:r.ans,errIds,added};
 state.simRun=null;state.ui.simView='result';
 logDay().tests=(logDay().tests||0)+1;bumpStreak();
 const xp=ok*2+(score>=5?20:0)+(score>=8?20:0),coins=ok+(score>=8?15:0);
 if(timeout)toast('<b>¡Tiempo!</b> El simulacro se ha entregado solo.','timer');
 if(xp)grantXP(xp,`Simulacro: ${fmtScore(score)}`,coins);
 if(score>=5)confetti(score>=8?140:70);
 afterAction();scrollSimTop();}

setInterval(()=>{const r=state.simRun;if(!r)return;
 if(r.endAt&&Date.now()>=r.endAt){finishSim(true);return;}
 const el=$('#simTimer');if(el){el.innerHTML=timerHTML(r);el.classList.toggle('low',!!r.endAt&&r.endAt-Date.now()<60000);}},1000);
function timerHTML(r){return r.endAt?`${ico('timer')}${fmtSecs((r.endAt-Date.now())/1000)}`:`${ico('timer')}${fmtSecs((Date.now()-r.started)/1000)}`;}

/* ---- Pegar varias preguntas de golpe ---- */
function parseBulk(txt,tp){
 const blocks=String(txt).replace(/\r/g,'').split(/\n\s*\n/);const out=[];let bad=0;
 for(const b of blocks){
  const lines=b.split('\n').map(l=>l.trim()).filter(Boolean);if(!lines.length)continue;
  const q=[],opts=[];let ok=-1;
  for(const l of lines){
   const ans=l.match(/^(?:respuesta|correcta|soluci[oó]n)\s*(?:correcta)?\s*[:\-]?\s*\(?([a-h])\)?\s*$/i);
   if(ans&&opts.length){ok=OPT_L.indexOf(ans[1].toUpperCase());continue;}
   const m=l.match(/^(\*)?\s*\(?([a-hA-H])[\)\.\-:]\s*(.+?)\s*(\*)?$/);
   if(m&&q.length){if(m[1]||m[4])ok=opts.length;opts.push(m[3]);}
   else if(!opts.length)q.push(l.replace(/^\d+\s*[\.\)\-]\s*/,''));
   else opts[opts.length-1]+=' '+l;}
  if(q.length&&opts.length>=2&&ok>=0&&ok<opts.length)out.push({id:uid(),tp,q:q.join(' ').slice(0,500),opts:opts.slice(0,8).map(o=>o.slice(0,300)),ok,expl:'',created:Date.now()});
  else bad++;}
 return {out,bad};}

/* ---- Pantallas ---- */
function setupHTML(){
 const c=state.simCfg;const own=ownPool(c.tp).length,cards=cardPool(c.tp).length;
 const avail=(c.src!=='cards'?own:0)+(c.src!=='own'?cards:0);const take=Math.min(avail,c.n);
 const T=state.tests;const last=T.slice(-10);
 const avg5=T.length?T.slice(-5).reduce((s,t)=>s+t.score,0)/Math.min(5,T.length):0;const best=T.length?Math.max(...T.map(t=>t.score)):0;
 const qTp=state.ui.qTp||'all';const bank=state.questions.filter(q=>qTp==='all'||q.tp===qTp).slice().reverse();
 const sel=(id,opts,val)=>`<select class="inp" id="${id}">${opts.map(([v,l])=>`<option value="${v}" ${String(val)===String(v)?'selected':''}>${l}</option>`).join('')}</select>`;
 return `<div class="sim-grid">
 <article class="card"><div class="card-head"><h3 class="card-title">${ico('clipboard')}Nuevo simulacro</h3></div>
  <div class="seg sim-src" role="group" aria-label="De dónde salen las preguntas">${[['all','Todas'],['own','Mis preguntas'],['cards','Flashcards']].map(([v,l])=>`<button data-act="sim-src" data-v="${v}" aria-pressed="${c.src===v}">${l}</button>`).join('')}</div>
  <div class="sim-cfg">
   <label for="simTp">Tema<select class="inp" id="simTp"></select></label>
   <label for="simN">Preguntas${sel('simN',[[10,'10'],[20,'20'],[30,'30'],[50,'50'],[100,'100']],c.n)}</label>
   <label for="simMin">Tiempo${sel('simMin',[[0,'Sin límite'],[5,'5 min'],[10,'10 min'],[15,'15 min'],[20,'20 min'],[30,'30 min'],[45,'45 min'],[60,'60 min'],[90,'90 min'],[120,'120 min']],c.min)}</label>
   <label for="simPen">Penalización por fallo${sel('simPen',[[0,'Sin penalización'],[4,'Resta 1/4'],[3,'Resta 1/3'],[2,'Resta 1/2'],[1,'Resta 1 entera']],c.pen)}</label>
  </div>
  <p class="hint">Disponibles: <b>${avail}</b> preguntas (${own} tuyas · ${cards} de flashcards). ${avail&&avail<c.n?`Haré el simulacro con ${avail}.`:''} Las flashcards necesitan al menos 3 respuestas distintas en tu mazo para generar opciones.</p>
  <button class="btn pink sim-start" data-act="sim-start" ${take?'':'disabled'}>${ico('play')}Empezar simulacro de ${take||0} preguntas</button>
  <p class="hint">Cada acierto suma 2 XP. Aprobar (5 o más) da +20 XP y un 8 o más, otros +20 XP y 15 monedas. Los fallos van solos a tu cuaderno de errores.</p>
 </article>
 <article class="card"><div class="card-head"><h3 class="card-title">${ico('chart')}Tus resultados</h3>${T.length?`<span class="chip">${T.length} simulacros</span>`:''}</div>
  ${T.length?`<div class="sim-kpis"><div class="mini-stat"><b>${fmtScore(T[T.length-1].score)}</b><span>Último</span></div><div class="mini-stat"><b>${fmtScore(avg5)}</b><span>Media últimos 5</span></div><div class="mini-stat"><b>${fmtScore(best)}</b><span>Mejor nota</span></div></div>
  <div class="sim-chart" aria-label="Notas de los últimos simulacros"><span class="sim-five" style="bottom:50%"><i>5</i></span>${last.map(t=>`<div class="sim-col" title="${fmtShort(t.date)} · ${fmtScore(t.score)}"><span class="sim-colv">${fmtScore(t.score)}</span><span class="sim-colb ${t.score>=5?'pass':''}" style="height:${Math.max(3,t.score*10)}%"></span></div>`).join('')}</div>
  <ul class="sim-hist">${T.slice(-5).reverse().map(t=>`<li><span>${fmtShort(t.date)}</span><span>${t.n} preg. · ${t.ok}✓ ${t.ko}✗ ${t.bl}–${t.pen?` · −1/${t.pen}`:''}</span><b class="${t.score>=5?'pass':'fail'}">${fmtScore(t.score)}</b></li>`).join('')}</ul>`
  :`<div class="empty"><strong>Aún sin simulacros</strong>Cuando hagas el primero verás aquí tu nota y cómo evoluciona.</div>`}
 </article>
 <article class="card span2"><div class="card-head"><h3 class="card-title">${ico('book')}Banco de preguntas</h3><span class="chip">${state.questions.length} preguntas</span></div>
  <div class="bank-forms">
   <details class="bank-add" data-k="add" ${(bankOpen.add===null?!state.questions.length:bankOpen.add)?'open':''}><summary>${ico('plus')}Añadir una pregunta</summary>
    <form class="stack-form" id="qForm" autocomplete="off">
     <label for="qTopic">Tema<select class="inp" id="qTopic"></select></label>
     <label for="qText">Enunciado<textarea class="inp" id="qText" maxlength="500" placeholder="Escribe la pregunta tal y como saldría en el examen"></textarea></label>
     <fieldset class="q-opts"><legend>Opciones · marca la correcta</legend>${[0,1,2,3].map(i=>`<label class="q-opt" for="qO${i}"><input type="radio" name="qOk" id="qOk${i}" value="${i}" ${i===0?'checked':''} aria-label="Marcar ${OPT_L[i]} como correcta"><b>${OPT_L[i]}</b><input class="inp" id="qO${i}" maxlength="300" placeholder="${i<2?'Opción obligatoria':'Opción opcional'}"></label>`).join('')}</fieldset>
     <label for="qExpl">Explicación (opcional)<input class="inp" id="qExpl" maxlength="300" placeholder="Por qué es la correcta: artículo, norma, truco…"></label>
     <button class="btn sun" type="submit">${ico('plus')}Guardar pregunta</button>
    </form></details>
   <details class="bank-add" data-k="bulk" ${bankOpen.bulk?'open':''}><summary>${ico('copy')}Pegar varias de golpe</summary>
    <div class="stack-form"><p class="hint">Separa cada pregunta con una línea en blanco. Pon las opciones como <code>a)</code> <code>b)</code> <code>c)</code> <code>d)</code> y marca la correcta con un asterisco al principio, o añade una línea <code>Respuesta: c</code>.</p>
    <pre class="bank-example">1. ¿Cuál es el teléfono único de emergencias europeo?
a) 091
*b) 112
c) 061
d) 080</pre>
    <label for="qBulkTopic">Tema para todas<select class="inp" id="qBulkTopic"></select></label>
    <label for="qBulk">Preguntas<textarea class="inp" id="qBulk" placeholder="Pega aquí tus preguntas"></textarea></label>
    <button class="btn sun" data-act="q-bulk">${ico('upload')}Importar preguntas</button></div></details>
  </div>
  <div class="bank-list-head"><label class="sr" for="qTpFilter">Filtrar por tema</label><select class="inp" id="qTpFilter"></select></div>
  ${bank.length?`<ul class="c-list bank-list">${bank.slice(0,60).map(q=>`<li class="c-item"><div style="min-width:0"><div class="c-q">${esc(q.q)}</div><div class="c-meta"><span>Correcta: ${OPT_L[q.ok]}) ${esc(q.opts[q.ok])}</span><span>· ${q.opts.length} opciones</span>${qTp==='all'?`<span>· ${esc(topicName(q.tp))}</span>`:''}</div></div><button class="btn sm icon ghost" data-act="q-del" data-id="${q.id}" aria-label="Borrar pregunta">${ico('trash')}</button></li>`).join('')}</ul>${bank.length>60?`<p class="hint">Y ${bank.length-60} más.</p>`:''}`
  :`<div class="empty"><strong>${state.questions.length?'Nada en este tema':'Tu banco está vacío'}</strong>${state.questions.length?'Elige otro tema.':'Añade preguntas de tus test o pega varias de golpe. Mientras tanto, puedes hacer simulacros con tus flashcards.'}</div>`}
 </article></div>`;}

function runHTML(){
 const r=state.simRun,i=r.cur,q=r.qs[i],n=r.qs.length;const answered=r.ans.filter(a=>a!=null).length,blank=n-answered;
 return `<article class="card sim-run">
 <div class="sim-top"><span class="chip">Pregunta ${i+1} / ${n}</span><span class="chip">${answered} contestadas</span>${r.pen?`<span class="chip warn">Fallo resta 1/${r.pen}</span>`:''}<span class="sim-timer" id="simTimer">${timerHTML(r)}</span></div>
 <div class="bar sim-bar"><i style="width:${answered/n*100}%"></i></div>
 <div class="eyebrow">${esc(q.tp?topicName(q.tp):'Sin tema')} · ${q.src==='c'?'De tus flashcards':'Tu banco de preguntas'}</div>
 <h3 class="sim-q">${esc(q.q)}</h3>
 <div class="sim-opts">${q.opts.map((o,k)=>`<button class="sim-opt ${r.ans[i]===k?'sel':''}" data-act="sim-ans" data-k="${k}" aria-pressed="${r.ans[i]===k}"><b>${OPT_L[k]}</b><span>${esc(o)}</span></button>`).join('')}</div>
 <div class="sim-nav"><button class="btn" data-act="sim-go" data-d="-1" ${i===0?'disabled':''}>Anterior</button><button class="btn ghost" data-act="sim-blank" ${r.ans[i]==null?'disabled':''}>Dejar en blanco</button><button class="btn sun" data-act="sim-go" data-d="1" ${i===n-1?'disabled':''}>Siguiente</button></div>
 <div class="sim-map" aria-label="Mapa de preguntas">${r.qs.map((_,k)=>`<button class="sim-dot ${r.ans[k]!=null?'done':''} ${k===i?'cur':''}" data-act="sim-jump" data-k="${k}" aria-label="Ir a la pregunta ${k+1}">${k+1}</button>`).join('')}</div>
 <div class="sim-end"><button class="btn pink" data-act="sim-finish">${ico('flag')}${r.confirm?(blank?`Quedan ${blank} en blanco · Pulsa otra vez para entregar`:'Pulsa otra vez para entregar'):'Entregar simulacro'}</button><button class="btn ghost sm" data-act="sim-abort">${simAbortArmed?'Pulsa otra vez para abandonar (no cuenta)':'Abandonar'}</button></div>
 <p class="hint sim-keys">Atajos en ordenador: teclas A–D o 1–4 para contestar y flechas para moverte.</p>
 </article>`;}

function resultHTML(){
 const s=state.simLast;const pass=s.score>=5;
 const msg=s.score>=9?'¡Sobresaliente! Así se llega al examen.':s.score>=7?'Muy bien. Repasa los fallos y a por el 9.':s.score>=5?'Aprobado. Los fallos ya están en tu cuaderno para repasarlos.':'Toca repasar. Revisa los fallos con calma y vuelve a intentarlo.';
 const restado=s.pen?s.ko/s.pen:0;
 const opts=Object.entries(REASONS).map(([k,l])=>`<option value="${k}">${l}</option>`).join('');
 return `<article class="card sim-result ${pass?'pass':'fail'}">
 <div class="sim-score"><div><span class="eyebrow">Tu nota</span><div class="sim-big">${fmtScore(s.score)}<small>/10</small></div><p>${msg}${s.timeout?' Se entregó al acabarse el tiempo.':''}</p></div>
 <div class="sim-kpis wide"><div class="mini-stat"><b>${s.ok}</b><span>Aciertos</span></div><div class="mini-stat"><b>${s.ko}</b><span>Fallos</span></div><div class="mini-stat"><b>${s.bl}</b><span>En blanco</span></div><div class="mini-stat"><b>${restado?'−'+fmtScore(restado):'0'}</b><span>Restado por fallos</span></div><div class="mini-stat"><b>${fmtSecs(s.secs)}</b><span>Tiempo</span></div></div></div>
 ${s.ko?`<p class="sim-errs">${ico('alert')}${s.added?`${s.added} ${s.added===1?'fallo nuevo guardado':'fallos nuevos guardados'} en tu cuaderno de errores`:'Tus fallos ya estaban en el cuaderno: he sumado un intento más a cada uno'}. Abajo puedes indicar por qué fallaste cada una.</p>`:''}
 <div class="aj-actions"><button class="btn pink" data-act="sim-new">${ico('play')}Nuevo simulacro</button>${s.ko?`<button class="btn sun" data-act="sim-retry" data-m="ko">${ico('repeat')}Repetir los fallos</button>`:''}${s.ko+s.bl?`<button class="btn" data-act="sim-retry" data-m="kobl">Fallos y en blanco</button>`:''}${s.ko?`<button class="btn ghost" data-act="sim-errs">${ico('alert')}Ver cuaderno</button>`:''}</div></article>
 <h3 class="sim-rev-title">Corrección</h3>
 <ol class="sim-review">${s.qs.map((q,i)=>{const a=s.ans[i];const st=a==null?'bl':a===q.ok?'ok':'ko';const eid=s.errIds&&s.errIds[i];const er=eid&&state.errors.find(e=>e.id===eid);
  return `<li class="sim-rq ${st}"><div class="sim-rq-head"><span class="sim-rq-n">${i+1}</span><span class="chip ${st==='ok'?'ok':st==='ko'?'bad':''}">${st==='ok'?'Acierto':st==='ko'?'Fallo':'En blanco'}</span><span class="hint">${esc(q.tp?topicName(q.tp):'Sin tema')}</span></div><div class="sim-rq-q">${esc(q.q)}</div><ul class="sim-rq-opts">${q.opts.map((o,k)=>`<li class="${k===q.ok?'right':''} ${k===a&&k!==q.ok?'wrong':''}"><b>${OPT_L[k]}</b><span>${esc(o)}${k===a?' <em>· tu respuesta</em>':''}</span></li>`).join('')}</ul>${q.expl?`<p class="sim-expl">${ico('bulb')}${esc(q.expl)}</p>`:''}${er?`<label class="sim-why" for="why-${i}">¿Por qué fallaste?<select class="inp sim-reason" id="why-${i}" data-err="${er.id}">${opts.replace(`value="${er.reason}"`,`value="${er.reason}" selected`)}</select></label>`:''}</li>`;}).join('')}</ol>`;}

function renderSim(){
 const area=$('#simArea');if(!area)return;
 const v=state.simRun?'run':(state.ui.simView==='result'&&state.simLast)?'result':'setup';
 area.innerHTML=v==='run'?runHTML():v==='result'?resultHTML():setupHTML();
 if(v==='setup'){
  const c=state.simCfg;topicOptions($('#simTp'),'Todos los temas',null,c.tp);if($('#simTp').value!==c.tp)c.tp='all';
  const nt=state.ui.qTopicSel||'';topicOptions($('#qTopic'),null,'Sin tema',nt);topicOptions($('#qBulkTopic'),null,'Sin tema',nt);
  topicOptions($('#qTpFilter'),'Todos los temas',null,state.ui.qTp||'all');}}

/* ---- Eventos ---- */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="sim-"],[data-act^="q-"]');if(!el||el.disabled)return;
 const a=el.dataset.act,r=state.simRun;
 switch(a){
 case 'sim-src':state.simCfg.src=el.dataset.v;save();renderSim();break;
 case 'sim-start':startSim(shuffle(poolFor(state.simCfg)).slice(0,state.simCfg.n));break;
 case 'sim-ans':simAnswer(+el.dataset.k);break;
 case 'sim-go':if(r)simGo(r.cur+(+el.dataset.d));break;
 case 'sim-jump':simGo(+el.dataset.k);break;
 case 'sim-blank':if(r){r.ans[r.cur]=null;save();renderSim();}break;
 case 'sim-finish':if(!r)break;if(!r.confirm){r.confirm=true;renderSim();setTimeout(()=>{if(state.simRun&&state.simRun.confirm){state.simRun.confirm=false;if(state.ui.tem==='simulacro')renderSim();}},5000);}else finishSim(false);break;
 case 'sim-abort':if(!simAbortArmed){simAbortArmed=true;renderSim();setTimeout(()=>{if(simAbortArmed){simAbortArmed=false;if(state.simRun&&state.ui.tem==='simulacro')renderSim();}},4000);}else{simAbortArmed=false;state.simRun=null;state.ui.simView='setup';save();renderSim();toast('Simulacro abandonado. No cuenta para tus resultados.','x');}break;
 case 'sim-new':state.ui.simView='setup';save();renderSim();break;
 case 'sim-retry':{const s=state.simLast;if(!s)break;const idx=s.qs.map((q,i)=>i).filter(i=>{const x=s.ans[i];return el.dataset.m==='ko'?(x!=null&&x!==s.qs[i].ok):x!==s.qs[i].ok;});
  const qs=shuffle(idx.map(i=>s.qs[i]));const c=state.simCfg;startSim(qs,c.min>0?Math.max(1,Math.ceil(c.min*qs.length/Math.max(1,c.n))):0);break;}
 case 'sim-errs':state.ui.tem='errores';state.ui.erFilter='pend';state.ui.erReason='all';state.ui.erTp='all';save();renderTemario();break;
 case 'q-del':{const i=state.questions.findIndex(q=>q.id===el.dataset.id);if(i<0)break;const [q]=state.questions.splice(i,1);save();renderSim();toast('Pregunta borrada','trash','',{label:'Deshacer',fn:()=>{state.questions.splice(i,0,q);save();renderSim();}});break;}
 case 'q-bulk':{const t=$('#qBulk');const tp=$('#qBulkTopic').value||null;const res=parseBulk(t.value,tp);
  if(!res.out.length){toast(res.bad?'No he reconocido ninguna pregunta. Revisa el formato del ejemplo.':'Pega primero tus preguntas.','alert');break;}
  state.questions.push(...res.out);state.ui.qTopicSel=tp||'';save();renderSim();
  toast(`<b>${res.out.length} ${res.out.length===1?'pregunta importada':'preguntas importadas'}</b>${res.bad?` · ${res.bad} sin reconocer`:''}`,'check','ach');break;}
 }});
document.addEventListener('submit',e=>{if(e.target.id!=='qForm')return;e.preventDefault();
 const q=$('#qText').value.trim();const opts=[0,1,2,3].map(i=>$('#qO'+i).value.trim());
 const okSel=document.querySelector('input[name="qOk"]:checked');const okIdx=okSel?+okSel.value:0;
 if(!q){$('#qText').focus();return;}
 if(!opts[0]||!opts[1]){toast('Escribe al menos las opciones A y B.','alert');return;}
 if(!opts[okIdx]){toast('La opción marcada como correcta está vacía.','alert');return;}
 const keep=[],map={};opts.forEach((o,i)=>{if(o){map[i]=keep.length;keep.push(o);}});
 const tp=$('#qTopic').value||null;state.ui.qTopicSel=tp||'';
 state.questions.push({id:uid(),tp,q:q.slice(0,500),opts:keep,ok:map[okIdx],expl:$('#qExpl').value.trim().slice(0,300),created:Date.now()});
 bankOpen.add=true;save();renderSim();toast('Pregunta guardada','check');const t=$('#qText');if(t)t.focus();});
document.addEventListener('change',e=>{const el=e.target;if(!el||!el.id&&!el.classList)return;
 const c=state.simCfg;
 if(el.id==='simTp'){c.tp=el.value;save();renderSim();}
 else if(el.id==='simN'){c.n=+el.value;save();renderSim();}
 else if(el.id==='simMin'){c.min=+el.value;save();}
 else if(el.id==='simPen'){c.pen=+el.value;save();}
 else if(el.id==='qTpFilter'){state.ui.qTp=el.value;save();renderSim();}
 else if(el.id==='qTopic'||el.id==='qBulkTopic'){state.ui.qTopicSel=el.value;}
 else if(el.classList.contains('sim-reason')){const er=state.errors.find(x=>x.id===el.dataset.err);if(er){er.reason=el.value;save();toast('Motivo guardado','check');}}});
document.addEventListener('keydown',e=>{
 if(!state.simRun||state.ui.tab!=='temario'||state.ui.tem!=='simulacro')return;
 const ae=document.activeElement;if(ae&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName))return;
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 const r=state.simRun,n=r.qs[r.cur].opts.length;
 let k=-1;if(/^[1-8]$/.test(e.key))k=+e.key-1;else if(/^[a-hA-H]$/.test(e.key))k=OPT_L.indexOf(e.key.toUpperCase());
 if(k>=0&&k<n){e.preventDefault();simAnswer(k);return;}
 if(e.key==='ArrowRight'){e.preventDefault();simGo(r.cur+1);}else if(e.key==='ArrowLeft'){e.preventDefault();simGo(r.cur-1);}});
