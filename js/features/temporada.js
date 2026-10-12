/* Temporadas mensuales: pase de 30 niveles, misiones y objetos exclusivos de cada mes */
'use strict';

const SEASON_THEMES={
 1:{n:'Propósitos de año nuevo',e:'🎆',c1:'#FFCB45',c2:'#3346E0'},2:{n:'Corazón valiente',e:'💘',c1:'#FF4D7D',c2:'#5A1430'},
 3:{n:'Primavera eléctrica',e:'🌱',c1:'#3DFFB0',c2:'#0F5A46'},4:{n:'Lluvia de ideas',e:'🌧️',c1:'#00D9FF',c2:'#1B2A6B'},
 5:{n:'Jardín en flor',e:'🌸',c1:'#FF9EC8',c2:'#1F6B52'},6:{n:'Sprint final',e:'🏁',c1:'#FF8A3D',c2:'#17132F'},
 7:{n:'Ola de verano',e:'🌊',c1:'#2EE6FF',c2:'#0B4A8C'},8:{n:'Noches de estrellas',e:'🌠',c1:'#FFE14D',c2:'#1A1446'},
 9:{n:'Vuelta al cole',e:'🎒',c1:'#FF4545',c2:'#2A2F4F'},10:{n:'Noche de calabazas',e:'🎃',c1:'#FF8A3D',c2:'#2A0A12'},
 11:{n:'Bosque de otoño',e:'🍂',c1:'#E0782E',c2:'#3B2416'},12:{n:'Invierno estelar',e:'❄️',c1:'#9AD8FF',c2:'#16224F'}};
