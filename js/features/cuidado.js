/* Autocuidado: sueño, agua, movimiento y descansos, con objetivos y racha propia */
'use strict';

const CARE=[
 {k:'sleep',e:'😴',l:'Sueño',u:'h',step:.5,max:14,lbl:'Anoche dormí',fmt:v=>(Math.round(v*10)/10).toLocaleString('es-ES')+' h'},
 {k:'water',e:'💧',l:'Agua',u:'vasos',step:1,max:20,lbl:'Vasos de agua',fmt:v=>`${v} ${v===1?'vaso':'vasos'}`},
 {k:'move',e:'🏃‍♀️',l:'Movimiento',u:'min',step:10,max:300,lbl:'Ejercicio o paseo',fmt:v=>`${v} min`},
 {k:'rest',e:'🧘',l:'Descansos',u:'',step:1,max:30,lbl:'Pausas de verdad',fmt:v=>`${v} ${v===1?'pausa':'pausas'}`}];
const CARE_TIPS={sleep:'Dormir bien es cuando se fija lo que has estudiado.',water:'Un vaso cada vez que acabes un pomodoro.',move:'10 minutos andando ya despejan la cabeza.',rest:'Los descansos del pomodoro cuentan solos.'};
let careEditGoals=false;

const careDayOf=d=>state.care.days[d]||{sleep:0,water:0,move:0,rest:0};
function careDay(){const t=today();return state.care.days[t]||(state.care.days[t]={sleep:0,water:0,move:0,rest:0});}
const careMet=(v,k)=>v[k]>=state.care.goals[k];
const careScore=d=>{const v=careDayOf(d);return CARE.filter(c=>careMet(v,c.k)).length;};
/* Un día cuenta para la racha si cumples 3 de los 4 objetivos */
function careStreak(){let n=0,d=today();if(careScore(d)<3)d=yesterday();while(careScore(d)>=3){n++;d=addDays(d,-1);}return n;}
function careBest(){const ds=Object.keys(state.care.days).sort();let best=0,cur=0,prev=null;for(const d of ds){if(careScore(d)>=3){cur=prev&&daysBetween(prev,d)===1?cur+1:1;prev=d;best=Math.max(best,cur);}else{cur=0;prev=null;}}return best;}

function renderCare(){const el=$('#careCard');if(!el)return;const v=careDay(),G=state.care.goals,st=careStreak(),sc=CARE.filter(c=>careMet(v,c.k)).length;
 if(careEditGoals){el.innerHTML=`<div class="card-head"><h2 class="card-title">${ico('sparkle')}Tus objetivos de autocuidado</h2></div>
  <form class="care-goals" id="careGoals" autocomplete="off">${CARE.map(c=>`<label for="cg-${c.k}"><span>${c.e} ${c.l}${c.u?` (${c.u})`:''}</span><input class="inp" type="number" id="cg-${c.k}" min="${c.step}" max="${c.max}" step="${c.step}" value="${G[c.k]}"></label>`).join('')}
  <div class="aj-actions"><button class="btn sun" type="submit">${ico('check')}Guardar</button><button class="btn ghost" type="button" data-act="care-cancel">Cancelar</button></div></form>`;return;}
 const week=[];for(let i=6;i>=0;i--){const d=addDays(today(),-i),s=careScore(d);week.push(`<span class="care-wd${s>=3?' ok':''}${s===4?' full':''}" title="${fmtShort(d)}: ${s} de 4"><i>${DOW_S[dowOf(d)]}</i><b>${s}</b></span>`);}
 el.className='card care-card'+(sc===4?' full':'');
 el.innerHTML=`<div class="card-head"><h2 class="card-title">${ico('sparkle')}Autocuidado</h2><span class="aj-actions"><span class="chip ${st?'sun':''}">${ico('flame')}Racha ${st} ${st===1?'día':'días'}</span><button class="icon-x" data-act="care-goals" aria-label="Cambiar objetivos">${ico('edit')}</button></span></div>
 <div class="care-grid">${CARE.map(c=>{const val=v[c.k],g=G[c.k],p=Math.min(100,val/g*100),ok=val>=g;
  return `<div class="care-t${ok?' ok':''}"><div class="care-top"><span class="care-e" aria-hidden="true">${c.e}</span><span class="care-l">${c.lbl}</span>${ok?ico('check'):''}</div>
  <div class="care-v"><b>${c.fmt(val)}</b><span>de ${c.fmt(g)}</span></div>
  <div class="care-bar"><i style="width:${p}%"></i></div>
  <div class="care-btns"><button class="btn sm ghost" data-act="care-dec" data-k="${c.k}" aria-label="Quitar" ${val<=0?'disabled':''}>−</button><button class="btn sm" data-act="care-inc" data-k="${c.k}">+${c.k==='sleep'?'½ h':c.k==='move'?'10 min':'1'}</button></div></div>`;}).join('')}</div>
 <div class="care-foot"><div class="care-week" aria-label="Últimos 7 días">${week.join('')}</div><span class="hint">${sc===4?'¡Hoy lo tienes todo! 💚':`Hoy llevas ${sc} de 4. Con 3 sigue tu racha. ${CARE_TIPS[CARE.find(c=>!careMet(v,c.k)).k]}`}</span></div>`;}

function careChange(k,dir){const c=CARE.find(x=>x.k===k);if(!c)return;const v=careDay();const before=CARE.filter(x=>careMet(v,x.k)).length;
 v[k]=Math.max(0,Math.min(c.max,Math.round((v[k]+dir*c.step)*10)/10));
 const after=CARE.filter(x=>careMet(v,x.k)).length;
 if(dir>0&&after===4&&before<4&&state.care.bonus!==today()){state.care.bonus=today();grantXP(20,'Autocuidado completo',8);toast('<b>¡Autocuidado al 100 % hoy!</b> Estudiar también es esto.','sparkle','ach');confetti(70);}
 else if(dir>0&&careMet(v,k)&&v[k]-c.step<state.care.goals[k])toast(`${c.e} <b>Objetivo de ${c.l.toLowerCase()} cumplido</b>`,'check');
 afterAction();renderCare();}
/* Los descansos del pomodoro cuentan solos */
function careRestDone(){careDay().rest++;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="care-"]');if(!el||el.disabled)return;const a=el.dataset.act;
 if(a==='care-inc')careChange(el.dataset.k,1);else if(a==='care-dec')careChange(el.dataset.k,-1);
 else if(a==='care-goals'){careEditGoals=true;renderCare();}else if(a==='care-cancel'){careEditGoals=false;renderCare();}});
document.addEventListener('submit',e=>{if(e.target.id!=='careGoals')return;e.preventDefault();
 CARE.forEach(c=>{const n=parseFloat(String($('#cg-'+c.k).value).replace(',','.'));if(!isNaN(n)&&n>0)state.care.goals[c.k]=Math.min(c.max,Math.round(n/c.step)*c.step||c.step);});
 careEditGoals=false;save();renderCare();toast('Objetivos guardados','sparkle');});
