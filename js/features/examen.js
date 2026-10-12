/* Cuenta atrás a tus exámenes (oposición, universidad o idiomas) y a tus entregas de trabajos: días que quedan, avance y ritmo necesario */
'use strict';

/* Se mantiene para el reparto automático del Plan */
const EXAM_SCOPES={opo:'Oposición',uni:'Universidad',idi:'Idiomas',all:'Todos los temas'};

const EXAM_TYPES={
 opo:{l:'Oposición',ico:'shield',ph:'Ej.: Bombero/a Ayuntamiento de Madrid',kinds:['Teórico','Práctico','Pruebas físicas','Psicotécnico','Entrevista'],kindL:'Prueba',
  matL:'Bloques que entran',all:'Todo el temario de oposición',v:3,vL:'Vueltas al temario',unit:['vuelta','vueltas'],all2:'todas las vueltas',
  empty:'Aún no tienes temas de oposición en Temario. Añádelos con su bloque (ej.: «Legislación») y aquí podrás elegir cuáles entran.'},
 uni:{l:'Universidad',ico:'cap',ph:'Ej.: Teoría de Autómatas',kinds:['Parcial','Final','Extraordinaria','Práctica','Recuperación'],kindL:'Convocatoria',
  matL:'Asignaturas que entran',all:'Todas mis asignaturas',v:2,vL:'Repasos completos',unit:['repaso','repasos'],all2:'todos los repasos',
  empty:'Aún no tienes temas de universidad en Temario. Añádelos poniendo la asignatura en «Materia o bloque» (ej.: «Cálculo») y aquí podrás elegirla.'},
 idi:{l:'Idiomas',ico:'chat',ph:'Ej.: Inglés B2 First',kinds:['Examen completo','Reading','Listening','Writing','Speaking'],kindL:'Parte',
  matL:'Unidades que entran',all:'Todas mis unidades de idiomas',v:2,vL:'Repasos completos',unit:['repaso','repasos'],all2:'todos los repasos',
  empty:'Aún no tienes temas de idiomas en Temario. Añádelos con su bloque (ej.: «Grammar») y aquí podrás elegir cuáles entran.'}};
const NO_MAT='Sin materia';

/* ---- Datos: varios exámenes (antes solo había uno) ---- */
if(!Array.isArray(state.exams)){state.exams=[];const o=state.exam;
 if(o&&o.date)state.exams.push({id:uid(),type:EXAM_TYPES[o.scope]?o.scope:'opo',name:o.name||'',kind:'',date:o.date,vueltas:o.vueltas||3,mats:[]});save();}

let examEditing=null,examDraft=null;