const MONTHS_L=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const SP_PER_LVL=150,SP_MAX=30;
const seasonId=()=>today().slice(0,7);
const seasonTheme=id=>SEASON_THEMES[+id.slice(5,7)];
function seasonEnd(id){const [y,m]=id.split('-').map(Number);const d=new Date(y,m,0);return `${y}-${String(m).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}

/* ---- Objetos exclusivos (se generan a partir del mes) ---- */
function seasonItems(id){const T=seasonTheme(id),y=id.slice(0,4),key=id.replace('-','');
 const oid='T'+key+'o',bid='T'+key+'b';
 if(!SEASON_OUTFITS[oid])SEASON_OUTFITS[oid]={t:T.c1,p:shade(T.c2,.15),sl:shade(T.c1,-.15),dt:'season',
  art:`<path d="M74 110 Q100 130 126 110" fill="${shade(T.c1,-.25)}" ${S}/><circle cx="100" cy="152" r="22" fill="${T.c2}" ${S}/><text x="100" y="161" font-size="25" text-anchor="middle">${T.e}</text><path d="M58 186 H142" stroke="${T.c2}" stroke-width="6"/><path d="M62 238 H96 M104 238 H138" stroke="${T.c1}" stroke-width="4"/>`};
 if(!BG_ART[bid]){const r=rng('bg'+id);let s=`<rect width="200" height="200" fill="${T.c2}"/><circle cx="100" cy="100" r="88" fill="${T.c1}" opacity=".18"/><circle cx="100" cy="100" r="58" fill="${T.c1}" opacity=".18"/>`;
  for(let i=0;i<9;i++){const x=(20+r()*160).toFixed(0),yy=(20+r()*160).toFixed(0),sz=(14+r()*16).toFixed(0);s+=`<text x="${x}" y="${yy}" font-size="${sz}" text-anchor="middle" opacity=".85" transform="rotate(${(r()*40-20).toFixed(0)} ${x} ${yy})">${T.e}</text>`;}
  BG_ART[bid]=s;}
 return {o:{id:oid,name:`Sudadera «${T.n}» ${y}`,u:{season:30},season:id},b:{id:bid,name:`Fondo «${T.n}» ${y}`,u:{season:15},season:id}};}
function registerSeasonItems(){const ids=new Set([seasonId()]);Object.keys(state.owned).forEach(k=>{const m=/^T(\d{4})(\d{2})[ob]$/.exec(k);if(m)ids.add(`${m[1]}-${m[2]}`);});
 ids.forEach(id=>{const I2=seasonItems(id);if(!ITEMS.outfit.some(x=>x.id===I2.o.id))ITEMS.outfit.push(I2.o);if(!ITEMS.bg.some(x=>x.id===I2.b.id))ITEMS.bg.push(I2.b);});
 /* Los exclusivos de meses pasados que no conseguiste dejan de mostrarse */
 ITEMS.outfit=ITEMS.outfit.filter(x=>!x.season||x.season===seasonId()||state.owned[x.id]);ITEMS.bg=ITEMS.bg.filter(x=>!x.season||x.season===seasonId()||state.owned[x.id]);}

/* ---- Recompensas por nivel ---- */
function seasonReward(l,id){const I2=seasonItems(id||seasonId());
 if(l===30)return {k:'item',id:I2.o.id,name:I2.o.name,coins:300};
 if(l===15)return {k:'item',id:I2.b.id,name:I2.b.name};
 if(l===10||l===20)return {k:'freeze',name:'Protector de racha'};
 if(l===25)return {k:'coins',n:250};if(l%5===0)return {k:'coins',n:120};
 return {k:'coins',n:25+(l%3===0?20:0)};}
function rewardLabel(R){return R.k==='coins'?`${R.n} monedas`:R.k==='freeze'?'Protector de racha':R.name+(R.coins?` + ${R.coins} monedas`:'');}
function giveReward(R){if(R.k==='coins'){state.coins+=R.n;state.coinsEarned+=R.n;}
 else if(R.k==='freeze'){if(state.freezes<FREEZE_MAX)state.freezes++;else{state.coins+=100;state.coinsEarned+=100;}}
 else if(R.k==='item'){state.owned[R.id]=true;if(R.coins){state.coins+=R.coins;state.coinsEarned+=R.coins;}}}

/* ---- Estado de la temporada ---- */
function ensureSeason(){const id=seasonId();if(state.season&&state.season.id===id)return;
 if(state.season&&state.season.pts>0){state.seasonHist=(state.seasonHist||[]).concat([{id:state.season.id,lvl:seasonLvl(state.season.pts)}]).slice(-24);}
 state.season={id,pts:0,given:0,claimed:{}};registerSeasonItems();}
const seasonLvl=p=>Math.min(SP_MAX,Math.floor(p/SP_PER_LVL)+1);
function seasonAdd(n,why){ensureSeason();const S2=state.season;if(seasonLvl(S2.pts)>=SP_MAX&&S2.given>=SP_MAX)return;
 S2.pts+=Math.max(0,Math.round(n));const L=seasonLvl(S2.pts);
 while(S2.given<L){S2.given++;if(S2.given===1)continue;const R=seasonReward(S2.given);giveReward(R);
  toast(`<b>Pase · nivel ${S2.given}</b> ${R.k==='item'?'🎁 ':''}${esc(rewardLabel(R))}`,R.k==='item'?'crown':'star','ach');if(R.k==='item'||S2.given===SP_MAX)confetti(120);}
 if(state.ui.tab==='pase')renderPase();}
/* Todo lo que da XP también suma al pase */
{const _gx=grantXP;grantXP=function(n,reason,coins,quiet){_gx(n,reason,coins,quiet);if(n>0)seasonAdd(n);};}

/* ---- Misiones ---- */
function sumLog(from,to,k){let n=0;for(let d=from;d<=to;d=addDays(d,1)){const L=state.log[d];if(L&&L[k])n+=L[k];}return n;}
function countDays(from,to,fn){let n=0;for(let d=from;d<=to;d=addDays(d,1))if(fn(d))n++;return n;}
const MISSIONS={
 pomos:{l:n=>`Completa ${n} pomodoros`,e:'⏱️',f:(a,b)=>sumLog(a,b,'pomos')},
 min:{l:n=>`Suma ${Math.round(n/60)} horas de foco`,e:'🔥',f:(a,b)=>sumLog(a,b,'min')},
 tasks:{l:n=>`Termina ${n} tareas`,e:'✅',f:(a,b)=>sumLog(a,b,'tasks')},
 closes:{l:n=>`Cierra ${n} vueltas del temario`,e:'📚',f:(a,b)=>sumLog(a,b,'closes')},
 cards:{l:n=>`Acierta ${n} flashcards`,e:'🃏',f:(a,b)=>sumLog(a,b,'cards')},
 active:{l:n=>`Estudia ${n} días distintos`,e:'📅',f:(a,b)=>countDays(a,b,d=>isActive(state.log[d]))},
 diary:{l:n=>`Cierra el día en tu diario ${n} veces`,e:'📝',f:(a,b)=>countDays(a,b,d=>!!state.diary[d])},
 care:{l:n=>`Cumple tu autocuidado ${n} días`,e:'💚',f:(a,b)=>typeof careScore==='function'?countDays(a,b,d=>careScore(d)>=3):0},
 tests:{l:n=>`Haz ${n} ${n===1?'simulacro':'simulacros'}`,e:'🎯',f:(a,b)=>state.tests.filter(t=>t.date>=a&&t.date<=b).length},
 phys:{l:n=>`Apunta ${n} marcas físicas`,e:'🏃‍♀️',f:(a,b)=>state.phys.tests.reduce((s,t)=>s+t.marks.filter(m=>m.d>=a&&m.d<=b).length,0)}};
const WEEK_POOL=[['pomos',15],['min',420],['tasks',12],['closes',3],['cards',50],['active',5],['diary',4],['care',4],['tests',1],['phys',2]];
const MONTH_POOL=[['pomos',60],['active',18],['closes',10],['diary',14],['care',14],['tasks',45]];
function pick(pool,seed,n){const r=rng(seed),a=pool.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n);}
function missionsNow(){ensureSeason();const id=state.season.id,ws=weekStart(today()),we=addDays(ws,6),ms=id+'-01',me=seasonEnd(id);
 const from=ws<ms?ms:ws,to=we>me?me:we;
 const W=pick(WEEK_POOL,'sem'+ws,3).map(([k,n])=>({key:`w${ws}-${k}`,k,n,v:Math.min(n,MISSIONS[k].f(from,to)),pts:250,scope:'week'}));
 const M=pick(MONTH_POOL,'mes'+id,3).map(([k,n])=>({key:`m${id}-${k}`,k,n,v:Math.min(n,MISSIONS[k].f(ms,me)),pts:600,scope:'month'}));
 return {W,M,we:to};}
function claimMission(key){const all=missionsNow();const m=all.W.concat(all.M).find(x=>x.key===key);if(!m||m.v<m.n||state.season.claimed[key])return;
 state.season.claimed[key]=true;toast(`<b>Misión cumplida</b> · +${m.pts} puntos de pase`,'crown','ach');confetti(60);seasonAdd(m.pts);afterAction();renderPase();}
function missionsReady(){const a=missionsNow();return a.W.concat(a.M).filter(m=>m.v>=m.n&&!state.season.claimed[m.key]).length;}

/* ---- Tarjeta en Inicio ---- */
function renderSeasonCard(){const el=$('#seasonCard');if(!el)return;ensureSeason();const S2=state.season,T=seasonTheme(S2.id),L=seasonLvl(S2.pts),into=S2.pts-(L-1)*SP_PER_LVL;
 const left=daysBetween(today(),seasonEnd(S2.id))+1,ready=missionsReady(),nx=L<SP_MAX?seasonReward(L+1):null;
 el.style.setProperty('--s1',T.c1);el.style.setProperty('--s2',T.c2);
 el.innerHTML=`<span class="sc-emoji" aria-hidden="true">${T.e}</span><div class="sc-main"><span class="eyebrow">Temporada de ${MONTHS_L[+S2.id.slice(5,7)-1]} · quedan ${left} ${left===1?'día':'días'}</span><b class="sc-name">${esc(T.n)}</b>
 <div class="sc-row"><span class="sc-lvl">Nv ${L}<small>/${SP_MAX}</small></span><span class="sc-bar"><i style="width:${L>=SP_MAX?100:into/SP_PER_LVL*100}%"></i></span></div>
 <span class="sc-next">${nx?`Siguiente: ${esc(rewardLabel(nx))}`:'¡Pase completado! 👑'}</span></div>
 <button class="btn sun sm sc-cta" data-act="tab" data-tab="pase">${ready?`<i class="sc-dot">${ready}</i>`:''}Ver pase</button>`;}

/* ---- Pantalla del pase ---- */
function renderPase(){const el=$('#paseArea');if(!el)return;ensureSeason();registerSeasonItems();const S2=state.season,T=seasonTheme(S2.id),L=seasonLvl(S2.pts),into=S2.pts-(L-1)*SP_PER_LVL;
 const left=daysBetween(today(),seasonEnd(S2.id))+1,I2=seasonItems(S2.id),mis=missionsNow();
 const prevO=Object.assign({},state.avatar,{outfit:I2.o.id,bg:I2.b.id});
 const track=[];for(let l=2;l<=SP_MAX;l++){const R=seasonReward(l),got=S2.given>=l;
  track.push(`<div class="ps-lv${got?' got':''}${l===L+1?' next':''}${R.k==='item'?' ex':''}"><span class="ps-n">${l}</span><span class="ps-ic">${R.k==='coins'?'🪙':R.k==='freeze'?'🛡️':l===30?'👕':'🖼️'}</span><span class="ps-r">${R.k==='coins'?R.n:R.k==='freeze'?'Protector':l===30?'Sudadera':'Fondo'}</span>${got?`<span class="ps-ok">${ico('check')}</span>`:''}</div>`);}
 const mHTML=(arr,ttl,sub)=>`<div class="ps-mis"><h4 class="bg-sub">${ttl} <span class="hint">${sub}</span></h4>${arr.map(m=>{const M=MISSIONS[m.k],done=m.v>=m.n,cl=!!S2.claimed[m.key];
  return `<div class="ps-m${cl?' claimed':done?' done':''}"><span class="ps-me" aria-hidden="true">${M.e}</span><div class="ps-mt"><b>${esc(M.l(m.n))}</b><span class="care-bar"><i style="width:${m.v/m.n*100}%"></i></span><span class="ps-mv">${m.k==='min'?`${Math.floor(m.v/60)} h ${m.v%60} min / ${Math.round(m.n/60)} h`:`${m.v} / ${m.n}`}</span></div>
  ${cl?`<span class="chip ok">${ico('check')}Hecha</span>`:done?`<button class="btn sun sm" data-act="ps-claim" data-k="${m.key}">+${m.pts}</button>`:`<span class="chip">+${m.pts}</span>`}</div>`;}).join('')}</div>`;
 el.style.setProperty('--s1',T.c1);el.style.setProperty('--s2',T.c2);
 el.innerHTML=`<div class="ps-hero"><span class="ps-big" aria-hidden="true">${T.e}</span><div class="ps-hm"><span class="eyebrow">Temporada de ${MONTHS_L[+S2.id.slice(5,7)-1]} ${S2.id.slice(0,4)} · termina en ${left} ${left===1?'día':'días'}</span><h2 class="ps-title">${esc(T.n)}</h2>
  <div class="sc-row"><span class="sc-lvl">Nivel ${L}<small>/${SP_MAX}</small></span><span class="sc-bar"><i style="width:${L>=SP_MAX?100:into/SP_PER_LVL*100}%"></i></span><span class="ps-pts">${L>=SP_MAX?'¡Completado!':`${into}/${SP_PER_LVL} pts`}</span></div>
  <p class="ps-how">Todo lo que te da XP suma puntos al pase. Las misiones dan puntos extra.</p></div></div>
 <div class="ps-grid"><article class="card ps-ex"><div class="card-head"><h3 class="card-title">${ico('crown')}Exclusivo de este mes</h3></div>
  <div class="ps-exw"><div class="ps-prev">${avatarFullSVG(prevO,{bg:true})}</div><ul class="ps-exl">
   <li class="${state.owned[I2.b.id]?'own':''}"><span>🖼️</span><div><b>${esc(I2.b.name)}</b><span>${state.owned[I2.b.id]?'¡Conseguido!':'Nivel 15 del pase'}</span></div></li>
   <li class="${state.owned[I2.o.id]?'own':''}"><span>👕</span><div><b>${esc(I2.o.name)}</b><span>${state.owned[I2.o.id]?'¡Conseguida!':'Nivel 30 del pase'}</span></div></li></ul></div>
  <p class="hint">Solo se pueden conseguir hasta el ${pdate(seasonEnd(S2.id)).getDate()} de ${MONTHS_L[+S2.id.slice(5,7)-1]}. Después, no vuelven.</p></article>
  <article class="card">${mHTML(mis.W,'Misiones de la semana',`· se renuevan el lunes`)}${mHTML(mis.M,'Misiones del mes',`· hasta fin de mes`)}</article></div>
 <article class="card ps-trackc"><div class="card-head"><h3 class="card-title">${ico('star')}Recompensas</h3><span class="chip">${S2.given-1>0?S2.given-1:0} de ${SP_MAX-1} conseguidas</span></div><div class="ps-track">${track.join('')}</div></article>
 ${(state.seasonHist||[]).length?`<p class="hint">Temporadas anteriores: ${state.seasonHist.slice().reverse().map(h=>`${seasonTheme(h.id).e} ${MONTHS_L[+h.id.slice(5,7)-1]} ${h.id.slice(0,4)} · nivel ${h.lvl}`).join(' · ')}</p>`:''}`;
 const nx=el.querySelector('.ps-lv.next');if(nx&&nx.parentElement)nx.parentElement.scrollLeft=Math.max(0,nx.offsetLeft-120);}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act="ps-claim"]');if(el)claimMission(el.dataset.k);});
ensureSeason();registerSeasonItems();
