/* Mascota de estudio: nace con tu primer pomodoro, crece con tus minutos de foco y se pone triste si la abandonas */
'use strict';

const PET_SPECIES={
 chispa:{n:'Chispa',d:'Espíritu de fuego. Le encanta que estudies a tope.',c:'#FF8A3D',c2:'#FFCB45',dk:'#C2410C',leg:['#7FD8FF','#E6FAFF','#2F6BFF']},
 gota:{n:'Gota',d:'Gotita de agua tranquila. Le gusta la constancia.',c:'#2EE6FF',c2:'#A9F5FF',dk:'#0B7FA8',leg:['#B58CFF','#F1E6FF','#6B3FD9']},
 brote:{n:'Brote',d:'Planta curiosa. Crece un poquito con cada día.',c:'#3EDDA8',c2:'#B6F7D9',dk:'#1F8A63',leg:['#FFD54D','#FFF6CC','#D99A00']}};
const PET_STAGES=[{n:'Huevo',min:0},{n:'Bebé',min:25},{n:'Peque',min:600},{n:'Mayor',min:3000},{n:'Leyenda',min:9000}];
const PET_DECAY={food:2,joy:1.5}; /* puntos que pierde por hora */
let petAnim=null;

function petStage(p){let s=0;PET_STAGES.forEach((x,i)=>{if(p.xp>=x.min)s=i;});return s;}
/* Aplica el paso del tiempo (hambre y ánimo bajan poco a poco) */
function petTick(){const p=state.pet;if(!p||!p.species)return;const now=Date.now(),h=Math.max(0,(now-(p.last||now))/36e5);
 if(h>0&&petStage(p)>0){p.food=Math.max(0,p.food-PET_DECAY.food*h);p.joy=Math.max(0,p.joy-PET_DECAY.joy*h);}p.last=now;}
function petMood(p){if(!p||!p.species)return 'none';if(petStage(p)===0)return 'egg';const hr=new Date().getHours();const avg=(p.food+p.joy)/2;
 if(avg<12)return 'gloom';if(hr>=0&&hr<7)return 'sleep';if(p.food<30)return 'hungry';if(avg<35)return 'sad';if(avg>=75)return 'happy';return 'ok';}
const MOOD_TXT={egg:'Está a punto de nacer… completa un pomodoro.',happy:'¡Está feliz! Le encanta verte estudiar.',ok:'Está bien, pero le vendría genial otro pomodoro.',hungry:'Tiene hambre: un pomodoro o un snack le vendría de lujo.',sad:'Está tristona. Te echa de menos.',gloom:'Se ha quedado sin fuerzas de tanto esperarte. Estudia un poco y se recupera.',sleep:'Está durmiendo. Shhh…'};

/* ---- Dibujo (viewBox 160×160) ---- */
function petEyes(m,cx,cy,sp,col){const L=cx-sp,R=cx+sp;
 if(m==='sleep'||m==='gloom')return `<path d="M${L-7} ${cy} q7 5 14 0 M${R-7} ${cy} q7 5 14 0" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>`;
 if(m==='happy')return `<path d="M${L-7} ${cy+2} q7 -9 14 0 M${R-7} ${cy+2} q7 -9 14 0" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>`;
 const e=`<g class="pet-eye"><ellipse cx="${L}" cy="${cy}" rx="6" ry="7.5" fill="${OL}"/><ellipse cx="${R}" cy="${cy}" rx="6" ry="7.5" fill="${OL}"/><circle cx="${L+2}" cy="${cy-3}" r="2.4" fill="#fff"/><circle cx="${R+2}" cy="${cy-3}" r="2.4" fill="#fff"/></g>`;
 const brow=m==='sad'||m==='hungry'?`<path d="M${L-9} ${cy-9} l12 -5 M${R+9} ${cy-9} l-12 -5" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`:'';
 return e+brow;}