/* ---- Utilidades: exámenes y entregas de trabajos ---- */
const isEnt=e=>e.mode==='entrega';
const entDeadline=e=>new Date(`${e.date}T${e.time||'23:59'}`);
function examPast(e){return isEnt(e)?(!!e.done||entDeadline(e)<new Date()):e.date<today();}
function examKey(e){return e.date+(isEnt(e)?(e.time||'23:59'):'99:99');}
function examsSorted(){const up=state.exams.filter(e=>!examPast(e)).sort((a,b)=>examKey(a)<examKey(b)?-1:1),past=state.exams.filter(examPast).sort((a,b)=>examKey(a)>examKey(b)?-1:1);return up.concat(past);}
function curExam(){const s=state.exams.find(e=>e.id===state.examSel);return s||examsSorted()[0]||null;}
function examLabel(e){const T=EXAM_TYPES[e.type];if(isEnt(e))return e.name||'Trabajo'+(e.mat?' de '+e.mat:'');return e.name||(e.mats.length?e.mats.join(' · '):T.l);}
function matsOf(type){const m={};state.topics.filter(t=>t.scope===type).forEach(t=>{const k=(t.mat||'').trim()||NO_MAT;m[k]=(m[k]||0)+1;});return Object.entries(m).sort((a,b)=>a[0]===NO_MAT?1:b[0]===NO_MAT?-1:a[0].localeCompare(b[0],'es'));}
function examTopics(e){e=e||curExam();if(!e||isEnt(e))return [];return state.topics.filter(t=>t.scope===e.type&&(!e.mats.length||e.mats.includes((t.mat||'').trim()||NO_MAT)));}
function closesBetween(from,to){let n=0;for(let d=from;d<=to;d=addDays(d,1)){const L=state.log[d];if(L&&L.closes)n+=L.closes;}return n;}
function examInfo(e){
 const t=today(),V=Math.max(1,e.vueltas||3),T=EXAM_TYPES[e.type];
 const tps=examTopics(e);
 const total=tps.length*V,done=tps.reduce((n,x)=>n+Math.min(V,x.vuelta),0),left=total-done;
 const pending=tps.filter(x=>x.vuelta<V).length;
 const days=daysBetween(t,e.date);
 const perWeekNeed=days>0?left/(days/7):left;
 const recent=closesBetween(addDays(t,-13),t)/2;
 let status;
 if(!tps.length)status={k:'',txt:e.mats.length?'No hay temas en lo que has elegido. Revisa los temas que entran.':`Añade tus temas de ${T.l.toLowerCase()} en Temario para calcular el ritmo.`};
 else if(left<=0)status={k:'ok',txt:`¡Has completado ${T.all2}! Ahora toca repasar y hacer simulacros.`};
 else if(state.counts.closes===0)status={k:'',txt:'Cierra tu primera vuelta en Temario y empezaré a medir tu ritmo.'};
 else if(recent>=perWeekNeed)status={k:'ok',txt:'Vas bien: a este ritmo llegas a tiempo.'};
 else if(recent>=perWeekNeed*0.7)status={k:'warn',txt:'Vas justa: un empujón más cada semana y llegas.'};
 else status={k:'bad',txt:`Toca acelerar: a este ritmo no llegas a ${T.all2}.`};
 return {V,T,tps,total,done,left,pending,days,perWeekNeed,recent,status};
}
const fmt1=n=>(Math.round(n*10)/10).toLocaleString('es-ES');
function tabTxt(e){
 if(isEnt(e)){if(e.done)return '✓ entregado';const h=(entDeadline(e)-Date.now())/36e5;if(h<0)return 'fuera de plazo';if(h<48)return `${Math.max(1,Math.floor(h))} h`;return `${daysBetween(today(),e.date)} d`;}
 const d=daysBetween(today(),e.date);return d===0?'hoy':d===1?'mañana':d>0?`${d} d`:'hecho';}

/* ---- Formulario ---- */
function newDraft(type,mode){const T=EXAM_TYPES[type];return {id:null,type,mode:mode||'exam',name:'',kind:'',date:'',vueltas:T.v,mats:[],clsTotal:'',clsSeen:'',mat:'',time:'23:59',stepsTxt:'',steps:[]};}
const val=id=>{const el=$('#'+id);return el?el.value:null;};
function readDraft(){const D=examDraft;if(!D||!$('#examForm'))return;
 const g=(k,id)=>{const v=val(id);if(v!==null)D[k]=v;};
 g('name','exName');g('date','exDate');g('kind','exKind');g('mat','exMat');g('time','exTime');g('stepsTxt','exSteps');g('clsTotal','exClsT');g('clsSeen','exClsS');
 const v=val('exV');if(v!==null)D.vueltas=parseInt(v,10)||D.vueltas;}
