/* Pestaña Inicio */
'use strict';

/* ================= INICIO ================= */
function renderHome(){
 const L=levelInfo(state.xp);
 $('#homeAvatar').innerHTML=avatarSVG(state.avatar);
 const ni=$('#nameInput');if(document.activeElement!==ni)ni.value=state.name;
 $('#hLvl').textContent=L.level;$('#hLvlS').textContent=L.level;$('#hTitle').textContent=L.title;$('#hCoins').innerHTML=coinTxt(state.coins);
 $('#hXpFill').style.width=(L.into/L.need*100)+'%';$('#hXpBar').setAttribute('aria-valuenow',Math.round(L.into/L.need*100));
 $('#hXpTxt').textContent=`${L.into} / ${L.need} XP para el nivel ${L.level+1} · ${state.xp} XP en total`;
 const done=state.tasks.filter(t=>t.done).length;
 const st=[['Racha','flame',streakNow(),streakNow()===1?'día':'días','orange'],['Pomodoros hoy','timer',state.day.pomos,'','pink'],['Foco hoy','target',state.day.minutes,'min','mint'],['Tareas','check',done,'/ '+state.tasks.length,'cobalt']];
 $('#stats').innerHTML=st.map(([l,i,v,u,c])=>`<div class="stat" style="${cvar(c)}"><div class="stat-top">${l}${ico(i)}</div><div class="stat-num">${v}<small>${u}</small></div></div>`).join('');
 const cs=challenges();const got=cs.filter((c,i)=>state.day.claimed[i]).length;
 $('#chTitle').innerHTML=`${ico('target')}Retos de hoy · ${got}/3`;
 $('#chList').innerHTML=cs.map((c,i)=>{const v=Math.min(state.day[c.type],c.n),ok=!!state.day.claimed[i];return `<li class="ch ${ok?'ok':''}"><span class="ch-ico">${ico(ok?'check':CH_ICO[c.type])}</span><div style="min-width:0"><div class="ch-txt">${CH_TXT[c.type](c.n)}</div><div class="bar"><i style="width:${v/c.n*100}%"></i></div></div><span class="ch-n">${v}/${c.n}</span></li>`;}).join('');
 const wt=weekTotals();const gs=GOALS.filter(g=>state.goals[g.k]>0);
 $('#wgTitle').innerHTML=`${ico('flag')}Metas de la semana`;
 $('#wgList').innerHTML=gs.length?gs.map(g=>{const tg=state.goals[g.k],v=Math.min(wt[g.k],tg);return `<div class="mg"><span>${g.name}</span><span>${wt[g.k]}/${tg}</span><div class="bar"><i style="width:${v/tg*100}%"></i></div></div>`;}).join(''):'<div class="empty"><strong>Sin metas activas</strong>Actívalas en Progreso.</div>';
 const r=rng('tip-'+today());const tid=ALL_TIPS[Math.floor(r()*ALL_TIPS.length)];const T=tipById(tid);const applied=!!state.tipsDone[tid];
 $('#tipDay').innerHTML=`<div class="eyebrow">Técnica del día · ${esc(T.amb.name)} · ${esc(T.sub.name)}</div><h3>${esc(T.tip.t)}</h3><p>${esc(T.tip.d)}</p><div class="try">${esc(T.tip.a)}</div><div class="acts"><button class="btn sun" data-act="tip-toggle" data-id="${tid}">${ico(applied?'check':'sparkle')}${applied?'Aplicada':'Lo aplico · +5 XP'}</button><button class="btn" data-act="goto-tip" data-id="${tid}">Ver su ámbito</button></div>`;
 $('#unlTitle').innerHTML=`${ico('gift')}Próximos desbloqueos`;
 const locked=[];for(const [cat] of CATS)for(const it of ITEMS[cat]){if(isUnlocked(it))continue;let c,t;if(it.u.lvl){c=state.xp;t=xpForLevel(it.u.lvl);}else if(it.u.coins){c=state.coins;t=it.u.coins;}else{[c,t]=ACH.find(a=>a.id===it.u.ach).p(state);}locked.push({it,cat,ratio:Math.max(0,Math.min(c/t,0.999))});}
 locked.sort((a,b)=>b.ratio-a.ratio);
 $('#unlList').innerHTML=locked.length?locked.slice(0,4).map(x=>{const cfg=Object.assign({},state.avatar,{[x.cat]:x.it.id});return `<div class="unl"><span class="unl-th">${avatarSVG(cfg)}</span><div style="min-width:0"><div class="unl-name">${esc(x.it.name)}</div><div class="unl-req"><span>${esc(reqText(x.it.u))}</span><span>${Math.round(x.ratio*100)}%</span></div><div class="bar"><i style="width:${x.ratio*100}%"></i></div></div></div>`;}).join(''):'<div class="empty"><strong>Colección completa</strong>Has desbloqueado todos los objetos.</div>';
 renderExam();
}
