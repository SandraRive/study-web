/* Fondo de estrellas animado y salto al hiperespacio */
'use strict';

/* ================= FONDO ESPACIAL ================= */
/* ---- Campo de estrellas ---- */
const SKY=(()=>{const cvs=$$('.stars-cv');let stars=[],shoot=null,warpT=0,W=0,H=0,last=0,nextShoot=performance.now()+4000;
 const COLS=['#FFFFFF','#CFE0FF','#FFE9C9','#BFD4FF','#FFD6EC'];
 function size(){W=innerWidth;H=innerHeight;const dpr=Math.min(window.devicePixelRatio||1,2);cvs.forEach(c=>{c.width=W*dpr;c.height=H*dpr;c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);});const n=Math.round(W*H/2600);stars=[];for(let i=0;i<n;i++){const z=Math.random();stars.push({x:Math.random()*W,y:Math.random()*H,z,r:.4+z*1.5,c:COLS[Math.floor(Math.random()*COLS.length)],tw:Math.random()*6.28,ts:.5+Math.random()*2});}}
 function draw(now){const dt=Math.min(50,now-last||16);last=now;const warp=warpT>now?1-(warpT-now)/1300:0;const cx=W/2,cy=H*.45;
  cvs.forEach(c=>{if(c.offsetParent===null&&c.closest('[hidden]'))return;const g=c.getContext('2d');g.clearRect(0,0,W,H);
   for(const s of stars){if(warp>0){const k=Math.sin(warp*Math.PI);const dx=s.x-cx,dy=s.y-cy;const len=k*(.05+s.z*.35);g.strokeStyle=s.c;g.globalAlpha=.4+s.z*.6;g.lineWidth=s.r;g.beginPath();g.moveTo(s.x,s.y);g.lineTo(s.x+dx*len,s.y+dy*len);g.stroke();}
    else{g.globalAlpha=(.35+s.z*.65)*(.65+.35*Math.sin(s.tw+now/1000*s.ts));g.fillStyle=s.c;g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.fill();}}
   if(shoot&&!warp){const p=(now-shoot.t)/shoot.d;if(p<=1){const x=shoot.x+shoot.vx*p,y=shoot.y+shoot.vy*p;const gr=g.createLinearGradient(x,y,x-shoot.vx*.18,y-shoot.vy*.18);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');g.globalAlpha=1-p*.6;g.strokeStyle=gr;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x-shoot.vx*.18,y-shoot.vy*.18);g.stroke();}}
   g.globalAlpha=1;});
  for(const s of stars){s.x-=(.004+s.z*.02)*dt;if(warp>0){const dx=s.x-cx,dy=s.y-cy;const f=1+Math.sin(warp*Math.PI)*.02*(.3+s.z);s.x=cx+dx*f;s.y=cy+dy*f;if(s.x<-20||s.x>W+20||s.y<-20||s.y>H+20){s.x=cx+(Math.random()-.5)*W*.3;s.y=cy+(Math.random()-.5)*H*.3;}}else if(s.x<-2)s.x=W+2;}
  if(shoot&&now-shoot.t>shoot.d)shoot=null;
  if(!shoot&&now>nextShoot){shoot={x:W*(.3+Math.random()*.7),y:H*Math.random()*.4,vx:-(260+Math.random()*260),vy:120+Math.random()*120,t:now,d:900};nextShoot=now+6000+Math.random()*9000;}
  if(!reduce&&!document.hidden)requestAnimationFrame(draw);}
 size();addEventListener('resize',()=>{size();if(reduce)draw(performance.now());});
 if(reduce){draw(performance.now());}else requestAnimationFrame(draw);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!reduce){last=performance.now();requestAnimationFrame(draw);}});
 return {warp(){if(reduce)return;warpT=performance.now()+1300;},redraw(){if(reduce)draw(performance.now());}};})();
