/* Temporizador pomodoro y modo foco */
'use strict';

/* ================= POMODORO ================= */
const CIRC=2*Math.PI*112;$('#ringProg').style.strokeDasharray=CIRC;
const durOf=m=>state.settings[m==='work'?'work':m==='short'?'short':'long']*60;
const fmt=s=>pad(Math.floor(s/60))+':'+pad(s%60);
function remainingNow(){const t=state.timer;return t.running?Math.max(0,(t.endAt-Date.now())/1000):t.remaining;}
const MODE_LBL={work:'Bloque de foco',short:'Descanso corto',long:'Descanso largo'};
function renderTimer(){const t=state.timer,dur=durOf(t.mode),rem=remainingNow(),txt=fmt(Math.ceil(rem));
 $('#time').textContent=txt;$('#ringProg').style.strokeDashoffset=CIRC*(1-rem/dur);$('#pomo').dataset.mode=t.mode;$('#modeLbl').textContent=MODE_LBL[t.mode];
 $$('#pomo .seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===t.mode)));
 const want=t.running?'pause':'play';$$('.js-play').forEach(pb=>{if(pb.dataset.ic!==want){pb.dataset.ic=want;pb.innerHTML=ico(want);pb.setAttribute('aria-label',t.running?'Pausar':'Empezar');}});
 const every=state.settings.every,c=t.cycle%every;let d='';for(let i=0;i<every;i++)d+=`<i class="${i<c?'on':''}"></i>`;$('#dots').innerHTML=d;
 const z=$('#zen');if(!z.hidden){z.dataset.mode=t.mode;$('#zTime').textContent=txt;$('#zMode').textContent=MODE_LBL[t.mode];$('#zBar').style.width=((1-rem/dur)*100)+'%';const tk=state.tasks.find(x=>x.id===t.taskId);$('#zTask').textContent=t.mode==='work'?(tk?'Trabajando en: '+tk.text:'Una cosa cada vez.'):'Levántate, estira y bebe agua.';$('#zDots').innerHTML=d;}
 if(t.running)document.title=`${txt} · ${t.mode==='work'?'Foco':'Descanso'}`;else if(document.title!=='Misión Estudio')document.title='Misión Estudio';}
/* Temporizador exacto: un único aviso programado para el final del bloque, que el navegador respeta mejor en segundo plano */
let endTO=null;
function disarmEnd(){if(endTO){clearTimeout(endTO);endTO=null;}}
function armEnd(){disarmEnd();const t=state.timer;if(!t.running||!t.endAt)return;endTO=setTimeout(()=>{endTO=null;if(state.timer.running&&Date.now()>=state.timer.endAt-25)completeTimer(false);},Math.max(0,t.endAt-Date.now())+30);}
function startTimer(){ac();if(state.timer.mode==='work'&&!state.timer.running)SKY.warp();const t=state.timer;if(t.remaining<=0)t.remaining=durOf(t.mode);t.running=true;t.endAt=Date.now()+t.remaining*1000;armEnd();save();renderTimer();renderHudTimer();}
function pauseTimer(){const t=state.timer;if(!t.running)return;t.remaining=Math.max(0,Math.round((t.endAt-Date.now())/1000));t.running=false;t.endAt=null;disarmEnd();save();renderTimer();renderHudTimer();}
function setMode(m){const t=state.timer;t.running=false;t.endAt=null;disarmEnd();t.mode=m;t.remaining=durOf(m);save();renderTimer();renderHudTimer();}
function completeTimer(silent){const t=state.timer,s=state.settings;const endAt=t.endAt||Date.now();t.running=false;t.endAt=null;disarmEnd();let next;
 if(t.mode==='work'){state.pomoLog.push({at:Math.min(Date.now(),endAt)-s.work*30000,m:s.work});if(state.pomoLog.length>3000)state.pomoLog.shift();state.pomo.total++;state.pomo.minutes+=s.work;state.day.pomos++;state.day.minutes+=s.work;const tk=state.tasks.find(x=>x.id===t.taskId);if(tk)tk.pomos++;const L=logDay();L.min+=s.work;L.pomos++;const sc=tk?tk.scope:'otro';L.sc[sc]=(L.sc[sc]||0)+s.work;t.cycle++;bumpStreak();if(!silent)chime();grantXP(25,'Pomodoro completado',10);bossHit(s.work*1.6,'Pomodoro');next=(t.cycle%s.every===0)?'long':'short';if(!silent)toast(`<b>¡Bloque terminado!</b> Toca ${next==='long'?'descanso largo':'descanso'}.`,'timer');}
 else{if(!silent){chime();toast('<b>Descanso terminado.</b> A por el siguiente bloque.','timer');}next='work';}
 if(!silent)notifyTimer(t.mode,next);
 t.mode=next;t.remaining=durOf(next);if(s.auto&&!silent)startTimer();afterAction();renderTimer();}
setInterval(()=>{const t=state.timer;if(t.running&&Date.now()>=t.endAt)completeTimer(false);if(state.ui.tab==='foco'||!$('#zen').hidden)renderTimer();else if(t.running)document.title=`${fmt(Math.ceil(remainingNow()))} · ${t.mode==='work'?'Foco':'Descanso'}`;renderHudTimer();},250);
setInterval(()=>{const d=state.day.date;ensureDay();if(d!==state.day.date){save();renderActive();maybeReturnReport();}},60000);
function renderFocusSel(){const sel=$('#focusSel');const pend=state.tasks.filter(t=>!t.done);sel.innerHTML='<option value="">Sin tarea concreta</option>'+pend.map(t=>`<option value="${t.id}">${esc(t.text)}</option>`).join('');if(!pend.some(t=>t.id===state.timer.taskId))state.timer.taskId=null;sel.value=state.timer.taskId||'';}
function initSettings(){const s=state.settings;$('#sWork').value=s.work;$('#sShort').value=s.short;$('#sLong').value=s.long;$('#sEvery').value=s.every;$('#sAuto').checked=s.auto;$('#sChime').checked=s.chime;$('#setSummary').innerHTML=`${ico('gear')}Ajustes del temporizador`;}
function onSetting(){const cl=(v,a,b,d)=>{v=parseInt(v,10);return isNaN(v)?d:Math.min(b,Math.max(a,v));};const s=state.settings;s.work=cl($('#sWork').value,1,120,25);s.short=cl($('#sShort').value,1,60,5);s.long=cl($('#sLong').value,1,90,15);s.every=cl($('#sEvery').value,2,10,4);s.auto=$('#sAuto').checked;s.chime=$('#sChime').checked;if(!state.timer.running)state.timer.remaining=durOf(state.timer.mode);save();renderTimer();renderHudTimer();}
let wakeLock=null;
function openZen(){$('#zen').hidden=false;SKY.redraw();renderTimer();try{const el=document.documentElement;if(el.requestFullscreen){const p=el.requestFullscreen();if(p&&p.catch)p.catch(()=>{});}}catch(e){}try{if(navigator.wakeLock&&navigator.wakeLock.request)navigator.wakeLock.request('screen').then(w=>{wakeLock=w;}).catch(()=>{});}catch(e){}$('#zenExit').focus();}
function closeZen(){$('#zen').hidden=true;try{if(document.fullscreenElement&&document.exitFullscreen){const p=document.exitFullscreen();if(p&&p.catch)p.catch(()=>{});}}catch(e){}try{if(wakeLock){wakeLock.release();wakeLock=null;}}catch(e){}if(state.ui.tab==='foco')renderTimer();}
