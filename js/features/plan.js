/* Plan semanal: bloques de estudio por día que se vuelcan solos en «Tareas de hoy» */
'use strict';

const ACTS={estudiar:'Estudiar',repasar:'Repasar',esquema:'Esquema',test:'Test',flash:'Flashcards',otro:'Otro'};
const DOW=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
let planAddDay=null,planClearArmed=false,planAutoOpen=false;

function planWeek(){const w=state.ui.planWeek;return w&&/^\d{4}-\d{2}-\d{2}$/.test(w)?w:weekStart(today());}
const planOf=d=>state.plan[d]||[];
function itemName(it){return it.tp?topicName(it.tp):(it.text||'Bloque libre');}
function itemScope(it){const tp=it.tp&&state.topics.find(x=>x.id===it.tp);return tp?tp.scope:'otro';}
function taskTextOf(it){return (it.act==='otro'?itemName(it):`${ACTS[it.act]||'Estudiar'}: ${itemName(it)}`)+(it.n>1?` (${it.n} bloques)`:'');}

/* ---- Enlace con Tareas de hoy ---- */
function syncPlan(){const t=today();let n=0;
 for(const it of planOf(t)){if(it.task||it.done)continue;const id=uid();
  state.tasks.push({id,text:taskTextOf(it),scope:itemScope(it),prio:'media',est:it.n,pomos:0,done:false,date:t,created:Date.now(),xp:false,plan:{date:t,id:it.id}});it.task=id;n++;}
 return n;}
const planItemOf=task=>task&&task.plan?planOf(task.plan.date).find(x=>x.id===task.plan.id):null;
function markPlan(task){const it=planItemOf(task);if(it)it.done=task.done;}
function unlinkPlan(task){const it=planItemOf(task);if(it&&!task.done)it.task='quitada';}
function relinkPlan(task){const it=planItemOf(task);if(it)it.task=task.id;}
function removePlanItem(d,id){const arr=state.plan[d];if(!arr)return null;const i=arr.findIndex(x=>x.id===id);if(i<0)return null;
 const [it]=arr.splice(i,1);if(it.task){const k=state.tasks.findIndex(x=>x.id===it.task&&!x.done);if(k>=0){if(state.timer.taskId===it.task)state.timer.taskId=null;state.tasks.splice(k,1);}}
 if(!arr.length)delete state.plan[d];return it;}
function addPlanItem(d,it){(state.plan[d]=state.plan[d]||[]).push(Object.assign({id:uid(),task:null,done:false},it));}

/* ---- Pantalla ---- */
function planFormHTML(d){
 const tps=state.topics.slice().sort((a,b)=>(a.vuelta-b.vuelta)||(a.dom-b.dom));
 return `<form class="pform" id="planForm" data-d="${d}" autocomplete="off">
  <label for="pTopic">Tema<select class="inp" id="pTopic">${tps.map(t=>`<option value="${t.id}">${esc(t.name)} · V${t.vuelta}</option>`).join('')}<option value="" ${tps.length?'':'selected'}>Otra cosa (escribe abajo)</option></select></label>
  <label for="pText" class="sr">Texto libre</label><input class="inp" id="pText" maxlength="80" placeholder="Texto libre si no eliges tema">
  <div class="pform-row"><label for="pAct">Actividad<select class="inp" id="pAct">${Object.entries(ACTS).map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></label>
  <label for="pN">Bloques<input class="inp" type="number" id="pN" min="1" max="12" value="2"></label></div>
  <div class="aj-actions"><button class="btn sun sm" type="submit">${ico('plus')}Añadir</button><button class="btn ghost sm" type="button" data-act="plan-cancel">Cancelar</button></div></form>`;}
function autoHTML(){const sc=(state.exam&&state.exam.scope)||'opo';
 return `<form class="card pauto" id="planAuto" autocomplete="off"><div class="card-head"><h3 class="card-title">${ico('shuffle')}Reparto automático</h3><button class="btn sm ghost" type="button" data-act="plan-auto">Cerrar</button></div>
 <p class="hint">Reparte tus temas por los días que elijas, empezando por los que llevan menos vueltas y menos dominio. Solo rellena desde hoy en adelante.</p>
 <fieldset class="pauto-days"><legend>Días</legend>${DOW.map((l,i)=>`<label for="pa${i}"><input type="checkbox" id="pa${i}" ${i<5?'checked':''}><span>${l}</span></label>`).join('')}</fieldset>
 <div class="pauto-grid">
  <label for="paN">Bloques por día<input class="inp" type="number" id="paN" min="1" max="16" value="4"></label>
  <label for="paChunk">Bloques seguidos por tema<select class="inp" id="paChunk"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option></select></label>
  <label for="paAct">Actividad<select class="inp" id="paAct"><option value="estudiar">Estudiar</option><option value="repasar">Repasar</option><option value="esquema">Esquema</option><option value="test">Test</option></select></label>
  <label for="paScope">Temas<select class="inp" id="paScope">${Object.entries(EXAM_SCOPES).map(([k,l])=>`<option value="${k}" ${k===sc?'selected':''}>${l}</option>`).join('')}</select></label>
  <label for="paMode">Si el día ya tiene bloques<select class="inp" id="paMode"><option value="add">Añadir a lo que hay</option><option value="replace">Sustituir lo pendiente</option></select></label>
 </div><button class="btn pink" type="submit">${ico('shuffle')}Repartir la semana</button></form>`;}
