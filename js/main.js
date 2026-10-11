/* Eventos y arranque de la aplicación */
'use strict';

/* ================= EVENTOS ================= */
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el||el.disabled)return;const act=el.dataset.act,id=el.dataset.id;
 const tp=()=>state.topics.find(x=>x.id===state.ui.tpSel);
 switch(act){
 case 'tab':setTab(el.dataset.tab);break;
 case 'go-shop':state.ui.cat='shop';setTab('avatar');break;
 case 'start-pomo':setTab('foco');if(!state.timer.running){if(state.timer.mode!=='work')setMode('work');startTimer();}break;
 case 'mode':setMode(el.dataset.mode);break;
 case 't-toggle':state.timer.running?pauseTimer():startTimer();break;
 case 't-reset':setMode(state.timer.mode);break;
 case 't-skip':{const t=state.timer;const n=t.mode==='work'?((t.cycle+1)%state.settings.every===0?'long':'short'):'work';if(t.mode==='work')t.cycle++;setMode(n);break;}
 case 'zen-open':openZen();break;
 case 'zen-exit':closeZen();break;
 case 'filter':state.ui.filter=el.dataset.f;save();renderTasks();break;
 case 'clear-done':{const n=state.tasks.filter(t=>t.done).length;if(!n){toast('No hay tareas completadas que borrar','broom');break;}const prev=state.tasks.slice();state.tasks=state.tasks.filter(t=>!t.done);save();renderTasks();toast(`${n} completada${n>1?'s':''} borrada${n>1?'s':''}`,'broom','',{label:'Deshacer',fn:()=>{state.tasks=prev;save();renderActive();}});break;}
 case 'task-toggle':toggleTask(el.closest('.task').dataset.id);break;
 case 'task-edit':editTask(el.closest('.task').dataset.id);break;
 case 'task-del':delTask(el.closest('.task').dataset.id);break;
 case 'task-focus':{const tid=el.closest('.task').dataset.id;state.timer.taskId=tid;if(!state.timer.running&&state.timer.mode!=='work')setMode('work');save();renderTasks();renderFocusSel();if(innerWidth<1000)$('#pomo').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});toast('Tarea en foco. Pulsa play cuando quieras.','target');break;}
 case 'tem-tab':state.ui.tem=id;save();renderTemario();break;
 case 'tem-scope':state.ui.temScope=id;save();renderTemas();break;
 case 'tp-sel':state.ui.tpSel=id;pendingDel=null;save();renderTemas();if(innerWidth<1000)$('#tpDetail').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});break;
 case 'tp-example':addExamples();break;
 case 'tp-v':{const x=tp();if(x){x.vuelta=Math.max(0,Math.min(30,x.vuelta+(+el.dataset.d)));save();renderTemas();}break;}
 case 'tp-dom':{const x=tp();if(x){x.dom=+el.dataset.d;save();renderTemas();}break;}
 case 'tp-close':{const x=tp();if(x)closeRound(x);break;}
 case 'tp-cards':{const x=tp();if(x){state.ui.tem='cartas';state.ui.fcTopic=x.id;$('#fcNewTopic').dataset.v=x.id;sess=null;save();renderTemario();}break;}
 case 'tp-errs':{const x=tp();if(x){state.ui.tem='errores';state.ui.erTp=x.id;state.ui.erFilter='pend';ers=null;save();renderTemario();}break;}
 case 'tp-del':{const x=tp();if(!x)break;if(pendingDel!==x.id){pendingDel=x.id;renderTemas();break;}pendingDel=null;state.topics=state.topics.filter(y=>y.id!==x.id);state.cards.forEach(c=>{if(c.tp===x.id)c.tp=null;});state.errors.forEach(er=>{if(er.tp===x.id)er.tp=null;});state.tasks=state.tasks.filter(tk=>!(tk.rev&&tk.rev.tp===x.id&&!tk.done));state.ui.tpSel=null;save();renderTemario();toast('Tema borrado. Sus tarjetas y errores pasan a "Sin tema".','trash');break;}
 case 'fc-start':startSession(el.dataset.mode);break;
 case 'fc-flip':{el.classList.add('on');const fa=$('#fcAns');if(fa)fa.hidden=false;break;}
 case 'fc-ans':answerCard(el.dataset.ok==='1');break;
 case 'fc-quit':if(sess&&sess.idx<sess.queue.length&&sess.xp)toast(`<b>+${sess.xp} XP</b> · <b>${coinTxt('+'+sess.coins)}</b> · Repaso de tarjetas`,'cards');sess=null;renderCardsView();break;
 case 'fc-del':{const i=state.cards.findIndex(c=>c.id===id);if(i<0)break;const [c]=state.cards.splice(i,1);save();renderTemario();toast('Tarjeta borrada','trash','',{label:'Deshacer',fn:()=>{state.cards.splice(i,0,c);save();renderActive();}});break;}
 case 'er-filter':state.ui.erFilter=el.dataset.f;save();renderErrors();break;
 case 'er-reason':state.ui.erReason=state.ui.erReason===el.dataset.r?'all':el.dataset.r;save();renderErrors();break;
 case 'er-start':{const rs=state.ui.erReason,tpf=state.ui.erTp;const q=state.errors.filter(e=>!e.fixed&&(rs==='all'||e.reason===rs)&&(tpf==='all'||e.tp===tpf)).map(e=>e.id);if(q.length){ers={queue:shuffle(q),idx:0,shown:false,fixed:0,xp:0,coins:0};renderErrors();}break;}
 case 'er-show':if(ers){ers.shown=true;renderErrors();}break;
 case 'er-res':{if(!ers)break;const er=state.errors.find(x=>x.id===ers.queue[ers.idx]);if(er){if(el.dataset.ok==='1'){if(fixError(er,true)){ers.xp+=3;ers.coins+=2;}ers.fixed++;}else er.fails++;}ers.idx++;ers.shown=false;if(ers.idx>=ers.queue.length&&ers.xp)toast(`<b>+${ers.xp} XP</b> · <b>${coinTxt('+'+ers.coins)}</b> · Repaso de errores`,'alert');afterAction();break;}
 case 'er-quit':ers=null;renderTemario();break;
 case 'er-fix':{const er=state.errors.find(x=>x.id===id);if(!er)break;if(er.fixed)er.fixed=false;else fixError(er,false);afterAction();break;}
 case 'er-card':{const er=state.errors.find(x=>x.id===id);if(!er)break;state.cards.push({id:uid(),tp:er.tp,q:er.q,a:er.a||'(Completa la respuesta)',box:1,due:today(),ok:0,ko:0,created:Date.now()});save();renderTemario();toast('Convertido en tarjeta. Aparecerá en tu repaso de hoy.','cards');break;}
 case 'er-del':{const i=state.errors.findIndex(x=>x.id===id);if(i<0)break;const [er]=state.errors.splice(i,1);save();renderTemario();toast('Error borrado','trash','',{label:'Deshacer',fn:()=>{state.errors.splice(i,0,er);save();renderActive();}});break;}
 case 'sound-toggle':A.on[id]?stopSound(id):startSound(id);afterAction();break;
 case 'preset':{const p=PRESETS[+el.dataset.i];Object.keys(A.on).forEach(stopSound);Object.assign(state.audio.vols,p.mix);Object.keys(p.mix).forEach(startSound);afterAction();toast(`Mezcla «${esc(p.name)}» sonando`,'music');break;}
 case 'stop-all':Object.keys(A.on).forEach(stopSound);renderSounds();renderHud();break;
 case 'amb':state.ui.amb=id;state.ui.sub=0;save();renderHabits();break;
 case 'sub':state.ui.sub=+el.dataset.i;save();renderHabits();break;
 case 'tip-toggle':toggleTip(id);break;
 case 'tip-task':{const T=tipById(id);addTask(T.tip.a,AMB_SCOPE[T.amb.id],'media',1);toast('Añadida a tus tareas de hoy','plus','',{label:'Ver',fn:()=>setTab('foco')});break;}
 case 'goto-tip':{const T=tipById(id);state.ui.amb=T.amb.id;state.ui.sub=T.si;setTab('habitos');break;}
 case 'cat':state.ui.cat=id;pendingBuy=null;save();renderAvatar();break;
 case 'item':clickItem(el.dataset.cat,id);break;
 case 'av-random':{for(const [c] of CATS){const opts=ITEMS[c].filter(isUnlocked);state.avatar[c]=opts[Math.floor(Math.random()*opts.length)].id;}save();renderHud();renderAvatar();break;}
 }});