function petMouth(m,cx,cy){
 if(m==='happy')return `<path d="M${cx-9} ${cy} q9 11 18 0Z" fill="#7A1F3D" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;
 if(m==='sad'||m==='gloom')return `<path d="M${cx-7} ${cy+5} q7 -7 14 0" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;
 if(m==='hungry')return `<ellipse cx="${cx}" cy="${cy+2}" rx="5" ry="6" fill="#7A1F3D" stroke="${OL}" stroke-width="3"/>`;
 if(m==='sleep')return `<ellipse cx="${cx}" cy="${cy+2}" rx="3.5" ry="2.5" fill="${OL}"/>`;
 return `<path d="M${cx-7} ${cy} q7 7 14 0" fill="none" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>`;}
function petSVG(p,mood,opts){opts=opts||{};const SP=PET_SPECIES[p.species]||PET_SPECIES.chispa;const st=petStage(p);const leg=st===4;
 const c=leg?SP.leg[0]:SP.c,c2=leg?SP.leg[1]:SP.c2,dk=leg?SP.leg[2]:SP.dk;mood=mood||petMood(p);
 let o='',face='',extra='',back='';
 const sc=[.8,.62,.78,.92,1][st];
 if(st===0){o=`<ellipse cx="80" cy="92" rx="38" ry="48" fill="#FFF7E8" ${S}/><path d="M48 90 l10 -8 10 8 10 -8 10 8 10 -8 10 8 6 -5" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/><circle cx="66" cy="70" r="6" fill="${c2}"/><circle cx="96" cy="112" r="8" fill="${c2}"/><circle cx="92" cy="64" r="4" fill="${c}"/><path d="M60 56 q4 -8 10 -6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  return wrapPet(o,p,mood,opts,st);}
 if(p.species==='chispa'){
  const tufts=st>=2?`<path d="M52 70 Q40 40 58 28 Q58 50 68 56Z M108 70 Q120 40 102 28 Q102 50 92 56Z" fill="${c2}" ${S}/>`:'';
  const crown=st>=3?`<path d="M62 44 Q58 14 80 4 Q74 26 92 22 Q104 34 96 48Z" fill="${c2}" ${S}/><path d="M74 40 Q74 24 82 18 Q82 30 88 34Z" fill="#fff" opacity=".8"/>`:`<path d="M66 50 Q66 24 82 14 Q80 34 94 40 Q96 52 90 56Z" fill="${c2}" ${S}/>`;
  back=st>=3?`<path d="M112 120 Q146 110 140 76 Q128 96 110 100Z" fill="${c}" ${S}/>`:'';
  o=`${back}${crown}${tufts}<path d="M80 34 C116 40 128 80 122 108 C116 136 96 146 80 146 C64 146 44 136 38 108 C32 80 44 40 80 34Z" fill="${c}" ${S}/><path d="M80 80 C100 84 106 106 100 124 C94 138 66 138 60 124 C54 106 60 84 80 80Z" fill="${c2}" opacity=".85"/>`;
  if(st>=2)extra=`<ellipse cx="44" cy="112" rx="9" ry="12" fill="${c}" ${S}/><ellipse cx="116" cy="112" rx="9" ry="12" fill="${c}" ${S}/>`;
  face=petEyes(mood,80,92,16)+petMouth(mood,80,110);}
 else if(p.species==='gota'){
  const fins=st>=2?`<path d="M42 104 Q22 100 26 82 Q38 92 46 92Z M118 104 Q138 100 134 82 Q122 92 114 92Z" fill="${c2}" ${S}/>`:'';
  const crest=st>=3?`<path d="M58 42 Q66 26 80 34 Q92 20 104 36 Q96 46 80 44 Q68 50 58 42Z" fill="${c2}" ${S}/>`:'';
  const crown=leg?`<path d="M62 30 L68 12 L76 26 L80 6 L84 26 L92 12 L98 30Z" fill="${c2}" ${S}/>`:'';
  o=`${crown}${fins}<path d="M80 14 C92 40 124 70 124 104 C124 130 104 146 80 146 C56 146 36 130 36 104 C36 70 68 40 80 14Z" fill="${c}" ${S}/>${crest}<path d="M60 60 Q54 74 54 86" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>`;
  if(st>=3)extra=`<circle cx="30" cy="58" r="6" fill="${c2}" stroke="${OL}" stroke-width="2.5"/><circle cx="134" cy="48" r="4.5" fill="${c2}" stroke="${OL}" stroke-width="2.5"/><circle cx="140" cy="66" r="3" fill="${c2}" stroke="${OL}" stroke-width="2"/>`;
  face=petEyes(mood,80,100,15)+petMouth(mood,80,118);}
 else{
  const leaves=st>=2?`<path d="M80 40 Q52 10 34 26 Q46 48 78 46Z" fill="${c}" ${S}/><path d="M80 40 Q108 10 126 26 Q114 48 82 46Z" fill="${c}" ${S}/>`:`<path d="M80 42 Q86 16 108 18 Q104 40 82 46Z" fill="${c}" ${S}/>`;
  const flower=st>=3?`<g transform="translate(80 24)">${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-11" rx="7" ry="11" fill="${leg?'#fff':'#FF9EC8'}" ${S} transform="rotate(${a})"/>`).join('')}<circle r="7" fill="${leg?c:'#FFE14D'}" ${S}/></g>`:'';
  o=`<path d="M80 50 V40" stroke="${dk}" stroke-width="6"/>${leaves}${flower}<path d="M80 48 C114 48 128 80 126 108 C124 134 104 146 80 146 C56 146 36 134 34 108 C32 80 46 48 80 48Z" fill="${c2}" ${S}/><path d="M44 112 Q80 128 116 112 Q114 138 80 142 Q46 138 44 112Z" fill="${c}" opacity=".55"/>`;
  if(st>=2)extra=`<ellipse cx="62" cy="146" rx="12" ry="7" fill="${dk}" ${S}/><ellipse cx="98" cy="146" rx="12" ry="7" fill="${dk}" ${S}/>`;
  face=petEyes(mood,80,96,16)+petMouth(mood,80,114);}
 const blush=mood!=='gloom'?`<circle cx="56" cy="${p.species==='gota'?110:106}" r="6" fill="#FF7FB5" opacity=".5"/><circle cx="104" cy="${p.species==='gota'?110:106}" r="6" fill="#FF7FB5" opacity=".5"/>`:'';
 const tear=mood==='sad'||mood==='gloom'?`<path d="M${mood==='gloom'?64:62} 104 q-4 8 0 11 q4 -3 0 -11Z" fill="#7FD8FF" stroke="${OL}" stroke-width="1.5"/>`:'';
 const zz=mood==='sleep'||mood==='gloom'?`<text x="118" y="44" font-size="18" font-weight="900" fill="#fff" stroke="${OL}" stroke-width="1" class="pet-z">z</text><text x="130" y="28" font-size="13" font-weight="900" fill="#fff" stroke="${OL}" stroke-width="1" class="pet-z z2">z</text>`:'';
 const aura=leg?`<circle cx="80" cy="92" r="70" fill="${c}" opacity=".18"/><circle cx="80" cy="92" r="58" fill="none" stroke="${c2}" stroke-width="2" stroke-dasharray="4 8" opacity=".7"/>`:'';
 return wrapPet(aura+extra+o+blush+face+tear+zz,p,mood,opts,st,sc);}
function wrapPet(inner,p,mood,opts,st,sc){sc=sc||.8;const tr=`translate(${80-80*sc} ${150-150*sc}) scale(${sc})`;
 return `<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(p.name||'Mascota')}" class="pet-svg m-${mood}${opts.cls?' '+opts.cls:''}"><ellipse cx="80" cy="152" rx="${30+st*6}" ry="6" fill="#000" opacity=".3"/><g class="pet-body"><g transform="${tr}">${inner}</g></g></svg>`;}

/* ---- Acciones ---- */
function petFeedFromStudy(min){const p=state.pet;if(!p||!p.species)return;petTick();const before=petStage(p);
 p.xp+=min;p.food=Math.min(100,p.food+Math.round(min*.9));p.joy=Math.min(100,p.joy+Math.round(min*.3));p.snacks=Math.min(9,(p.snacks||0)+1);
 const after=petStage(p);if(after>before)petEvolve(before,after);}
/* Escena del nacimiento: el huevo tiembla, se agrieta, brilla y se parte en dos */
function hatchSVG(p){const SP=PET_SPECIES[p.species],c=SP.c,c2=SP.c2,id='h'+uid();
 const zig='M50 112 L60 102 L70 114 L80 100 L90 114 L100 100 L110 114 L120 100 L130 114 L140 102 L150 112';
 const egg=`<ellipse cx="100" cy="112" rx="50" ry="62" fill="#FFF7E8" stroke="${OL}" stroke-width="5"/><path d="M58 100 l12 -10 12 10 12 -10 12 10 12 -10 12 10 12 -10 8 6" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="round"/><circle cx="80" cy="76" r="8" fill="${c2}"/><circle cx="122" cy="138" r="10" fill="${c2}"/><circle cx="116" cy="70" r="5" fill="${c}"/><circle cx="76" cy="146" r="6" fill="${c}"/><path d="M72 64 q6 -10 14 -8" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
 const rays=Array.from({length:12},(_,k)=>`<path d="M100 110 L${100+Math.cos(k*Math.PI/6-.12)*160} ${110+Math.sin(k*Math.PI/6-.12)*160} L${100+Math.cos(k*Math.PI/6+.12)*160} ${110+Math.sin(k*Math.PI/6+.12)*160}Z" fill="${c2}"/>`).join('');
 const bits=Array.from({length:8},(_,k)=>`<path class="hb hb${k}" d="M0 -6 L6 2 L-4 6Z" fill="#FFF7E8" stroke="${OL}" stroke-width="2" transform="translate(100 108)"/>`).join('');
 return `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" class="hatch" aria-label="Nacimiento">
 <defs><clipPath id="${id}t"><path d="M0 0 H200 V112 L150 112 L140 102 L130 114 L120 100 L110 114 L100 100 L90 114 L80 100 L70 114 L60 102 L50 112 L0 112Z"/></clipPath>
 <clipPath id="${id}b"><path d="${zig} L200 112 V220 H0 V112 L50 112Z"/></clipPath>
 <radialGradient id="${id}g"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="${c2}" stop-opacity=".8"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient></defs>
 <g class="h-rays">${rays}</g><circle class="h-glow" cx="100" cy="110" r="95" fill="url(#${id}g)"/>
 <g class="h-pet">${petSVG(p,'happy').replace(/^<svg[^>]*>/,'<svg x="20" y="22" width="160" height="160" viewBox="0 0 160 160">')}</g>
 <g class="h-egg"><g class="h-bot" clip-path="url(#${id}b)">${egg}</g><g class="h-top" clip-path="url(#${id}t)">${egg}</g>
  <path class="h-crack c1" d="M100 100 L92 84 L100 74 L94 60" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="h-crack c2" d="M80 100 L70 90 L74 78 M120 100 L130 92 L126 80 L134 72" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path class="h-crack c3" d="${zig}" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>
 ${bits}</svg>`;}
function petEvolve(from,to){const p=state.pet;p.food=Math.max(p.food,80);p.joy=Math.max(p.joy,80);
 setTimeout(()=>{const m=$('#petModal');if(!m)return;const SP=PET_SPECIES[p.species],nm=esc(p.name||SP.n);
  if(to===1){
   $('#petModalBody').innerHTML=`<div class="eyebrow hatch-ey">¡Algo se mueve…!</div><div class="hatch-wrap" data-act="pet-tap">${hatchSVG(p)}</div>
   <div class="hatch-txt"><h2 class="pet-evo-t">¡${nm} ha nacido! 🎉</h2><p class="hint">Cuídala estudiando: cada pomodoro la alimenta y la hace crecer. Su siguiente forma llega a las 10 horas de foco.</p><button class="btn pink" data-act="pet-close">¡Bienvenida, ${nm}!</button></div>`;
   m.hidden=false;m.classList.add('hatching');
   const ey=m.querySelector('.hatch-ey');
   setTimeout(()=>{if(ey)ey.textContent='¡Se está agrietando!';},1500);
   setTimeout(()=>{if(ey)ey.textContent='¡Ya sale, ya sale!';},2900);
   setTimeout(()=>{if(ey)ey.textContent='¡Ha nacido!';confetti(180);if(navigator.vibrate)navigator.vibrate([60,40,120]);},3700);
   setTimeout(()=>{confetti(90);},4300);
   return;}
  $('#petModalBody').innerHTML=`<div class="eyebrow">¡Evolución!</div><div class="pet-evo">${petSVG(Object.assign({},p,{xp:PET_STAGES[from].min}),'happy',{cls:'evo-from'})}${petSVG(p,'happy',{cls:'evo-to'})}</div>
  <h2 class="pet-evo-t">¡${nm} ahora es ${PET_STAGES[to].n.toLowerCase()}!</h2><p class="hint">${to===4?'Ha alcanzado su forma legendaria. Pocas mascotas llegan hasta aquí.':`Siguiente forma a las ${Math.round(PET_STAGES[to+1].min/60)} horas de foco.`}</p><button class="btn pink" data-act="pet-close">¡Genial!</button>`;
  m.hidden=false;m.classList.remove('hatching');setTimeout(()=>confetti(140),2200);},900);}
function petAction(kind){const p=state.pet;if(!p||!p.species)return;petTick();if(petStage(p)===0){toast('Primero tiene que nacer: completa un pomodoro.','timer');return;}
 if(kind==='snack'){if(!(p.snacks>0)){toast('No te quedan snacks. Cada pomodoro te da uno.','timer');return;}p.snacks--;p.food=Math.min(100,p.food+25);p.joy=Math.min(100,p.joy+5);petFx('🍪');}
 else{const t=today();if(p.petDay!==t){p.petDay=t;p.pets=0;}if(p.pets>=6){petFx('💤');toast('Ya le has dado muchos mimos hoy. ¡Ahora toca estudiar!','sparkle');return;}p.pets++;p.joy=Math.min(100,p.joy+6);petFx('💖');}
 save();renderPet();}
function petFx(em){const st=$('#petStage');if(!st)return;const s=document.createElement('span');s.className='pet-fx';s.textContent=em;s.style.left=(35+Math.random()*30)+'%';st.appendChild(s);setTimeout(()=>s.remove(),1200);
 const svg=st.querySelector('.pet-svg');if(svg){svg.classList.remove('jump');void svg.offsetWidth;svg.classList.add('jump');}}

/* ---- Tarjeta en Inicio ---- */
function renderPet(){const el=$('#petCard');if(!el)return;const p=state.pet;
 if(!p||!p.species){el.className='card pet-card adopt';
  el.innerHTML=`<div class="card-head"><h2 class="card-title">${ico('sparkle')}Adopta una mascota de estudio</h2></div><p class="hint">Nace con tu primer pomodoro, crece con tus horas de foco y evoluciona 4 veces. Si la abandonas, se pone triste… pero nunca se va.</p>
  <div class="pet-pick">${Object.entries(PET_SPECIES).map(([k,s])=>`<button class="pet-opt" data-act="pet-adopt" data-s="${k}"><span class="pet-opt-art">${petSVG({species:k,xp:600,food:80,joy:80,name:s.n},'happy')}</span><b>${s.n}</b><span>${s.d}</span></button>`).join('')}</div>`;return;}
 petTick();const SP=PET_SPECIES[p.species],st=petStage(p),mood=petMood(p);const nx=PET_STAGES[st+1];
 const pct=nx?Math.min(100,(p.xp-PET_STAGES[st].min)/(nx.min-PET_STAGES[st].min)*100):100;
 const bar=(v,cl,l,ic)=>`<div class="pet-st"><span>${ic} ${l}</span><span class="care-bar ${cl}"><i style="width:${Math.round(v)}%"></i></span></div>`;
 el.className='card pet-card m-'+mood;
 el.innerHTML=`<div class="card-head"><h2 class="card-title">${ico('sparkle')}<span class="pet-name" data-act="pet-rename" title="Cambiar nombre">${esc(p.name||SP.n)}</span>${ico('edit','pet-ed')}</h2><span class="chip">${PET_STAGES[st].n}${st===4?' ✨':''}</span></div>
 <div class="pet-wrap"><div class="pet-stage" id="petStage" data-act="pet-pet" title="Acaríciala">${petSVG(p,mood)}</div>
 <div class="pet-info"><p class="pet-mood">${MOOD_TXT[mood]}</p>
  ${st>0?bar(p.food,'food','Energía','🍎')+bar(p.joy,'joy','Ánimo','💖'):''}
  <div class="pet-st"><span>⭐ ${nx?(st===0?`Para nacer: ${p.xp} de ${nx.min} min de foco`:`Hacia ${nx.n.toLowerCase()}: ${fmtMin(p.xp)} de ${Math.round(nx.min/60)} h`):'Forma final alcanzada'}</span><span class="care-bar grow"><i style="width:${pct}%"></i></span></div>
  ${st>0?`<div class="aj-actions"><button class="btn sm" data-act="pet-pet">💖 Mimos</button><button class="btn sm sun" data-act="pet-snack" ${p.snacks>0?'':'disabled'}>🍪 Snack · ${p.snacks||0}</button></div>`:''}</div></div>`;}
/* Mini mascota que estudia contigo en Foco */
function renderPetMini(){const el=$('#petMini');if(!el)return;const p=state.pet;if(!p||!p.species){el.hidden=true;return;}el.hidden=false;
 const run=state.timer.running&&state.timer.mode==='work';const mood=run?'ok':petMood(p);
 el.innerHTML=`${petSVG(p,mood==='sleep'&&run?'ok':mood,{cls:run?'studying':''})}<span>${run?`${esc(p.name)} estudia contigo`:esc(p.name)}</span>`;}

document.addEventListener('click',e=>{const el=e.target.closest('[data-act^="pet-"]');if(!el||el.disabled)return;const a=el.dataset.act;
 if(a==='pet-adopt'){const s=el.dataset.s;state.pet={species:s,name:PET_SPECIES[s].n,born:Date.now(),xp:0,food:80,joy:80,last:Date.now(),snacks:0};save();renderPet();toast(`<b>¡Has adoptado a ${PET_SPECIES[s].n}!</b> Completa un pomodoro para que nazca.`,'sparkle','ach');}
 else if(a==='pet-pet')petAction('pet');else if(a==='pet-snack')petAction('snack');
 else if(a==='pet-close'){$('#petModal').hidden=true;$('#petModal').classList.remove('hatching');}
 else if(a==='pet-tap'){const w=el.querySelector('.hatch');if(w){w.classList.remove('tap');void w.getBoundingClientRect();w.classList.add('tap');}}
 else if(a==='pet-rename'){const n=prompt('¿Cómo quieres llamarla?',state.pet.name||'');if(n&&n.trim()){state.pet.name=n.trim().slice(0,18);save();renderPet();}}});
setInterval(()=>{if(state.pet&&state.pet.species&&state.ui.tab==='inicio'&&!document.hidden){petTick();renderPet();}},60000);
