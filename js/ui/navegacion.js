/* Pestañas y barra superior */
'use strict';

/* ================= TABS ================= */
const TABS=[['inicio','Inicio','home'],['foco','Foco','timer'],['plan','Plan','calendar'],['temario','Temario','map'],['fisicas','Físicas','run'],['sonidos','Sonidos','headphones'],['habitos','Hábitos','book'],['avatar','Avatar','user'],['progreso','Progreso','chart'],['ajustes','Ajustes','gear']];
$('#tabs').innerHTML=TABS.filter(x=>x[0]!=='ajustes').map(([id,l,i])=>`<button class="tab" role="tab" data-act="tab" data-tab="${id}" aria-selected="false">${ico(i)}${l}</button>`).join('');
function setTab(t,noScroll){if(t==='logros')t='progreso';if(!TABS.some(x=>x[0]===t))t='inicio';state.ui.tab=t;$$('.tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));$$('.view').forEach(v=>v.hidden=v.id!=='v-'+t);save();renderActive();if(!noScroll)$('#scroller').scrollTo({top:0,behavior:reduce?'auto':'smooth'});}
function renderActive(){const t=state.ui.tab;if(t==='inicio')renderHome();else if(t==='foco'){renderTasks();renderTimer();renderFocusSel();}else if(t==='temario')renderTemario();else if(t==='sonidos')renderSounds();else if(t==='habitos')renderHabits();else if(t==='avatar')renderAvatar();else if(t==='ajustes'){renderAjustes();if(typeof renderSyncCard==='function'){renderSyncCard();renderCalCard();}}else if(t==='plan')renderPlan();else if(t==='fisicas')renderFisicas();else if(t==='progreso')renderProgreso();}

/* ================= HUD ================= */
function renderHud(){const L=levelInfo(state.xp);$('#hudPlayer').innerHTML=`<span class="hud-av">${avatarSVG(state.avatar)}</span>NV ${L.level}<span class="hud-xp"><i style="width:${L.into/L.need*100}%"></i></span>`;
 $('#hudCoins').innerHTML=coinTxt(state.coins);
 const n=Object.keys(A.on).length;const hs=$('#hudSound');hs.hidden=!n;if(n)hs.innerHTML=`<span class="eq"><i></i><i></i><i></i><i></i></span>${n}`;
 renderHudTimer();renderGear();}
function renderHudTimer(){const t=state.timer,el=$('#hudTimer');const rem=remainingNow(),dur=durOf(t.mode);const show=t.running||rem<dur-1;el.hidden=!show;if(show){el.className='hud-chip plain timer '+(t.mode==='work'?'':t.mode);el.innerHTML=`${ico(t.running?'timer':'pause')}<span class="hud-time">${fmt(Math.ceil(rem))}</span>`;}}
