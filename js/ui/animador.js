/* Motor de animación del avatar de cuerpo entero.
   Mueve cada articulación del esqueleto (ver RIG en js/data/cuerpo.js) 60 veces por segundo,
   como en un videojuego: reposo con respiración, ciclo de carrera, golpe, saltos y celebración. */
'use strict';

const RIG_KEYS=Object.keys(POSE_IDLE);
const rigReduce=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const rLerp=(a,b,t)=>a+(b-a)*t;
const rClamp=t=>t<0?0:t>1?1:t;
const R_EASE={lin:t=>t,io:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,out:t=>1-Math.pow(1-t,3),in:t=>t*t*t,
 back:t=>{const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);}};
function mixPose(a,b,t){const o={};for(const k of RIG_KEYS){const x=a[k]??POSE_IDLE[k],y=b[k]??POSE_IDLE[k];o[k]=(k==='dL'||k==='dR')?(t<.5?x:y):rLerp(x,y,t);}return o;}
const rP=o=>Object.assign({},POSE_IDLE,o);

/* ---- Poses clave ---- */
const POSES={
 ready:rP({turn:1,y:7,sx:1.05,sy:.93,torso:-12,head:-6,aR1:150,aR2:35,aL1:-35,aL2:-70,lR1:-22,lR2:32,lL1:22,lL2:28,fR:-8,fL:8,dL:1,dR:1}),
 strike:rP({turn:1,y:9,sx:1.03,sy:.96,torso:22,head:8,aR1:-98,aR2:-8,aL1:45,aL2:-35,lR1:-48,lR2:22,lL1:38,lL2:38,fR:26,fL:-60,dL:1,dR:1,cape:30}),
 follow:rP({turn:1,y:8,torso:26,head:10,aR1:-60,aR2:-6,aL1:40,aL2:-40,lR1:-44,lR2:24,lL1:36,lL2:36,fR:20,fL:-58,dL:1,dR:1,cape:25}),
 air:rP({turn:1,y:-2,sx:.96,sy:1.05,torso:-10,head:-6,aR1:-35,aR2:-40,aL1:30,aL2:-50,lR1:-28,lR2:70,lL1:8,lL2:78,fR:-30,fL:-60,dL:1,dR:1,cape:-10}),
 land:rP({turn:1,y:8,sx:1.09,sy:.89,torso:8,head:4,aR1:-25,aR2:-20,aL1:25,aL2:-20,lR1:-14,lR2:30,lL1:14,lL2:30,fR:-12,fL:-40,dL:1,dR:1}),
 victory:rP({y:-2,sx:.97,sy:1.04,torso:-4,head:-8,aR1:-140,aR2:-40,aL1:28,aL2:-95,lR1:-6,lL1:8,lL2:12}),
 miss:rP({turn:1,y:11,rot:5,torso:34,head:14,aR1:-70,aR2:-10,aL1:55,aL2:-20,lR1:-58,lR2:12,lL1:44,lL2:52,fR:30,fL:-70,dL:1,dR:1,cape:35}),
 doh:rP({torso:4,head:12,aR1:-160,aR2:-80,aL1:12,aL2:-10,lR1:-3,lL1:3}),
 wave:rP({aR1:-150,aR2:-20,head:6,torso:-2})};

/* ---- Bucles ---- */
function poseIdle(t){const s=Math.sin(t*2*Math.PI/3.2),h=Math.sin(t*2*Math.PI/4.6);
 return rP({y:s*1.2,sy:1+.013*s,sx:1-.007*s,torso:.8*h,head:2*h,aL1:9+2.5*s,aL2:-8-4*s,aR1:-9-2.5*s,aR2:8+4*s,cape:2*s});}
function poseRun(t,period){period=period||.36;const f=t/period*2*Math.PI,sf=Math.sin(f),cf=Math.cos(f);
 const leg=(ph)=>{const s=Math.sin(ph),c=Math.cos(ph);const th=-40*s,sn=10+68*Math.pow(Math.max(0,c),1.1);return [th,sn,-(th+sn)*.75+12*Math.max(0,c)];};
 const [rT,rS,rF]=leg(f),[lT,lS,lF]=leg(f+Math.PI);
 return rP({turn:1,y:4-9*Math.abs(sf),sy:1+.03*Math.abs(sf),sx:1-.02*Math.abs(sf),torso:13,head:-5+2*Math.sin(2*f),
  aL1:4-40*sf,aL2:-70+12*sf,aR1:-4+40*sf,aR2:-70-12*sf,lR1:rT,lR2:rS,fR:rF,lL1:lT,lL2:lS,fL:lF,dL:1,dR:1,cape:22+8*Math.sin(2*f)});}
