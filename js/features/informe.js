/* Informe semanal (con imagen para guardar) y «Cuándo rindes más» (horas y días con más foco y menos distracciones) */
'use strict';

const DOW_L=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const DOW_S=['L','M','X','J','V','S','D'];
const fmtMinShort=m=>m>=60?`${Math.floor(m/60)}h${m%60?String(m%60).padStart(2,'0'):''}`:`${m}m`;
const dowOf=d=>(pdate(d).getDay()+6)%7;
let repWeek=null;

/* ---------- Datos de una semana ---------- */
function weekTotals2(ws){const o={min:0,pomos:0,tasks:0,cards:0,closes:0,active:0,days:[]};
 for(let i=0;i<7;i++){const d=addDays(ws,i),L=state.log[d]||{};const m=L.min||0;o.days.push({d,min:m,pomos:L.pomos||0,mood:state.diary[d]?state.diary[d].mood:null,act:isActive(L)});
  o.min+=m;o.pomos+=L.pomos||0;o.tasks+=L.tasks||0;o.cards+=L.cards||0;o.closes+=L.closes||0;if(isActive(L))o.active++;}
 return o;}
function weekReport(ws){const we=addDays(ws,6),W=weekTotals2(ws),P=weekTotals2(addDays(ws,-7));
 const best=W.days.reduce((a,b)=>b.min>a.min?b:a,W.days[0]);
 const D=state.dist.filter(x=>x.d>=ws&&x.d<=we),Dp=state.dist.filter(x=>x.d>=addDays(ws,-7)&&x.d<ws);
 const byC={};D.forEach(x=>byC[x.c]=(byC[x.c]||0)+1);const topC=Object.entries(byC).sort((a,b)=>b[1]-a[1])[0];
 const moods=W.days.map(x=>x.mood).filter(x=>x!=null&&x>=0);const moodAvg=moods.length?moods.reduce((a,b)=>a+b,0)/moods.length:null;
 const boss=state.boss&&state.boss.week===ws?state.boss:state.bossHist.find(h=>h.week===ws);
 let recs=0;for(const t of state.phys.tests){let b=null;t.marks.slice().sort((a,c)=>a.d===c.d?a.at-c.at:a.d<c.d?-1:1).forEach(m=>{const pr=b!=null&&pfBetter(t,m.v,b);if(b==null||pfBetter(t,m.v,b))b=m.v;if(pr&&m.d>=ws&&m.d<=we)recs++;});}
 const entregas=state.exams.filter(e=>e.mode==='entrega'&&e.done&&e.doneAt&&(()=>{const d=new Date(e.doneAt);const s=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');return s>=ws&&s<=we;})()).length;
 let bestWeek=true;for(let k=1;k<=26;k++){if(weekTotals2(addDays(ws,-7*k)).min>=W.min){bestWeek=false;break;}}
 return {ws,we,W,P,best,D,Dp,topC,moodAvg,boss,recs,entregas,bestWeek:bestWeek&&W.min>0};}
function repHeadline(R){const W=R.W,P=R.P;
 if(!W.min&&!W.tasks)return 'Semana en blanco. La próxima, aunque sea un pomodoro al día.';
 if(R.bestWeek)return '¡Tu mejor semana en seis meses!';
 if(P.min&&W.min>=P.min*1.15)return `+${Math.round((W.min/P.min-1)*100)} % de foco que la semana pasada. ¡Vas a más!`;
 if(P.min&&W.min<P.min*.85)return 'Algo menos de foco que la semana pasada. Esta semana, a recuperarlo.';
 if(W.active>=6)return 'Constancia de diez: casi todos los días has estudiado.';
 return 'Semana sólida. Sigue con el mismo ritmo.';}
const pctDiff=(a,b)=>b?Math.round((a/b-1)*100):null;

/* ---------- Tarjeta del informe en Progreso ---------- */
function renderReport(){const el=$('#reportCard');if(!el)return;
 const cur=weekStart(today());if(!repWeek)repWeek=dowOf(today())===6?cur:addDays(cur,-7);
 const R=weekReport(repWeek),W=R.W,max=Math.max(1,...W.days.map(x=>x.min));
 const isCur=repWeek===cur;const dd=pctDiff(W.min,R.P.min);
 const cmp=(a,b,inv)=>{if(!b&&!a)return '';const d=a-b;if(!d)return '<i class="rp-eq">=</i>';const good=inv?d<0:d>0;return `<i class="${good?'rp-up':'rp-down'}">${d>0?'+':''}${d}</i>`;};
 el.innerHTML=`<div class="card-head"><h3 class="card-title">${ico('chart')}Informe semanal</h3><div class="rp-nav"><button class="icon-x" data-act="rep-prev" aria-label="Semana anterior">‹</button><span>${fmtShort(R.ws)} – ${fmtShort(R.we)}${isCur?' · en curso':''}</span><button class="icon-x" data-act="rep-next" aria-label="Semana siguiente" ${isCur?'disabled':''}>›</button></div></div>
 <p class="rp-head">${esc(repHeadline(R))}</p>
 <div class="rp-kpis">
  <div class="rp-k pink"><span>Foco</span><b>${fmtMin(W.min)}</b>${dd!=null?`<i class="${dd>=0?'rp-up':'rp-down'}">${dd>=0?'+':''}${dd} %</i>`:''}</div>
  <div class="rp-k"><span>Pomodoros</span><b>${W.pomos}</b>${cmp(W.pomos,R.P.pomos)}</div>
  <div class="rp-k"><span>Tareas</span><b>${W.tasks}</b>${cmp(W.tasks,R.P.tasks)}</div>
  <div class="rp-k"><span>Vueltas cerradas</span><b>${W.closes}</b>${cmp(W.closes,R.P.closes)}</div>
  <div class="rp-k"><span>Días estudiados</span><b>${W.active}/7</b>${cmp(W.active,R.P.active)}</div>
  <div class="rp-k"><span>Distracciones</span><b>${R.D.length}</b>${cmp(R.D.length,R.Dp.length,true)}</div>
 </div>
 <div class="rp-days">${W.days.map((x,i)=>`<div class="rp-day${x===R.best&&x.min?' best':''}${x.d>today()?' future':''}"><span class="rp-v">${x.min?fmtMinShort(x.min):''}</span><span class="rp-bar"><i style="height:${x.min/max*100}%"></i></span><span class="rp-mood">${x.mood!=null&&MOODS[x.mood]?MOODS[x.mood][0]:''}</span><span class="rp-l">${DOW_S[i]}</span></div>`).join('')}</div>
 <ul class="rp-facts">
  <li>${ico('trophy')}<span>Mejor día</span><b>${R.best.min?`${DOW_L[W.days.indexOf(R.best)]} · ${fmtMin(R.best.min)}`:'—'}</b></li>
  <li>${ico('alert')}<span>Lo que más te distrajo</span><b>${R.topC?`${DIST_CATS[R.topC[0]].e} ${esc(DIST_CATS[R.topC[0]].l)} (${R.topC[1]})`:'Nada apuntado'}</b></li>
  <li>${ico('pen')}<span>Ánimo del diario</span><b>${R.moodAvg!=null?`${MOODS[Math.round(R.moodAvg)][0]} ${MOODS[Math.round(R.moodAvg)][1]}`:'Sin entradas'}</b></li>
  <li>${ico('bolt')}<span>Jefe de la semana</span><b>${R.boss?`${esc(BOSSES[R.boss.id].name)} · ${R.boss.won?'vencido':isCur?`${R.boss.hp} PV`:'escapó'}`:'—'}</b></li>
  ${R.recs||state.phys.tests.length?`<li>${ico('run')}<span>Récords físicos</span><b>${R.recs}</b></li>`:''}
  ${R.entregas?`<li>${ico('file')}<span>Trabajos entregados</span><b>${R.entregas}</b></li>`:''}
 </ul>
 <div class="aj-actions"><button class="btn sun" data-act="rep-img">${ico('star')}Guardar como imagen</button></div>`;}

/* ---------- Imagen del informe (canvas 1080×1350, formato vertical para el móvil) ---------- */
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function drawReport(R){const S=1080,H=1350,cv=document.createElement('canvas');cv.width=S;cv.height=H;const c=cv.getContext('2d');
 const FD='"Unbounded","Arial Black",sans-serif',FB='"Figtree",system-ui,sans-serif',FM='"JetBrains Mono",monospace';
 const C={bg:'#0B1230',sf:'#141D45',sf2:'#1B2656',ln:'#000',ink:'#F4F6FF',mu:'#9AA6D6',pink:'#FF4D3D',sun:'#FFE14D',mint:'#3DFFB0',cob:'#00D9FF'};
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0E1840');g.addColorStop(1,'#060A1E');c.fillStyle=g;c.fillRect(0,0,S,H);
 const rnd=rng('rep'+R.ws);for(let i=0;i<140;i++){c.globalAlpha=.25+rnd()*.6;c.fillStyle='#fff';c.beginPath();c.arc(rnd()*S,rnd()*H,rnd()*2+.4,0,7);c.fill();}c.globalAlpha=1;
 const pg=c.createRadialGradient(930,1240,10,930,1240,330);pg.addColorStop(0,'#4D6BFF');pg.addColorStop(1,'#1A2A80');c.fillStyle=pg;c.beginPath();c.arc(930,1260,260,0,7);c.fill();
 const box=(x,y,w,h,fill,sh)=>{c.fillStyle='#000';rrect(c,x+(sh||8),y+(sh||8),w,h,26);c.fill();c.fillStyle=fill;rrect(c,x,y,w,h,26);c.fill();c.lineWidth=5;c.strokeStyle='#000';rrect(c,x,y,w,h,26);c.stroke();};
 const W=R.W;
 c.fillStyle=C.pink;rrect(c,60,60,72,72,18);c.fill();c.lineWidth=5;c.strokeStyle='#000';rrect(c,60,60,72,72,18);c.stroke();
 c.fillStyle='#000';c.font=`900 40px ${FD}`;c.textAlign='center';c.textBaseline='middle';c.fillText('⚡',96,98);
 c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle=C.ink;c.font=`900 34px ${FD}`;c.fillText('MISIÓN ESTUDIO',152,96);
 c.fillStyle=C.mu;c.font=`700 22px ${FM}`;c.fillText('INFORME SEMANAL',152,128);
 c.fillStyle=C.ink;c.font=`900 62px ${FD}`;c.fillText(`${fmtShort(R.ws)} – ${fmtShort(R.we)}`,60,232);
 c.fillStyle=C.mu;const hl=repHeadline(R);let fs=30;do{c.font=`600 ${fs}px ${FB}`;fs--;}while(c.measureText(hl).width>960&&fs>18);c.fillText(hl,60,282);
 /* Bloque grande: horas de foco */
 box(60,320,960,200,C.pink);c.fillStyle='#000';c.font=`800 26px ${FM}`;c.fillText('HORAS DE FOCO',96,372);
 c.font=`900 92px ${FD}`;c.fillText(fmtMin(W.min).replace(' min',''),96,476);
 const dd=pctDiff(W.min,R.P.min);if(dd!=null){c.textAlign='right';c.font=`800 34px ${FB}`;c.fillText(`${dd>=0?'+':''}${dd} % vs. semana pasada`,990,476);c.textAlign='left';}
 /* Cuatro datos */
 const K=[['POMODOROS',W.pomos,C.sun],['TAREAS',W.tasks,C.cob],['VUELTAS',W.closes,C.mint],['DÍAS',`${W.active}/7`,'#FFFFFF']];
 K.forEach(([l,v,col],i)=>{const x=60+i*246;box(x,560,222,150,col,7);c.fillStyle='#000';c.font=`800 20px ${FM}`;c.fillText(l,x+24,604);c.font=`900 52px ${FD}`;c.fillText(String(v),x+24,676);});
 /* Barras por día */
 box(60,750,960,300,C.sf);const mx=Math.max(1,...W.days.map(x=>x.min));
 W.days.forEach((x,i)=>{const bx=110+i*130,bh=x.min/mx*150,best=x===R.best&&x.min;
  c.fillStyle=C.sf2;rrect(c,bx,790,70,150,14);c.fill();
  if(bh>0){c.fillStyle=best?C.sun:C.cob;rrect(c,bx,940-bh,70,bh,14);c.fill();c.lineWidth=4;c.strokeStyle='#000';rrect(c,bx,940-bh,70,bh,14);c.stroke();}
  c.textAlign='center';c.fillStyle=best?C.sun:C.mu;c.font=`800 26px ${FD}`;c.fillText(DOW_S[i],bx+35,982);
  if(x.mood!=null&&MOODS[x.mood]){c.font='34px sans-serif';c.fillText(MOODS[x.mood][0],bx+35,1026);}
  c.textAlign='left';});
 /* Datos de abajo */
 const facts=[['Mejor día',R.best.min?`${DOW_L[W.days.indexOf(R.best)]} · ${fmtMin(R.best.min)}`:'—'],['Distracciones',R.topC?`${R.D.length} · sobre todo ${DIST_CATS[R.topC[0]].l.toLowerCase()}`:`${R.D.length}`],['Jefe',R.boss?`${BOSSES[R.boss.id].name} · ${R.boss.won?'¡vencido!':'en pie'}`:'—']];
 facts.forEach(([l,v],i)=>{const y=1110+i*62;c.fillStyle=C.mu;c.font=`800 22px ${FM}`;c.fillText(l.toUpperCase(),60,y);c.fillStyle=C.ink;c.font=`800 32px ${FB}`;c.fillText(v.slice(0,40),330,y);});
 c.fillStyle=C.mu;c.font=`700 20px ${FM}`;c.fillText(state.name?`${state.name.toUpperCase()} · NIVEL ${levelInfo(state.xp).level}`:`NIVEL ${levelInfo(state.xp).level}`,60,1300);
 return cv;}
function openReportImg(){const R=weekReport(repWeek||addDays(weekStart(today()),-7));
 const go=()=>{const cv=drawReport(R);const url=cv.toDataURL('image/png');const m=$('#repModal');
  $('#repBody').innerHTML=`<img class="rp-img" src="${url}" alt="Informe semanal ${fmtShort(R.ws)} – ${fmtShort(R.we)}"><p class="hint">En el móvil también puedes mantener pulsada la imagen y elegir «Guardar en Fotos».</p><div class="aj-actions"><button class="btn sun" data-act="rep-save">${ico('star')}Guardar o compartir</button><button class="btn ghost" data-act="rep-close">Cerrar</button></div>`;
  m.hidden=false;m._cv=cv;m._name=`informe-${R.ws}.png`;};
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);else go();}
function saveReportImg(){const m=$('#repModal');if(!m||!m._cv)return;
 m._cv.toBlob(async b=>{if(!b)return;const f=new File([b],m._name,{type:'image/png'});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Mi informe semanal'});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=m._name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);toast('Imagen descargada','star');},'image/png');}

/* ---------- Aviso del domingo en Inicio ---------- */
function reportReadyWeek(){const cur=weekStart(today());if(dowOf(today())===6)return cur;const prev=addDays(cur,-7);return dowOf(today())<=1?prev:null;}
function renderReportBanner(){const el=$('#reportBanner');if(!el)return;const w=reportReadyWeek();
 const show=w&&state.reportSeen!==w&&(weekTotals2(w).active>0);el.hidden=!show;if(!show)return;
 el.innerHTML=`<span class="rp-ico">${ico('chart')}</span><span class="rp-txt"><b>Tu informe de la semana está listo</b><span>${fmtShort(w)} – ${fmtShort(addDays(w,6))} · horas, mejor día, distracciones y ánimo</span></span><span class="btn sun sm rp-cta">Verlo</span>`;}

/* ---------- Cuándo rindes más ---------- */
const SLOTS=[[0,6,'0–6'],[6,8,'6–8'],[8,10,'8–10'],[10,12,'10–12'],[12,14,'12–14'],[14,16,'14–16'],[16,18,'16–18'],[18,20,'18–20'],[20,22,'20–22'],[22,24,'22–24']];
const slotOf=h=>SLOTS.findIndex(([a,b])=>h>=a&&h<b);
function slotName(i){const s=SLOTS[i];return i===0?'de madrugada':`de ${s[0]} a ${s[1]}`;}
function renderRhythm(){const el=$('#rhythmCard');if(!el)return;
 const from=Date.now()-56*864e5;const P=state.pomoLog.filter(x=>x.at>=from),D=state.dist.filter(x=>x.at>=from);
 const grid=Array.from({length:7},()=>SLOTS.map(()=>({p:0,d:0})));
 P.forEach(x=>{const t=new Date(x.at);grid[(t.getDay()+6)%7][slotOf(t.getHours())].p++;});
 D.forEach(x=>{const t=new Date(x.at);grid[(t.getDay()+6)%7][slotOf(t.getHours())].d++;});
 const slotT=SLOTS.map((_,j)=>({p:grid.reduce((n,r)=>n+r[j].p,0),d:grid.reduce((n,r)=>n+r[j].d,0)}));
 const mx=Math.max(1,...grid.flat().map(c=>c.p));
 /* Por días: media de minutos de las últimas 8 semanas */
 const dayAvg=[0,0,0,0,0,0,0],dayN=[0,0,0,0,0,0,0];const ws=weekStart(today());
 for(let k=1;k<=8;k++)for(let i=0;i<7;i++){const d=addDays(addDays(ws,-7*k),i);if(d<(Object.keys(state.log).sort()[0]||d))continue;dayN[i]++;dayAvg[i]+=(state.log[d]&&state.log[d].min)||0;}
 for(let i=0;i<7;i++)dayAvg[i]=dayN[i]?Math.round(dayAvg[i]/dayN[i]):0;
 const dmx=Math.max(1,...dayAvg),bestDay=dayAvg.indexOf(Math.max(...dayAvg));
 const enough=P.length>=5;
 let tips='';
 if(enough){const ranked=slotT.map((s,j)=>({j,...s})).filter(s=>s.p>0).sort((a,b)=>b.p-a.p);const top=ranked[0];
  const cand=ranked.filter(s=>s.p>=3).map(s=>({...s,r:s.d/s.p}));const calm=cand.slice().sort((a,b)=>a.r-b.r)[0],noisy=cand.slice().sort((a,b)=>b.r-a.r)[0];
  const cell=grid.flatMap((r,i)=>r.map((c,j)=>({i,j,...c}))).sort((a,b)=>b.p-a.p)[0];
  tips=`<ul class="rh-tips">
   <li>${ico('bolt')}<span>Tu franja más productiva es <b>${slotName(top.j)}</b> (${top.p} pomodoros). El mejor hueco de la semana: <b>${DOW_L[cell.i].toLowerCase()} ${slotName(cell.j)}</b>.</span></li>
   ${calm?`<li>${ico('target')}<span>Donde menos te distraes: <b>${slotName(calm.j)}</b> (${fmt1(calm.r)} distracciones por pomodoro).${noisy&&noisy.j!==calm.j&&noisy.r>0?` Donde más: <b>${slotName(noisy.j)}</b> (${fmt1(noisy.r)}).`:''}</span></li>`:''}
   <li>${ico('bulb')}<span><b>Consejo:</b> deja lo más difícil (temas nuevos, simulacros) para la franja ${slotName(calm?calm.j:top.j)}${noisy&&calm&&noisy.j!==calm.j?` y usa la franja ${slotName(noisy.j)} para repasos ligeros o flashcards`:''}.</span></li></ul>`;}
 el.innerHTML=`<div class="card-head"><h3 class="card-title">${ico('timer')}Cuándo rindes más</h3><span class="chip">Últimas 8 semanas</span></div>
 ${enough?tips:`<div class="rh-wait">${ico('timer')}<span>Necesito al menos 5 pomodoros para saber a qué horas rindes más. Llevas <b>${P.length}</b>. A partir de ahora apunto la hora de cada pomodoro que termines.</span></div>`}
 <div class="rh-wrap"><table class="rh-grid" aria-label="Pomodoros por día y franja horaria"><thead><tr><th></th>${SLOTS.map(s=>`<th>${s[2]}</th>`).join('')}</tr></thead>
 <tbody>${grid.map((r,i)=>`<tr><th>${DOW_S[i]}</th>${r.map((c,j)=>`<td><span class="rh-c${c.p&&(.18+.82*c.p/mx)>.5?' hi':''}" style="--a:${c.p?(.18+.82*c.p/mx).toFixed(2):0}" title="${DOW_L[i]} ${slotName(j)}: ${c.p} pomodoros${c.d?`, ${c.d} distracciones`:''}">${c.p||''}${c.d?'<i></i>':''}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>
 <div class="rh-leg"><span><i class="rh-sw lo"></i>Pocos</span><span><i class="rh-sw hi"></i>Muchos pomodoros</span><span><i class="rh-dot"></i>Hubo distracciones</span></div>
 <h4 class="bg-sub">Por días de la semana · media de foco</h4>
 <div class="rh-days">${dayAvg.map((m,i)=>`<div class="rh-day${i===bestDay&&m?' best':''}"><span class="rh-dl">${DOW_L[i].slice(0,3)}</span><span class="dist-bar"><i style="width:${m/dmx*100}%"></i></span><b>${m?fmtMin(m):'—'}</b></div>`).join('')}</div>`;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="rep-"],#reportBanner');if(!el||el.disabled)return;
 if(el.id==='reportBanner'){const w=reportReadyWeek();state.reportSeen=w;repWeek=w;save();setTab('progreso');setTimeout(()=>{const c=$('#reportCard');if(c)c.scrollIntoView({behavior:'smooth',block:'start'});},120);return;}
 const a=el.dataset.act;
 if(a==='rep-prev'){repWeek=addDays(repWeek,-7);renderReport();}
 else if(a==='rep-next'){const n=addDays(repWeek,7);if(n<=weekStart(today())){repWeek=n;renderReport();}}
 else if(a==='rep-img')openReportImg();
 else if(a==='rep-save')saveReportImg();
 else if(a==='rep-close')$('#repModal').hidden=true;});
$('#repModal')&&$('#repModal').addEventListener('click',e=>{if(e.target.id==='repModal')e.target.hidden=true;});
document.addEventListener('keydown',e=>{const m=$('#repModal');if(m&&!m.hidden&&e.key==='Escape'){e.stopImmediatePropagation();m.hidden=true;}},true);
