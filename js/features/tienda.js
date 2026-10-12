/* Tienda: protector de racha y escenarios de la web (además de los objetos de avatar) */
'use strict';

const FREEZE_PRICE=120,FREEZE_MAX=3;
let shopPending=null;

/* ---- Protector de racha: se usa solo al volver si faltaste algún día ---- */
function applyFreeze(){
 const s=state.streak,t=today();if(!s.last||s.count<=0||s.last>=yesterday())return;
 const missed=daysBetween(s.last,t)-1;if(missed<=0)return;if(state.freezes<missed){checkStreakLoss();return;}
 state.freezes-=missed;for(let i=1;i<=missed;i++)state.frozen.push(addDays(s.last,i));
 state.frozen=state.frozen.slice(-90);s.last=yesterday();save();
 setTimeout(()=>toast(`<b>Protector de racha usado</b> · Faltaste ${missed===1?'1 día':missed+' días'} y tu racha de ${s.count} ${s.count===1?'día':'días'} sigue viva.`,'shield','ach'),700);}

/* ---- Pantalla de tienda ---- */
function scenePreview(id){return `<span class="scene-prev" data-prev="${id}"><span class="scene-prev-sky"></span>${sceneSVG(id)}</span>`;}
function priceTag(price,id){return shopPending===id?`<span class="item-buy confirm">Pulsa otra vez para comprar</span>`:`<span class="item-buy">${ico('coin','coin-ico')}${price}</span>`;}
function shopExtrasHTML(){
 const fz=state.freezes;
 return `<section class="shop-sec"><h3 class="shop-h">${ico('shield')}Objetos especiales</h3>
  <button class="shop-card freeze ${fz>=FREEZE_MAX?'full':''}" data-act="shop-freeze"><span class="shop-ico">${ico('shield')}</span><span class="shop-txt"><b>Protector de racha</b><span>Si un día no puedes estudiar, se gasta solo y tu racha sigue viva. Puedes llevar hasta ${FREEZE_MAX}.</span><span class="shop-have">${[0,1,2].map(i=>`<i class="${i<fz?'on':''}"></i>`).join('')}Tienes ${fz} de ${FREEZE_MAX}</span></span>${fz>=FREEZE_MAX?'<span class="item-lock">Al máximo</span>':priceTag(FREEZE_PRICE,'freeze')}</button></section>
 <section class="shop-sec"><h3 class="shop-h">${ico('star')}Escenarios de la web</h3><div class="scene-grid">${Object.entries(SCENES).map(([id,sc])=>{const own=!!state.themes[id]||sc.price===0,use=state.bgTheme===id;
  return `<button class="scene-card ${use?'sel':''}" data-act="shop-scene" data-id="${id}" aria-pressed="${use}">${scenePreview(id)}<span class="scene-name">${esc(sc.name)}</span><span class="scene-desc">${esc(sc.desc)}</span>${use?'<span class="item-lock">En uso</span>':own?'<span class="item-buy own">Usar</span>':priceTag(sc.price,'scene-'+id)}</button>`;}).join('')}</div></section>
 <h3 class="shop-h">${ico('user')}Para tu avatar</h3>`;}

function buyConfirm(key,price,done){
 if(state.coins<price){shopPending=null;toast(`Te faltan ${price-state.coins} monedas.`,'coin');renderAvatar();return;}
 if(shopPending!==key){shopPending=key;renderAvatar();setTimeout(()=>{if(shopPending===key){shopPending=null;if(state.ui.tab==='avatar')renderAvatar();}},4000);return;}
 shopPending=null;state.coins-=price;done();confetti(70);afterAction();}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="shop-"]');if(!el)return;
 if(el.dataset.act==='shop-freeze'){if(state.freezes>=FREEZE_MAX){toast('Ya llevas el máximo de protectores.','shield');return;}
  buyConfirm('freeze',FREEZE_PRICE,()=>{state.freezes++;toast(`<b>Protector comprado.</b> Tienes ${state.freezes} de ${FREEZE_MAX}.`,'shield','ach');});}
 else if(el.dataset.act==='shop-scene'){const id=el.dataset.id,sc=SCENES[id];if(!sc)return;
  if(state.themes[id]||sc.price===0){state.bgTheme=id;applyScene(id);save();renderAvatar();toast(`Escenario: ${esc(sc.name)}`,'star');return;}
  buyConfirm('scene-'+id,sc.price,()=>{state.themes[id]=true;state.bgTheme=id;applyScene(id);toast(`<b>¡${esc(sc.name)} desbloqueado!</b> Ya lo tienes puesto.`,'star','ach');});}});