/* Pasos de la carrera (para soltar polvo justo cuando el pie toca el suelo) */
function runStep(t,period){return Math.floor(t/((period||.36)/2));}

/* ---- Clips: funciones de tiempo (ms) → {pose, wx (desplazamiento en % del ancho del héroe), done} ---- */
function rSeq(t,keys){/* keys: [[t0,pose|fn,ease]] → mezcla entre la clave anterior y la siguiente */
 for(let i=1;i<keys.length;i++){const [t1,b,e]=keys[i];if(t<=t1){const [t0,a]=keys[i-1];const u=(R_EASE[e||'io'])(rClamp((t-t0)/(t1-t0)));
   const pa=typeof a==='function'?a(t):a,pb=typeof b==='function'?b(t):b;return mixPose(pa,pb,u);}}
 const l=keys[keys.length-1][1];return typeof l==='function'?l(t):l;}
const idleF=t=>poseIdle(t/1000);
function rTrack(t,keys){for(let i=1;i<keys.length;i++){const [t1,v,e]=keys[i];if(t<=t1){const [t0,a]=keys[i-1];return rLerp(a,v,(R_EASE[e||'io'])(rClamp((t-t0)/(t1-t0))));}}return keys[keys.length-1][1];}
const rArc=(t,t0,t1,h)=>{const u=rClamp((t-t0)/(t1-t0));return -h*4*u*(1-u);};