function examFormHTML(){const D=examDraft,T=EXAM_TYPES[D.type],M=matsOf(D.type),ent=isEnt(D);
 const isNew=!D.id;
 const typeSeg=`<div class="ex-row ex-type"><span class="ex-lab">¿Para qué es?</span><div class="seg" role="group" aria-label="Tipo de examen">${Object.entries(EXAM_TYPES).map(([k,x])=>`<button type="button" data-act="exam-type" data-t="${k}" aria-pressed="${D.type===k}">${ico(x.ico)}${x.l}</button>`).join('')}</div></div>`;
 const modeSeg=D.type==='uni'?`<div class="ex-row ex-type ex-mode"><span class="ex-lab">¿Qué quieres contar?</span><div class="seg" role="group" aria-label="Examen o entrega"><button type="button" data-act="exam-mode" data-m="exam" aria-pressed="${!ent}">${ico('pen')}Examen</button><button type="button" data-act="exam-mode" data-m="entrega" aria-pressed="${ent}">${ico('file')}Entrega de trabajo</button></div></div>`:'';
 const acts=`<div class="aj-actions"><button class="btn sun" type="submit">${ico('check')}${isNew?(ent?'Guardar entrega':'Guardar examen'):'Guardar cambios'}</button>${state.exams.length?`<button class="btn ghost" type="button" data-act="exam-cancel">Cancelar</button>`:''}${isNew?'':`<button class="btn ghost" type="button" data-act="exam-del">${ico('trash')}Borrar ${ent?'entrega':'examen'}</button>`}</div>`;
 if(ent){const ml=M.filter(x=>x[0]!==NO_MAT).map(x=>x[0]);
  return `<form class="exam-form" id="examForm" autocomplete="off">${typeSeg}${modeSeg}
 <div class="ex-fields">
  <label for="exName">Trabajo<input class="inp" id="exName" maxlength="60" placeholder="Ej.: Práctica 2 · Circuitos secuenciales" value="${esc(D.name)}"></label>
  <label for="exMat">Asignatura<input class="inp" id="exMat" list="exMatList" maxlength="60" placeholder="Ej.: Sistemas Digitales" value="${esc(D.mat)}"><datalist id="exMatList">${ml.map(m=>`<option value="${esc(m)}">`).join('')}</datalist></label>
  <label for="exDate">Fecha de entrega<input class="inp" type="date" id="exDate" value="${esc(D.date)}" required></label>
  <label for="exTime">Hora límite<input class="inp" type="time" id="exTime" value="${esc(D.time||'23:59')}"></label>
 </div>
 <label class="ex-row" for="exSteps"><span class="ex-lab">Pasos del trabajo <span class="ex-opt">· opcional, uno por línea</span></span><textarea class="inp" id="exSteps" rows="4" maxlength="800" placeholder="Buscar información&#10;Hacer el esquema&#10;Redactar&#10;Revisar y entregar">${esc(D.stepsTxt)}</textarea></label>
 ${acts}</form>`;}
 return `<form class="exam-form" id="examForm" autocomplete="off">${typeSeg}${modeSeg}
 <div class="ex-fields">
  <label for="exName">${D.type==='uni'?'Asignatura o examen':'Examen'}<input class="inp" id="exName" maxlength="60" placeholder="${esc(T.ph)}" value="${esc(D.name)}"></label>
  <label for="exDate">Fecha<input class="inp" type="date" id="exDate" value="${esc(D.date)}" required></label>
  <label for="exKind">${T.kindL}<select class="inp" id="exKind"><option value="">—</option>${T.kinds.map(k=>`<option ${D.kind===k?'selected':''}>${k}</option>`).join('')}</select></label>
  <label for="exV">${T.vL}<input class="inp" type="number" id="exV" min="1" max="10" value="${D.vueltas}"></label>
 </div>
 ${D.type==='uni'?`<div class="ex-row"><span class="ex-lab">Clases de la asignatura <span class="ex-opt">· opcional, para saber cuántas te faltan por ver</span></span><div class="ex-cls"><label for="exClsT">Clases en total<input class="inp" type="number" id="exClsT" min="0" max="200" placeholder="Ej.: 28" value="${esc(D.clsTotal)}"></label><label for="exClsS">Ya vistas<input class="inp" type="number" id="exClsS" min="0" max="200" placeholder="Ej.: 10" value="${esc(D.clsSeen)}"></label></div></div>`:''}
 <div class="ex-row"><span class="ex-lab">${T.matL}</span>
  ${M.length?`<div class="ex-mats" role="group" aria-label="${T.matL}"><button type="button" class="ex-mat${D.mats.length?'':' on'}" data-act="exam-mat" data-m="" aria-pressed="${!D.mats.length}">${ico('layers')}${T.all}<i>${M.reduce((n,x)=>n+x[1],0)}</i></button>${M.map(([m,n])=>{const on=D.mats.includes(m);return `<button type="button" class="ex-mat${on?' on':''}" data-act="exam-mat" data-m="${esc(m)}" aria-pressed="${on}">${on?ico('check'):''}${esc(m)}<i>${n}</i></button>`;}).join('')}</div>`
  :`<div class="ex-empty">${ico('map')}<span>${T.empty}</span><button type="button" class="btn sm" data-act="exam-temario">Ir a Temario</button></div>`}
 </div>
 ${acts}</form>`;}

