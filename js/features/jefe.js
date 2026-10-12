/* Jefe semanal: un monstruo nuevo cada lunes al que se le quita vida estudiando */
'use strict';

const BOSSES={
 golem:{name:'Gólem Procrastinador',taunt:'«Ya empezarás mañana…»',c:'#8C93A8'},
 hidra:{name:'Hidra de las Notificaciones',taunt:'«Solo un vistazo al móvil…»',c:'#9B6BFF'},
 sofa:{name:'Dragón del Sofá',taunt:'«Un capítulo más y te pones.»',c:'#4CC46A'},
 manana:{name:'Espectro del «Mañana lo hago»',taunt:'«Hoy no, que estás cansada.»',c:'#9FD4FF'},
 kraken:{name:'Kraken del Scroll',taunt:'«Desliza, desliza, desliza…»',c:'#1FC7C7'},
 ogro:{name:'Ogro del Sueño',taunt:'«Cinco minutitos más…»',c:'#FF9A3D'},
 caos:{name:'Bestia del Caos',taunt:'«¿Y si lo dejas todo para el final?»',c:'#FF4D3D'},
 slime:{name:'Slime del Despiste',taunt:'«¿Por dónde ibas?»',c:'#B6F04A'}
};
const BOSS_IDS=Object.keys(BOSSES);
/* Fondo de avatar que se gana al vencer al primer jefe */
BG_ART.arena='<rect width="200" height="200" fill="#2A0A12"/>'+[96,76,56,36].map((r,i)=>`<circle cx="100" cy="100" r="${r}" fill="${i%2?'#5A1428':'#3D0E1C'}"/>`).join('')+'<path d="M40 160 L160 40 M40 40 L160 160" stroke="#FFCB45" stroke-width="8" stroke-linecap="round" opacity=".55"/>';
ITEMS.bg.push({id:'arena',name:'Arena del jefe',u:{ach:'jefe1'}});
const BOSS_MOVES=[['timer','Pomodoro','−40'],['check','Tarea','−15'],['repeat','Repaso o vuelta','−25 / −30'],['clipboard','Acierto en test','−5'],['cards','Flashcard','−3']];
let bossFx=0;