const CLIPS={
 /* Ataque completo: carrera, impulso, golpe, parón de impacto, salto atrás y celebración */
 attack(o){const crit=o.crit,miss=o.miss,won=o.won;const runF=t=>poseRun(t/1000);
  const T={run:430,ready:540,hit:610,stop:miss?610:720,fol:miss?760:800,back:1060,land:1140,vic:1560};
  return {impact:T.hit-30,dur:miss?1900:won?2100:1800,f(t){let pose,wx;
   if(t<T.run){pose=runF(t);wx=rTrack(t,[[0,-150],[T.run,38,'out']]);}
   else if(t<T.ready){pose=rSeq(t,[[T.run,runF],[T.ready,POSES.ready,'out']]);wx=rTrack(t,[[T.run,38],[T.ready,33,'out']]);}
   else if(t<T.hit){pose=rSeq(t,[[T.ready,POSES.ready],[T.hit,POSES.strike,'in']]);wx=rTrack(t,[[T.ready,33],[T.hit,miss?88:74,'in']]);
    if(crit)pose.spin=rLerp(0,360,R_EASE.io(rClamp((t-T.ready)/(T.hit-T.ready))));}
   else if(t<T.stop){pose=rP(POSES.strike);wx=74+(Math.random()-.5)*2.4;}
   else if(miss&&t<1200){pose=rSeq(t,[[T.stop,POSES.strike],[T.fol,POSES.miss,'out'],[1000,POSES.miss],[1200,POSES.doh,'io']]);wx=rTrack(t,[[T.stop,88],[T.fol,100,'out'],[1200,96]]);}
   else if(miss){pose=rSeq(t,[[1200,POSES.doh],[1500,POSES.air,'out'],[1640,POSES.land,'in'],[1900,idleF,'io']]);
    if(t<1200+300)pose.head+=Math.sin((t-1200)/40)*7;wx=rTrack(t,[[1200,96],[1640,0,'io']]);pose.y+=rArc(t,1460,1640,16);}
   else if(t<T.fol){pose=rSeq(t,[[T.stop,POSES.strike],[T.fol,POSES.follow,'out']]);wx=rTrack(t,[[T.stop,74],[T.fol,71]]);}
   else if(t<T.land){pose=rSeq(t,[[T.fol,POSES.follow],[T.fol+90,POSES.air,'out'],[T.back,POSES.air],[T.land,POSES.land,'in']]);
    wx=rTrack(t,[[T.fol,71],[T.back,0,'io']]);pose.y+=rArc(t,T.fol,T.back,34);}
   else{const vh=won?28:18;pose=rSeq(t,[[T.land,POSES.land],[T.land+110,POSES.victory,'back'],[T.vic,POSES.victory],[T.vic+300,idleF,'io']]);
    pose.y+=rArc(t,T.land+40,T.land+380,vh);if(won)pose.y+=rArc(t,T.land+420,T.land+700,vh*.7);
    if(t<T.vic)pose.aR2+=Math.sin((t-T.land)/55)*10;wx=0;}
   return {pose,wx};}};},
 /* Golpe rápido cuando encadenas varios (ya está delante del jefe) */
 quick(o){const miss=o.miss;return {impact:150,dur:720,f(t){let pose,wx;
   if(t<110){pose=rSeq(t,[[0,idleF],[110,POSES.ready,'out']]);wx=rTrack(t,[[0,0],[110,-6]]);}
   else if(t<180){pose=rSeq(t,[[110,POSES.ready],[180,POSES.strike,'in']]);wx=rTrack(t,[[110,-6],[180,miss?84:68,'in']]);}
   else if(t<250){pose=rP(POSES.strike);wx=(miss?84:68)+(Math.random()-.5)*2;}
   else{pose=rSeq(t,[[250,POSES.strike],[340,POSES.air,'out'],[520,POSES.land,'in'],[720,idleF]]);wx=rTrack(t,[[250,miss?84:68],[520,0,'io']]);pose.y+=rArc(t,250,520,26);}
   return {pose,wx};}};},
 /* Para la pantalla de Avatar */
 wave(){return {dur:1500,f(t){const pose=rSeq(t,[[0,idleF],[220,POSES.wave,'back'],[1200,POSES.wave],[1500,idleF]]);
   if(t>200&&t<1250)pose.aR2+=Math.sin((t-200)/90)*28;pose.y+=rArc(t,0,260,8);return {pose,wx:0};}};},
 run(){return {dur:2600,f(t){const pose=t<2300?poseRun(t/1000,.34):rSeq(t,[[2300,poseRun(2.3,.34)],[2600,idleF,'out']]);if(t<200)Object.assign(pose,mixPose(poseIdle(t/1000),pose,t/200));return {pose,wx:0};}};},
 hit(){return {impact:330,dur:1250,f(t){const pose=rSeq(t,[[0,idleF],[240,POSES.ready,'out'],[330,POSES.strike,'in'],[470,POSES.strike],[620,POSES.follow,'out'],[900,POSES.land,'io'],[1250,idleF,'io']]);
   if(t>330&&t<470)pose.x+=(Math.random()-.5)*3;return {pose,wx:0};}};},
 victory(){return {dur:1700,f(t){const pose=rSeq(t,[[0,idleF],[160,POSES.land,'out'],[300,POSES.victory,'back'],[1350,POSES.victory],[1700,idleF,'io']]);
   pose.y+=rArc(t,200,560,30)+rArc(t,640,940,20);if(t>300&&t<1350)pose.aR2+=Math.sin((t-300)/60)*12;return {pose,wx:0};}};}};

/* Gira la cara de 3/4: localiza los rasgos (ojos, boca, nariz, mofletes…) por su tamaño y posición
   y los envuelve en grupos que el animador desplaza hacia donde mira. El contorno de la cabeza no se mueve. */
const TURN_C=[100,108];
function rigPrepFace(svg){const base=svg.querySelector('.hd-base');if(!base||base.dataset.prep)return;base.dataset.prep='1';
 for(const el of [...base.children]){let bb;try{bb=el.getBBox();}catch(e){continue;}
  const cx=bb.x+bb.width/2,cy=bb.y+bb.height/2;
  if(bb.width<62&&bb.height<52&&cx>58&&cx<142&&cy>78&&cy<162){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('data-turn','1');el.replaceWith(g);g.appendChild(el);}}}
