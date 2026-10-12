/* Mapa de temas, repasos, flashcards y cuaderno de errores */
'use strict';

/* ================= TEMARIO ================= */
let pendingDel=null,sess=null,ers=null;
const topicName=id=>{const t=state.topics.find(x=>x.id===id);return t?t.name:'Sin tema';};
function distBar(list){if(!list.length)return '<div class="dist"></div>';const c=[0,0,0,0,0];list.forEach(t=>c[t.dom]++);return `<div class="dist" aria-label="Distribución de dominio">${c.map((n,i)=>n?`<i style="width:${n/list.length*100}%;background:var(${DOM[i].c})"></i>`:'').join('')}</div>`;}
function nextRev(tp){return tp.reviews.filter(r=>!r.done&&!r.skip).sort((a,b)=>a.due<b.due?-1:1)[0]||null;}
function revLabel(r){const t=today();if(r.due<t)return 'Repaso atrasado';if(r.due===t)return 'Repaso hoy';const d=daysBetween(t,r.due);return d===1?'Repaso mañana':`Repaso en ${d} días`;}
function renderTemario(){
 const tabs=[['temas','Mapa de temas','map'],['cartas','Flashcards','cards'],['simulacro','Simulacro','clipboard'],['errores','Cuaderno de errores','alert']];
 const t=today();const dueC=state.cards.filter(c=>c.due<=t).length;const pendE=state.errors.filter(e=>!e.fixed).length;
 $('#temTabs').innerHTML=tabs.map(([id,l,i])=>`<button class="pill cnt" data-act="tem-tab" data-id="${id}" aria-pressed="${state.ui.tem===id}">${ico(i)}${l}${id==='simulacro'?`<span class="pill-count">${state.questions.length}</span>`:id==='cartas'?`<span class="pill-count">${dueC}</span>`:id==='errores'?`<span class="pill-count">${pendE}</span>`:`<span class="pill-count">${state.topics.length}</span>`}</button>`).join('');
 $$('.tem-view').forEach(v=>v.hidden=v.id!=='tem-'+state.ui.tem);
 if(state.ui.tem==='temas')renderTemas();else if(state.ui.tem==='cartas')renderCardsView();else if(state.ui.tem==='simulacro')renderSim();else renderErrors();
}
function renderTemas(){
 const t=today();const tps=state.topics;
 const pendToday=tps.reduce((n,tp)=>n+tp.reviews.filter(r=>!r.done&&!r.skip&&r.due<=t).length,0);
 $('#temSum').innerHTML=[['Temas',tps.length],['Dominados',tps.filter(x=>x.dom===4).length],['Vueltas cerradas',state.counts.closes],['Repasos para hoy',pendToday]].map(([l,v])=>`<div class="mini-stat"><b>${v}</b><span>${l}</span></div>`).join('')+`<div class="tem-dist">${distBar(tps)}<div class="legend">${DOM.map(d=>`<span><i style="background:var(${d.c})"></i>${d.n}</span>`).join('')}</div></div>`;
 const mats=[...new Set(tps.map(x=>x.mat).filter(Boolean))];$('#matList').innerHTML=mats.map(m=>`<option value="${esc(m)}"></option>`).join('');
 const sc=state.ui.temScope;
 $('#temScopes').innerHTML=[['all','Todos']].concat(Object.entries(SCOPE)).map(([k,l])=>{const n=k==='all'?tps.length:tps.filter(x=>x.scope===k).length;return (k==='all'||n)?`<button class="pill cnt" data-act="tem-scope" data-id="${k}" aria-pressed="${sc===k}">${l}<span class="pill-count">${n}</span></button>`:'';}).join('');
 const list=tps.filter(x=>sc==='all'||x.scope===sc);
 let html;
 if(!tps.length)html=`<div class="empty"><strong>Tu mapa está vacío</strong>Añade tu primer tema arriba: nombre, materia o bloque y ámbito.<br><button class="btn" data-act="tp-example">${ico('sparkle')}Probar con temas de ejemplo</button></div>`;
 else if(!list.length)html='<div class="empty"><strong>Nada en este ámbito</strong>Elige otro filtro o añade un tema.</div>';
 else{const groups={};list.forEach(x=>{const m=x.mat||'Sin materia';(groups[m]=groups[m]||[]).push(x);});
  html=Object.keys(groups).map(m=>{const g=groups[m];return `<div class="mat"><div class="mat-head"><span class="mat-name">${esc(m)}</span><span class="chip ${g[0].scope}">${SCOPE[g[0].scope]}</span><span class="meta">${g.length} ${g.length===1?'tema':'temas'}</span>${distBar(g)}</div><div class="topic-grid">${g.map(tp=>{const nr=nextRev(tp);return `<button class="topic ${state.ui.tpSel===tp.id?'sel':''}" style="${domStyle(tp.dom)}" data-act="tp-sel" data-id="${tp.id}"><span class="topic-name">${esc(tp.name)}</span><span class="topic-meta"><span class="v">V${tp.vuelta}</span><span>${DOM[tp.dom].n}</span></span>${nr?`<span class="topic-rev">${ico('repeat')}${revLabel(nr)}</span>`:''}</button>`;}).join('')}</div></div>`;}).join('');}
 $('#temMap').innerHTML=html;
 $('#tpDetail').innerHTML=detailHTML();
}
function upcomingHTML(){const t=today(),lim=addDays(t,7);const rows=[];state.topics.forEach(tp=>tp.reviews.forEach(r=>{if(!r.done&&!r.skip&&r.due>t&&r.due<=lim)rows.push({tp,r});}));rows.sort((a,b)=>a.r.due<b.r.due?-1:1);
 return `<div class="td-sec"><span class="eyebrow">Próximos repasos · 7 días</span>${rows.length?`<ul class="revs">${rows.slice(0,8).map(x=>`<li class="rev-row"><b>${fmtShort(x.r.due)}</b><span style="overflow-wrap:anywhere">${esc(x.tp.name)}</span><span class="st">+${x.r.n} d</span></li>`).join('')}</ul>`:'<p class="hint">No tienes repasos programados esta semana.</p>'}</div>`;}
