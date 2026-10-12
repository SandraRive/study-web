/* Pruebas físicas: apuntas tus marcas, ves la evolución frente al mínimo y celebras cada récord */
'use strict';

/* Tipos de marca: tiempo (menos es mejor), repeticiones, distancia, etc. */
const PF_KINDS={
 time:{l:'Tiempo',unit:'',better:'low',ph:'Ej.: 3:45 o 8.2'},
 reps:{l:'Repeticiones',unit:'rep.',better:'high',ph:'Ej.: 12'},
 cm:{l:'Distancia (cm)',unit:'cm',better:'high',ph:'Ej.: 245'},
 m:{l:'Distancia (m)',unit:'m',better:'high',ph:'Ej.: 2400'},
 level:{l:'Nivel o periodo',unit:'',better:'high',ph:'Ej.: 9.5'}};
/* Plantillas habituales en oposiciones de emergencias (los mínimos los pones tú con las bases de tu convocatoria) */
const PF_PRESETS=[
 {name:'Carrera 1000 m',kind:'time',e:'🏃‍♀️'},{name:'Carrera 2000 m',kind:'time',e:'🏃‍♀️'},{name:'Velocidad 60 m',kind:'time',e:'⚡'},
 {name:'Course Navette',kind:'level',e:'🔁'},{name:'Natación 50 m',kind:'time',e:'🏊‍♀️'},{name:'Natación 100 m',kind:'time',e:'🏊‍♀️'},
 {name:'Dominadas',kind:'reps',e:'💪'},{name:'Flexiones',kind:'reps',e:'💪'},{name:'Press de banca',kind:'reps',e:'🏋️‍♀️'},
 {name:'Abdominales',kind:'reps',e:'🔥'},{name:'Salto vertical',kind:'cm',e:'⬆️'},{name:'Salto horizontal',kind:'cm',e:'↔️'},
 {name:'Trepa de cuerda',kind:'time',e:'🪢'},{name:'Subida de escaleras con mochila',kind:'time',e:'🎒'},{name:'Circuito de agilidad',kind:'time',e:'🔀'},{name:'Lanzamiento de balón',kind:'m',e:'🏐'}];
const PF_EMOJIS=['🎒','🏃‍♀️','⚡','🏊‍♀️','💪','🏋️‍♀️','🔥','⬆️','↔️','🔁','🪢','🔀','🏐','🚴‍♀️','🧗‍♀️','⏱️','🎯'];

let pfEditing=null,pfDraft=null,pfAdd=null,pfOpenHist={},pfMoreOpen=null;

/* ---- Utilidades ---- */
function pfParse(kind,s){s=String(s||'').trim().replace(',','.');if(!s)return null;
 if(kind==='time'){if(s.includes(':')){const p=s.split(':').map(Number);if(p.some(isNaN))return null;let v=0;for(const x of p)v=v*60+x;return v>0?Math.round(v*100)/100:null;}const v=Number(s);return isNaN(v)||v<=0?null:v;}
 const v=Number(s);return isNaN(v)||v<0?null:v;}
function pfFmt(kind,v){if(v==null||v==='')return '—';
 if(kind==='time'){if(v<60)return (Math.round(v*10)/10).toLocaleString('es-ES')+' s';const m=Math.floor(v/60),s=v-m*60;const ss=(Math.round(s*10)/10);return `${m}:${(ss<10?'0':'')+ss.toLocaleString('es-ES',{maximumFractionDigits:1})}`;}
 return (Math.round(v*100)/100).toLocaleString('es-ES')+(PF_KINDS[kind].unit?' '+PF_KINDS[kind].unit:'');}
