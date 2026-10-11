/* XP, monedas, logros, retos y metas */
'use strict';

/* ================= XP, MONEDAS, LOGROS, RETOS, METAS ================= */
let pendingLevel=null;
function grantXP(n,reason,coins,quiet){const before=levelInfo(state.xp).level;state.xp+=n;if(coins){state.coins+=coins;state.coinsEarned+=coins;}if(!quiet)toast(`<b>+${n} XP</b>${coins?` · <b>${coinTxt('+'+coins)}</b>`:''} · ${esc(reason)}`,'sparkle');const after=levelInfo(state.xp).level;if(after>before)pendingLevel={from:pendingLevel?pendingLevel.from:before,to:after};}
function isUnlocked(it){const u=it.u;if(!u)return true;if(u.lvl)return levelInfo(state.xp).level>=u.lvl;if(u.ach)return !!state.ach[u.ach];if(u.coins)return !!state.owned[it.id];return true;}
function itemsWhere(fn){const out=[];for(const c in ITEMS)for(const it of ITEMS[c])if(it.u&&fn(it.u))out.push(it);return out;}
function achName(id){const a=ACH.find(x=>x.id===id);return a?a.name:id;}
function reqText(u){return u.lvl?`Nivel ${u.lvl}`:u.coins?`${u.coins} monedas`:`Logro: ${achName(u.ach)}`;}
function checkAch(){let ch=true;while(ch){ch=false;for(const a of ACH){if(state.ach[a.id])continue;const [c,t]=a.p(state);if(c>=t){state.ach[a.id]=Date.now();ch=true;const un=itemsWhere(u=>u.ach===a.id);toast(`<b>Logro: ${esc(a.name)}</b>${un.length?'<br>Desbloqueas: '+un.map(i=>esc(i.name)).join(', '):''}`,'trophy','ach');grantXP(a.xp,'Logro conseguido',20);confetti(70);}}}}
function checkChallenges(){const cs=challenges();cs.forEach((c,i)=>{if(!state.day.claimed[i]&&state.day[c.type]>=c.n){state.day.claimed[i]=true;grantXP(40,'Reto: '+CH_TXT[c.type](c.n),15);}});if(!state.day.allDone&&cs.every((c,i)=>state.day.claimed[i])){state.day.allDone=true;state.counts.challengesDays++;}}
function weekTotals(){const ws=weekStart(today());const o={pomos:0,minutes:0,tasks:0,cards:0,days:0};for(let i=0;i<7;i++){const L=state.log[addDays(ws,i)];if(!L)continue;o.pomos+=L.pomos;o.minutes+=L.min;o.tasks+=L.tasks;o.cards+=L.cards;if(isActive(L))o.days++;}return o;}
function checkGoals(){const ws=weekStart(today());const cl=state.goalsClaimed[ws]||(state.goalsClaimed[ws]={});const tot=weekTotals();for(const g of GOALS){const tg=state.goals[g.k];if(!tg||cl[g.k])continue;if(tot[g.k]>=tg){cl[g.k]=true;state.counts.goalsDone++;toast(`<b>¡Meta semanal cumplida!</b> ${esc(g.name)}`,'flag','ach');grantXP(60,'Meta semanal',25);confetti(90);}}}
function afterAction(){ensureDay();checkChallenges();checkGoals();checkAch();save();if(pendingLevel){const p=pendingLevel;pendingLevel=null;showLevelUp(p);}renderHud();renderActive();}