function detailHTML(){const tp=state.topics.find(x=>x.id===state.ui.tpSel);
 if(!tp)return `<div class="card tp-detail"><div class="card-title">${ico('map')}Ficha del tema</div><p class="hint" style="margin-top:8px">Toca un tema del mapa para ver sus vueltas, su dominio y sus repasos.</p>${upcomingHTML()}</div>`;
 const t=today();const cards=state.cards.filter(c=>c.tp===tp.id);const due=cards.filter(c=>c.due<=t).length;const errs=state.errors.filter(e=>e.tp===tp.id&&!e.fixed).length;
 const revs=tp.reviews.length?`<ul class="revs">${tp.reviews.map(r=>{let st,cl;if(r.done){st='Hecho';cl='ok';}else if(r.skip){st='Omitido';cl='skip';}else if(r.due<t){st='Atrasado';cl='late';}else if(r.due===t){st='Hoy';cl='hoy';}else{st='Pendiente';cl='';}return `<li class="rev-row"><b>+${r.n} d</b><span>${fmtShort(r.due)}</span><span class="st ${cl}">${st}</span></li>`;}).join('')}</ul>`:'<p class="hint">Aún no hay repasos. Cierra una vuelta para programarlos.</p>';
 return `<div class="card tp-detail"><div class="eyebrow">${SCOPE[tp.scope]}</div>
 <input class="td-name" id="tdName" value="${esc(tp.name)}" maxlength="80" aria-label="Nombre del tema">
 <input class="td-mat" id="tdMat" value="${esc(tp.mat)}" placeholder="Materia o bloque" maxlength="60" aria-label="Materia o bloque">
 <div class="td-sec"><span class="eyebrow">Vuelta actual</span><div class="vuelta"><button class="btn round" data-act="tp-v" data-d="-1" aria-label="Restar una vuelta">${ico('minus')}</button><b>${tp.vuelta}</b><button class="btn round" data-act="tp-v" data-d="1" aria-label="Sumar una vuelta">${ico('plus')}</button></div></div>
 <div class="td-sec"><span class="eyebrow">¿Cuánto lo dominas?</span><div class="dom-row">${DOM.map((d,i)=>`<button class="dom-btn" style="${domStyle(i)}" data-act="tp-dom" data-d="${i}" aria-pressed="${tp.dom===i}">${d.n}</button>`).join('')}</div></div>
 <div class="td-sec"><button class="btn pink" data-act="tp-close">${ico('repeat')}Cerrar vuelta y programar repasos</button><span class="hint">Suma una vuelta y programa repasos a 1, 3, 7 y 30 días. Aparecen solos en tus tareas el día que tocan. +20 XP y 10 monedas.</span>${revs}</div>
 <div class="td-sec"><div class="td-line"><span>${ico('cards')} ${cards.length} tarjetas · ${due} para hoy</span><button class="btn sm" data-act="tp-cards">Estudiar</button></div><div class="td-line"><span>${ico('alert')} ${errs} errores pendientes</span><button class="btn sm" data-act="tp-errs">Ver</button></div></div>
 <div class="td-sec" style="align-items:flex-start"><button class="btn sm ghost" data-act="tp-del">${ico('trash')}${pendingDel===tp.id?'Pulsa otra vez para borrar':'Borrar tema'}</button></div></div>`;}
