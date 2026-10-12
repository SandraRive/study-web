/* Mini diario: al final del día, qué has hecho, qué te ha costado y qué toca mañana (en 30 segundos) */
'use strict';

const MOODS=[['😫','Fatal'],['😕','Regular'],['😐','Normal'],['🙂','Bien'],['🤩','Genial']];
let diaryOpen=false,diaryDraft=null;

function daySummary(d){const L=state.log[d]||{},nd=state.dist.filter(x=>x.d===d).length;const out=[];
 if(L.pomos)out.push(`${ico('timer')}${L.pomos} ${L.pomos===1?'pomodoro':'pomodoros'}`);
 if(L.min)out.push(`${ico('target')}${L.min} min de foco`);
 if(L.tasks)out.push(`${ico('check')}${L.tasks} ${L.tasks===1?'tarea':'tareas'}`);
 if(L.cards)out.push(`${ico('cards')}${L.cards} tarjetas`);
 if(nd)out.push(`${ico('alert')}${nd} ${nd===1?'distracción':'distracciones'}`);
 return out;}

function renderDiary(force){const el=$('#diaryCard');if(!el)return;
 const fm=$('#diaryForm');if(fm){readDiary();if(!force&&fm.contains(document.activeElement))return;}const t=today(),E=state.diary[t],y=state.diary[yesterday()];
 const late=new Date().getHours()>=18;
 const sum=daySummary(t);
 const fromY=y&&y.next&&!y.imported?`<div class="dy-yest"><span>${ico('flag')}<span><b>Ayer apuntaste para hoy:</b> «${esc(y.next)}»</span></span><span class="aj-actions"><button class="btn sm sun" data-act="diary-import">${ico('plus')}Añadir a mis tareas</button><button class="btn sm ghost" data-act="diary-dismiss">Ocultar</button></span></div>`:'';
 const head=`<div class="card-head"><h2 class="card-title">${ico('pen')}Cierre del día</h2>${E?`<span class="chip ok">${ico('check')}Hecho hoy</span>`:'<span class="chip xp">+15 XP · 30 segundos</span>'}</div>`;
 /* Ya escrito: se muestra resumido */
 if(E&&!diaryOpen){el.className='card diary-card done';
  el.innerHTML=head+fromY+`<div class="dy-entry"><span class="dy-mood" title="${MOODS[E.mood]?MOODS[E.mood][1]:''}">${MOODS[E.mood]?MOODS[E.mood][0]:'📝'}</span><dl>
  ${E.done?`<div><dt>Hoy he hecho</dt><dd>${esc(E.done)}</dd></div>`:''}${E.hard?`<div><dt>Me ha costado</dt><dd>${esc(E.hard)}</dd></div>`:''}${E.next?`<div><dt>Mañana toca</dt><dd>${esc(E.next)}</dd></div>`:''}</dl></div>
  <div class="aj-actions"><button class="btn sm" data-act="diary-edit">${ico('edit')}Editar</button><button class="btn sm ghost" data-act="tab" data-tab="progreso">Ver mi diario</button></div>`;return;}
 /* Aún no toca: versión pequeña hasta las 18:00 */
 if(!E&&!late&&!diaryOpen){el.className='card diary-card mini';
  el.innerHTML=head+fromY+`<div class="dy-mini"><p class="hint">Al terminar de estudiar, apunta en 30 segundos qué has hecho, qué te ha costado y qué toca mañana. Mañana te lo recuerdo.</p><button class="btn sm" data-act="diary-edit">${ico('pen')}Escribir ahora</button></div>`;return;}
 const D=diaryDraft||(diaryDraft=E?Object.assign({},E):{mood:-1,done:'',hard:'',next:''});
 el.className='card diary-card';
 el.innerHTML=head+fromY+`${sum.length?`<div class="dy-sum"><span class="eyebrow">Tu día en números</span><div class="dy-chips">${sum.map(s=>`<span class="chip">${s}</span>`).join('')}</div></div>`:''}
 <form class="dy-form" id="diaryForm" autocomplete="off">
  <fieldset class="dy-moods"><legend>¿Qué tal ha ido?</legend>${MOODS.map(([e,l],i)=>`<button type="button" class="dy-m${D.mood===i?' on':''}" data-act="diary-mood" data-i="${i}" aria-pressed="${D.mood===i}"><span aria-hidden="true">${e}</span>${l}</button>`).join('')}</fieldset>
  <label for="dyDone">Hoy he hecho<input class="inp" id="dyDone" maxlength="140" placeholder="Ej.: Tema 4 entero y 20 preguntas de test" value="${esc(D.done)}"></label>
  <label for="dyHard">Me ha costado<input class="inp" id="dyHard" maxlength="140" placeholder="Ej.: Concentrarme después de comer" value="${esc(D.hard)}"></label>
  <label for="dyNext">Mañana toca<input class="inp" id="dyNext" maxlength="140" placeholder="Ej.: Repasar el tema 4 y empezar el 5" value="${esc(D.next)}"></label>
  <div class="aj-actions"><button class="btn sun" type="submit">${ico('check')}${E?'Guardar cambios':'Cerrar el día'}</button>${E||diaryOpen?'<button class="btn ghost" type="button" data-act="diary-cancel">Cancelar</button>':''}</div>
 </form>`;}