function pfInput(kind,v){if(v==null||v==='')return '';if(kind==='time'&&v>=60){const m=Math.floor(v/60),s=Math.round((v-m*60)*10)/10;return `${m}:${s<10?'0':''}${s}`;}return String(v);}
const pfBetter=(t,a,b)=>t.better==='low'?a<b:a>b;
function pfBest(t){let b=null;for(const m of t.marks)if(b==null||pfBetter(t,m.v,b))b=m.v;return b;}
function pfLast(t){return t.marks.length?t.marks.slice().sort((a,b)=>a.d===b.d?a.at-b.at:a.d<b.d?-1:1).pop():null;}
const pfApto=(t,v)=>t.min!=null&&v!=null&&(t.better==='low'?v<=t.min:v>=t.min);
/* Nota estimada: lineal entre el mínimo (5) y la marca del 10 */
function pfNota(t,v){if(t.min==null||t.top==null||v==null||t.min===t.top)return null;if(!pfApto(t,v))return null;
 const f=(v-t.min)/(t.top-t.min);return Math.max(5,Math.min(10,5+5*f));}
function pfGap(t,v){if(t.min==null||v==null||pfApto(t,v))return '';const d=Math.abs(v-t.min);return t.kind==='time'?`Te faltan ${pfFmt('time',d)}`:`Te faltan ${pfFmt(t.kind,d)}`;}

