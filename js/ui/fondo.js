/* Fondo animado de la web: espacio (con salto al hiperespacio), bosque nocturno, ciudad neón, océano y aurora */
'use strict';

/* ---- Escenarios: el dibujo fijo (siluetas) va en SVG; lo que se mueve, en el canvas ---- */
const SCENES={
 espacio:{name:'Espacio profundo',price:0,mode:'stars',color:'#03050C',desc:'Estrellas, nebulosas y un planeta con anillo.'},
 bosque:{name:'Bosque nocturno',price:300,mode:'fireflies',color:'#030A06',desc:'Pinos bajo la luna y luciérnagas.'},
 oceano:{name:'Océano profundo',price:350,mode:'bubbles',color:'#020A14',desc:'Rayos de luz, algas y burbujas.'},
 ciudad:{name:'Ciudad neón',price:400,mode:'rain',color:'#08040F',desc:'Rascacielos iluminados y lluvia.'},
 aurora:{name:'Aurora boreal',price:500,mode:'aurora',color:'#020812',desc:'Montañas nevadas y luces del norte.'}
};
function sceneSVG(id){
 let seed=id.length*97+13;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const wrap=(h,body)=>`<svg class="deco-svg" viewBox="0 0 1600 ${h}" preserveAspectRatio="xMidYMax slice" style="height:${h===400?'42vh':'38vh'}">${body}</svg>`;
 if(id==='bosque'){
  const pine=(x,base,h,w,c)=>{let p='';const n=5;for(let i=0;i<n;i++){const y=base-h+i*h/(n+1);const ww=w*(.35+i*.16);p+=`M${x} ${y-h/(n+1)}L${x-ww/2} ${y+h/(n+1)*1.3}L${x+ww/2} ${y+h/(n+1)*1.3}Z`;}return `<path d="${p}M${x-w*.06} ${base-8}h${w*.12}v12h${-w*.12}z" fill="${c}"/>`;};
  let back='',front='';for(let x=-20;x<1640;x+=38+rnd()*30)back+=pine(x,360,150+rnd()*90,70+rnd()*30,'#0A2016');for(let x=-30;x<1650;x+=60+rnd()*50)front+=pine(x,400,200+rnd()*120,100+rnd()*40,'#040E09');
  return wrap(400,`<rect y="330" width="1600" height="70" fill="#040E09"/>${back}${front}`);}
 if(id==='oceano'){
  let weeds='';for(let i=0;i<26;i++){const x=rnd()*1600,h=90+rnd()*170;weeds+=`<path d="M${x} 400 Q${x-30} ${400-h*.5} ${x+10} ${400-h}" stroke="${rnd()<.5?'#0B3B3A':'#0C2F45'}" stroke-width="${7+rnd()*7}" fill="none" stroke-linecap="round"/>`;}
  let rocks='';for(let i=0;i<12;i++){const x=rnd()*1600,w=80+rnd()*160;rocks+=`<ellipse cx="${x}" cy="400" rx="${w}" ry="${30+rnd()*40}" fill="#03121F"/>`;}
  return wrap(400,`${weeds}${rocks}<rect y="380" width="1600" height="20" fill="#03121F"/>`);}
 if(id==='ciudad'){
  let b='',w='';let x=-10;while(x<1620){const bw=50+rnd()*90,bh=120+rnd()*260;const back=rnd()<.4;b+=`<rect x="${x}" y="${400-bh}" width="${bw}" height="${bh}" fill="${back?'#140A26':'#0A0516'}"/>`;
   if(rnd()<.25)b+=`<rect x="${x+bw/2-1}" y="${400-bh-26}" width="2" height="26" fill="#0A0516"/><circle cx="${x+bw/2}" cy="${400-bh-28}" r="3" fill="#FF2E97"/>`;
   for(let wy=400-bh+12;wy<392;wy+=16)for(let wx=x+8;wx<x+bw-10;wx+=13)if(rnd()<.32)w+=`<rect x="${wx}" y="${wy}" width="6" height="8" fill="${rnd()<.55?'#00D9FF':rnd()<.5?'#FF2E97':'#FFE14D'}" opacity="${(.45+rnd()*.5).toFixed(2)}"/>`;
   x+=bw+2+rnd()*8;}
  return wrap(400,`${b}${w}<rect y="396" width="1600" height="4" fill="#FF2E97" opacity=".6"/>`);}
 if(id==='aurora'){
  const ridge=(base,amp,fill,snow)=>{let d=`M0 400L0 ${base}`;let pts=[];for(let x=0;x<=1600;x+=80){const y=base-rnd()*amp;pts.push([x,y]);d+=`L${x} ${y}`;}d+='L1600 400Z';let s='';if(snow)pts.forEach(([px,py],i)=>{if(i&&py<base-amp*.55)s+=`<path d="M${px-22} ${py+22}L${px} ${py}L${px+22} ${py+22}Z" fill="#DDE9F5" opacity=".85"/>`;});return `<path d="${d}" fill="${fill}"/>${s}`;};
  return wrap(400,ridge(250,170,'#0C1A2C',true)+ridge(330,110,'#060E1A',false));}
 return '';}