function readDiary(){if(!diaryDraft||!$('#diaryForm'))return;diaryDraft.done=$('#dyDone').value;diaryDraft.hard=$('#dyHard').value;diaryDraft.next=$('#dyNext').value;}

document.addEventListener('submit',e=>{if(e.target.id!=='diaryForm')return;e.preventDefault();readDiary();const D=diaryDraft,t=today();
 const clean=s=>(s||'').trim().slice(0,140);
 const entry={mood:D.mood,done:clean(D.done),hard:clean(D.hard),next:clean(D.next),at:Date.now()};
 if(entry.mood<0&&!entry.done&&!entry.hard&&!entry.next){toast('Escribe al menos una línea o elige cómo ha ido.','pen');return;}
 const first=!state.diary[t];const prev=state.diary[t];if(prev&&prev.imported)entry.imported=true;
 state.diary[t]=entry;diaryOpen=false;diaryDraft=null;
 if(first){grantXP(15,'Cierre del día',5);toast('<b>Día cerrado.</b> Mañana te recuerdo lo que toca.','pen');}else toast('Diario actualizado','pen');
 afterAction();renderDiary(true);});
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="diary-"]');if(!el)return;const a=el.dataset.act;
 if(a==='diary-mood'){readDiary();const i=+el.dataset.i;diaryDraft.mood=diaryDraft.mood===i?-1:i;renderDiary(true);}
 else if(a==='diary-edit'){diaryOpen=true;diaryDraft=null;renderDiary(true);const f=$('#dyDone');if(f&&!state.diary[today()])f.focus();}
 else if(a==='diary-cancel'){diaryOpen=false;diaryDraft=null;renderDiary(true);}
 else if(a==='diary-import'||a==='diary-dismiss'){const y=state.diary[yesterday()];if(!y)return;y.imported=true;
  if(a==='diary-import'){const sc=(typeof curExam==='function'&&curExam())?curExam().type:'opo';addTask(y.next,sc,'alta',1);toast('<b>Añadido a tus tareas de hoy</b>','check');}
  save();renderActive();}
 else if(a==='diary-more'){state.ui.diaryAll=!state.ui.diaryAll;save();renderDiaryLog();}});

/* ---- Historial en Progreso ---- */
function renderDiaryLog(){const el=$('#diaryLog');if(!el)return;
 const days=Object.keys(state.diary).sort().reverse();
 const head=`<div class="card-head"><h3 class="card-title">${ico('pen')}Tu diario</h3><span class="chip">${days.length} ${days.length===1?'día escrito':'días escritos'}</span></div>`;
 if(!days.length){el.innerHTML=head+`<div class="empty"><strong>Tu diario está en blanco</strong>Cada noche, en Inicio, cierra el día con tres líneas. Aquí se irán guardando y verás cómo te sientes semana a semana.</div>`;return;}
 const strip=[];for(let i=13;i>=0;i--){const d=addDays(today(),-i),E=state.diary[d];strip.push(`<span class="dy-day${E?'':' none'}" title="${fmtShort(d)}${E&&MOODS[E.mood]?' · '+MOODS[E.mood][1]:''}"><span>${E?(MOODS[E.mood]?MOODS[E.mood][0]:'📝'):''}</span><i>${pdate(d).getDate()}</i></span>`);}
 const show=state.ui.diaryAll?days.slice(0,60):days.slice(0,5);
 el.innerHTML=head+`<div class="dy-strip" aria-label="Últimos 14 días">${strip.join('')}</div>
 <ul class="dy-list">${show.map(d=>{const E=state.diary[d];return `<li><span class="dy-ld"><b>${d===today()?'Hoy':d===yesterday()?'Ayer':fmtShort(d)}</b><span>${MOODS[E.mood]?MOODS[E.mood][0]:'📝'}</span></span><div>${E.done?`<p><em>Hecho:</em> ${esc(E.done)}</p>`:''}${E.hard?`<p><em>Costó:</em> ${esc(E.hard)}</p>`:''}${E.next?`<p><em>Siguiente:</em> ${esc(E.next)}</p>`:''}</div></li>`;}).join('')}</ul>
 ${days.length>5?`<button class="btn sm ghost" data-act="diary-more">${state.ui.diaryAll?'Ver menos':`Ver todo (${days.length})`}</button>`:''}`;}
