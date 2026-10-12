/* Cofre diario: una recompensa aleatoria por entrar cada día; cuantos más días seguidos, mejor */
'use strict';

const chestReady=()=>state.chest.date!==today();
const chestStreakNext=()=>(state.chest.date===yesterday()?state.chest.streak:0)+1;

function chestSVG(cls){return `<svg class="chest-svg ${cls||''}" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <g class="chest-rays"><path d="M100 90 L40 0 L70 0Z M100 90 L130 0 L160 0Z M100 90 L200 30 L200 60Z M100 90 L0 30 L0 60Z" fill="#FFE14D" opacity=".55"/></g>
 <ellipse cx="100" cy="168" rx="70" ry="8" fill="#000" opacity=".35"/>
 <rect x="30" y="86" width="140" height="78" rx="10" fill="#B5652B" stroke="${OL}" stroke-width="5"/>
 <rect x="30" y="86" width="140" height="18" fill="#8E4A1C" stroke="${OL}" stroke-width="5"/>
 <rect x="48" y="86" width="14" height="78" fill="#FFCB45" stroke="${OL}" stroke-width="4"/><rect x="138" y="86" width="14" height="78" fill="#FFCB45" stroke="${OL}" stroke-width="4"/>
 <g class="chest-lid"><path d="M30 88 V66 Q30 36 100 36 Q170 36 170 66 V88Z" fill="#C97436" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/><path d="M48 88 V54 M152 88 V54" stroke="#FFCB45" stroke-width="12"/></g>
 <rect x="86" y="78" width="28" height="30" rx="6" fill="#FFCB45" stroke="${OL}" stroke-width="4"/><circle cx="100" cy="91" r="4" fill="${OL}"/><path d="M100 93 V100" stroke="${OL}" stroke-width="3"/>
</svg>`;}

function rollChest(){
 const st=chestStreakNext(),mult=1+Math.min(st-1,6)*.1,r=Math.random();
 const items=[];for(const [c] of CATS)for(const it of ITEMS[c])if(it.u&&it.u.coins&&it.u.coins<=300&&!state.owned[it.id])items.push({it,c});
 if(r<.05&&items.length){const x=items[Math.floor(Math.random()*items.length)];return {type:'item',it:x.it,c:x.c,st};}
 if(r<.13&&state.freezes<3)return {type:'freeze',st};
 if(r<.22)return {type:'jackpot',coins:Math.round((100+Math.random()*100)*mult),st};
 if(r<.55)return {type:'xp',xp:Math.round((40+Math.random()*80)*mult),st};
 return {type:'coins',coins:Math.round((20+Math.random()*40)*mult),st};}

function rewardHTML(rw){
 if(rw.type==='item'){const cfg=Object.assign({},state.avatar,{[rw.c]:rw.it.id});return `<div class="chest-prize item"><span class="chest-item">${avatarSVG(cfg)}</span><b>¡Objeto gratis!</b><span>${esc(rw.it.name)} ya es tuyo</span></div>`;}
 if(rw.type==='freeze')return `<div class="chest-prize freeze"><span class="chest-ico">${ico('shield')}</span><b>Protector de racha</b><span>Salvará tu racha un día que no puedas estudiar</span></div>`;
 if(rw.type==='xp')return `<div class="chest-prize xp"><span class="chest-ico">${ico('sparkle')}</span><b>+${rw.xp} XP</b><span>Experiencia extra</span></div>`;
 return `<div class="chest-prize ${rw.type}"><span class="chest-ico">${ico('coin')}</span><b>+${rw.coins} monedas</b><span>${rw.type==='jackpot'?'¡Premio gordo!':'Para la tienda'}</span></div>`;}

function openChest(){
 if(!chestReady())return;
 const rw=rollChest();
 state.chest={date:today(),streak:rw.st,opened:(state.chest.opened||0)+1};
 if(rw.type==='coins'||rw.type==='jackpot'){state.coins+=rw.coins;state.coinsEarned+=rw.coins;}
 else if(rw.type==='xp')grantXP(rw.xp,'Cofre diario',0,true);
 else if(rw.type==='freeze')state.freezes=Math.min(3,state.freezes+1);
 else if(rw.type==='item')state.owned[rw.it.id]=true;
 save();
 const m=$('#chestModal');m.hidden=false;
 $('#chestBody').innerHTML=`<div class="eyebrow">Cofre diario · día ${rw.st} seguido</div><div class="chest-stage">${chestSVG('shake')}</div><div class="chest-reveal" hidden>${rewardHTML(rw)}<p class="hint">${rw.st>=7?'Racha máxima: tus cofres dan un 60 % más.':`Vuelve mañana: con ${rw.st+1} días seguidos el premio crece un ${Math.min(rw.st,6)*10} %.`}</p><button class="btn pink" data-act="chest-close">¡Genial!</button></div>`;
 const svg=$('#chestBody .chest-svg');
 setTimeout(()=>{if(svg){svg.classList.remove('shake');svg.classList.add('open');}if(!reduce)confetti(rw.type==='jackpot'||rw.type==='item'?160:80);const rv=$('#chestBody .chest-reveal');if(rv)rv.hidden=false;const b=$('#chestBody [data-act="chest-close"]');if(b)b.focus();},reduce?50:1100);
 renderHud();}
function closeChest(){$('#chestModal').hidden=true;afterAction();}

function renderChest(){
 const el=$('#chestBanner');if(!el)return;el.hidden=!chestReady();if(el.hidden)return;
 const st=chestStreakNext();
 el.innerHTML=`<span class="chest-mini">${chestSVG('bob')}</span><span class="chest-txt"><b>Tu cofre diario te espera</b><span>${st>1?`Día ${st} seguido: premio un ${Math.min(st-1,6)*10} % mejor`:'Ábrelo cada día y los premios crecen'}</span></span><span class="btn sun chest-cta">${ico('gift')}Abrir</span>`;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="chest-"]');if(!el)return;
 if(el.dataset.act==='chest-open')openChest();else if(el.dataset.act==='chest-close')closeChest();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#chestModal').hidden)closeChest();});