function closeRound(tp){const t=today();{const L=logDay();L.closes=(L.closes||0)+1;}tp.vuelta=Math.min(30,tp.vuelta+1);tp.last=t;
 state.tasks=state.tasks.filter(x=>!(x.rev&&x.rev.tp===tp.id&&!x.done));
 tp.reviews=[1,3,7,30].map(n=>({n,due:addDays(t,n),done:false,skip:false,task:null}));state.counts.closes++;
 grantXP(20,`Vuelta ${tp.vuelta} cerrada`,10);toast(`Repasos programados: ${tp.reviews.map(r=>fmtShort(r.due)).join(', ')}`,'calendar');afterAction();}
function addExamples(){const t=today();const mk=(name,mat,scope,v,d)=>({id:uid(),name,mat,scope,vuelta:v,dom:d,last:null,reviews:[],created:Date.now()+Math.random()});
 const a=[mk('Ejemplo · Tema 1','Ejemplo · Bloque A','opo',2,3),mk('Ejemplo · Tema 2','Ejemplo · Bloque A','opo',1,2),mk('Ejemplo · Tema 3','Ejemplo · Bloque A','opo',0,0),mk('Ejemplo · Tema 4','Ejemplo · Bloque B','opo',3,4),mk('Ejemplo · Tema 5','Ejemplo · Bloque B','opo',1,1),mk('Ejemplo · Unidad 1','Ejemplo · Asignatura','uni',1,2)];
 a[0].reviews=[{n:1,due:addDays(t,-2),done:true,skip:false,task:null},{n:3,due:t,done:false,skip:false,task:null},{n:7,due:addDays(t,4),done:false,skip:false,task:null},{n:30,due:addDays(t,27),done:false,skip:false,task:null}];
 a[1].reviews=[{n:1,due:addDays(t,1),done:false,skip:false,task:null},{n:3,due:addDays(t,3),done:false,skip:false,task:null},{n:7,due:addDays(t,7),done:false,skip:false,task:null},{n:30,due:addDays(t,30),done:false,skip:false,task:null}];
 state.topics.push(...a);
 state.cards.push({id:uid(),tp:a[0].id,q:'Ejemplo: ¿a qué intervalos se programan los repasos espaciados?',a:'A 1, 3, 7 y 30 días desde que cierras la vuelta.',box:1,due:t,ok:0,ko:0,created:Date.now()},{id:uid(),tp:a[0].id,q:'Ejemplo: ¿cuánto dura un pomodoro clásico?',a:'25 minutos de foco y 5 de descanso.',box:1,due:t,ok:0,ko:0,created:Date.now()+1});
 state.errors.push({id:uid(),tp:a[1].id,q:'Ejemplo: confundí dos plazos parecidos en un test',a:'Anota aquí la respuesta correcta para repasarla.',reason:'confundi',date:t,fixed:false,fails:0,cred:false});
 state.ui.tpSel=a[0].id;afterAction();toast('Temas de ejemplo añadidos. Bórralos cuando quieras.','sparkle');}
$('#tpForm').addEventListener('submit',e=>{e.preventDefault();const n=$('#tpName').value.trim();if(!n){$('#tpName').focus();return;}const tp={id:uid(),name:n.slice(0,80),mat:$('#tpMat').value.trim().slice(0,60),scope:$('#tpScope').value,vuelta:0,dom:0,last:null,reviews:[],created:Date.now()};state.topics.push(tp);state.ui.tpSel=tp.id;$('#tpName').value='';save();renderTemario();$('#tpName').focus();});

