/* Estado de la aplicación, guardado en localStorage y cambio de día */
'use strict';

/* ================= ESTADO ================= */
const KEY='mision-estudio-v1';
const DEFAULT={name:'',xp:0,coins:0,coinsEarned:0,owned:{},avatar:{base:'gato',color:'pink',hat:'lana',glasses:'none',extra:'none',bg:'liso'},tasks:[],seeded:false,
 pomo:{total:0,minutes:0},tipsDone:{},tipsXp:{},ach:{},streak:{last:null,count:0},
 day:{date:null,pomos:0,tasks:0,tips:0,minutes:0,claimed:{},allDone:false},
 counts:{tasksDone:0,challengesDays:0,closes:0,cardsOk:0,errorsFixed:0,goalsDone:0},
 topics:[],cards:[],errors:[],questions:[],tests:[],simRun:null,simLast:null,simCfg:{src:'all',tp:'all',n:20,min:20,pen:3},plan:{},exam:{name:'',date:'',vueltas:3,scope:'opo'},log:{},goals:{pomos:20,minutes:600,tasks:15,cards:100,days:5},goalsClaimed:{},
 settings:{work:25,short:5,long:15,every:4,auto:false,chime:true,notify:false},lastBackup:null,
 timer:{mode:'work',remaining:1500,endAt:null,running:false,cycle:0,taskId:null},
 ui:{tab:'inicio',amb:'base',sub:0,filter:'all',cat:'base',baseSet:'clasicos',tem:'temas',temScope:'all',tpSel:null,fcTopic:'all',erFilter:'pend',erReason:'all',erTp:'all',simView:'setup',qTp:'all',qTopicSel:'',planWeek:null},
 audio:{master:.8,vols:{lofi:.7,lluvia:.6,fuego:.6,olas:.6,blanco:.5,rosa:.5,marron:.6}},
 soundsUsed:false,maxSounds:0};
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null');}catch(e){}const d=JSON.parse(JSON.stringify(DEFAULT));if(s&&typeof s==='object'){for(const k in d){if(s[k]===undefined)continue;if(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))d[k]=Object.assign(d[k],s[k]);else d[k]=s[k];}}return d;}
let state=load();
let SAVE_LOCK=false;
function save(){if(SAVE_LOCK)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function streakNow(){const s=state.streak;return (s.last===today()||s.last===yesterday())?s.count:0;}
function bumpStreak(){const t=today(),s=state.streak;if(s.last===t)return;s.count=(s.last===yesterday())?s.count+1:1;s.last=t;}
function logDay(){const t=today();if(!state.log[t])state.log[t]={min:0,pomos:0,tasks:0,cards:0,sc:{}};return state.log[t];}
function syncReviews(){const t=today();for(const tp of state.topics){for(const r of tp.reviews){if(r.done||r.skip||r.task||r.due>t)continue;const id=uid();state.tasks.push({id,text:`Repaso (+${r.n} d): ${tp.name}`,scope:tp.scope,prio:'alta',est:1,pomos:0,done:false,date:t,created:Date.now(),xp:false,rev:{tp:tp.id,n:r.n}});r.task=id;}}}
function ensureDay(){const t=today();if(state.day.date!==t){state.day={date:t,pomos:0,tasks:0,tips:0,minutes:0,claimed:{},allDone:false};state.tasks=state.tasks.filter(x=>!(x.done&&x.date<t));}syncReviews();if(typeof syncPlan==='function')syncPlan();}
if(!state.seeded){state.seeded=true;const t=today();state.tasks=[
 {id:uid(),text:'Ejemplo: repasar el tema 3 con la hoja en blanco',scope:'opo',prio:'alta',est:2,pomos:0,done:false,date:t,created:Date.now(),xp:false},
 {id:uid(),text:'Ejemplo: 15 minutos de tarjetas de vocabulario',scope:'idi',prio:'media',est:1,pomos:0,done:false,date:t,created:Date.now()+1,xp:false},
 {id:uid(),text:'Ejemplo: 3 ejercicios del examen del año pasado',scope:'uni',prio:'baja',est:2,pomos:0,done:false,date:t,created:Date.now()+2,xp:false}];}
if(state.day.date===today()&&!state.log[today()]&&(state.day.minutes||state.day.tasks||state.day.pomos)){const L=logDay();L.min=state.day.minutes;L.pomos=state.day.pomos;L.tasks=state.day.tasks;if(L.min)L.sc.otro=L.min;}
if(state.ui.tab==='logros')state.ui.tab='progreso';
ensureDay();
