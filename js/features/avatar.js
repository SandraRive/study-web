/* Pestaña Avatar y tienda */
'use strict';

/* ================= AVATAR Y TIENDA ================= */
let pendingBuy=null;
function renderAvatar(){const L=levelInfo(state.xp);$('#avStage').innerHTML=state.ui.avView==='retrato'?avatarSVG(state.avatar):avatarFullSVG(state.avatar,{bg:true});$('#avStage').classList.toggle('full',state.ui.avView!=='retrato');{const vt=$('#avViewTog');if(vt)vt.innerHTML=[['cuerpo','Cuerpo entero'],['retrato','Retrato']].map(([k,l])=>`<button data-act="av-view" data-v="${k}" aria-pressed="${(state.ui.avView||'cuerpo')===k}">${l}</button>`).join('');}$('#avName').textContent=state.name||'Sin nombre';let tot=0,un=0;for(const c in ITEMS)for(const it of ITEMS[c]){if(it.id==='none')continue;tot++;if(isUnlocked(it))un++;}$('#avSub').textContent=`Nivel ${L.level} · ${un}/${tot} objetos`;$('#avPurse').innerHTML=coinTxt(state.coins);$('#avRandom').innerHTML=`${ico('shuffle')}Combinación aleatoria`;
 const cat=state.ui.cat;$('#catTabs').innerHTML=CATS.concat([['shop','Tienda']]).map(([id,l])=>`<button class="pill" data-act="cat" data-id="${id}" aria-pressed="${id===cat}">${id==='shop'?ico('bag'):''}${l}</button>`).join('');
 let list;if(cat==='shop'){list=[];for(const [c] of CATS)for(const it of ITEMS[c])if(it.u&&it.u.coins)list.push({it,c});}else list=ITEMS[cat].map(it=>({it,c:cat}));
 {const sx=$('#shopExtras');if(sx){sx.hidden=cat!=='shop';if(cat==='shop')sx.innerHTML=shopExtrasHTML();}}
 const st=$('#setTabs');if(cat==='base'){const cur=state.ui.baseSet||'clasicos';st.hidden=false;st.innerHTML=SETS.map(([id,l])=>{const its=ITEMS.base.filter(it=>(it.set||'clasicos')===id);const un=its.filter(isUnlocked).length;return `<button class="pill cnt" data-act="set" data-id="${id}" aria-pressed="${id===cur}">${l}<span class="pill-count">${un}/${its.length}</span></button>`;}).join('');list=list.filter(({it})=>(it.set||'clasicos')===cur);}else st.hidden=true;
 $('#itemGrid').innerHTML=list.map(({it,c})=>{const u=isUnlocked(it),sel=state.avatar[c]===it.id;const cfg=Object.assign({},state.avatar,{[c]:it.id});if(c==='base'&&cat==='base'){cfg.hat='none';cfg.glasses='none';}const buy=!u&&it.u&&it.u.coins;let tag='';if(buy)tag=pendingBuy===it.id?`<span class="item-buy confirm">Pulsa para comprar</span>`:`<span class="item-buy">${ico('coin','coin-ico')}${it.u.coins}</span>`;else if(!u)tag=`<span class="item-lock">${ico('lock')}${esc(reqText(it.u))}</span>`;else if(cat==='shop')tag=`<span class="item-lock">${sel?'Puesto':'Tuyo'}</span>`;return `<button class="item ${u?'':(buy?'buyable':'locked')} ${sel?'sel':''}" data-act="item" data-cat="${c}" data-id="${it.id}" aria-pressed="${sel}" ${u?'':'aria-disabled="true"'}>${it.leg?'<span class="chip leg">Legendario</span>':''}<span class="item-thumb">${(BODY_CATS[c]?avatarFullSVG(cfg):avatarSVG(cfg))}</span><span class="item-name">${esc(it.name)}</span>${tag}</button>`;}).join('');}
function clickItem(cat,id){const it=ITEMS[cat].find(x=>x.id===id);if(!it)return;
 if(isUnlocked(it)){state.avatar[cat]=id;pendingBuy=null;save();renderHud();renderAvatar();return;}
 if(it.u.coins){if(state.coins<it.u.coins){pendingBuy=null;toast(`Te faltan ${it.u.coins-state.coins} monedas para ${esc(it.name)}`,'coin');renderAvatar();return;}
  if(pendingBuy!==id){pendingBuy=id;renderAvatar();return;}
  state.coins-=it.u.coins;state.owned[id]=true;state.avatar[cat]=id;pendingBuy=null;toast(`<b>¡Comprado!</b> ${esc(it.name)} ya es tuyo`,'bag','ach');confetti(60);save();renderHud();renderAvatar();return;}
 toast(`<b>${esc(it.name)}</b> está bloqueado. Necesitas: ${esc(reqText(it.u))}`,'lock');}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act="av-view"]');if(!el)return;state.ui.avView=el.dataset.v;save();renderAvatar();});