function rigTurnTf(kind,t){const dx=(kind==='hat'?4:14)*t,s=kind==='hat'?1:1-.2*t;return `translate(${(TURN_C[0]+dx).toFixed(2)} ${TURN_C[1]}) scale(${s.toFixed(3)} 1) translate(${-TURN_C[0]} ${-TURN_C[1]})`;}
/* El brazo del fondo va detrás del cuerpo cuando corre o ataca (vista de 3/4) y delante en reposo */
function rigLayer(R,back){if(R.back===back)return;R.back=back;const a=R.els.aL1[0];if(!a)return;const g=a.parentNode;
 if(back){const first=g.querySelector(':scope > :not([data-j="cape"])');g.insertBefore(a,first);}else{const r=R.els.aR1[0];g.insertBefore(a,r);}}
/* ---- Controlador: une un <svg> del avatar con el bucle de animación ---- */
const rigLive=new Set();let rigRaf=0;
function rigAttach(svg,o){if(!svg||!svg.querySelector('[data-j="root"]'))return null;o=o||{};
 const els={};for(const k of ['root','torso','head','cape','aL1','aL2','aR1','aR2','lL1','lL2','lR1','lR2','fL','fR'])els[k]=svg.querySelectorAll(`[data-j="${k}"]`);
 const R={svg,els,shadow:svg.querySelector('[data-j="shadow"]'),host:o.host||null,t0:performance.now(),clip:null,clipT0:0,onStep:o.onStep||null,lastStep:-1,onImpact:null,impactDone:false,
  play(name,opts,cb){const c=CLIPS[name]&&CLIPS[name](opts||{});if(!c)return;this.clip=c;this.clipName=name;rigLayer(this,name==='run'||name==='attack'||name==='quick');this.clipT0=performance.now();this.cb=cb||null;this.impactDone=false;this.lastStep=-1;this.svg.classList.add('rig-busy');},
  stop(){rigLive.delete(this);}};
 R.turnEls=null;R.lastTurn=-1;
 svg.classList.add('rig-live');rigLive.add(R);
 if(rigReduce()){rigApply(R,POSE_IDLE,0);return R;}
 if(!rigRaf)rigRaf=requestAnimationFrame(rigLoop);return R;}
function rigApply(R,pose,wx){
 if(R.lastTurn!==Math.round(pose.turn*100)){R.lastTurn=Math.round(pose.turn*100);if(!R.turnEls){rigPrepFace(R.svg);R.turnEls=[...R.svg.querySelectorAll('[data-turn]')];}
  for(const el of R.turnEls)el.setAttribute('transform',pose.turn>.005?rigTurnTf(el.dataset.turn,pose.turn):'');}for(const k in R.els){const tf=rigTf(k,pose);for(const el of R.els[k])el.setAttribute('transform',tf);}
 if(R.shadow){const lift=Math.max(0,-pose.y);const s=Math.max(.45,1-lift/60);R.shadow.setAttribute('transform',`translate(${(100*(1-s)+pose.x).toFixed(1)} ${(286*(1-s)).toFixed(1)}) scale(${s.toFixed(3)})`);R.shadow.setAttribute('opacity',(.3*s).toFixed(2));}
 if(R.host)R.host.style.transform=`translateX(${wx.toFixed(2)}%)`;}
function rigLoop(now){rigRaf=0;
 for(const R of rigLive){if(!R.svg.isConnected){rigLive.delete(R);continue;}
  let pose,wx=0;
  if(R.clip){const t=now-R.clipT0;
   if(t>=R.clip.dur){R.clip=null;rigLayer(R,false);R.svg.classList.remove('rig-busy');const cb=R.cb;R.cb=null;if(cb)cb();R.t0=now;pose=poseIdle(0);}
   else{const r=R.clip.f(t);pose=r.pose;wx=r.wx||0;
    if(R.clip.impact!=null&&!R.impactDone&&t>=R.clip.impact){R.impactDone=true;if(R.onImpact)R.onImpact(R.clipName);}
    if(R.onStep&&(R.clipName==='run'||(R.clipName==='attack'&&t<430))){const st=runStep(t/1000,R.clipName==='run'?.34:.36);if(st!==R.lastStep){R.lastStep=st;R.onStep(st%2?'L':'R');}}}}
  else pose=poseIdle((now-R.t0)/1000);
  rigApply(R,pose,wx);}
 if(rigLive.size)rigRaf=requestAnimationFrame(rigLoop);}
