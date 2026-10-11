/* Curva de niveles, logros, retos diarios y metas semanales */
'use strict';

/* ================= PROGRESO ================= */
const LV_TITLES=['Novato/a','Aprendiz','Constante','Concentrado/a','Imparable','Maestro/a del foco','Leyenda','Mítico/a','Épico/a','Legendario/a','Cadete estelar','Piloto','Navegante','Teniente','Capitán/a','Comandante','Almirante','Guardián/a estelar','Cazador/a de cometas','Señor/a de las nebulosas','Viajero/a interestelar','Forjador/a de estrellas','Supernova','Púlsar','Quásar','Titán/a','Coloso','Inmortal','Eterno/a','Leyenda galáctica'];
const NEED=L=>Math.round(100*Math.pow(L,1.6)/10)*10;
function levelInfo(xp){let L=1,acc=0;while(xp>=acc+NEED(L)){acc+=NEED(L);L++;}return {level:L,into:xp-acc,need:NEED(L),title:LV_TITLES[Math.min(L-1,LV_TITLES.length-1)]};}
function xpForLevel(lv){let acc=0;for(let L=1;L<lv;L++)acc+=NEED(L);return acc;}
const isActive=L=>!!L&&(L.min>0||L.tasks>0||L.cards>0||L.pomos>0);
const ACH=[
 {id:'primerPomo',name:'Primer bloque',desc:'Completa tu primer pomodoro',icon:'timer',xp:30,p:s=>[s.pomo.total,1]},
 {id:'pomo5',name:'Calentando motores',desc:'Completa 5 pomodoros',icon:'timer',xp:50,p:s=>[s.pomo.total,5]},
 {id:'pomo25',name:'Guardia completa',desc:'Completa 25 pomodoros',icon:'shield',xp:120,p:s=>[s.pomo.total,25]},
 {id:'min1000',name:'Mil minutos',desc:'Acumula 1000 minutos de foco',icon:'flame',xp:150,p:s=>[s.pomo.minutes,1000]},
 {id:'primeraTarea',name:'Primera tachada',desc:'Completa tu primera tarea',icon:'check',xp:20,p:s=>[s.counts.tasksDone,1]},
 {id:'tareas10',name:'Lista en llamas',desc:'Completa 10 tareas',icon:'check',xp:60,p:s=>[s.counts.tasksDone,10]},
 {id:'tareas50',name:'Máquina de tachar',desc:'Completa 50 tareas',icon:'trophy',xp:150,p:s=>[s.counts.tasksDone,50]},
 {id:'perfecto',name:'Día perfecto',desc:'Termina todas tus tareas de hoy (mínimo 3)',icon:'star',xp:60,p:s=>{const n=s.tasks.length,d=s.tasks.filter(t=>t.done).length;return [n>=3&&d===n?1:0,1];}},
 {id:'racha3',name:'En racha',desc:'Estudia 3 días seguidos',icon:'flame',xp:50,p:s=>[streakNow(),3]},
 {id:'racha7',name:'Semana redonda',desc:'Estudia 7 días seguidos',icon:'flame',xp:120,p:s=>[streakNow(),7]},
 {id:'sabio',name:'Coleccionista de técnicas',desc:'Aplica 15 técnicas de estudio',icon:'bulb',xp:80,p:s=>[Object.keys(s.tipsDone).length,15]},
 {id:'explorador',name:'Explorador/a',desc:'Aplica al menos una técnica de cada ámbito',icon:'globe',xp:60,p:s=>[AMB.filter(a=>Object.keys(s.tipsDone).some(k=>k.startsWith(a.id+'-'))).length,AMB.length]},
 {id:'tema1',name:'Primera vuelta',desc:'Cierra la vuelta de un tema en el Temario',icon:'layers',xp:40,p:s=>[s.counts.closes,1]},
 {id:'vueltas20',name:'Rodillo',desc:'Cierra 20 vueltas de temas',icon:'repeat',xp:120,p:s=>[s.counts.closes,20]},
 {id:'cartas50',name:'Memoria de elefante',desc:'Acierta 50 flashcards en repaso',icon:'cards',xp:80,p:s=>[s.counts.cardsOk,50]},
 {id:'errores10',name:'Aprender del fallo',desc:'Resuelve 10 errores del cuaderno',icon:'alert',xp:80,p:s=>[s.counts.errorsFixed,10]},
 {id:'meta1',name:'Semana cumplida',desc:'Completa una meta semanal',icon:'flag',xp:60,p:s=>[Math.min(s.counts.goalsDone,1),1]},
 {id:'ambiente',name:'Ambiente creado',desc:'Activa tu primer sonido',icon:'music',xp:15,p:s=>[s.soundsUsed?1:0,1]},
 {id:'dj',name:'DJ de biblioteca',desc:'Mezcla 3 sonidos a la vez',icon:'headphones',xp:30,p:s=>[Math.min(s.maxSounds,3),3]},
 {id:'retos',name:'Retador/a',desc:'Completa los 3 retos de un mismo día',icon:'target',xp:80,p:s=>[Math.min(s.counts.challengesDays,1),1]},
 {id:'rico',name:'Hucha llena',desc:'Gana 1000 monedas en total',icon:'coin',xp:100,p:s=>[s.coinsEarned,1000]},
 {id:'nivel5',name:'Imparable',desc:'Llega al nivel 5',icon:'star',xp:100,p:s=>[Math.min(levelInfo(s.xp).level,5),5]},
 {id:'nivel10',name:'Legendario/a',desc:'Llega al nivel 10',icon:'crown',xp:200,p:s=>[Math.min(levelInfo(s.xp).level,10),10]},
 {id:'nivel20',name:'Comandante',desc:'Llega al nivel 20',icon:'crown',xp:400,p:s=>[Math.min(levelInfo(s.xp).level,20),20]},
 {id:'nivel30',name:'Leyenda galáctica',desc:'Llega al nivel 30',icon:'crown',xp:800,p:s=>[Math.min(levelInfo(s.xp).level,30),30]}
];
const CH={pomos:[2,4],tasks:[3,5],tips:[1,2],minutes:[60,100]};
const CH_TXT={pomos:n=>`Completa ${n} pomodoros`,tasks:n=>`Termina ${n} tareas`,tips:n=>n===1?'Aplica una técnica nueva':`Aplica ${n} técnicas nuevas`,minutes:n=>`Suma ${n} minutos de foco`};
const CH_ICO={pomos:'timer',tasks:'check',tips:'bulb',minutes:'flame'};
function rng(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);h^=h>>>16;return (h>>>0)/4294967296;};}
function challenges(){const r=rng('retos-'+today());const t=Object.keys(CH);for(let i=t.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[t[i],t[j]]=[t[j],t[i]];}return t.slice(0,3).map(k=>({type:k,n:CH[k][r()<.5?0:1]}));}
const GOALS=[{k:'pomos',name:'Pomodoros',icon:'timer'},{k:'minutes',name:'Minutos de foco',icon:'flame'},{k:'tasks',name:'Tareas completadas',icon:'check'},{k:'cards',name:'Flashcards acertadas',icon:'cards'},{k:'days',name:'Días de estudio',icon:'calendar'}];