function renderPlan(){
 const el=$('#planArea');if(!el)return;
 const ws=planWeek(),t=today(),cur=weekStart(t),work=state.settings.work;
 const days=[...Array(7)].map((_,i)=>addDays(ws,i));
 const all=days.flatMap(planOf);const tot=all.reduce((s,x)=>s+x.n,0),done=all.filter(x=>x.done).reduce((s,x)=>s+x.n,0);
 const head=`<div class="card plan-head"><div class="plan-nav"><button class="btn icon" data-act="plan-prev" aria-label="Semana anterior">${ico('play','flip-x')}</button><div class="plan-week"><span class="eyebrow">${ws===cur?'Esta semana':ws<cur?'Semana pasada':'Próxima semana'}</span><b>${fmtShort(ws)} – ${fmtShort(addDays(ws,6))}</b></div><button class="btn icon" data-act="plan-next" aria-label="Semana siguiente">${ico('play')}</button>${ws!==cur?`<button class="btn sm" data-act="plan-today">Hoy</button>`:''}</div>
  <div class="plan-sum"><div class="plan-sum-top"><span><b>${tot}</b> bloques · ${fmtMin(tot*work)}</span><span>${done} hechos</span></div><div class="bar"><i style="width:${tot?done/tot*100:0}%"></i></div></div>
  <div class="aj-actions plan-tools"><button class="btn sm ${planAutoOpen?'sun':''}" data-act="plan-auto">${ico('shuffle')}Reparto automático</button><button class="btn sm" data-act="plan-copy">${ico('copy')}Copiar semana anterior</button><button class="btn sm ghost" data-act="plan-clear">${ico('trash')}${planClearArmed?'Pulsa otra vez para vaciar':'Vaciar lo pendiente'}</button></div></div>`;
 const grid=`<div class="plan-grid">${days.map((d,i)=>{
  const items=planOf(d),n=items.reduce((s,x)=>s+x.n,0),past=d<t,isT=d===t;
  return `<section class="pday ${isT?'today':''} ${past?'past':''}" aria-label="${DOW[i]} ${fmtShort(d)}"><header class="pday-head"><b>${DOW[i]} <span>${pdate(d).getDate()}</span></b>${isT?'<span class="chip now">Hoy</span>':''}<span class="pday-n">${n?`${n} bl. · ${fmtMin(n*work)}`:'Libre'}</span></header>
  <ul class="pday-list">${items.map(it=>{let st='';if(it.done)st=`<span class="pst ok">${ico('check')}Hecho</span>`;else if(past)st='<span class="pst miss">Sin hacer</span>';else if(isT&&it.task&&it.task!=='quitada')st='<span class="pst on">En tareas de hoy</span>';
   return `<li class="pitem sc-${itemScope(it)} ${it.done?'done':''}"><div class="pitem-main"><span class="pitem-act">${ACTS[it.act]||'Estudiar'}</span><span class="pitem-t">${esc(itemName(it))}</span><span class="pitem-meta"><span class="pdots">${'<i></i>'.repeat(Math.min(it.n,12))}</span>${st}</span></div><button class="btn sm icon ghost" data-act="plan-del" data-d="${d}" data-id="${it.id}" aria-label="Quitar bloque">${ico('x')}</button></li>`;}).join('')}</ul>
  ${past?'':planAddDay===d?planFormHTML(d):`<button class="btn sm ghost pday-add" data-act="plan-add" data-d="${d}">${ico('plus')}Añadir bloque</button>`}</section>`;}).join('')}</div>`;
 el.innerHTML=head+(planAutoOpen?autoHTML():'')+grid+`<p class="hint plan-note">${ico('check')}Los bloques de hoy aparecen solos en <b>Foco → Tareas de hoy</b>. Al completarlos allí, se marcan como hechos aquí.</p>`;
}

