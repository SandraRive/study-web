/* Exportar al calendario (iPhone, Google, Outlook): exámenes, entregas y plan semanal en un archivo .ics, con avisos */
'use strict';

Object.assign(I,{cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3v3H8z"/>'});

const icsEsc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
function icsFold(line){const out=[];let cur='',bytes=0;for(const ch of line){const b=new TextEncoder().encode(ch).length;if(bytes+b>73){out.push(cur);cur=' '+ch;bytes=1+b;}else{cur+=ch;bytes+=b;}}out.push(cur);return out.join('\r\n');}
const icsDate=d=>d.replace(/-/g,'');
const icsDT=(d,t)=>`${icsDate(d)}T${(t||'00:00').replace(':','')}00`;
const icsStamp=()=>new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
const alarm=(trig,txt)=>['BEGIN:VALARM','ACTION:DISPLAY',`DESCRIPTION:${icsEsc(txt)}`,`TRIGGER${trig[0]===";"?trig:":"+trig}`,'END:VALARM'];

/* Eventos de un examen o una entrega */
function examEvents(e){const name=examLabel(e);
 if(isEnt(e)){const end=e.time||'23:59';const [h,m]=end.split(':').map(Number);const st=`${String(Math.max(0,h-1)).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  return [['BEGIN:VEVENT',`UID:ent-${e.id}@mision-estudio`,`DTSTAMP:${icsStamp()}`,`DTSTART:${icsDT(e.date,h>0?st:'00:00')}`,`DTEND:${icsDT(e.date,end)}`,
   `SUMMARY:${icsEsc('📄 Entrega: '+name)}`,`DESCRIPTION:${icsEsc(`${e.mat?'Asignatura: '+e.mat+'\n':''}Hora límite: ${end}${(e.steps||[]).length?'\nPasos:\n'+e.steps.map(s=>(s.done?'✓ ':'· ')+s.t).join('\n'):''}\n\nMisión Estudio`)}`,
   ...alarm(';RELATED=END:-P1D',`Mañana entregas: ${name}`),...alarm(';RELATED=END:-PT2H',`Quedan 2 horas para entregar: ${name}`),'END:VEVENT']];}
 const T=EXAM_TYPES[e.type];
 return [['BEGIN:VEVENT',`UID:exam-${e.id}@mision-estudio`,`DTSTAMP:${icsStamp()}`,`DTSTART;VALUE=DATE:${icsDate(e.date)}`,`DTEND;VALUE=DATE:${icsDate(addDays(e.date,1))}`,
  `SUMMARY:${icsEsc('🎯 '+(e.kind?e.kind+' · ':'')+name)}`,`DESCRIPTION:${icsEsc(`${T.l}${e.mats&&e.mats.length?'\nEntra: '+e.mats.join(', '):''}\n\n¡Mucha suerte! · Misión Estudio`)}`,'TRANSP:TRANSPARENT',
  ...alarm('-P6DT15H',`Dentro de una semana: ${name}`),...alarm('-PT15H',`Mañana es tu examen: ${name}`),'END:VEVENT']];}
/* Un evento de día completo por cada día con plan */
function planEvents(ws){const out=[];for(let i=0;i<7;i++){const d=addDays(ws,i),P=planOf(d);if(!P.length)continue;
 const n=P.reduce((a,x)=>a+(x.n||1),0);
 out.push(['BEGIN:VEVENT',`UID:plan-${d}@mision-estudio`,`DTSTAMP:${icsStamp()}`,`DTSTART;VALUE=DATE:${icsDate(d)}`,`DTEND;VALUE=DATE:${icsDate(addDays(d,1))}`,
  `SUMMARY:${icsEsc(`📚 Plan: ${n} ${n===1?'bloque':'bloques'} · ${P.map(itemName).slice(0,3).join(', ')}${P.length>3?'…':''}`)}`,
  `DESCRIPTION:${icsEsc(P.map(x=>'· '+taskTextOf(x)).join('\n')+'\n\nMisión Estudio')}`,'TRANSP:TRANSPARENT','END:VEVENT']);}
 return out;}
function buildICS(events){const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Mision Estudio//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Misión Estudio'];
 events.forEach(ev=>L.push(...ev));L.push('END:VCALENDAR');return L.map(icsFold).join('\r\n')+'\r\n';}
function downloadICS(text,name){const blob=new Blob([text],{type:'text/calendar;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}

/* Enlace directo para Google Calendar (un evento) */
function googleLink(e){const name=examLabel(e);let dates,details;
 if(isEnt(e)){const end=e.time||'23:59';const [h,m]=end.split(':').map(Number);const st=`${String(Math.max(0,h-1)).padStart(2,'0')}${String(m).padStart(2,'0')}00`;dates=`${icsDate(e.date)}T${st}/${icsDate(e.date)}T${end.replace(':','')}00`;details=`${e.mat?'Asignatura: '+e.mat+'. ':''}Hora límite: ${end}.`;}
 else{dates=`${icsDate(e.date)}/${icsDate(addDays(e.date,1))}`;details=`${EXAM_TYPES[e.type].l}${e.mats&&e.mats.length?'. Entra: '+e.mats.join(', '):''}. ¡Mucha suerte!`;}
 return 'https://calendar.google.com/calendar/render?action=TEMPLATE'+`&text=${encodeURIComponent((isEnt(e)?'📄 Entrega: ':'🎯 ')+name)}&dates=${dates}&details=${encodeURIComponent(details+' · Misión Estudio')}`;}

/* ---- Ventana desde la tarjeta del examen ---- */
function openCalFor(e){const m=$('#calModal');if(!m||!e)return;
 $('#calBody').innerHTML=`<div class="eyebrow">Añadir al calendario</div><h2 class="cal-title">${esc(examLabel(e))}</h2>
 <p class="hint">${isEnt(e)?'Con avisos el día antes y 2 horas antes de la hora límite.':'Con avisos una semana antes y el día antes, a las 9:00.'}</p>
 <div class="cal-opts"><button class="cal-opt" data-act="cal-one-ics" data-id="${e.id}"><span class="cal-ic">${ico('phone')}</span><span><b>iPhone, Mac u Outlook</b><span>Descarga el evento y toca «Añadir»</span></span></button>
 <a class="cal-opt" href="${googleLink(e)}" target="_blank" rel="noopener"><span class="cal-ic g">G</span><span><b>Google Calendar</b><span>Se abre con el evento listo para guardar</span></span></a></div>
 <button class="btn ghost" data-act="cal-close">Cerrar</button>`;m.hidden=false;}

/* ---- Tarjeta en Ajustes ---- */
function renderCalCard(){const el=$('#ajCal');if(!el)return;const t=today(),ws=weekStart(t);
 const ups=state.exams.filter(e=>!examPast(e)).length;
 const pw=planEvents(ws).length,pn=planEvents(addDays(ws,7)).length;
 const o=state.ui.calOpts||(state.ui.calOpts={ex:true,pw:true,pn:false});
 el.innerHTML=`<div class="card-head"><h3 class="card-title">${ico('cal')}Llevar al calendario del móvil</h3></div>
 <p class="hint aj-intro">Pasa tus fechas al calendario del iPhone, de Google o de Outlook, con avisos. Si cambias algo, vuelve a exportar: los eventos se actualizan en lugar de repetirse.</p>
 <div class="cal-checks">
  <label class="cal-check"><input type="checkbox" data-cal="ex" ${o.ex?'checked':''}><span><b>Exámenes y entregas</b><span>${ups} ${ups===1?'pendiente':'pendientes'} · con avisos</span></span></label>
  <label class="cal-check"><input type="checkbox" data-cal="pw" ${o.pw?'checked':''}><span><b>Plan de esta semana</b><span>${pw} ${pw===1?'día':'días'} con bloques</span></span></label>
  <label class="cal-check"><input type="checkbox" data-cal="pn" ${o.pn?'checked':''}><span><b>Plan de la semana que viene</b><span>${pn} ${pn===1?'día':'días'} con bloques</span></span></label>
 </div>
 <div class="aj-actions"><button class="btn sun" data-act="cal-all">${ico('download')}Descargar calendario (.ics)</button></div>
 <details class="aj-paste cal-help"><summary>¿Cómo lo añado?</summary>
  <ol class="aj-steps"><li><b>iPhone:</b> abre la web en Safari, pulsa el botón y toca <b>Añadir todo</b>. Los eventos van al calendario que elijas.</li>
  <li><b>Google Calendar:</b> en el ordenador, entra en calendar.google.com → ⚙️ <b>Configuración</b> → <b>Importar y exportar</b> → elige el archivo descargado. Para un solo examen, usa el botón <b>Calendario</b> de su tarjeta en Inicio.</li>
  <li><b>Outlook o Mac:</b> abre el archivo descargado con doble clic.</li></ol></details>`;}

document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.cal;if(!k)return;state.ui.calOpts[k]=e.target.checked;save();});
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="cal-"]');if(!el)return;const a=el.dataset.act;
 if(a==='cal-open'){openCalFor(curExam());}
 else if(a==='cal-close'){$('#calModal').hidden=true;}
 else if(a==='cal-one-ics'){const ex=state.exams.find(x=>x.id===el.dataset.id);if(!ex)return;downloadICS(buildICS(examEvents(ex)),`${(isEnt(ex)?'entrega-':'examen-')+ex.date}.ics`);$('#calModal').hidden=true;toast('Abre el archivo para añadirlo a tu calendario.','cal');}
 else if(a==='cal-all'){const o=state.ui.calOpts||{},ws=weekStart(today());let ev=[];
  if(o.ex)state.exams.filter(x=>!examPast(x)).forEach(x=>ev.push(...examEvents(x)));
  if(o.pw)ev.push(...planEvents(ws));if(o.pn)ev.push(...planEvents(addDays(ws,7)));
  if(!ev.length){toast('No hay nada que exportar con lo que has marcado.','cal');return;}
  downloadICS(buildICS(ev),`mision-estudio-${today()}.ics`);toast(`<b>${ev.length} ${ev.length===1?'evento':'eventos'}</b> listos. Ábrelo para añadirlos.`,'cal','ach');}});
$('#calModal')&&$('#calModal').addEventListener('click',e=>{if(e.target.id==='calModal')e.target.hidden=true;});
document.addEventListener('keydown',e=>{const m=$('#calModal');if(m&&!m.hidden&&e.key==='Escape'){e.stopImmediatePropagation();m.hidden=true;}},true);