function examTabsHTML(cur){const L=examsSorted();
 return `<div class="ex-tabs" role="tablist" aria-label="Tus exámenes y entregas">${L.map(e=>`<button class="ex-tab${e===cur?' on':''}${examPast(e)?' past':''}${isEnt(e)?' ent':''}" role="tab" aria-selected="${e===cur}" data-act="exam-sel" data-id="${e.id}">${ico(isEnt(e)?'file':EXAM_TYPES[e.type].ico)}<span>${esc(examLabel(e))}</span><i>${tabTxt(e)}</i></button>`).join('')}<button class="ex-tab add" data-act="exam-new">${ico('plus')}Añadir</button></div>`;}

function bigCount(d){
 if(d>1)return {big:d,unit:'días',sub:`${Math.floor(d/7)} semanas y ${d%7} días`};
 if(d===1)return {big:1,unit:'día',sub:'¡Mañana es el examen!'};
 if(d===0)return {big:'HOY',unit:'',sub:'Mucha suerte. Lo tienes.'};
 return {big:Math.abs(d),unit:Math.abs(d)===1?'día':'días',sub:'desde el examen. Bórralo o cambia la fecha.',past:true};}

/* ---- Tarjeta de una entrega de trabajo ---- */
function entregaHTML(e){
 const dl=entDeadline(e),ms=dl-Date.now(),h=ms/36e5,d=daysBetween(today(),e.date);
 const fechaTxt=dl.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})+', '+(e.time||'23:59');
 let big,unit,sub;
 if(e.done){big='✓';unit='entregado';sub=e.doneAt?`Lo entregaste el ${new Date(e.doneAt).toLocaleDateString('es-ES',{day:'numeric',month:'long'})}.`:'¡Hecho!';}
 else if(ms<0){big='0';unit='h';sub='Se pasó la hora límite. Si ya lo entregaste, márcalo.';}
 else if(h<48){const hh=Math.floor(h),mm=Math.floor((h-hh)*60);big=hh;unit=hh===1?'hora':'horas';sub=`y ${mm} min · ${d===0?'¡Se entrega hoy!':'Se entrega mañana'}`;}
 else{big=d;unit='días';sub=`${Math.floor(d/7)} semanas y ${d%7} días`;}
 const S=e.steps||[],nd=S.filter(x=>x.done).length,pct=e.done?100:S.length?Math.round(nd/S.length*100):0;
 const start=e.created||Date.now(),elapsed=Math.min(1,Math.max(0,(Date.now()-start)/Math.max(1,dl-start)));
 let st;
 if(e.done)st={k:'ok',txt:'Entregado. ¡Bien hecho!'};
 else if(ms<0)st={k:'bad',txt:'Fuera de plazo.'};
 else if(!S.length)st={k:'',txt:'Divide el trabajo en pasos (en «Cambiar») para ver cómo vas.'};
 else if(nd===S.length)st={k:'ok',txt:'Todos los pasos hechos: ¡solo queda entregarlo!'};
 else if(h<24)st={k:'bad',txt:`Último día: te quedan ${S.length-nd} ${S.length-nd===1?'paso':'pasos'}.`};
 else if(nd/S.length>=elapsed)st={k:'ok',txt:'Vas bien: a este ritmo lo entregas a tiempo.'};
 else if(nd/S.length>=elapsed-0.2)st={k:'warn',txt:'Vas justa: avanza un paso hoy.'};
 else st={k:'bad',txt:'Toca acelerar: vas por detrás del plazo.'};
 const left=S.length-nd,perDay=left&&d>0?left/d:0;
 return `<div class="exam-main">
  <div class="exam-count"><span class="eyebrow">Entrega${e.mat?' · '+esc(e.mat):''} · ${esc(fechaTxt)}</span><h3 class="exam-name">${esc(examLabel(e))}</h3><div class="exam-big${e.done?' done':''}">${big}<small>${unit}</small></div><span class="exam-sub">${sub}</span></div>
  <div class="exam-stats">
   <div class="mini-stat"><b>${S.length?nd+'/'+S.length:'—'}</b><span>Pasos hechos</span></div>
   <div class="mini-stat"><b>${S.length?left:'—'}</b><span>Pasos por hacer</span></div>
   <div class="mini-stat"><b>${e.done||ms<0?'—':d}</b><span>${d===1?'Día':'Días'} hasta la entrega</span></div>
   <div class="mini-stat"><b>${perDay?fmt1(perDay):'—'}</b><span>Pasos al día</span></div>
  </div></div>
  ${S.length?`<div class="exam-prog"><div class="exam-prog-top"><span>Avance del trabajo</span><b>${pct}%</b></div><div class="bar"><i style="width:${pct}%"></i></div>
  <ul class="ent-steps">${S.map((x,i)=>`<li><button class="ent-step${x.done?' on':''}" data-act="exam-step" data-i="${i}" aria-pressed="${x.done}"><span class="ent-box">${x.done?ico('check'):''}</span><span>${esc(x.t)}</span></button></li>`).join('')}</ul></div>`:''}
  <div class="exam-foot"><span class="exam-status ${st.k}">${ico(st.k==='ok'?'check':st.k?'alert':'target')}${st.txt}</span><span class="aj-actions">${e.done?`<button class="btn sm ghost" data-act="exam-undone">Deshacer</button>`:`<button class="btn sm sun" data-act="exam-done">${ico('check')}Marcar como entregado</button>`}<button class="btn sm ghost" data-act="cal-open">${ico('cal')}Calendario</button><button class="btn sm" data-act="exam-edit">${ico('edit')}Cambiar</button></span></div>`;}

