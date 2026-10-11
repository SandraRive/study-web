/* Motor de sonido: ruidos, ambientes y lofi */
'use strict';

/* ================= AUDIO ================= */
const A={ctx:null,master:null,buf:{},on:{}};
function ac(){try{if(!A.ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;A.ctx=new C();A.master=A.ctx.createGain();A.master.gain.value=state.audio.master;A.master.connect(A.ctx.destination);}if(A.ctx.state==='suspended')A.ctx.resume();return A.ctx;}catch(e){return null;}}
function genNoise(type,n){const d=new Float32Array(n);let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0,last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(type==='white')d[i]=w*.5;else if(type==='pink'){b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926;}else if(type==='brown'){last=(last+.02*w)/1.02;d[i]=last*3.5;}else{d[i]=Math.random()<.0007?(Math.random()*2-1)*.8:w*.006;}}return d;}
/* Búfer de 10 s en estéreo con bucle sin costura: el final enlaza con el principio mediante un fundido de potencia constante */
function getBuf(type){if(A.buf[type])return A.buf[type];const ctx=A.ctx,sr=ctx.sampleRate;const ch=type==='crackle'?1:2;const L=Math.floor(sr*(type==='crackle'?6:10)),F=Math.floor(sr*1.5);const b=ctx.createBuffer(ch,L,sr);
 for(let c=0;c<ch;c++){const raw=genNoise(type,L+F);const d=b.getChannelData(c);d.set(raw.subarray(0,L));for(let i=0;i<F;i++){const x=i/F*Math.PI/2;d[i]=raw[i]*Math.sin(x)+raw[L+i]*Math.cos(x);}}
 A.buf[type]=b;return b;}
function src(type,off){const s=A.ctx.createBufferSource();s.buffer=getBuf(type);s.loop=true;s.start(0,off!=null?off:Math.random()*s.buffer.duration);return s;}
function lookahead(fn){const ctx=A.ctx;let next=ctx.currentTime+.05;const tick=()=>{const la=document.hidden?2.5:.35;let guard=0;while(next<ctx.currentTime+la&&guard++<400)next=fn(next);};tick();const iv=setInterval(tick,80);return ()=>clearInterval(iv);}
function panner(v){const ctx=A.ctx;if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=v;return p;}return ctx.createGain();}
function filt(type,f,q){const b=A.ctx.createBiquadFilter();b.type=type;b.frequency.value=f;if(q!=null)b.Q.value=q;return b;}
const mtof=m=>440*Math.pow(2,(m-69)/12);
function startLofi(out){const ctx=A.ctx;const bus=ctx.createGain();bus.gain.value=.9;const lp=filt('lowpass',2600,.4);bus.connect(lp);lp.connect(out);
 const keys=ctx.createGain();keys.connect(bus);const dl=ctx.createDelay(1);dl.delayTime.value=.42;const fb=ctx.createGain();fb.gain.value=.3;const dlp=filt('lowpass',1400);keys.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(bus);
 const cr=src('crackle');const crg=ctx.createGain();crg.gain.value=.35;cr.connect(filt('highpass',900)).connect(crg).connect(out);
 const hum=src('brown',1);const hg=ctx.createGain();hg.gain.value=.05;hum.connect(filt('lowpass',300)).connect(hg).connect(out);
 const prog=[{r:41,n:[53,57,60,64,67]},{r:40,n:[52,55,59,62,67]},{r:38,n:[50,53,57,60,64]},{r:43,n:[47,53,55,59,62]},{r:45,n:[57,60,64,67,71]},{r:38,n:[53,57,60,64,69]},{r:43,n:[53,55,59,62,65]},{r:36,n:[52,55,59,64,67]}];
 const penta=[72,74,76,79,81,84];const spb=60/72,st=spb/4;let next=ctx.currentTime+.15,i=0;
 const ep=(m,t,d,v)=>{const f=mtof(m);const o1=ctx.createOscillator();o1.type='sine';o1.frequency.value=f;o1.detune.value=(Math.random()-.5)*10;const o2=ctx.createOscillator();o2.type='triangle';o2.frequency.value=f*2;const g2=ctx.createGain();g2.gain.value=.18;const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(v*.35,t+1.1);g.gain.exponentialRampToValueAtTime(.0001,t+d);o1.connect(g);o2.connect(g2).connect(g);g.connect(keys);o1.start(t);o2.start(t);o1.stop(t+d+.05);o2.stop(t+d+.05);};
 const bass=(m,t,d)=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=mtof(m);const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.26,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(bus);o.start(t);o.stop(t+d+.05);};
 const kick=t=>{const o=ctx.createOscillator();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);const g=ctx.createGain();g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g).connect(bus);o.start(t);o.stop(t+.35);};
 const noiseHit=(t,ft,f,q,v,d)=>{const n=ctx.createBufferSource();n.buffer=getBuf('white');const b=filt(ft,f,q);const g=ctx.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);n.connect(b).connect(g).connect(bus);n.start(t,Math.random()*3,d+.05);};
 const snare=t=>{noiseHit(t,'bandpass',1700,.8,.22,.16);const o=ctx.createOscillator();o.type='triangle';o.frequency.value=185;const g=ctx.createGain();g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g).connect(bus);o.start(t);o.stop(t+.12);};
 const hat=(t,v)=>noiseHit(t,'highpass',7000,null,v,.05);
 const play=(k,t)=>{const bar=Math.floor(k/16)%8,s=k%16,c=prog[bar];
  if(s===0){c.n.forEach((m,j)=>ep(m,t+j*.014,spb*4*.98,.07));bass(c.r,t,spb*1.8);}
  if(s===8)bass(c.r+(Math.random()<.4?7:0),t,spb*1.4);
  if(s===0||s===10||(s===7&&Math.random()<.35))kick(t);
  if(s===4||s===12)snare(t);
  if(s%2===0)hat(t,s%4===2?.05:.03);
  if(s!==0&&s%2===0&&Math.random()<.2)ep(penta[Math.floor(Math.random()*penta.length)],t,spb*1.2,.045);};
 const sched=()=>{const la=document.hidden?2.2:.3;while(next<ctx.currentTime+la){play(i,next);next+=(i%2===0)?st*1.16:st*.84;i=(i+1)%128;}};
 sched();const iv=setInterval(sched,60);
 return ()=>{clearInterval(iv);try{cr.stop();hum.stop();}catch(e){}setTimeout(()=>bus.disconnect(),600);};}