/* --- Flashcards --- */
const BOX_DAYS=[0,1,2,4,8,16];
function topicOptions(sel,allLabel,noneLabel,val){sel.innerHTML=(allLabel?`<option value="all">${allLabel}</option>`:'')+(noneLabel?`<option value="">${noneLabel}</option>`:'')+state.topics.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join('');sel.value=val;if(sel.value!==val)sel.selectedIndex=0;}
const boxDots=b=>`<span class="box-dots" title="Caja ${b} de 5">${[1,2,3,4,5].map(i=>`<i class="${i<=b?'on':''}"></i>`).join('')}</span>`;
function renderCardsView(){const t=today();const f=state.ui.fcTopic;
 topicOptions($('#fcTopic'),'Todas las tarjetas',null,f);if($('#fcTopic').value!==f){state.ui.fcTopic='all';}
 const nt=$('#fcNewTopic');const prev=nt.dataset.v!=null?nt.dataset.v:(f!=='all'?f:'');topicOptions(nt,null,'Sin tema',prev);
 const ff=state.ui.fcTopic;const pool=state.cards.filter(c=>ff==='all'||c.tp===ff);const due=pool.filter(c=>c.due<=t);
 $('#fcTitle').innerHTML=`${ico('cards')}Repaso de tarjetas`;$('#fcNewTitle').innerHTML=`${ico('plus')}Nueva tarjeta`;
 $('#fcStats').innerHTML=`<span class="chip xp">${due.length} para hoy</span><span class="chip">${pool.length} en total</span>`;
 const area=$('#fcArea');
 if(!sess){area.innerHTML=pool.length?`<div class="fc-start"><div class="fc-big">${due.length}</div><p style="font-weight:700">${due.length?(due.length===1?'tarjeta te espera hoy':'tarjetas te esperan hoy'):'Todo al día. Vuelve mañana o practica sin presión.'}</p><div class="acts"><button class="btn pink" data-act="fc-start" data-mode="due" ${due.length?'':'disabled'}>${ico('play')}Empezar repaso</button><button class="btn" data-act="fc-start" data-mode="all">${ico('shuffle')}Practicar todas</button></div><p class="hint" style="max-width:44ch">Cada acierto en repaso da +2 XP y 1 moneda. Las que aciertas vuelven cada vez más tarde; las que fallas, vuelven mañana.</p></div>`:`<div class="empty"><strong>Aún no hay tarjetas${ff!=='all'?' en este tema':''}</strong>Crea la primera con el formulario: una pregunta corta y su respuesta.</div>`;}
 else if(sess.idx>=sess.queue.length){area.innerHTML=`<div class="fc-start"><div class="fc-big">${sess.ok}/${sess.ok+sess.ko}</div><p style="font-weight:700">aciertos en esta sesión</p>${sess.xp?`<span class="chip xp">+${sess.xp} XP · +${sess.coins} monedas</span>`:'<p class="hint">Modo práctica: no cambia el calendario de tus tarjetas.</p>'}<div class="acts"><button class="btn" data-act="fc-quit">Volver</button></div></div>`;}
 else{const c=state.cards.find(x=>x.id===sess.queue[sess.idx]);if(!c){sess.idx++;renderCardsView();return;}
  area.innerHTML=`<div class="fc-prog"><span>${sess.idx+1} / ${sess.queue.length}${sess.mode==='all'?' · práctica':''}</span><span>${esc(topicName(c.tp))}</span>${boxDots(c.box)}</div><div class="flip" data-act="fc-flip" id="flip" role="button" tabindex="0" aria-label="Girar tarjeta"><div class="flip-in"><div class="face front"><span class="eyebrow">Pregunta</span><div class="face-txt">${esc(c.q)}</div><span class="face-hint">Toca para ver la respuesta</span></div><div class="face back"><span class="eyebrow" style="color:inherit">Respuesta</span><div class="face-txt">${esc(c.a)}</div></div></div></div><div class="fc-ans" id="fcAns" hidden><button class="btn pink" data-act="fc-ans" data-ok="0">${ico('x')}Fallé</button><button class="btn mint" data-act="fc-ans" data-ok="1">${ico('check')}Acerté</button></div><div class="fc-end"><button class="btn sm ghost" data-act="fc-quit">Terminar sesión</button></div>`;}
 const lst=pool.slice().sort((a,b)=>a.due<b.due?-1:1);
 $('#fcList').innerHTML=lst.length?lst.map(c=>`<li class="c-item"><div style="min-width:0"><div class="c-q">${esc(c.q)}</div><div class="c-meta">${boxDots(c.box)}<span>${c.due<=t?'Toca hoy':'Vuelve el '+fmtShort(c.due)}</span>${ff==='all'?`<span>· ${esc(topicName(c.tp))}</span>`:''}</div></div><button class="btn sm icon ghost" data-act="fc-del" data-id="${c.id}" aria-label="Borrar tarjeta">${ico('trash')}</button></li>`).join(''):'';}