/* ---- Gráfica de evolución (arriba = mejor) ---- */
function pfChart(t){const M=t.marks.slice().sort((a,b)=>a.d===b.d?a.at-b.at:a.d<b.d?-1:1);
 const W=320,H=130,pl=8,pr=8,pt=14,pb=18;
 const vals=M.map(m=>m.v).concat([t.min,t.top].filter(x=>x!=null));
 if(!M.length)return `<div class="pf-chart empty"><span>Apunta tu primera marca y aquí verás tu evolución.</span></div>`;
 let lo=Math.min(...vals),hi=Math.max(...vals);if(lo===hi){lo-=1;hi+=1;}const pad=(hi-lo)*.12;lo-=pad;hi+=pad;
 const Y=v=>{let f=(v-lo)/(hi-lo);if(t.better==='low')f=1-f;return (pt+(1-f)*(H-pt-pb)).toFixed(1);};
 const X=i=>(M.length===1?W/2:pl+i*(W-pl-pr)/(M.length-1)).toFixed(1);
 let best=null,o='';
 if(t.min!=null){const y=Y(t.min);o+=`<rect x="0" y="${t.better==='low'?pt-4:pt-4}" width="${W}" height="${Math.max(0,y-pt+4)}" fill="var(--mint)" opacity=".08"/><line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--pink)" stroke-width="2" stroke-dasharray="6 5"/>`;}
 if(t.top!=null){const y=Y(t.top);o+=`<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="var(--mint)" stroke-width="2" stroke-dasharray="2 5"/>`;}
 o+=`<polyline points="${M.map((m,i)=>X(i)+','+Y(m.v)).join(' ')}" fill="none" stroke="var(--cobalt)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
 M.forEach((m,i)=>{const pr_=best==null||pfBetter(t,m.v,best);if(pr_)best=m.v;o+=`<circle cx="${X(i)}" cy="${Y(m.v)}" r="${pr_?6:4.5}" fill="${pr_?'var(--sun)':'var(--surface)'}" stroke="${pr_?'#000':'var(--cobalt)'}" stroke-width="2.5"><title>${fmtShort(m.d)} · ${pfFmt(t.kind,m.v)}${pr_?' · récord':''}</title></circle>`;});
 o+=`<text x="${pl}" y="${H-3}" class="pf-lbl">${fmtShort(M[0].d)}</text>${M.length>1?`<text x="${W-pr}" y="${H-3}" text-anchor="end" class="pf-lbl">${fmtShort(M[M.length-1].d)}</text>`:''}`;
 const leg=`<div class="pf-leg">${t.min!=null?`<span><i class="lg-min"></i>Mínimo ${esc(pfFmt(t.kind,t.min))}</span>`:''}${t.top!=null?`<span><i class="lg-top"></i>Para el 10 · ${esc(pfFmt(t.kind,t.top))}</span>`:''}<span><i class="lg-pr"></i>Récord</span><span class="lg-up">↑ mejor</span></div>`;
 return `<div class="pf-chartw"><svg class="pf-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución de ${esc(t.name)}">${o}</svg>${leg}</div>`;}

/* ---- Pantalla ---- */
function renderFisicas(){const el=$('#pfArea');if(!el)return;const T=state.phys.tests;
 if(pfEditing){el.innerHTML=pfFormHTML();return;}
 const aptas=T.filter(t=>pfApto(t,pfBest(t))).length,withMin=T.filter(t=>t.min!=null).length;
 const ws=weekStart(today()),wk=T.reduce((n,t)=>n+t.marks.filter(m=>m.d>=ws).length,0);
 const notas=T.map(t=>pfNota(t,pfBest(t))).filter(x=>x!=null);
 const kpis=`<div class="pf-kpis">
  <div class="stat" style="${cvar('mint')}"><div class="stat-top">Pruebas aptas${ico('check')}</div><div class="stat-num">${aptas}<small>/${withMin||T.length}</small></div></div>
  <div class="stat" style="${cvar('sun')}"><div class="stat-top">Récords${ico('trophy')}</div><div class="stat-num">${state.counts.records||0}</div></div>
  <div class="stat" style="${cvar('cobalt')}"><div class="stat-top">Marcas esta semana${ico('run')}</div><div class="stat-num">${wk}</div></div>
  <div class="stat" style="${cvar('pink')}"><div class="stat-top">Nota media estimada${ico('target')}</div><div class="stat-num">${notas.length?fmt1(notas.reduce((a,b)=>a+b,0)/notas.length):'—'}</div></div></div>`;
 if(!T.length){el.innerHTML=kpis+`<article class="card pf-empty"><div class="card-head"><h3 class="card-title">${ico('run')}Elige tus pruebas</h3></div><p class="hint">Toca las pruebas de tu oposición para añadirlas. Después, en cada una, pon el <b>mínimo</b> y la <b>marca del 10</b> que vienen en las bases de tu convocatoria.</p>${presetsHTML()}<div class="aj-actions"><button class="btn" data-act="pf-new">${ico('plus')}Crear una prueba a mano</button></div></article>`;return;}
 el.innerHTML=kpis+`<div class="pf-grid">${T.map(pfCardHTML).join('')}</div>
 <details class="card pf-more" id="pfMore" ${(pfMoreOpen??T.length<3)?'open':''}><summary>${ico('plus')}Añadir otra prueba</summary>${presetsHTML()}<div class="aj-actions"><button class="btn sm" data-act="pf-new">${ico('edit')}Crear una a mano</button></div></details>
 <p class="hint pf-note">La nota estimada reparte la puntuación de forma lineal entre el mínimo (5) y la marca del 10. Tu convocatoria puede usar otra tabla: tómala como orientación.</p>`;}
function presetsHTML(){const have=new Set(state.phys.tests.map(t=>t.name));return `<div class="pf-presets">${PF_PRESETS.map((p,i)=>`<button class="pf-preset" data-act="pf-preset" data-i="${i}" ${have.has(p.name)?'disabled':''}><span aria-hidden="true">${p.e}</span>${esc(p.name)}${have.has(p.name)?ico('check'):''}</button>`).join('')}</div>`;}
function pfCardHTML(t){const K=PF_KINDS[t.kind],best=pfBest(t),last=pfLast(t),apto=pfApto(t,best),nota=pfNota(t,best);
 const status=t.min==null?'<span class="chip">Sin mínimo</span>':apto?`<span class="chip ok">${ico('check')}Apta</span>`:best==null?'<span class="chip">Sin marcas</span>':`<span class="chip bad">${esc(pfGap(t,best))}</span>`;
 const adding=pfAdd===t.id,open=!!pfOpenHist[t.id];
 const hist=t.marks.slice().sort((a,b)=>a.d===b.d?b.at-a.at:a.d>b.d?-1:1);
 return `<article class="card pf-card${apto?' apto':''}">
 <div class="pf-head"><span class="pf-e" aria-hidden="true">${t.e||'⏱️'}</span><div class="pf-ttl"><h3>${esc(t.name)}</h3><div class="pf-subrow">${status}<span class="pf-sub">${K.l} · ${t.better==='low'?'menos es mejor':'más es mejor'}</span></div></div><button class="icon-x" data-act="pf-edit" data-id="${t.id}" aria-label="Editar prueba">${ico('edit')}</button></div>
 <div class="pf-nums"><div><span>Récord</span><b>${pfFmt(t.kind,best)}</b></div><div><span>Última</span><b>${last?pfFmt(t.kind,last.v):'—'}</b></div><div><span>Mínimo</span><b>${pfFmt(t.kind,t.min)}</b></div><div><span>Nota est.</span><b>${nota!=null?fmt1(nota):'—'}</b></div></div>
 ${pfChart(t)}
 ${adding?`<form class="pf-addf" id="pfAddForm" data-id="${t.id}" autocomplete="off"><label for="pfV">Marca<input class="inp" id="pfV" inputmode="decimal" placeholder="${K.ph}" required></label><label for="pfD">Fecha<input class="inp" type="date" id="pfD" value="${today()}" max="${today()}"></label><label for="pfN" class="pf-wide">Nota <span class="ex-opt">· opcional</span><input class="inp" id="pfN" maxlength="60" placeholder="Ej.: con viento, en pista, cansada…"></label><div class="aj-actions pf-wide"><button class="btn sun sm" type="submit">${ico('check')}Guardar marca</button><button class="btn ghost sm" type="button" data-act="pf-addcancel">Cancelar</button></div></form>`
 :`<div class="aj-actions"><button class="btn sun sm" data-act="pf-add" data-id="${t.id}">${ico('plus')}Nueva marca</button>${t.marks.length?`<button class="btn ghost sm" data-act="pf-hist" data-id="${t.id}">${open?'Ocultar':'Ver'} historial (${t.marks.length})</button>`:''}</div>`}
 ${open&&!adding?`<ul class="pf-hist">${hist.map(m=>`<li><span class="pf-hd">${fmtShort(m.d)}</span><b>${pfFmt(t.kind,m.v)}</b>${m.v===best?'<span class="chip sun">Récord</span>':''}<span class="pf-hn">${esc(m.note||'')}</span><button class="icon-x" data-act="pf-mdel" data-id="${t.id}" data-m="${m.id}" aria-label="Borrar marca">${ico('x')}</button></li>`).join('')}</ul>`:''}
 </article>`;}

function pfFormHTML(){const D=pfDraft,K=PF_KINDS[D.kind],isNew=!D.id;
 return `<article class="card"><div class="card-head"><h3 class="card-title">${ico('run')}${isNew?'Nueva prueba':'Editar prueba'}</h3></div>
 <form class="pf-form" id="pfForm" autocomplete="off">
  <label for="pfName" class="pf-wide">Nombre<input class="inp" id="pfName" maxlength="40" placeholder="Ej.: Carrera 1000 m" value="${esc(D.name)}" required></label>
  <div class="pf-wide"><span class="ex-lab">Icono</span><div class="pf-emojis">${PF_EMOJIS.map(e=>`<button type="button" class="pf-emo${D.e===e?' on':''}" data-act="pf-emo" data-e="${e}" aria-pressed="${D.e===e}">${e}</button>`).join('')}</div></div>
  <label for="pfKind">Tipo de marca<select class="inp" id="pfKind">${Object.entries(PF_KINDS).map(([k,x])=>`<option value="${k}" ${D.kind===k?'selected':''}>${x.l}</option>`).join('')}</select></label>
  <label for="pfBetter">¿Qué es mejor?<select class="inp" id="pfBetter"><option value="low" ${D.better==='low'?'selected':''}>Menos (tiempos)</option><option value="high" ${D.better==='high'?'selected':''}>Más (repeticiones, distancia…)</option></select></label>
  <label for="pfMin">Mínimo para aprobar<input class="inp" id="pfMin" inputmode="decimal" placeholder="${K.ph}" value="${esc(pfInput(D.kind,D.min))}"></label>
  <label for="pfTop">Marca para el 10 <span class="ex-opt">· opcional</span><input class="inp" id="pfTop" inputmode="decimal" placeholder="${K.ph}" value="${esc(pfInput(D.kind,D.top))}"></label>
  <p class="hint pf-wide">${D.kind==='time'?'Los tiempos se escriben como minutos:segundos (3:45) o solo segundos (8.2).':'Escribe solo el número.'} Copia el mínimo y la marca del 10 de las bases de tu convocatoria.</p>
  <div class="aj-actions pf-wide"><button class="btn sun" type="submit">${ico('check')}${isNew?'Crear prueba':'Guardar cambios'}</button><button class="btn ghost" type="button" data-act="pf-cancel">Cancelar</button>${isNew?'':`<button class="btn ghost" type="button" data-act="pf-del">${ico('trash')}Borrar prueba</button>`}</div>
 </form></article>`;}

/* ---- Recompensas ---- */
function pfSaveMark(t,v,d,note){const prevBest=pfBest(t),wasApto=pfApto(t,prevBest);
 t.marks.push({id:uid(),d,v,note,at:Date.now()});
 const isPR=prevBest==null||pfBetter(t,v,prevBest);
 state.phys.daily=state.phys.daily&&state.phys.daily.d===today()?state.phys.daily:{d:today(),n:0};
 if(state.phys.daily.n<6){state.phys.daily.n++;grantXP(10,'Marca apuntada',3,true);}
 if(isPR&&prevBest!=null){state.counts.records=(state.counts.records||0)+1;grantXP(40,'¡Nuevo récord!',15);if(typeof bossHit==='function')bossHit(35,'Récord');confetti(110);
  toast(`<b>¡Nuevo récord en ${esc(t.name)}!</b> ${pfFmt(t.kind,prevBest)} → ${pfFmt(t.kind,v)}`,'trophy','ach');}
 else if(prevBest==null)toast(`<b>Primera marca en ${esc(t.name)}:</b> ${pfFmt(t.kind,v)}. ¡A batirla!`,'run');
 else toast(`Marca apuntada: ${pfFmt(t.kind,v)} · Tu récord sigue en ${pfFmt(t.kind,prevBest)}`,'run');
 if(!wasApto&&pfApto(t,pfBest(t))){grantXP(60,'¡Ya eres apta!',25);toast(`<b>¡Ya eres apta en ${esc(t.name)}!</b> Has superado el mínimo.`,'check','ach');confetti(140);}
 afterAction();}

/* ---- Eventos ---- */
function pfReadDraft(){if(!pfDraft||!$('#pfForm'))return;const D=pfDraft;D.name=$('#pfName').value;const k=$('#pfKind').value;
 const mn=$('#pfMin').value,tp=$('#pfTop').value;D.minTxt=mn;D.topTxt=tp;D.min=pfParse(D.kind,mn);D.top=pfParse(D.kind,tp);D.better=$('#pfBetter').value;
 if(k!==D.kind){D.kind=k;D.better=PF_KINDS[k].better;D.min=pfParse(k,mn);D.top=pfParse(k,tp);}}
document.addEventListener('submit',e=>{
 if(e.target.id==='pfForm'){e.preventDefault();pfReadDraft();const D=pfDraft;const name=D.name.trim().slice(0,40);if(!name){$('#pfName').focus();return;}
  if(D.minTxt&&D.min==null){toast('No entiendo el mínimo. Revisa el formato.','alert');$('#pfMin').focus();return;}
  if(D.topTxt&&D.top==null){toast('No entiendo la marca del 10. Revisa el formato.','alert');$('#pfTop').focus();return;}
  const old=state.phys.tests.find(x=>x.id===D.id);
  const t={id:D.id||uid(),name,e:D.e||'⏱️',kind:D.kind,better:D.better,min:D.min,top:D.top,marks:old?old.marks:[],created:old?old.created:Date.now()};
  if(old)Object.assign(old,t);else state.phys.tests.push(t);
  pfEditing=null;pfDraft=null;save();renderFisicas();toast(old?'Prueba guardada':`<b>${esc(name)}</b> añadida`,'run');return;}
 if(e.target.id==='pfAddForm'){e.preventDefault();const t=state.phys.tests.find(x=>x.id===e.target.dataset.id);if(!t)return;
  const v=pfParse(t.kind,$('#pfV').value);if(v==null){toast(t.kind==='time'?'Escribe el tiempo como 3:45 o 8.2':'Escribe un número.','alert');$('#pfV').focus();return;}
  const d=$('#pfD').value&&$('#pfD').value<=today()?$('#pfD').value:today();
  pfAdd=null;pfSaveMark(t,v,d,$('#pfN').value.trim().slice(0,60));renderFisicas();}});
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="pf-"]');if(!el||el.disabled)return;const a=el.dataset.act;
 if(a==='pf-preset'){const p=PF_PRESETS[+el.dataset.i];const K=PF_KINDS[p.kind];
  state.phys.tests.push({id:uid(),name:p.name,e:p.e,kind:p.kind,better:K.better,min:null,top:null,marks:[],created:Date.now()});save();renderFisicas();toast(`<b>${esc(p.name)}</b> añadida. Pon su mínimo con el lápiz.`,'run');}
 else if(a==='pf-new'){pfEditing='new';pfDraft={id:null,name:'',e:'⏱️',kind:'time',better:'low',min:null,top:null};renderFisicas();$('#pfName').focus();}
 else if(a==='pf-edit'){const t=state.phys.tests.find(x=>x.id===el.dataset.id);if(!t)return;pfEditing=t.id;pfDraft=Object.assign({},t);renderFisicas();}
 else if(a==='pf-cancel'){pfEditing=null;pfDraft=null;renderFisicas();}
 else if(a==='pf-emo'){pfReadDraft();pfDraft.e=el.dataset.e;renderFisicas();}
 else if(a==='pf-add'){pfAdd=el.dataset.id;renderFisicas();const v=$('#pfV');if(v)v.focus();}
 else if(a==='pf-addcancel'){pfAdd=null;renderFisicas();}
 else if(a==='pf-hist'){pfOpenHist[el.dataset.id]=!pfOpenHist[el.dataset.id];renderFisicas();}
 else if(a==='pf-mdel'){const t=state.phys.tests.find(x=>x.id===el.dataset.id);if(!t)return;t.marks=t.marks.filter(m=>m.id!==el.dataset.m);save();renderFisicas();}
 else if(a==='pf-del'){const id=pfDraft&&pfDraft.id;if(!id)return;
  if(el.dataset.sure!=='1'){el.dataset.sure='1';el.innerHTML=`${ico('trash')}Pulsa otra vez: se borran sus marcas`;setTimeout(()=>{if(el.isConnected){el.dataset.sure='';el.innerHTML=`${ico('trash')}Borrar prueba`;}},3500);return;}
  state.phys.tests=state.phys.tests.filter(x=>x.id!==id);pfEditing=null;pfDraft=null;save();renderFisicas();toast('Prueba borrada','trash');}});
document.addEventListener('change',e=>{if(e.target.id==='pfKind'){pfReadDraft();renderFisicas();}});
document.addEventListener('toggle',e=>{if(e.target.id==='pfMore')pfMoreOpen=e.target.open;},true);