const SOUNDS=[
 {id:'lofi',name:'Lofi beats',icon:'music',desc:'Acordes suaves, batería tranquila y crepitar de vinilo.',color:'pink',gain:1},
 {id:'lluvia',name:'Lluvia',icon:'rain',desc:'Lluvia constante contra la ventana.',color:'cobalt',gain:.8},
 {id:'fuego',name:'Chimenea',icon:'flame',desc:'Leña crepitando y un rumor cálido de fondo.',color:'orange',gain:1},
 {id:'olas',name:'Olas',icon:'wave',desc:'Mar que va y viene, a ritmo de respiración lenta.',color:'mint',gain:.9},
 {id:'blanco',name:'Ruido blanco',icon:'noise',desc:'Todas las frecuencias por igual. Tapa voces y conversaciones.',color:'sun',gain:.35},
 {id:'rosa',name:'Ruido rosa',icon:'noise',desc:'Más suave y equilibrado que el blanco. Bueno para leer.',color:'pink',gain:.7},
 {id:'marron',name:'Ruido marrón',icon:'noise',desc:'Grave y profundo, como un avión o un rumor lejano.',color:'orange',gain:.9}
];
const volOf=id=>state.audio.vols[id]!=null?state.audio.vols[id]:.6;
const SG=id=>SOUNDS.find(s=>s.id===id).gain;
function startSound(id){const ctx=ac();if(!ctx||A.on[id])return;const g=ctx.createGain();g.gain.value=0;g.connect(A.master);g.gain.setTargetAtTime(volOf(id)*SG(id),ctx.currentTime,.5);const h={g,srcs:[],stops:[]};
 const lfo=(f,depth,target)=>{const o=ctx.createOscillator();o.frequency.value=f;const d=ctx.createGain();d.gain.value=depth;o.connect(d);d.connect(target);o.start();h.srcs.push(o);return o;};
 if(id==='blanco'){const s=src('white');s.connect(filt('lowpass',12000)).connect(g);h.srcs.push(s);}
 if(id==='rosa'){const s=src('pink');s.connect(g);h.srcs.push(s);}
 if(id==='marron'){const s=src('brown');s.connect(filt('highpass',28)).connect(g);h.srcs.push(s);}
 if(id==='lluvia'){
  const bed=src('pink');const bg=ctx.createGain();bg.gain.value=.85;bed.connect(filt('highpass',400)).connect(filt('lowpass',7000)).connect(bg).connect(g);lfo(.05,.12,bg.gain);
  const siz=src('white');const sg=ctx.createGain();sg.gain.value=.2;siz.connect(filt('bandpass',3600,.5)).connect(sg).connect(g);lfo(.07,.06,sg.gain);
  const low=src('brown');const lg=ctx.createGain();lg.gain.value=.25;low.connect(filt('lowpass',320)).connect(lg).connect(g);
  h.srcs.push(bed,siz,low);
  h.stops.push(lookahead(t=>{const o=ctx.createOscillator();o.type='sine';const f=1800+Math.random()*2600;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+.035);const e=ctx.createGain();const v=.012+Math.random()*.04;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(v,t+.003);e.gain.exponentialRampToValueAtTime(.0001,t+.05);o.connect(e).connect(panner(Math.random()*1.6-.8)).connect(g);o.start(t);o.stop(t+.07);return t+.02+Math.random()*.14;}));}
 if(id==='olas'){
  const s=src('brown');const lp=filt('lowpass',800,.3);const am=ctx.createGain();am.gain.value=.5;s.connect(lp).connect(am).connect(g);
  lfo(.083,.3,am.gain);lfo(.051,.15,am.gain);lfo(.083,380,lp.frequency);
  const s2=src('pink');const am2=ctx.createGain();am2.gain.value=.1;const pn=panner(0);s2.connect(filt('highpass',1400)).connect(am2).connect(pn).connect(g);lfo(.083,.09,am2.gain);if(pn.pan)lfo(.021,.6,pn.pan);
  h.srcs.push(s,s2);}
 if(id==='fuego'){
  const s=src('brown');const g1=ctx.createGain();g1.gain.value=.65;s.connect(filt('lowpass',420)).connect(g1).connect(g);lfo(.13,.12,g1.gain);lfo(.31,.07,g1.gain);
  const w=src('pink');const wg=ctx.createGain();wg.gain.value=.05;w.connect(filt('bandpass',700,.7)).connect(wg).connect(g);lfo(.09,.035,wg.gain);
  h.srcs.push(s,w);
  h.stops.push(lookahead(t=>{const n=ctx.createBufferSource();n.buffer=getBuf('white');const eg=ctx.createGain();const amp=.2+Math.random()*.85;const dur=.008+Math.random()*.05;eg.gain.setValueAtTime(amp,t);eg.gain.exponentialRampToValueAtTime(.001,t+dur);n.connect(filt('bandpass',1100+Math.random()*4500,1.3)).connect(eg).connect(panner(Math.random()*1.2-.6)).connect(g);n.start(t,Math.random()*8,dur+.03);return t+(Math.random()<.12?.25+Math.random()*.7:.02+Math.random()*.16);}));}
 if(id==='lofi')h.stops.push(startLofi(g));
 h.stop=()=>h.stops.forEach(f=>{try{f();}catch(e){}});
 A.on[id]=h;state.soundsUsed=true;const c=Object.keys(A.on).length;if(c>state.maxSounds)state.maxSounds=c;}
