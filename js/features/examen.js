/* Cuenta atrás al examen: días que quedan, vueltas pendientes y ritmo necesario (tarjeta de Inicio) */
'use strict';

let examEditing=false;
const EXAM_SCOPES={opo:'Oposición',uni:'Universidad',idi:'Idiomas',all:'Todos los temas'};

function examTopics(){const sc=state.exam.scope||'opo';return state.topics.filter(t=>sc==='all'||t.scope===sc);}
function closesBetween(from,to){let n=0;for(let d=from;d<=to;d=addDays(d,1)){const L=state.log[d];if(L&&L.closes)n+=L.closes;}return n;}
function examInfo(){
 const ex=state.exam,t=today(),V=Math.max(1,ex.vueltas||3);
 const tps=examTopics();
 const total=tps.length*V,done=tps.reduce((n,x)=>n+Math.min(V,x.vuelta),0),left=total-done;
 const pending=tps.filter(x=>x.vuelta<V).length;
 const days=daysBetween(t,ex.date);
 const perWeekNeed=days>0?left/(days/7):left;
 const recent=closesBetween(addDays(t,-13),t)/2;
 let status;
 if(!tps.length)status={k:'',txt:'Añade tus temas en Temario para calcular el ritmo.'};
 else if(left<=0)status={k:'ok',txt:'¡Has completado todas las vueltas! Ahora toca repasar y hacer simulacros.'};
 else if(state.counts.closes===0)status={k:'',txt:'Cierra tu primera vuelta en Temario y empezaré a medir tu ritmo.'};
 else if(recent>=perWeekNeed)status={k:'ok',txt:'Vas bien: a este ritmo llegas a tiempo.'};
 else if(recent>=perWeekNeed*0.7)status={k:'warn',txt:'Vas justa: un empujón más cada semana y llegas.'};
 else status={k:'bad',txt:'Toca acelerar: a este ritmo no llegas a todas las vueltas.'};
 return {V,tps,total,done,left,pending,days,perWeekNeed,recent,status};
}
const fmt1=n=>(Math.round(n*10)/10).toLocaleString('es-ES');

function examFormHTML(){const ex=state.exam;
 return `<form class="exam-form" id="examForm" autocomplete="off">
 <label for="exName">Examen<input class="inp" id="exName" maxlength="60" placeholder="Ej.: Oposición Ayuntamiento" value="${esc(ex.name)}"></label>
 <label for="exDate">Fecha<input class="inp" type="date" id="exDate" min="${today()}" value="${esc(ex.date)}" required></label>
 <label for="exV">Vueltas al temario<input class="inp" type="number" id="exV" min="1" max="10" value="${ex.vueltas||3}"></label>
 <label for="exScope">Temas que cuentan<select class="inp" id="exScope">${Object.entries(EXAM_SCOPES).map(([k,l])=>`<option value="${k}" ${ex.scope===k?'selected':''}>${l}</option>`).join('')}</select></label>
 <div class="aj-actions"><button class="btn sun" type="submit">${ico('check')}Guardar</button>${ex.date?`<button class="btn ghost" type="button" data-act="exam-cancel">Cancelar</button><button class="btn ghost" type="button" data-act="exam-clear">${ico('trash')}Quitar fecha</button>`:''}</div></form>`;}

function renderExam(){
 const el=$('#examCard');if(!el)return;const ex=state.exam;
 if(!ex.date||examEditing){
  el.className='card exam-card exam-setup';
  el.innerHTML=`<div class="card-head"><h2 class="card-title">${ico('flag')}Cuenta atrás al examen</h2></div>${ex.date?'':`<p class="hint" style="margin-bottom:14px">Pon la fecha de tu examen y te diré cuántos días quedan, cuántas vueltas al temario te faltan y a qué ritmo tienes que ir para llegar.</p>`}${examFormHTML()}`;return;}
 const I2=examInfo();const d=I2.days;
 let big,unit,sub;
 if(d>1){big=d;unit='días';sub=`${Math.floor(d/7)} semanas y ${d%7} días`;}
 else if(d===1){big=1;unit='día';sub='¡Mañana es el examen!';}
 else if(d===0){big='HOY';unit='';sub='Mucha suerte. Lo tienes.';}
 else{big=Math.abs(d);unit=Math.abs(d)===1?'día':'días';sub='desde el examen. Cambia la fecha para el siguiente.';}
 const pct=I2.total?Math.round(I2.done/I2.total*100):0;
 const lastTest=state.tests.length?state.tests[state.tests.length-1]:null;
 el.className='card exam-card'+(d<=7&&d>=0?' close':'');
 el.innerHTML=`<div class="exam-main">
  <div class="exam-count"><span class="eyebrow">${esc(ex.name||'Examen')} · ${new Date(ex.date+'T00:00').toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})}</span><div class="exam-big">${big}<small>${unit}</small></div><span class="exam-sub">${d<0?'Han pasado ':''}${sub}</span></div>
  <div class="exam-stats">
   <div class="mini-stat"><b>${I2.pending}</b><span>Temas por cerrar</span></div>
   <div class="mini-stat"><b>${I2.left}</b><span>Vueltas pendientes</span></div>
   <div class="mini-stat"><b>${d>0&&I2.left>0?fmt1(I2.perWeekNeed):'—'}</b><span>Vueltas por semana</span></div>
   <div class="mini-stat"><b>${state.counts.closes?fmt1(I2.recent):'—'}</b><span>Tu ritmo actual</span></div>
  </div></div>
  <div class="exam-prog"><div class="exam-prog-top"><span>Temario: ${I2.done}/${I2.total} vueltas (${I2.V} por tema · ${I2.tps.length} temas)</span><b>${pct}%</b></div><div class="bar"><i style="width:${pct}%"></i></div></div>
  <div class="exam-foot"><span class="exam-status ${I2.status.k}">${ico(I2.status.k==='ok'?'check':I2.status.k?'alert':'target')}${I2.status.txt}</span><span class="aj-actions">${lastTest?`<span class="chip">Último simulacro: ${fmt1(lastTest.score)}</span>`:''}<button class="btn sm" data-act="exam-edit">${ico('edit')}Cambiar</button></span></div>`;
}

document.addEventListener('submit',e=>{if(e.target.id!=='examForm')return;e.preventDefault();
 const date=$('#exDate').value;if(!date){$('#exDate').focus();return;}
 state.exam={name:$('#exName').value.trim().slice(0,60),date,vueltas:Math.max(1,Math.min(10,parseInt($('#exV').value,10)||3)),scope:$('#exScope').value};
 examEditing=false;save();renderExam();toast('Cuenta atrás guardada','flag');});
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="exam-"]');if(!el)return;
 const a=el.dataset.act;
 if(a==='exam-edit'){examEditing=true;renderExam();}
 else if(a==='exam-cancel'){examEditing=false;renderExam();}
 else if(a==='exam-clear'){state.exam.date='';examEditing=false;save();renderExam();}});
