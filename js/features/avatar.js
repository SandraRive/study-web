/* Pestaña Avatar y tienda */
'use strict';

/* ================= AVATAR Y TIENDA ================= */
let pendingBuy=null;
function renderAvatar(){const L=levelInfo(state.xp);$('#avStage').innerHTML=avatarSVG(state.avatar);$('#avName').textContent=state.name||'Sin nombre';let tot=0,un=0;for(const c in ITEMS)for(const it of ITEMS[c]){if(it.id==='none')continue;tot++;if(isUnlocked(it))un++;}$('#avSub').textContent=`Nivel ${L.level} · ${un}/${tot} objetos`;$('#avPurse').innerHTML=coinTxt(state.coins);$('#avRandom').innerHTML=`${ico('shuffle')}Combinación aleatoria`;
 const cat=state.ui.cat;$('#catTabs').innerHTML=CATS.concat([['shop','Tienda']]).map(([id,l])=>`<button class="pill" data-act="cat" data-id="${id}" aria-pressed="${id===cat}">${id==='shop'?ico('bag'):''}${l}</button>`).join('');
 let list;if(cat==='shop'){list=[];for(const [c] of CATS)for(const it of ITEMS[c])if(it.u&&it.u.coins)list.push({it,c});}else list=ITEMS[cat].map(it=>({it,c:cat}));
 $('#itemGrid').innerHTML=list.map(({it,c})=>{const u=isUnlocked(it),sel=state.avatar[c]===it.id;const cfg=Object.assign({},state.avatar,{[c]:it.id});const buy=!u&&it.u&&it.u.coins;let tag='';if(buy)tag=pendingBuy===it.id?`<span class="item-buy confirm">Pulsa para comprar</span>`:`<span class="item-buy">${ico('coin','coin-ico')}${it.u.coins}</span>`;else if(!u)tag=`<span class="item-lock">${ico('lock')}${esc(reqText(it.u))}</span>`;else if(cat==='shop')tag=`<span class="item-lock">${sel?'Puesto':'Tuyo'}</span>`;return `<button class="item ${u?'':(buy?'buyable':'locked')} ${sel?'sel':''}" data-act="item" data-cat="${c}" data-id="${it.id}" aria-pressed="${sel}" ${u?'':'aria-disabled="true"'}>${it.leg?'<span class="chip leg">Legendario</span>':''}<span class="item-thumb">${avatarSVG(cfg)}</span><span class="item-name">${esc(it.name)}</span>${tag}</button>`;}).join('');}
function clickItem(cat,id){const it=ITEMS[cat].find(x=>x.id===id);if(!it)return;
 if(isUnlocked(it)){state.avatar[cat]=id;pendingBuy=null;save();renderHud();renderAvatar();return;}
 if(it.u.coins){if(state.coins<it.u.coins){pendingBuy=null;toast(`Te faltan ${it.u.coins-state.coins} monedas para ${esc(it.name)}`,'coin');renderAvatar();return;}
  if(pendingBuy!==id){pendingBuy=id;renderAvatar();return;}
  state.coins-=it.u.coins;state.owned[id]=true;state.avatar[cat]=id;pendingBuy=null;toast(`<b>¡Comprado!</b> ${esc(it.name)} ya es tuyo`,'bag','ach');confetti(60);save();renderHud();renderAvatar();return;}
 toast(`<b>${esc(it.name)}</b> está bloqueado. Necesitas: ${esc(reqText(it.u))}`,'lock');}