function bossSVG(id,down){
 const b=BOSSES[id]||BOSSES.golem,c=b.c,dk=shade(c,-0.28),lt=shade(c,0.4);
 const eye=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x+1}" cy="${y+1}" r="${r*.45}" fill="${OL}"/>`;
 const xeye=(x,y)=>`<path d="M${x-7} ${y-7}L${x+7} ${y+7}M${x+7} ${y-7}L${x-7} ${y+7}" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
 const eyes=(pts,r)=>pts.map(([x,y])=>down?xeye(x,y):eye(x,y,r)).join('');
 const brows=(l,r)=>down?'':`<path d="M${l-12} ${l===74?84:82}L${l+10} 90M${r+12} 84L${r-10} 90" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
 let o='';
 switch(id){
 case 'hidra':o=`<path d="M70 62 Q60 30 48 20 M100 56 V14 M130 62 Q140 30 152 20" stroke="${OL}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="48" cy="20" r="11" fill="#FF4D3D" ${S}/><circle cx="100" cy="14" r="11" fill="#FF4D3D" ${S}/><circle cx="152" cy="20" r="11" fill="#FF4D3D" ${S}/><text x="48" y="25" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">9</text><text x="100" y="19" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">!</text><text x="152" y="25" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">3</text><ellipse cx="100" cy="118" rx="68" ry="62" fill="${c}" ${S}/>${eyes([[72,104],[100,92],[128,104]],12)}<path d="M74 140 Q100 158 126 140" fill="${OL}" ${S}/>`;break;
 case 'sofa':o=`<rect x="22" y="146" width="156" height="40" rx="16" fill="#C0392B" ${S}/><path d="M60 64 L52 30 L78 54Z M140 64 L148 30 L122 54Z" fill="#FFE14D" ${S}/><path d="M36 100 L10 76 L24 112Z M164 100 L190 76 L176 112Z" fill="${dk}" ${S}/><ellipse cx="100" cy="110" rx="62" ry="56" fill="${c}" ${S}/><ellipse cx="100" cy="132" rx="34" ry="20" fill="${lt}" ${S}/>${eyes([[78,98],[122,98]],11)}${brows(78,122)}<path d="M84 136 L90 146 L96 136 L102 146 L108 136 L114 146" fill="#fff" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;break;
 case 'manana':{let w='';for(let i=0;i<6;i++)w+=' q-10 16 -20 0';return wrapBoss(`<path d="M40 182 V98 A60 60 0 0 1 160 98 V182${w}Z" fill="${c}" ${S}/>${down?xeye(80,100)+xeye(120,100):`<path d="M70 100 Q80 92 90 100" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M110 100 Q120 92 130 100" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/>`}<ellipse cx="100" cy="128" rx="10" ry="13" fill="${OL}"/><circle cx="152" cy="52" r="20" fill="#fff" ${S}/><path d="M152 40 V52 L160 58" stroke="${OL}" stroke-width="4" fill="none" stroke-linecap="round"/>`,down);}
 case 'kraken':o=`<path d="M50 120 Q20 160 36 194 M78 136 Q66 176 82 200 M122 136 Q134 176 118 200 M150 120 Q180 160 164 194" stroke="${OL}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M50 120 Q20 160 36 194 M78 136 Q66 176 82 200 M122 136 Q134 176 118 200 M150 120 Q180 160 164 194" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="146" y="150" width="30" height="48" rx="6" fill="#20263A" ${S}/><rect x="151" y="156" width="20" height="32" rx="3" fill="#5CF2FF"/><ellipse cx="100" cy="92" rx="62" ry="62" fill="${c}" ${S}/><circle cx="70" cy="60" r="7" fill="${lt}"/><circle cx="128" cy="56" r="5" fill="${lt}"/>${eyes([[80,96],[120,96]],13)}${brows(80,120)}<path d="M86 128 Q100 120 114 128" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/>`;break;
 case 'ogro':o=`<path d="M48 82 Q60 18 140 40 Q170 50 176 30 Q186 60 152 80Z" fill="#5468FF" ${S}/><circle cx="178" cy="28" r="10" fill="#fff" ${S}/><ellipse cx="100" cy="116" rx="64" ry="60" fill="${c}" ${S}/>${down?xeye(100,104):`<circle cx="100" cy="104" r="22" fill="#fff" ${S}/><circle cx="100" cy="108" r="9" fill="${OL}"/><path d="M78 100 Q100 90 122 100 L122 92 Q100 80 78 92Z" fill="${c}" stroke="${OL}" stroke-width="4"/>`}<path d="M80 146 Q100 136 120 146" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M84 144 L88 132 L92 142 M116 144 L112 132 L108 142" fill="#fff" stroke="${OL}" stroke-width="2.5"/><text x="150" y="80" font-size="18" font-weight="900" fill="#fff" font-family="Arial" opacity=".9">z</text><text x="162" y="66" font-size="13" font-weight="900" fill="#fff" font-family="Arial" opacity=".7">z</text>`;break;
 case 'caos':{let sp='';for(let i=0;i<12;i++){const a=i*Math.PI/6,r1=58,r2=82;const x1=100+Math.cos(a-.2)*r1,y1=108+Math.sin(a-.2)*r1,x2=100+Math.cos(a)*r2,y2=108+Math.sin(a)*r2,x3=100+Math.cos(a+.2)*r1,y3=108+Math.sin(a+.2)*r1;sp+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}Z" fill="${dk}" ${S}/>`;}
  o=`${sp}<circle cx="100" cy="108" r="62" fill="${c}" ${S}/>${eyes([[80,100],[120,100]],12)}${brows(80,120)}<path d="M74 136 Q100 160 126 136Z" fill="${OL}"/><path d="M82 138 L88 148 L94 140 L100 150 L106 140 L112 148 L118 138" fill="#fff"/>`;break;}
 case 'slime':o=`<path d="M30 180 Q24 110 60 80 Q100 44 140 80 Q176 110 170 180 Q150 170 140 184 Q124 168 108 186 Q92 168 76 184 Q60 168 46 184Z" fill="${c}" ${S}/><circle cx="74" cy="90" r="8" fill="#fff" opacity=".6"/>${down?xeye(80,118)+xeye(122,118):`<circle cx="80" cy="118" r="14" fill="#fff" ${S}/><circle cx="122" cy="118" r="14" fill="#fff" ${S}/><path d="M80 118 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3" stroke="${OL}" stroke-width="2.5" fill="none"/><path d="M122 118 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3" stroke="${OL}" stroke-width="2.5" fill="none"/>`}<path d="M90 150 Q100 144 110 150" stroke="${OL}" stroke-width="4" fill="none" stroke-linecap="round"/>`;break;
 default:o=`<rect x="36" y="44" width="128" height="136" rx="26" fill="${c}" ${S}/><path d="M58 70 L74 86 L66 100 M140 140 L126 150 L132 164" stroke="${dk}" stroke-width="4" fill="none"/><rect x="22" y="110" width="22" height="46" rx="10" fill="${dk}" ${S}/><rect x="156" y="110" width="22" height="46" rx="10" fill="${dk}" ${S}/>${down?xeye(80,104)+xeye(120,104):`<circle cx="80" cy="104" r="12" fill="#fff" ${S}/><circle cx="120" cy="104" r="12" fill="#fff" ${S}/><circle cx="80" cy="108" r="5" fill="${OL}"/><circle cx="120" cy="108" r="5" fill="${OL}"/><path d="M66 100 H94 M106 100 H134" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M67 98 Q80 88 93 98Z M107 98 Q120 88 133 98Z" fill="${c}"/>`}<path d="M84 140 H116" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><text x="150" y="40" font-size="20" font-weight="900" fill="#fff" font-family="Arial" opacity=".85">Z</text><text x="166" y="24" font-size="14" font-weight="900" fill="#fff" font-family="Arial" opacity=".6">z</text>`;
 }
 return wrapBoss(o,down);}
