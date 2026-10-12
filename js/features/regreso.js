/* Al volver: aviso de racha perdida y jefe escapado, y reparación de racha durante 24 horas */
'use strict';

const streakRepairPrice=n=>Math.min(800,Math.max(200,120+20*n));

/* Se llama cuando la racha se ha roto y no había protectores suficientes */
function checkStreakLoss(){
 const s=state.streak;if(!s.last||s.count<=0||s.last>=yesterday())return;
 state.bestStreak=Math.max(state.bestStreak||0,s.count);
 if(s.count>=2)state.lostStreak={count:s.count,last:s.last,until:Date.now()+864e5,price:streakRepairPrice(s.count),seen:false,repaired:false};
 s.count=0;save();}
const canRepair=()=>{const L=state.lostStreak;return !!L&&!L.repaired&&Date.now()<L.until;};
function hoursLeft(){const L=state.lostStreak;return L?Math.max(1,Math.ceil((L.until-Date.now())/36e5)):0;}

function repairStreak(){
 const L=state.lostStreak;if(!canRepair())return;
 if(state.coins<L.price){toast(`Te faltan ${L.price-state.coins} monedas para repararla.`,'coin');return;}
 state.coins-=L.price;const s=state.streak;
 const fill=(from,to)=>{for(let d=from;d<=to;d=addDays(d,1))if(!state.frozen.includes(d))state.frozen.push(d);};
 if(s.count>0&&s.last&&s.last>L.last){const start=addDays(s.last,-(s.count-1));fill(addDays(L.last,1),addDays(start,-1));s.count=L.count+s.count;}
 else{fill(addDays(L.last,1),yesterday());s.count=L.count;s.last=yesterday();}
 state.frozen=state.frozen.slice(-120);
 L.repaired=true;L.seen=true;state.counts.repairs=(state.counts.repairs||0)+1;
 closeReturn(true);
 toast(`<b>¡Racha reparada!</b> Vuelves a tener ${streakNow()} ${streakNow()===1?'día':'días'}.`,'flame','ach');confetti(130);
 afterAction();}

/* ---- Ventana «Mientras no estabas…» ---- */
function maybeReturnReport(){
 const L=state.lostStreak,E=state.bossEscaped;
 const showL=L&&!L.seen,showE=E&&!E.seen;if(!showL&&!showE)return;
 const m=$('#backModal');if(!m||!m.hidden)return;
 const best=Math.max(state.bestStreak||0,typeof bestStreak==='function'?bestStreak():0);
 let html=`<div class="eyebrow">Mientras no estabas…</div><h2 class="back-title">¡Hola de nuevo!</h2>`;
 if(showL){const can=canRepair(),enough=state.coins>=L.price;
  html+=`<section class="back-item streak"><span class="back-ico">${ico('flame')}</span><div class="back-txt"><p>Perdiste tu racha de <b>${L.count} días</b>. ¡A por la siguiente!</p><p class="hint">Tu mejor racha: ${best} días.</p>
  ${can?`<div class="back-repair"><span>Puedes repararla durante las próximas <b>${hoursLeft()} h</b> por ${coinTxt(L.price)}.</span><button class="btn sun sm" data-act="back-repair" ${enough?'':'disabled'}>${ico('flame')}${enough?'Reparar racha':`Te faltan ${L.price-state.coins}`}</button></div>`:''}</div></section>`;}
 if(showE){const B=BOSSES[E.id];const rv=!E.revenge&&state.revenge.find(r=>r.id===E.id);const wk=rv?Math.max(1,Math.round(daysBetween(weekStart(today()),rv.due)/7)):0;const when=wk<=1?'la semana que viene':`dentro de ${wk} semanas`;const back=!!rv;
  html+=`<section class="back-item boss"><span class="back-boss">${bossSVG(E.id,false)}</span><div class="back-txt"><p><b>${esc(B.name)}</b> escapó con <b>${E.hp} / ${E.max} PV</b>.</p><p class="hint">${back?`Volverá ${when}, más fuerte. Si lo vences, doble recompensa.`:E.revenge?'Era su revancha: esta vez se ha ido para siempre.':'Esta semana te espera un jefe nuevo.'}</p></div></section>`;}
 html+=`<button class="btn pink" data-act="back-close">¡A por ello!</button>`;
 $('#backBody').innerHTML=html;m.hidden=false;
 const b=m.querySelector('[data-act="back-close"]');if(b)b.focus();}
function closeReturn(quiet){const m=$('#backModal');if(m)m.hidden=true;
 if(state.lostStreak)state.lostStreak.seen=true;if(state.bossEscaped)state.bossEscaped.seen=true;save();if(!quiet)renderActive();}

/* ---- Aviso en Inicio mientras se pueda reparar ---- */
function renderRepair(){const el=$('#repairBanner');if(!el)return;el.hidden=!canRepair();if(el.hidden)return;const L=state.lostStreak;
 el.innerHTML=`<span class="rp-ico">${ico('flame')}</span><span class="rp-txt"><b>Tu racha de ${L.count} días se puede reparar</b><span>Quedan ${hoursLeft()} h · Si no, empiezas una nueva</span></span><span class="btn sun sm rp-cta">${ico('coin')}Reparar · ${L.price}</span>`;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="back-"],[data-act="repair-open"]');if(!el||el.disabled)return;
 const a=el.dataset.act;
 if(a==='back-close')closeReturn();
 else if(a==='back-repair')repairStreak();
 else if(a==='repair-open'){if(state.lostStreak)state.lostStreak.seen=false;maybeReturnReport();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#backModal')&&!$('#backModal').hidden)closeReturn();});