const SKY=(()=>{const cvs=$$('.stars-cv');let parts=[],shoot=null,warpT=0,W=0,H=0,last=0,nextShoot=performance.now()+4000,mode='stars';
 const COLS=['#FFFFFF','#CFE0FF','#FFE9C9','#BFD4FF','#FFD6EC'];
 function seedParts(){parts=[];
  if(mode==='stars'||mode==='aurora'){const n=Math.round(W*H/(mode==='aurora'?4200:2600));for(let i=0;i<n;i++){const z=Math.random();parts.push({x:Math.random()*W,y:Math.random()*H*(mode==='aurora'?.7:1),z,r:.4+z*1.5,c:COLS[Math.floor(Math.random()*COLS.length)],tw:Math.random()*6.28,ts:.5+Math.random()*2});}}
  else if(mode==='fireflies'){const n=Math.round(Math.min(70,W*H/16000));for(let i=0;i<n;i++)parts.push({x:Math.random()*W,y:H*(.35+Math.random()*.6),a:Math.random()*6.28,sp:.01+Math.random()*.025,r:1.4+Math.random()*1.8,ph:Math.random()*6.28});
   for(let i=0;i<Math.round(W*H/9000);i++)parts.push({star:1,x:Math.random()*W,y:Math.random()*H*.45,r:.4+Math.random(),tw:Math.random()*6.28});}
  else if(mode==='bubbles'){const n=Math.round(Math.min(60,W*H/14000));for(let i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,r:1.5+Math.random()*5,sp:.02+Math.random()*.05,ph:Math.random()*6.28});}
  else if(mode==='rain'){const n=Math.round(Math.min(220,W*H/5000));for(let i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,l:10+Math.random()*22,sp:.5+Math.random()*.6,o:.12+Math.random()*.3});}}
 function size(){W=innerWidth;H=innerHeight;const dpr=Math.min(window.devicePixelRatio||1,2);cvs.forEach(c=>{c.width=W*dpr;c.height=H*dpr;c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);});seedParts();}
 function drawAurora(g,now){const t=now/1000;const bands=[['rgba(61,255,176,','#3DFFB0',.18,.22],['rgba(0,217,255,','#00D9FF',.26,.16],['rgba(170,120,255,','#AA78FF',.12,.12]];
  bands.forEach(([rgba],bi)=>{const base=H*(.18+bi*.07);g.beginPath();g.moveTo(0,base);for(let x=0;x<=W;x+=24){const y=base+Math.sin(x/220+t*.25+bi)*28+Math.sin(x/90+t*.4+bi*2)*10;g.lineTo(x,y);}
   for(let x=W;x>=0;x-=24){const y=base+150+Math.sin(x/260+t*.2+bi)*30;g.lineTo(x,y);}g.closePath();const gr=g.createLinearGradient(0,base-30,0,base+170);gr.addColorStop(0,rgba+'0)');gr.addColorStop(.25,rgba+(.28-bi*.06)+')');gr.addColorStop(1,rgba+'0)');g.fillStyle=gr;g.globalAlpha=1;g.fill();});}
 function draw(now){const dt=Math.min(50,now-last||16);last=now;const warp=mode==='stars'&&warpT>now?1-(warpT-now)/1300:0;const cx=W/2,cy=H*.45;
  cvs.forEach(c=>{if(c.offsetParent===null&&c.closest('[hidden]'))return;const g=c.getContext('2d');g.clearRect(0,0,W,H);
   if(mode==='aurora')drawAurora(g,now);
   for(const s of parts){
    if(mode==='stars'||mode==='aurora'){if(warp>0){const k=Math.sin(warp*Math.PI);const dx=s.x-cx,dy=s.y-cy;const len=k*(.05+s.z*.35);g.strokeStyle=s.c;g.globalAlpha=.4+s.z*.6;g.lineWidth=s.r;g.beginPath();g.moveTo(s.x,s.y);g.lineTo(s.x+dx*len,s.y+dy*len);g.stroke();}
     else{g.globalAlpha=(.35+s.z*.65)*(.65+.35*Math.sin(s.tw+now/1000*s.ts));g.fillStyle=s.c;g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.fill();}}
    else if(mode==='fireflies'){if(s.star){g.globalAlpha=.4+.3*Math.sin(s.tw+now/900);g.fillStyle='#E8F4FF';g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.fill();continue;}
     const a=.35+.65*Math.max(0,Math.sin(s.ph+now/700));g.globalAlpha=a*.35;g.fillStyle='#D8FF6A';g.beginPath();g.arc(s.x,s.y,s.r*4,0,6.283);g.fill();g.globalAlpha=a;g.fillStyle='#F4FFB0';g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.fill();}
    else if(mode==='bubbles'){g.globalAlpha=.5;g.strokeStyle='#BFEFFF';g.lineWidth=1.2;g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.stroke();g.globalAlpha=.6;g.fillStyle='#fff';g.beginPath();g.arc(s.x-s.r*.35,s.y-s.r*.35,Math.max(.6,s.r*.22),0,6.283);g.fill();}
    else if(mode==='rain'){g.globalAlpha=s.o;g.strokeStyle='#B9C6FF';g.lineWidth=1;g.beginPath();g.moveTo(s.x,s.y);g.lineTo(s.x-s.l*.25,s.y+s.l);g.stroke();}}
   if(mode==='stars'&&shoot&&!warp){const p=(now-shoot.t)/shoot.d;if(p<=1){const x=shoot.x+shoot.vx*p,y=shoot.y+shoot.vy*p;const gr=g.createLinearGradient(x,y,x-shoot.vx*.18,y-shoot.vy*.18);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');g.globalAlpha=1-p*.6;g.strokeStyle=gr;g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x-shoot.vx*.18,y-shoot.vy*.18);g.stroke();}}
   g.globalAlpha=1;});
  for(const s of parts){
   if(mode==='stars'){s.x-=(.004+s.z*.02)*dt;if(warp>0){const dx=s.x-cx,dy=s.y-cy;const f=1+Math.sin(warp*Math.PI)*.02*(.3+s.z);s.x=cx+dx*f;s.y=cy+dy*f;if(s.x<-20||s.x>W+20||s.y<-20||s.y>H+20){s.x=cx+(Math.random()-.5)*W*.3;s.y=cy+(Math.random()-.5)*H*.3;}}else if(s.x<-2)s.x=W+2;}
   else if(mode==='fireflies'&&!s.star){s.a+=(Math.random()-.5)*.2;s.x+=Math.cos(s.a)*s.sp*dt;s.y+=Math.sin(s.a)*s.sp*dt*.6;if(s.x<-10)s.x=W+10;if(s.x>W+10)s.x=-10;if(s.y<H*.3)s.a=Math.PI/2;if(s.y>H)s.a=-Math.PI/2;}
   else if(mode==='bubbles'){s.y-=s.sp*dt;s.x+=Math.sin(s.ph+s.y/40)*.25;if(s.y<-10){s.y=H+10;s.x=Math.random()*W;}}
   else if(mode==='rain'){s.y+=s.sp*dt;s.x-=s.sp*dt*.25;if(s.y>H){s.y=-s.l;s.x=Math.random()*(W+200);}}}
  if(mode==='stars'){if(shoot&&now-shoot.t>shoot.d)shoot=null;if(!shoot&&now>nextShoot){shoot={x:W*(.3+Math.random()*.7),y:H*Math.random()*.4,vx:-(260+Math.random()*260),vy:120+Math.random()*120,t:now,d:900};nextShoot=now+6000+Math.random()*9000;}}
  if(!reduce&&!document.hidden)requestAnimationFrame(draw);}
 size();addEventListener('resize',()=>{size();if(reduce)draw(performance.now());});
 if(reduce){draw(performance.now());}else requestAnimationFrame(draw);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!reduce){last=performance.now();requestAnimationFrame(draw);}});
 return {warp(){if(reduce||mode!=='stars')return;warpT=performance.now()+1300;},redraw(){if(reduce)draw(performance.now());},setMode(m){if(m===mode)return;mode=m;seedParts();if(reduce)draw(performance.now());}};})();

/* Aplica un escenario: colores de la web, siluetas y animación */
function applyScene(id){
 if(!SCENES[id])id='espacio';const sc=SCENES[id];
 document.documentElement.dataset.scene=id;
 $$('.space .deco').forEach(d=>d.innerHTML=sceneSVG(id));
 SKY.setMode(sc.mode);
 const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',sc.color);}