/* ---- Acciones ---- */
function autoPlan(){
 const cfg={days:DOW.map((_,i)=>$('#pa'+i).checked),n:Math.max(1,Math.min(16,parseInt($('#paN').value,10)||4)),chunk:+$('#paChunk').value||2,act:$('#paAct').value,scope:$('#paScope').value,mode:$('#paMode').value};
 const tps=state.topics.filter(x=>cfg.scope==='all'||x.scope===cfg.scope).sort((a,b)=>(a.vuelta-b.vuelta)||(a.dom-b.dom)||(a.created-b.created));
 if(!tps.length){toast('No hay temas en ese ámbito. Añádelos primero en Temario.','alert');return;}
 if(!cfg.days.some(Boolean)){toast('Elige al menos un día.','alert');return;}
 const ws=planWeek(),t=today();let ti=0,added=0;
 for(let i=0;i<7;i++){if(!cfg.days[i])continue;const d=addDays(ws,i);if(d<t)continue;
  if(cfg.mode==='replace')planOf(d).filter(x=>!x.done).map(x=>x.id).forEach(id=>removePlanItem(d,id));
  let left=cfg.n;while(left>0){const k=Math.min(cfg.chunk,left);addPlanItem(d,{tp:tps[ti%tps.length].id,act:cfg.act,n:k});ti++;left-=k;added++;}}
 if(!added){toast('Los días elegidos de esta semana ya han pasado. Prueba con la semana siguiente.','alert');return;}
 planAutoOpen=false;syncPlan();afterAction();toast(`<b>${added} bloques repartidos</b> entre ${Math.min(tps.length,added)} temas`,'shuffle','ach');}

document.addEventListener('submit',e=>{
 if(e.target.id==='planAuto'){e.preventDefault();autoPlan();return;}
 if(e.target.id!=='planForm')return;e.preventDefault();
 const d=e.target.dataset.d,tp=$('#pTopic').value||null,text=$('#pText').value.trim();
 if(!tp&&!text){toast('Elige un tema o escribe qué vas a hacer.','alert');$('#pText').focus();return;}
 addPlanItem(d,{tp,text:tp?'':text.slice(0,80),act:$('#pAct').value,n:Math.max(1,Math.min(12,parseInt($('#pN').value,10)||1))});
 planAddDay=null;const n=d===today()?syncPlan():0;afterAction();if(n)toast('Añadido también a tus tareas de hoy','plus');});
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="plan-"]');if(!el)return;
 const a=el.dataset.act,ws=planWeek();
 switch(a){
 case 'plan-prev':state.ui.planWeek=addDays(ws,-7);planAddDay=null;save();renderPlan();break;
 case 'plan-next':state.ui.planWeek=addDays(ws,7);planAddDay=null;save();renderPlan();break;
 case 'plan-today':state.ui.planWeek=null;planAddDay=null;save();renderPlan();break;
 case 'plan-add':planAddDay=el.dataset.d;renderPlan();{const f=$('#pTopic');if(f)f.focus();}break;
 case 'plan-cancel':planAddDay=null;renderPlan();break;
 case 'plan-auto':planAutoOpen=!planAutoOpen;renderPlan();break;
 case 'plan-del':{const d=el.dataset.d;const it=removePlanItem(d,el.dataset.id);if(!it)break;afterAction();
  toast('Bloque quitado','trash','',{label:'Deshacer',fn:()=>{it.task=null;(state.plan[d]=state.plan[d]||[]).push(it);syncPlan();afterAction();}});break;}
 case 'plan-copy':{const t=today();let n=0;for(let i=0;i<7;i++){const d=addDays(ws,i);if(d<t)continue;for(const it of planOf(addDays(d,-7))){addPlanItem(d,{tp:it.tp,text:it.text,act:it.act,n:it.n});n++;}}
  if(!n){toast('La semana anterior no tiene bloques que copiar desde hoy en adelante.','alert');break;}syncPlan();afterAction();toast(`<b>${n} bloques copiados</b> de la semana anterior`,'copy');break;}
 case 'plan-clear':{if(!planClearArmed){planClearArmed=true;renderPlan();setTimeout(()=>{if(planClearArmed){planClearArmed=false;if(state.ui.tab==='plan')renderPlan();}},4000);break;}
  planClearArmed=false;const t=today();let n=0;for(let i=0;i<7;i++){const d=addDays(ws,i);if(d<t)continue;planOf(d).filter(x=>!x.done).map(x=>x.id).forEach(id=>{removePlanItem(d,id);n++;});}
  afterAction();toast(n?`${n} bloques quitados`:'No había bloques pendientes','trash');break;}
 }});
