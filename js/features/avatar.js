/* Pestaña Avatar y tienda */
'use strict';

/* ================= AVATAR Y TIENDA ================= */
let pendingBuy=null;
/* Pestaña «Desbloqueados»: todo lo que ya es tuyo, ordenado por secciones */
const MINE_ICON='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>';
function countUnlocked(){let tot=0,un=0;for(const c in ITEMS)for(const it of ITEMS[c]){if(it.id==='none')continue;tot++;if(isUnlocked(it))un++;}return {tot,un};}
function itemBtn(it,c,cat){const u=isUnlocked(it),sel=state.avatar[c]===it.id;const cfg=Object.assign({},state.avatar,{[c]:it.id});if(c==='base'&&(cat==='base'||cat==='mine')){cfg.hat='none';cfg.glasses='none';}
 const buy=!u&&it.u&&it.u.coins;let tag='';
 if(buy)tag=pendingBuy===it.id?`<span class="item-buy confirm">Pulsa para comprar</span>`:`<span class="item-buy">${ico('coin','coin-ico')}${it.u.coins}</span>`;
 else if(!u)tag=`<span class="item-lock">${ico('lock')}${esc(reqText(it.u))}</span>`;
 else if(cat==='shop'||cat==='mine')tag=`<span class="item-lock">${sel?'Puesto':'Tuyo'}</span>`;
 return `<button class="item ${u?'':(buy?'buyable':'locked')} ${sel?'sel':''}" data-act="item" data-cat="${c}" data-id="${it.id}" aria-pressed="${sel}" ${u?'':'aria-disabled="true"'}>${it.leg?'<span class="chip leg">Legendario</span>':''}<span class="item-thumb">${(BODY_CATS[c]?avatarFullSVG(cfg):avatarSVG(cfg))}</span><span class="item-name">${esc(it.name)}</span>${tag}</button>`;}
function mineHTML(){let o='';
 for(const [c,l] of CATS){const all=ITEMS[c].filter(it=>it.id!=='none');const got=all.filter(isUnlocked);
  o+=`<div class="ig-head"><span>${esc(l)}</span><b>${got.length}/${all.length}</b></div>`;
  o+=got.length?got.map(it=>itemBtn(it,c,'mine')).join(''):`<div class="ig-empty">Aún no tienes nada de ${esc(l.toLowerCase())}. ¡Sigue sumando XP!</div>`;}
 return o;}
function renderAvatar(){const L=levelInfo(state.xp);const full=state.ui.avView!=='retrato';
 $('#avStage').innerHTML=full?avatarFullSVG(state.avatar,{bg:true,anim:true}):avatarSVG(state.avatar);$('#avStage').classList.toggle('full',full);
 {const vt=$('#avViewTog');if(vt)vt.innerHTML=[['cuerpo','Cuerpo entero'],['retrato','Retrato']].map(([k,l])=>`<button data-act="av-view" data-v="${k}" aria-pressed="${(state.ui.avView||'cuerpo')===k}">${l}</button>`).join('');}
 $('#avName').textContent=state.name||'Sin nombre';const {tot,un}=countUnlocked();
 $('#avSub').textContent=`Nivel ${L.level} · ${un}/${tot} objetos`;$('#avPurse').innerHTML=coinTxt(state.coins);$('#avRandom').innerHTML=`${ico('shuffle')}Combinación aleatoria`;
 const cat=state.ui.cat;
 $('#catTabs').innerHTML=[['mine','Desbloqueados']].concat(CATS,[['shop','Tienda']]).map(([id,l])=>`<button class="pill${id==='mine'?' pill-mine':''}" data-act="cat" data-id="${id}" aria-pressed="${id===cat}">${id==='shop'?ico('bag'):id==='mine'?MINE_ICON:''}${l}${id==='mine'?`<span class="pill-count">${un}</span>`:''}</button>`).join('');
 {const sx=$('#shopExtras');if(sx){sx.hidden=cat!=='shop';if(cat==='shop')sx.innerHTML=shopExtrasHTML();}}
 const st=$('#setTabs');
 if(cat==='mine'){st.hidden=true;$('#itemGrid').innerHTML=mineHTML();return;}
 let list;if(cat==='shop'){list=[];for(const [c] of CATS)for(const it of ITEMS[c])if(it.u&&it.u.coins)list.push({it,c});}else list=(ITEMS[cat]||[]).map(it=>({it,c:cat}));
 if(cat==='base'){const cur=state.ui.baseSet||'clasicos';st.hidden=false;st.innerHTML=SETS.map(([id,l])=>{const its=ITEMS.base.filter(it=>(it.set||'clasicos')===id);const n=its.filter(isUnlocked).length;return `<button class="pill cnt" data-act="set" data-id="${id}" aria-pressed="${id===cur}">${l}<span class="pill-count">${n}/${its.length}</span></button>`;}).join('');list=list.filter(({it})=>(it.set||'clasicos')===cur);}else st.hidden=true;
 $('#itemGrid').innerHTML=list.map(({it,c})=>itemBtn(it,c,cat)).join('');}
function clickItem(cat,id){const it=ITEMS[cat].find(x=>x.id===id);if(!it)return;
 if(isUnlocked(it)){state.avatar[cat]=id;pendingBuy=null;save();renderHud();renderAvatar();avatarCheer();return;}
 if(it.u.coins){if(state.coins<it.u.coins){pendingBuy=null;toast(`Te faltan ${it.u.coins-state.coins} monedas para ${esc(it.name)}`,'coin');renderAvatar();return;}
  if(pendingBuy!==id){pendingBuy=id;renderAvatar();return;}
  state.coins-=it.u.coins;state.owned[id]=true;state.avatar[cat]=id;pendingBuy=null;toast(`<b>¡Comprado!</b> ${esc(it.name)} ya es tuyo`,'bag','ach');confetti(60);save();renderHud();renderAvatar();avatarCheer();return;}
 toast(`<b>${esc(it.name)}</b> está bloqueado. Necesitas: ${esc(reqText(it.u))}`,'lock');}

/* Saludo: da un saltito y mueve la mano (al tocarlo o al cambiarle algo) */
function avatarCheer(){const s=document.querySelector('#avStage svg.fb-anim');if(!s)return;s.classList.remove('wave');void s.getBoundingClientRect();s.classList.add('wave');setTimeout(()=>s.classList.remove('wave'),1300);}
document.addEventListener('click',e=>{const el=e.target.closest('[data-act="av-view"]');if(el){state.ui.avView=el.dataset.v;save();renderAvatar();return;}
 if(e.target.closest('#avStage'))avatarCheer();});