document.addEventListener('input',e=>{const id=e.target.dataset&&e.target.dataset.vol;if(!id)return;state.audio.vols[id]=+e.target.value;const h=A.on[id];if(h)h.g.gain.setTargetAtTime(volOf(id)*SG(id),A.ctx.currentTime,.05);save();});
document.addEventListener('change',e=>{const el=e.target;
 if(el.id==='tdName'||el.id==='tdMat'){const x=state.topics.find(y=>y.id===state.ui.tpSel);if(!x)return;if(el.id==='tdName'){const v=el.value.trim();if(v)x.name=v.slice(0,80);}else x.mat=el.value.trim().slice(0,60);state.tasks.forEach(tk=>{if(tk.rev&&tk.rev.tp===x.id&&!tk.done)tk.text=`Repaso (+${tk.rev.n} d): ${x.name}`;});save();renderTemas();return;}
 if(el.dataset&&el.dataset.goal){const v=Math.max(0,Math.min(9999,parseInt(el.value,10)||0));state.goals[el.dataset.goal]=v;afterAction();return;}
 if(el.id==='fcTopic'){state.ui.fcTopic=el.value;sess=null;if(el.value!=='all')$('#fcNewTopic').dataset.v=el.value;save();renderCardsView();return;}
 if(el.id==='fcNewTopic'){el.dataset.v=el.value;return;}
 if(el.id==='erTpFilter'){state.ui.erTp=el.value;save();renderErrors();return;}
});
$('#focusSel').addEventListener('change',e=>{state.timer.taskId=e.target.value||null;save();renderTasks();});
['sWork','sShort','sLong','sEvery','sAuto','sChime'].forEach(i=>$('#'+i).addEventListener('change',onSetting));
$('#nameInput').addEventListener('input',e=>{state.name=e.target.value.trim().slice(0,24);save();});
$('#mClose').addEventListener('click',closeModal);
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(!$('#modal').hidden){closeModal();return;}if(!$('#zen').hidden){closeZen();return;}}
 const ae=document.activeElement;
 if(ae&&ae.id==='flip'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();ae.click();return;}
 if(e.code==='Space'&&(state.ui.tab==='foco'||!$('#zen').hidden)&&!/INPUT|TEXTAREA|SELECT|BUTTON/.test(ae.tagName)){e.preventDefault();state.timer.running?pauseTimer():startTimer();}});