function wrapBoss(inner,down){return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jefe semanal"${down?' class="boss-down"':''}><ellipse cx="100" cy="192" rx="70" ry="8" fill="#000" opacity=".35"/>${inner}</svg>`;}

/* ---- Estado del jefe ---- */
function ensureBoss(){
 const ws=weekStart(today()),b=state.boss;if(b&&b.week===ws)return false;
 if(b){state.bossHist.push({week:b.week,id:b.id,won:!!b.won});if(state.bossHist.length>80)state.bossHist.shift();}
 const lv=levelInfo(state.xp).level,max=500+25*(Math.min(lv,30)-1);
 const r=rng('jefe-'+ws);let id=BOSS_IDS[Math.floor(r()*BOSS_IDS.length)];if(b&&b.id===id)id=BOSS_IDS[(BOSS_IDS.indexOf(id)+1)%BOSS_IDS.length];
 state.boss={week:ws,id,max,hp:max,won:false,wonAt:null,hits:[]};return !!b;}
function bossHit(n,why){
 ensureBoss();const b=state.boss;n=Math.round(n);if(b.won||n<=0)return;
 const from=b.hp;b.hp=Math.max(0,b.hp-n);b.hits.unshift({n,why,at:Date.now()});b.hits=b.hits.slice(0,5);bossFx=Date.now();
 const name=BOSSES[b.id].name;
 if(b.hp<=0){b.won=true;b.wonAt=Date.now();state.counts.bossWins=(state.counts.bossWins||0)+1;
  const prot=state.freezes<3;if(prot)state.freezes++;
  grantXP(250,'¡Jefe derrotado!',prot?120:170,true);
  toast(`<b>¡Has derrotado a ${esc(name)}!</b><br>+250 XP · ${prot?'+120 monedas · +1 protector de racha':'+170 monedas'}`,'trophy','ach');confetti(220);}
 showBossHit(n,from,b.hp,b.max,b.id,b.won,why);}

/* ---- Animación de golpe en mitad de la pantalla (no bloquea nada y se va sola) ---- */
const bossPop={timer:null,dmg:0,from:0};
function showBossHit(n,from,to,max,id,won,why){
 let el=$('#bossPop');
 if(!el){el=document.createElement('div');el.id='bossPop';el.className='boss-pop';el.setAttribute('aria-hidden','true');el.hidden=true;document.body.appendChild(el);}
 if(bossPop.timer&&!el.hidden){bossPop.dmg+=n;}else{bossPop.dmg=n;bossPop.from=from;}
 clearTimeout(bossPop.timer);
 const pf=bossPop.from/max*100,pt=to/max*100;
 el.innerHTML=`<div class="bp-card${won?' win':''}"><div class="bp-art">${bossSVG(id,won)}<span class="bp-dmg">−${bossPop.dmg}</span></div><div class="bp-name">${esc(BOSSES[id].name)}</div><div class="bp-bar"><i class="bp-ghost" style="width:${pf}%"></i><i class="bp-fill" style="width:${pf}%"></i></div><div class="bp-hp"><b>${to}</b> / ${max} PV${why?` · ${esc(why)}`:''}</div>${won?'<div class="bp-win">¡Derrotado!</div>':''}</div>`;
 el.classList.remove('out');el.hidden=false;
 const fill=el.querySelector('.bp-fill'),ghost=el.querySelector('.bp-ghost');
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(fill)fill.style.width=pt+'%';if(ghost)ghost.style.width=pt+'%';}));
 bossPop.timer=setTimeout(()=>{el.classList.add('out');bossPop.timer=setTimeout(()=>{el.hidden=true;el.classList.remove('out');bossPop.timer=null;},400);},won?2800:1800);}