function startSession(mode){const t=today();const ff=state.ui.fcTopic;const pool=state.cards.filter(c=>ff==='all'||c.tp===ff);const q=(mode==='due'?pool.filter(c=>c.due<=t):pool).map(c=>c.id);if(!q.length)return;sess={mode,queue:shuffle(q),idx:0,ok:0,ko:0,xp:0,coins:0,re:{}};renderCardsView();}
function answerCard(ok){const c=state.cards.find(x=>x.id===sess.queue[sess.idx]);sess.idx++;if(!c){renderCardsView();return;}
 if(ok)sess.ok++;else sess.ko++;
 if(sess.mode==='due'){if(ok){const wasTop=c.box===5;c.box=Math.min(5,c.box+1);c.due=addDays(today(),wasTop?30:BOX_DAYS[c.box]);c.ok++;state.counts.cardsOk++;logDay().cards++;bumpStreak();grantXP(2,'Acierto',1,true);sess.xp+=2;sess.coins+=1;}else{c.box=1;c.due=today();c.ko++;if(!sess.re[c.id]){sess.re[c.id]=1;sess.queue.push(c.id);}}}
 if(sess.idx>=sess.queue.length&&sess.xp)toast(`<b>+${sess.xp} XP</b> · <b>${coinTxt('+'+sess.coins)}</b> · Repaso de tarjetas`,'cards');
 afterAction();}
$('#fcForm').addEventListener('submit',e=>{e.preventDefault();const q=$('#fcQ').value.trim(),a=$('#fcA').value.trim();if(!q){$('#fcQ').focus();return;}if(!a){$('#fcA').focus();return;}const tp=$('#fcNewTopic').value||null;$('#fcNewTopic').dataset.v=tp||'';state.cards.push({id:uid(),tp,q:q.slice(0,400),a:a.slice(0,600),box:1,due:today(),ok:0,ko:0,created:Date.now()});$('#fcQ').value='';$('#fcA').value='';save();renderTemario();toast('Tarjeta creada','cards');$('#fcQ').focus();});