/* ---- Bloque de clases por ver (exámenes de universidad) ---- */
function classesHTML(e,d){const tot=+e.clsTotal||0;if(e.type!=='uni'||!tot)return '';
 const seen=Math.min(tot,+e.clsSeen||0),left=tot-seen,pct=Math.round(seen/tot*100);
 const wk=d>0?left/(d/7):0;
 return `<div class="exam-prog exam-cls"><div class="exam-prog-top"><span>${ico('play')}Clases: <b>${seen}/${tot}</b> vistas · ${left?`te ${left===1?'falta':'faltan'} <b>${left}</b> por ver`:'¡todas vistas!'}</span><span class="cls-btns"><button class="btn sm ghost" data-act="exam-class" data-d="-1" aria-label="Quitar una clase vista" ${seen?'':'disabled'}>−</button><button class="btn sm" data-act="exam-class" data-d="1" ${left?'':'disabled'}>${ico('plus')}Clase vista</button></span></div><div class="bar cls"><i style="width:${pct}%"></i></div>${left&&d>0?`<span class="hint">Para verlas todas antes del examen: unas <b>${fmt1(wk)}</b> clases por semana.</span>`:''}</div>`;}

function renderExam(){
 const el=$('#examCard');if(!el)return;
 if(examEditing==='new'&&examDraft&&examDraft._auto&&state.exams.length){examEditing=null;examDraft=null;}
 if(!state.exams.length&&!examEditing){examEditing='new';examDraft=newDraft('opo');examDraft._auto=true;}
 if(examEditing){const ent=isEnt(examDraft);
  el.className='card exam-card exam-setup';
  el.innerHTML=`<div class="card-head"><h2 class="card-title">${ico(ent?'file':'flag')}${examEditing==='new'?(state.exams.length?(ent?'Nueva entrega':'Nuevo examen'):'Cuenta atrás al examen'):(ent?'Editar entrega':'Editar examen')}</h2></div>${state.exams.length?'':`<p class="hint" style="margin-bottom:14px">Pon la fecha de tu examen y te diré cuántos días quedan, cuánto temario te falta y a qué ritmo tienes que ir para llegar. Puedes añadir varios: la oposición, cada examen de la uni y tus entregas de trabajos.</p>`}${examFormHTML()}`;return;}
 const e=curExam();
 if(isEnt(e)){const h=(entDeadline(e)-Date.now())/36e5;el.className='card exam-card ent-card'+(!e.done&&h>=0&&h<72?' close':'')+(e.done?' done':'');el.innerHTML=examTabsHTML(e)+entregaHTML(e);return;}
 const I2=examInfo(e),d=I2.days,T=I2.T;const C=bigCount(d);
 const pct=I2.total?Math.round(I2.done/I2.total*100):0;
 const lastTest=state.tests.length?state.tests[state.tests.length-1]:null;
 const scopeTxt=e.mats.length?e.mats.join(', '):T.all;
 const U=T.unit[1],Ucap=U[0].toUpperCase()+U.slice(1);
 el.className='card exam-card'+(d<=7&&d>=0?' close':'');
 el.innerHTML=`${examTabsHTML(e)}<div class="exam-main">
  <div class="exam-count"><span class="eyebrow">${T.l}${e.kind?' · '+esc(e.kind):''} · ${new Date(e.date+'T00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</span><h3 class="exam-name">${esc(examLabel(e))}</h3><div class="exam-big">${C.big}<small>${C.unit}</small></div><span class="exam-sub">${C.past?'Han pasado ':''}${C.sub}</span></div>
  <div class="exam-stats">
   <div class="mini-stat"><b>${I2.pending}</b><span>Temas por cerrar</span></div>
   <div class="mini-stat"><b>${I2.left}</b><span>${Ucap} pendientes</span></div>
   <div class="mini-stat"><b>${d>0&&I2.left>0?fmt1(I2.perWeekNeed):'—'}</b><span>${Ucap} por semana</span></div>
   <div class="mini-stat"><b>${state.counts.closes?fmt1(I2.recent):'—'}</b><span>Tu ritmo actual</span></div>
  </div></div>
  ${classesHTML(e,d)}
  <div class="exam-prog"><div class="exam-prog-top"><span>${esc(scopeTxt)}: ${I2.done}/${I2.total} ${U} (${I2.V} por tema · ${I2.tps.length} temas)</span><b>${pct}%</b></div><div class="bar"><i style="width:${pct}%"></i></div></div>
  <div class="exam-foot"><span class="exam-status ${I2.status.k}">${ico(I2.status.k==='ok'?'check':I2.status.k?'alert':'target')}${I2.status.txt}</span><span class="aj-actions">${lastTest&&e.type==='opo'?`<span class="chip">Último simulacro: ${fmt1(lastTest.score)}</span>`:''}<button class="btn sm ghost" data-act="cal-open">${ico('cal')}Calendario</button><button class="btn sm" data-act="exam-edit">${ico('edit')}Cambiar</button></span></div>`;
}