function renderBoss(){
 const el=$('#bossCard');if(!el)return;ensureBoss();
 const b=state.boss,B=BOSSES[b.id],pct=b.hp/b.max*100,wd=(pdate(today()).getDay()+6)%7,left=6-wd;
 const hit=Date.now()-bossFx<1600&&!b.won;
 const when=b.won?`Derrotado el ${new Date(b.wonAt).toLocaleDateString('es-ES',{weekday:'long'})}`:left===0?'¡Último día para vencerlo!':`Quedan ${left} ${left===1?'día':'días'} · hasta el domingo`;
 el.className=`card boss-card${b.won?' down':''}${hit?' hit':''}${!b.won&&left===0?' urgent':''}`;
 el.innerHTML=`<div class="boss-art">${bossSVG(b.id,b.won)}${hit&&b.hits[0]?`<span class="boss-dmg">−${b.hits[0].n}</span>`:''}${b.won?'<span class="boss-stamp">¡Vencido!</span>':''}</div>
 <div class="boss-info"><span class="eyebrow">Jefe de la semana · ${when}</span><h2 class="boss-name">${esc(B.name)}</h2><p class="boss-taunt">${b.won?'Vuelve el lunes con un jefe nuevo. ¡Buen trabajo!':esc(B.taunt)}</p>
  <div class="boss-hp"><div class="boss-hpbar" role="progressbar" aria-label="Vida del jefe" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></div><span>${b.hp} / ${b.max} PV</span></div>
  <ul class="boss-moves">${BOSS_MOVES.map(([i,l,d])=>`<li>${ico(i)}<span>${l}</span><b>${d}</b></li>`).join('')}</ul>
  <div class="boss-foot"><span class="boss-reward">${ico('gift')}${b.won?'Recompensa conseguida':'Recompensa: 250 XP · 120 monedas · 1 protector de racha'}</span>${b.hits.length?`<span class="boss-last">Último golpe: −${b.hits[0].n} · ${esc(b.hits[0].why)}</span>`:''}</div>
 </div>`;}