/* --- Errores --- */
function renderErrors(){topicOptions($('#erTopic'),null,'Sin tema',$('#erTopic').value||'');topicOptions($('#erTpFilter'),'Todos los temas',null,state.ui.erTp);if($('#erTpFilter').value!==state.ui.erTp)state.ui.erTp='all';
 $('#erNewTitle').innerHTML=`${ico('alert')}Anotar un error`;
 const pend=state.errors.filter(e=>!e.fixed);
 $('#erReasons').innerHTML=Object.keys(REASONS).map(k=>`<button class="reason" style="--rc:var(--${REASON_C[k]})" data-act="er-reason" data-r="${k}" aria-pressed="${state.ui.erReason===k}"><span>${REASONS[k]}</span><b>${pend.filter(e=>e.reason===k).length}</b></button>`).join('');
 const cnt={};pend.forEach(e=>cnt[e.reason]=(cnt[e.reason]||0)+1);const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
 $('#erTop').textContent=top?`Tu fallo más habitual ahora mismo: ${REASONS[top].toLowerCase()}. Toca un motivo para filtrar la lista.`:'Cuando anotes errores verás aquí qué tipo de fallo repites más.';
 $$('#tem-errores .filters .seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===state.ui.erFilter)));
 const f=state.ui.erFilter,rs=state.ui.erReason,tpf=state.ui.erTp;
 const list=state.errors.filter(e=>(f==='all'||(f==='pend'?!e.fixed:e.fixed))&&(rs==='all'||e.reason===rs)&&(tpf==='all'||e.tp===tpf)).sort((a,b)=>(a.fixed-b.fixed)||(a.date<b.date?1:-1));
 const reviewable=state.errors.filter(e=>!e.fixed&&(rs==='all'||e.reason===rs)&&(tpf==='all'||e.tp===tpf));
 $('#erListTitle').innerHTML=`${ico('clipboard')}Tus errores · ${pend.length} pendientes`;
 const sb=$('#erStart');sb.innerHTML=`${ico('play')}Repasar (${reviewable.length})`;sb.disabled=!reviewable.length||!!ers;
 const area=$('#erArea');
 if(ers){if(ers.idx>=ers.queue.length){area.innerHTML=`<div class="er-card"><div class="fc-big">${ers.fixed}/${ers.queue.length}</div><p style="font-weight:700">errores resueltos en este repaso</p>${ers.xp?`<span class="chip xp">+${ers.xp} XP · +${ers.coins} monedas</span>`:''}<button class="btn" data-act="er-quit">Volver a la lista</button></div>`;return;}
  const e=state.errors.find(x=>x.id===ers.queue[ers.idx]);if(!e){ers.idx++;renderErrors();return;}
  area.innerHTML=`<div class="er-card"><div class="fc-prog"><span>${ers.idx+1} / ${ers.queue.length}</span><span class="chip r-${e.reason}">${REASONS[e.reason]}</span></div><div class="eyebrow">${esc(topicName(e.tp))}</div><div class="face-txt">${esc(e.q)}</div>${ers.shown?`<div class="err-a">${esc(e.a||'No anotaste la respuesta correcta.')}</div><div class="fc-ans" style="width:100%"><button class="btn pink" data-act="er-res" data-ok="0">Aún me cuesta</button><button class="btn mint" data-act="er-res" data-ok="1">${ico('check')}Ya lo tengo</button></div>`:`<button class="btn sun" data-act="er-show">${ico('eye')}Ver respuesta</button>`}<button class="btn sm ghost" data-act="er-quit">Terminar</button></div>`;return;}
 area.innerHTML=list.length?`<ul class="err-list">${list.map(e=>`<li class="err-item ${e.fixed?'fixed':''}"><div class="task-meta" style="margin:0"><span class="chip r-${e.reason}">${REASONS[e.reason]}</span><span class="chip">${esc(topicName(e.tp))}</span><span class="meta">${fmtShort(e.date)}${e.fails?` · te ha costado ${e.fails} ${e.fails===1?'vez':'veces'}`:''}</span></div><div class="err-q">${esc(e.q)}</div>${e.a?`<div class="err-a">${esc(e.a)}</div>`:''}<div class="err-foot"><button class="btn sm ${e.fixed?'':'mint'}" data-act="er-fix" data-id="${e.id}">${ico('check')}${e.fixed?'Volver a pendiente':'Ya lo tengo'}</button><span style="display:flex;gap:6px"><button class="btn sm" data-act="er-card" data-id="${e.id}">${ico('cards')}Pasar a tarjeta</button><button class="btn sm icon ghost" data-act="er-del" data-id="${e.id}" aria-label="Borrar error">${ico('trash')}</button></span></div></li>`).join('')}</ul>`:`<div class="empty"><strong>${state.errors.length?'Nada con este filtro':'Cuaderno vacío'}</strong>${state.errors.length?'Prueba con otro filtro.':'Cuando falles una pregunta en un test, anótala a la izquierda con su motivo.'}</div>`;}
function fixError(e,quiet){if(e.fixed)return;e.fixed=true;if(!e.cred){e.cred=true;state.counts.errorsFixed++;grantXP(3,'Error resuelto',2,quiet);return true;}return false;}
$('#erForm').addEventListener('submit',e=>{e.preventDefault();const q=$('#erQ').value.trim();if(!q){$('#erQ').focus();return;}state.errors.push({id:uid(),tp:$('#erTopic').value||null,q:q.slice(0,400),a:$('#erA').value.trim().slice(0,600),reason:$('#erReason').value,date:today(),fixed:false,fails:0,cred:false});$('#erQ').value='';$('#erA').value='';grantXP(2,'Error anotado',0);afterAction();$('#erQ').focus();});