/* ================= ARRANQUE ================= */
$('#brandMark').innerHTML=ico('bolt');
$('#btnCustom').innerHTML=`${ico('user')}Personalizar avatar`;
$('#btnStart').innerHTML=`${ico('play')}Empezar pomodoro`;
$('#tAdd').innerHTML=`${ico('plus')}Añadir`;
$('#tpAdd').innerHTML=`${ico('plus')}Añadir tema`;
$('#fcAdd').innerHTML=`${ico('plus')}Crear tarjeta`;
$('#erAdd').innerHTML=`${ico('plus')}Guardar error`;
$('#clearDone').innerHTML=`${ico('broom')}Borrar completadas`;
$('#zenBtn').innerHTML=`${ico('expand')}Modo foco a pantalla completa`;
$('#zenExit').innerHTML=`${ico('x')}Salir`;
$$('[data-act="t-reset"]').forEach(b=>b.innerHTML=ico('reset'));
$$('[data-act="t-skip"]').forEach(b=>b.innerHTML=ico('skip'));
const words=['Concentra','Repasa','Descansa','Repite','Sube de nivel','Un bloque más','Constancia'];
$('#marquee').innerHTML=words.map(w=>`<span>${w}</span>${ico('star')}`).join('');
initSettings();initSounds();
(function restore(){const t=state.timer;if(t.running&&t.endAt&&Date.now()>=t.endAt){completeTimer(true);}else if(!t.running&&(t.remaining==null||t.remaining>durOf(t.mode)))t.remaining=durOf(t.mode);})();
let start=state.ui.tab;const h=(location.hash||'').slice(1);if(TABS.some(x=>x[0]===h))start=h;
checkChallenges();checkGoals();checkAch();pendingLevel=null;save();
renderHud();setTab(start,true);