function stopSound(id){const h=A.on[id];if(!h)return;delete A.on[id];const t=A.ctx.currentTime;h.g.gain.cancelScheduledValues(t);h.g.gain.setTargetAtTime(0,t,.08);setTimeout(()=>{if(h.stop)h.stop();h.srcs.forEach(s=>{try{s.stop();}catch(e){}});h.g.disconnect();},500);}
function chime(){const ctx=ac();if(!ctx||!state.settings.chime)return;const t=ctx.currentTime;[[880,0],[1318.5,.18],[1760,.36]].forEach(([f,d])=>{const o=ctx.createOscillator();o.type='sine';o.frequency.value=f;const g=ctx.createGain();g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.22,t+d+.02);g.gain.exponentialRampToValueAtTime(.001,t+d+1.3);o.connect(g).connect(ctx.destination);o.start(t+d);o.stop(t+d+1.4);});}
const PRESETS=[
 {name:'Lofi lluvioso',icon:'rain',mix:{lofi:.7,lluvia:.35}},
 {name:'Biblioteca',icon:'book',mix:{marron:.45,lluvia:.25}},
 {name:'Cabaña',icon:'flame',mix:{fuego:.7,lluvia:.4,lofi:.35}},
 {name:'Foco máximo',icon:'target',mix:{rosa:.6}},
 {name:'Playa',icon:'wave',mix:{olas:.75,lofi:.3}}
];
function initSounds(){$('#soundGrid').innerHTML=SOUNDS.map(s=>`<article class="sound" id="snd-${s.id}" style="${cvar(s.color)}"><div class="sound-top"><span class="sound-ico">${ico(s.icon)}</span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><h3 class="sound-name">${s.name}</h3><p class="sound-desc">${s.desc}</p><div class="sound-ctrl"><button class="btn sm" data-act="sound-toggle" data-id="${s.id}" aria-pressed="false"></button><label class="vol" for="vol-${s.id}"><span class="sr">Volumen de ${s.name}</span>${ico('volume')}<input type="range" min="0" max="1" step="0.01" id="vol-${s.id}" data-vol="${s.id}"></label></div></article>`).join('');
 $('#presets').innerHTML=PRESETS.map((p,i)=>`<button class="btn" data-act="preset" data-i="${i}">${ico(p.icon)}${p.name}</button>`).join('');
 $('#masterIco').innerHTML=ico('volume');$('#stopAll').innerHTML=`${ico('stop')}Parar todo`;}
function renderSounds(){SOUNDS.forEach(s=>{const on=!!A.on[s.id];const el=$('#snd-'+s.id);el.classList.toggle('on',on);const b=el.querySelector('[data-act="sound-toggle"]');b.setAttribute('aria-pressed',String(on));b.innerHTML=on?`${ico('pause')}Pausar`:`${ico('play')}Activar`;const v=$('#vol-'+s.id);if(document.activeElement!==v)v.value=volOf(s.id);});const m=$('#master');if(document.activeElement!==m)m.value=state.audio.master;const n=Object.keys(A.on).length;$('#activeCount').textContent=n?`${n} sonando`:'Nada sonando';}
$('#master').addEventListener('input',e=>{state.audio.master=+e.target.value;if(A.master)A.master.gain.setTargetAtTime(state.audio.master,A.ctx.currentTime,.05);save();});