function parseSteps(txt,old){const prev={};(old||[]).forEach(s=>prev[s.t]=s.done);return (txt||'').split('\n').map(s=>s.trim()).filter(Boolean).slice(0,20).map(t=>({t:t.slice(0,80),done:!!prev[t]}));}
document.addEventListener('submit',ev=>{if(ev.target.id!=='examForm')return;ev.preventDefault();readDraft();
 const D=examDraft;if(!D.date){$('#exDate').focus();toast(isEnt(D)?'Pon la fecha de entrega.':'Pon la fecha del examen.','calendar');return;}
 const old=state.exams.find(x=>x.id===D.id);let ex;
 if(isEnt(D))ex={id:D.id||uid(),type:'uni',mode:'entrega',name:D.name.trim().slice(0,60),mat:D.mat.trim().slice(0,60),date:D.date,time:D.time||'23:59',steps:parseSteps(D.stepsTxt,old&&old.steps),done:old?!!old.done:false,doneAt:old?old.doneAt:null,rewarded:old?!!old.rewarded:false,created:old&&old.created||Date.now()};
 else{const tot=Math.max(0,Math.min(200,parseInt(D.clsTotal,10)||0));
  ex={id:D.id||uid(),type:D.type,mode:'exam',name:D.name.trim().slice(0,60),kind:D.kind,date:D.date,vueltas:Math.max(1,Math.min(10,D.vueltas||EXAM_TYPES[D.type].v)),mats:D.mats.slice(),clsTotal:D.type==='uni'&&tot?tot:'',clsSeen:D.type==='uni'&&tot?Math.min(tot,Math.max(0,parseInt(D.clsSeen,10)||0)):''};}
 const i=state.exams.findIndex(x=>x.id===ex.id);if(i>=0)state.exams[i]=ex;else state.exams.push(ex);
 state.examSel=ex.id;examEditing=null;examDraft=null;save();renderExam();toast(i>=0?'Guardado':isEnt(ex)?'Entrega guardada':'Cuenta atrás guardada',isEnt(ex)?'file':'flag');});
