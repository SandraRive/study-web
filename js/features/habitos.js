/* Pestaña Hábitos */
'use strict';

/* ================= HÁBITOS ================= */
function renderHabits(){const a=AMB.find(x=>x.id===state.ui.amb)||AMB[0];let si=state.ui.sub;if(!a.subs[si])si=state.ui.sub=0;
 $('#ambTiles').innerHTML=AMB.map(x=>{const tot=x.subs.reduce((n,s)=>n+s.tips.length,0);const dn=Object.keys(state.tipsDone).filter(k=>k.startsWith(x.id+'-')).length;return `<button class="amb" style="${cvar(x.color)}" data-act="amb" data-id="${x.id}" aria-pressed="${x.id===a.id}"><span class="big-ico">${ico(x.icon)}</span><span class="amb-name">${x.name}</span><span class="amb-tag">${x.tagline}</span><span class="amb-prog"><span class="mini-bar"><i style="width:${dn/tot*100}%"></i></span>${dn}/${tot}</span></button>`;}).join('');
 $('#ambHead').setAttribute('style',cvar(a.color));
 $('#ambHead').innerHTML=`<span class="big-ico">${ico(a.icon)}</span><div style="min-width:0"><div class="eyebrow">Ámbito · ${a.subs.length} apartados</div><h3 class="h2" style="font-size:clamp(24px,3.4vw,34px)">${a.name}</h3></div>`;
 $('#subPills').innerHTML=a.subs.map((s,i)=>`<button class="pill cnt" data-act="sub" data-i="${i}" aria-pressed="${i===si}">${ico(s.icon)}${s.name}<span class="pill-count">${s.tips.filter((t,ti)=>state.tipsDone[tipId(a.id,i,ti)]).length}/${s.tips.length}</span></button>`).join('');
 $('#tipGrid').innerHTML=a.subs[si].tips.map((t,ti)=>{const id=tipId(a.id,si,ti);const d=!!state.tipsDone[id];return `<article class="tip ${d?'done':''}"><span class="eyebrow">${esc(a.subs[si].name)}</span><h3>${esc(t.t)}</h3><p>${esc(t.d)}</p><div class="try"><b>Pruébalo</b>${esc(t.a)}</div><div class="tip-acts"><button class="btn sm ${d?'mint':'pink'}" data-act="tip-toggle" data-id="${id}" aria-pressed="${d}">${ico(d?'check':'sparkle')}${d?'Aplicada':state.tipsXp[id]?'Lo aplico':'Lo aplico · +5 XP'}</button><button class="btn sm" data-act="tip-task" data-id="${id}">${ico('plus')}A mis tareas</button></div></article>`;}).join('');}
function toggleTip(id){if(state.tipsDone[id]){delete state.tipsDone[id];}else{state.tipsDone[id]=today();if(!state.tipsXp[id]){state.tipsXp[id]=1;state.day.tips++;grantXP(5,'Técnica aplicada',2);}}afterAction();}