document.addEventListener('click',ev=>{const el=ev.target.closest('[data-act^="exam-"]');if(!el||el.disabled)return;
 const a=el.dataset.act;
 if(a==='exam-type'){readDraft();const T=EXAM_TYPES[el.dataset.t];const keepV=examDraft.vueltas!==EXAM_TYPES[examDraft.type].v;examDraft.type=el.dataset.t;if(el.dataset.t!=='uni')examDraft.mode='exam';examDraft.mats=[];examDraft.kind='';if(!keepV)examDraft.vueltas=T.v;renderExam();}
 else if(a==='exam-mode'){readDraft();examDraft.mode=el.dataset.m;renderExam();const n=$('#exName');if(n)n.focus();}
 else if(a==='exam-mat'){readDraft();const m=el.dataset.m;if(!m)examDraft.mats=[];else{const i=examDraft.mats.indexOf(m);if(i>=0)examDraft.mats.splice(i,1);else examDraft.mats.push(m);}renderExam();}
 else if(a==='exam-sel'){state.examSel=el.dataset.id;save();renderExam();}
 else if(a==='exam-new'){const c=curExam();examEditing='new';examDraft=newDraft(c?c.type:'opo',c&&c.type==='uni'?c.mode:'exam');renderExam();const n=$('#exName');if(n)n.focus();}
 else if(a==='exam-edit'){const c=curExam();if(!c)return;examEditing=c.id;examDraft=Object.assign(newDraft(c.type,c.mode),JSON.parse(JSON.stringify(c)));if(isEnt(c))examDraft.stepsTxt=(c.steps||[]).map(s=>s.t).join('\n');renderExam();}
 else if(a==='exam-cancel'){examEditing=null;examDraft=null;renderExam();}
 else if(a==='exam-temario'){examEditing=null;examDraft=null;setTab('temario');}
 else if(a==='exam-class'){const c=curExam();if(!c||!c.clsTotal)return;c.clsSeen=Math.max(0,Math.min(c.clsTotal,(+c.clsSeen||0)+(+el.dataset.d)));save();renderExam();
  if(+el.dataset.d>0&&c.clsSeen===c.clsTotal){toast(`<b>¡Todas las clases vistas!</b> ${esc(examLabel(c))}`,'check','ach');confetti(60);}}
 else if(a==='exam-step'){const c=curExam();if(!c||!c.steps)return;const s=c.steps[+el.dataset.i];if(!s)return;s.done=!s.done;save();renderExam();
  if(s.done&&c.steps.every(x=>x.done)&&!c.done)toast('<b>¡Todos los pasos hechos!</b> Solo queda entregarlo.','check','ach');}
 else if(a==='exam-done'){const c=curExam();if(!c)return;c.done=true;c.doneAt=Date.now();state.examSel=c.id;
  if(!c.rewarded){c.rewarded=true;state.counts.entregas=(state.counts.entregas||0)+1;grantXP(60,'Trabajo entregado',30);if(typeof bossHit==='function')bossHit(40,'Entrega');}
  confetti(120);afterAction();renderExam();}
 else if(a==='exam-undone'){const c=curExam();if(!c)return;c.done=false;c.doneAt=null;save();renderExam();}
 else if(a==='exam-del'){const id=examDraft&&examDraft.id;if(!id)return;const ent=isEnt(examDraft);
  if(el.dataset.sure!=='1'){el.dataset.sure='1';el.innerHTML=`${ico('trash')}Pulsa otra vez para borrar`;setTimeout(()=>{if(el.isConnected){el.dataset.sure='';el.innerHTML=`${ico('trash')}Borrar ${ent?'entrega':'examen'}`;}},3500);return;}
  state.exams=state.exams.filter(x=>x.id!==id);if(state.examSel===id)state.examSel=null;examEditing=null;examDraft=null;save();renderExam();toast(ent?'Entrega borrada':'Examen borrado','trash');}});
