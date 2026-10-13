/* Avatar de cuerpo entero: ropa, calzado y objeto en la mano (la cabeza es la del retrato) */
'use strict';

/* Ropa: colores de la parte de arriba (t), de abajo (p), mangas (sl) y detalles (dt) */
const OUTFITS={
 basica:{t:'#F4F6FF',p:'#3A4A8C',dt:'tee'},
 sudadera:{t:'#FF4D3D',p:'#2A2F4F',dt:'hoodie'},
 chandal:{t:'#00B3D9',p:'#00B3D9',dt:'track'},
 vaquera:{t:'#4A78C9',p:'#26325E',dt:'denim'},
 pijama:{t:'#B58CFF',p:'#B58CFF',dt:'pj'},
 bombera:{t:'#1E2A4A',p:'#1E2A4A',dt:'fire'},
 sanitaria:{t:'#F4F6FF',p:'#2F6BFF',dt:'medic'},
 gala:{t:'#17132F',p:'#17132F',dt:'suit'},
 toga:{t:'#2E2852',p:'#2E2852',dt:'gown'},
 armadura:{t:'#A9B4C6',p:'#6B7690',dt:'armor'},
 neon:{t:'#1A1033',p:'#1A1033',dt:'neon'},
 espacial:{t:'#E8ECF5',p:'#E8ECF5',dt:'space'},
 superheroe:{t:'#FF4545',p:'#2F6BFF',dt:'hero'},
 chef:{t:'#FFFFFF',p:'#3A3A4A',dt:'chef'}};
const SHOES={zapas:{c:'#F4F6FF',s:'#FF4D3D'},botas:{c:'#2A2A35',s:'#FFCB45'},deportivas:{c:'#3DFFB0',s:'#17132F'},zapatos:{c:'#3B2416',s:'#5A3A26'},neonz:{c:'#FF2E97',s:'#00D9FF'},pantuflas:{c:'#FF9EC8',s:'#FFFFFF'}};

/* Prendas de temporada: se generan con los colores del mes (ver temporada.js) */
const SEASON_OUTFITS={};

/* Formas del cuerpo: hombros redondeados, cintura suave, codos y piernas con curva */
const TORSO_D='M68 108 Q100 99 132 108 Q145 112 146 127 L143 189 Q142 201 130 202 L70 202 Q58 201 57 189 L54 127 Q55 112 68 108Z';
const ARM_L='M67 117 Q51 124 47 145 Q44 161 40 172',ARM_R='M133 117 Q149 124 153 145 Q156 161 160 172';
function outfitArt(id,skin){const O=OUTFITS[id]||SEASON_OUTFITS[id]||OUTFITS.basica,t=O.t,p=O.p,dk=shade(t,-0.25),pdk=shade(p,-0.25);
 let torso=`<path d="${TORSO_D}" fill="${t}" ${S}/><path d="M64 194 Q100 199 136 194" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
 const arm=(d,c)=>`<path d="${d}" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="15" stroke-linecap="round"/>`;
 const armL=arm(ARM_L,O.sl||t),armR=arm(ARM_R,O.sl||t);
 let legs=`<path d="M61 196 L59 255 Q59 264 68 264 H90 Q97 264 97 256 L100 214 L103 256 Q103 264 110 264 H132 Q141 264 141 255 L139 196Z" fill="${p}" ${S}/><path d="M100 214 V203" stroke="${OL}" stroke-width="3" stroke-linecap="round"/><path d="M70 232 Q76 236 82 232 M118 232 Q124 236 130 232" fill="none" stroke="${pdk}" stroke-width="2.5" stroke-linecap="round"/>`;
 let det='';
 switch(O.dt){
  case 'tee':det=`<path d="M86 108 Q100 120 114 108" fill="none" ${S}/>`;break;
  case 'hoodie':det=`<path d="M74 110 Q100 132 126 110" fill="${dk}" ${S}/><path d="M92 124 V150 M108 124 V150" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="78" y="160" width="44" height="22" rx="10" fill="${dk}" ${S}/>`;break;
  case 'track':det=`<path d="M100 104 V200" stroke="#fff" stroke-width="4"/>`;break;
  case 'denim':det=`<path d="M100 106 V200" stroke="${dk}" stroke-width="3"/><rect x="72" y="132" width="20" height="16" rx="4" fill="none" stroke="#FFCB45" stroke-width="2.5"/><rect x="108" y="132" width="20" height="16" rx="4" fill="none" stroke="#FFCB45" stroke-width="2.5"/><path d="M84 106 L100 128 L116 106" fill="#F4F6FF" ${S}/>`;break;
  case 'pj':det=[[78,135],[118,150],[86,175],[122,182]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#FFE14D" stroke="${OL}" stroke-width="2"/>`).join('')+`<path d="M86 108 Q100 118 114 108" fill="none" ${S}/>`;break;
  case 'fire':det=`<path d="M57 160 L143 160 M57 176 L143 176" stroke="#FFE14D" stroke-width="6"/><path d="M57 160 L143 160 M57 176 L143 176" stroke="#C9D3DC" stroke-width="2"/><path d="M100 106 V200" stroke="#0E1630" stroke-width="3"/><path d="M84 106 L100 122 L116 106" fill="#0E1630" ${S}/>`;break;
  case 'medic':det=`<path d="M57 168 L143 168" stroke="#2F6BFF" stroke-width="10"/><path d="M57 168 L143 168" stroke="#E4ECEF" stroke-width="3" stroke-dasharray="2 4"/><rect x="104" y="124" width="22" height="22" rx="5" fill="#fff" ${S}/><path d="M115 128 V142 M108 135 H122" stroke="#FF4545" stroke-width="5"/><path d="M84 106 L100 122 L116 106" fill="#2F6BFF" ${S}/>`;break;
  case 'suit':det=`<path d="M84 106 L100 150 L116 106" fill="#F4F6FF" ${S}/><path d="M94 116 L100 124 L106 116 L100 108Z" fill="#FF4D3D" ${S}/><path d="M84 106 L72 140 L100 168 M116 106 L128 140 L100 168" fill="none" ${S}/><circle cx="100" cy="180" r="3" fill="#FFCB45"/>`;break;
  case 'gown':det=`<path d="M60 194 Q54 230 50 258 Q50 264 58 264 H142 Q150 264 150 258 Q146 230 140 194Z" fill="${t}" ${S}/><path d="M86 106 L100 136 L114 106" fill="#FFCB45" ${S}/><path d="M76 120 V250 M124 120 V250" stroke="${dk}" stroke-width="3"/>`;legs='';break;
  case 'armor':det=`<path d="M64 112 Q100 100 136 112 L134 160 Q100 172 66 160Z" fill="#C9D3E0" ${S}/><path d="M100 108 V166" stroke="${OL}" stroke-width="3"/><circle cx="100" cy="136" r="9" fill="#FFCB45" ${S}/><path d="M54 112 Q42 106 40 124 L58 128Z M146 112 Q158 106 160 124 L142 128Z" fill="#8994A8" ${S}/>`;break;
  case 'neon':det=`<path d="M70 120 L70 190 M130 120 L130 190" stroke="#FF2E97" stroke-width="4"/><path d="M70 120 L70 190 M130 120 L130 190" stroke="#fff" stroke-width="1.5"/><path d="M84 150 H116" stroke="#00D9FF" stroke-width="4"/>`;break;
  case 'space':det=`<rect x="80" y="126" width="40" height="30" rx="7" fill="#5468FF" ${S}/><circle cx="90" cy="141" r="4" fill="#3DFFB0"/><circle cx="103" cy="141" r="4" fill="#FF4D3D"/><rect x="109" y="137" width="6" height="8" fill="#FFE14D"/><path d="M57 186 H143" stroke="#FF8A3D" stroke-width="6"/>`;break;
  case 'hero':det=`<path d="M78 128 L100 146 L122 128 L114 160 H86Z" fill="#FFE14D" ${S}/><path d="M57 186 H143" stroke="#FFE14D" stroke-width="7"/>`;break;
  case 'chef':det=`<circle cx="92" cy="130" r="3.5" fill="${OL}"/><circle cx="108" cy="130" r="3.5" fill="${OL}"/><circle cx="92" cy="150" r="3.5" fill="${OL}"/><circle cx="108" cy="150" r="3.5" fill="${OL}"/><path d="M84 106 Q100 116 116 106" fill="#FF4545" ${S}/>`;break;
  case 'season':det=O.art||'';break;}
 /* La capa del superhéroe va detrás del cuerpo */
 const cape=O.dt==='hero'?`<path d="M66 112 Q30 190 50 258 Q52 264 60 264 L140 264 Q148 264 150 258 Q170 190 134 112Z" fill="#C21E1E" ${S}/>`:'';
 return {back:cape,legs,torso:torso+det,armL,armR,arms:armL+armR};}

/* Parte de arriba del retrato: la misma prenda que llevas en el cuerpo entero */
function bustArt(id){const O=OUTFITS[id]||SEASON_OUTFITS[id]||OUTFITS.basica,t=O.t,dk=shade(t,-0.25);
 let o=`<path d="M34 206 Q38 160 100 157 Q162 160 166 206Z" fill="${t}" ${S}/>`;
 switch(O.dt){
  case 'tee':case 'pj':o+=`<path d="M84 160 Q100 174 116 160" fill="none" ${S}/>`;if(O.dt==='pj')o+=[[60,186],[138,182],[110,196]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#FFE14D" stroke="${OL}" stroke-width="2"/>`).join('');break;
  case 'hoodie':o+=`<path d="M66 164 Q100 192 134 164" fill="${dk}" ${S}/><path d="M92 180 V204 M108 180 V204" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`;break;
  case 'track':o+=`<path d="M100 158 V206" stroke="#fff" stroke-width="5"/><path d="M84 159 Q100 168 116 159" fill="none" ${S}/>`;break;
  case 'denim':o+=`<path d="M100 166 V206" stroke="${dk}" stroke-width="3"/><path d="M80 158 L100 184 L120 158" fill="#F4F6FF" ${S}/>`;break;
  case 'fire':o+=`<path d="M40 194 Q100 182 160 194" stroke="#FFE14D" stroke-width="8" fill="none"/><path d="M40 194 Q100 182 160 194" stroke="#C9D3DC" stroke-width="2.5" fill="none"/><path d="M82 158 L100 178 L118 158" fill="#0E1630" ${S}/>`;break;
  case 'medic':o+=`<path d="M40 198 Q100 186 160 198" stroke="#2F6BFF" stroke-width="10" fill="none"/><rect x="118" y="170" width="20" height="20" rx="5" fill="#fff" ${S}/><path d="M128 174 V186 M122 180 H134" stroke="#FF4545" stroke-width="4.5"/><path d="M82 158 L100 178 L118 158" fill="#2F6BFF" ${S}/>`;break;
  case 'suit':o+=`<path d="M82 158 L100 206 L118 158" fill="#F4F6FF" ${S}/><path d="M93 168 L100 176 L107 168 L100 160Z" fill="#FF4D3D" ${S}/>`;break;
  case 'gown':o+=`<path d="M84 158 L100 190 L116 158" fill="#FFCB45" ${S}/>`;break;
  case 'armor':o+=`<path d="M58 172 Q100 156 142 172 L140 206 H60Z" fill="#C9D3E0" ${S}/><circle cx="100" cy="190" r="9" fill="#FFCB45" ${S}/>`;break;
  case 'neon':o+=`<path d="M70 172 V206 M130 172 V206" stroke="#FF2E97" stroke-width="4"/><path d="M84 160 Q100 170 116 160" fill="none" stroke="#00D9FF" stroke-width="4"/>`;break;
  case 'space':o+=`<rect x="82" y="176" width="36" height="24" rx="6" fill="#5468FF" ${S}/><circle cx="92" cy="188" r="3.5" fill="#3DFFB0"/><circle cx="104" cy="188" r="3.5" fill="#FF4D3D"/>`;break;
  case 'hero':o+=`<path d="M84 176 L100 190 L116 176 L110 204 H90Z" fill="#FFE14D" ${S}/>`;break;
  case 'chef':o+=`<path d="M82 158 Q100 172 118 158" fill="#FF4545" ${S}/><circle cx="92" cy="190" r="3.5" fill="${OL}"/><circle cx="108" cy="190" r="3.5" fill="${OL}"/>`;break;
  default:o+=`<path d="M84 160 Q100 172 116 160" fill="none" ${S}/>`;}
 return o;}

/* Lo que llevas en el cuello, también en el cuerpo entero */
function fullExtraArt(x){if(!x||x==='none')return '';
 if(x==='chaleco')return `<path d="M68 108 Q60 112 57 128 L58 188 Q59 200 70 200 H92 L92 124 Q84 116 82 107Z M132 108 Q140 112 143 128 L142 188 Q141 200 130 200 H108 L108 124 Q116 116 118 107Z" fill="#FF7A2E" ${S}/><path d="M58 156 H92 M108 156 H142 M58 176 H92 M108 176 H142" stroke="#E4ECEF" stroke-width="6"/>`;
 return `<g transform="translate(22 -19) scale(.78)">${extraArt(x)}</g>`;}
function shoesArt(id){const Z=SHOES[id]||SHOES.zapas;
 return `<path d="M57 259 H96 Q99 259 99 263 V274 Q99 282 90 282 H52 Q43 282 45 273 Q47 262 57 259Z" fill="${Z.c}" ${S}/><path d="M104 259 H143 Q153 262 155 273 Q157 282 148 282 H110 Q101 282 101 274 V263 Q101 259 104 259Z" fill="${Z.c}" ${S}/><path d="M47 276 H98 M102 276 H153" stroke="${Z.s}" stroke-width="4"/>`;}
const HANDS={
 none:()=>'',
 libro:()=>`<g transform="translate(150 158) rotate(-8)"><rect x="-6" y="-2" width="34" height="42" rx="3" fill="#FF4D3D" ${S}/><rect x="-1" y="2" width="5" height="34" fill="#C21E1E"/><path d="M8 12 H22 M8 20 H20" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`,
 cafe:()=>`<g transform="translate(150 152)"><path d="M0 4 H26 L23 36 Q22 40 18 40 H8 Q4 40 3 36Z" fill="#F4F6FF" ${S}/><rect x="-2" y="0" width="30" height="8" rx="3" fill="#6B3E26" ${S}/><path d="M6 18 H20" stroke="#6B3E26" stroke-width="7"/><path d="M8 -6 q3 -5 0 -10 M16 -6 q3 -5 0 -10" stroke="#C9D3DC" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`,
 extintor:()=>`<g transform="translate(146 140)"><rect x="4" y="10" width="22" height="50" rx="10" fill="#FF3D3D" ${S}/><rect x="8" y="2" width="14" height="10" rx="3" fill="#2A2A35" ${S}/><path d="M22 6 Q36 4 38 20" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="8" y="26" width="14" height="14" rx="2" fill="#fff"/></g>`,
 lapiz:()=>`<g transform="translate(150 196) rotate(-70)"><rect x="0" y="-7" width="60" height="14" fill="#FFCB45" ${S}/><path d="M60 -7 L74 0 L60 7Z" fill="#F2D3A8" ${S}/><path d="M68 -2 L74 0 L68 2Z" fill="${OL}"/><rect x="-10" y="-7" width="10" height="14" rx="3" fill="#FF9EC8" ${S}/></g>`,
 trofeo:()=>`<g transform="translate(144 136)"><path d="M6 0 H34 V14 Q34 32 20 34 Q6 32 6 14Z" fill="#FFCB45" ${S}/><path d="M6 6 Q-4 6 -2 16 Q2 24 8 22 M34 6 Q44 6 42 16 Q38 24 32 22" fill="none" stroke="${OL}" stroke-width="3.5"/><rect x="16" y="34" width="8" height="8" fill="#E8961F" ${S}/><rect x="8" y="42" width="24" height="8" rx="2" fill="#6B3E26" ${S}/></g>`,
 mochila:()=>`<g transform="translate(140 132)"><rect x="4" y="6" width="34" height="44" rx="10" fill="#3DFFB0" ${S}/><rect x="10" y="26" width="22" height="16" rx="5" fill="#1FAE80" ${S}/><path d="M14 6 Q21 -6 28 6" fill="none" stroke="${OL}" stroke-width="4"/></g>`,
 linterna:()=>`<g transform="translate(150 160) rotate(-30)"><rect x="0" y="-6" width="32" height="12" rx="4" fill="#2A2A35" ${S}/><path d="M32 -9 H42 V9 H32Z" fill="#FFCB45" ${S}/><path d="M44 -8 L80 -24 V24 L44 8Z" fill="#FFE14D" opacity=".35"/></g>`};

/* ================= ESQUELETO DEL AVATAR =================
   El cuerpo entero está hecho de piezas con articulaciones (como un personaje de videojuego):
   torso, cabeza, brazo + antebrazo, muslo + espinilla y pie. Cada pieza es un <g data-j="…">
   que gira sobre su articulación; el animador (js/ui/animador.js) las mueve 60 veces por segundo.
   Todo se dibuja en coordenadas «de reposo» (viewBox 200×300, suelo en y=282). */
const RIG={
 hip:[100,196],neck:[100,108],cape:[100,112],
 sh:{L:[63,120],R:[137,120]},up:30,fo:30,
 hp:{L:[83,196],R:[117,196]},th:34,sn:34};
/* Pose de reposo: brazos un poco abiertos, pies hacia fuera */
const POSE_IDLE={x:0,y:0,rot:0,spin:0,turn:0,sx:1,sy:1,torso:0,head:0,cape:0,aL1:9,aL2:-8,aR1:-9,aR2:8,lL1:3,lL2:0,lR1:-3,lR2:0,fL:0,fR:0,dL:-1,dR:1};
function rigTf(j,P){const r=n=>Math.round(n*100)/100;
 switch(j){
  case 'root':return `translate(${r(P.x)} ${r(P.y)}) rotate(${r(P.rot)} 100 282) rotate(${r(P.spin)} 100 186) translate(100 282) scale(${r(P.sx)} ${r(P.sy)}) translate(-100 -282)`;
  case 'torso':return `rotate(${r(P.torso)} ${RIG.hip[0]} ${RIG.hip[1]})`;
  case 'head':return `rotate(${r(P.head)} ${RIG.neck[0]} ${RIG.neck[1]})`;
  case 'cape':return `rotate(${r(P.cape)} ${RIG.cape[0]} ${RIG.cape[1]})`;
  case 'aL1':case 'aR1':{const s=RIG.sh[j[1]];return `rotate(${r(P[j])} ${s[0]} ${s[1]})`;}
  case 'aL2':case 'aR2':{const s=RIG.sh[j[1]];return `rotate(${r(P[j])} ${s[0]} ${s[1]+RIG.up})`;}
  case 'lL1':case 'lR1':{const h=RIG.hp[j[1]];return `rotate(${r(P[j])} ${h[0]} ${h[1]})`;}
  case 'lL2':case 'lR2':{const h=RIG.hp[j[1]];return `rotate(${r(P[j])} ${h[0]} ${h[1]+RIG.th})`;}
  case 'fL':case 'fR':{const h=RIG.hp[j[1]],d=P['d'+j[1]];return `translate(${h[0]} ${h[1]+RIG.th+RIG.sn}) scale(${d} 1) rotate(${r(P[j]*d)})`;}}
 return '';}
/* Un segmento de brazo o pierna: contorno + relleno + sombra a un lado (cel-shading) */
function limb(x,y1,y2,w,c,cover){const o=w+7;
 return `<path d="M${x} ${y1} V${y2}" stroke="${OL}" stroke-width="${o}" stroke-linecap="round"/>${cover?`<circle cx="${x}" cy="${y1}" r="${cover/2}" fill="${c}"/>`:''}<path d="M${x} ${y1} V${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/><path d="M${x+w*.28} ${y1+2} V${y2-1}" stroke="#000" stroke-opacity=".16" stroke-width="${w*.36}" stroke-linecap="round"/><path d="M${x-w*.26} ${y1+3} V${y2-4}" stroke="#fff" stroke-opacity=".22" stroke-width="${w*.16}" stroke-linecap="round"/>`;}
/* Zapato visto de frente/lado, dibujado alrededor del tobillo (0,0); la punta mira a +x */
function shoeLocal(id){const Z=SHOES[id]||SHOES.zapas;
 return `<path d="M-12 -2 Q-13 -9 -5 -9 H5 Q12 -8 15 2 Q18 10 11 13 H-10 Q-16 12 -15 5Z" fill="${Z.c}" ${S}/><path d="M-14 9 H15" stroke="${Z.s}" stroke-width="4" stroke-linecap="round"/><path d="M-3 -6 Q4 -6 8 -2" stroke="#fff" stroke-opacity=".45" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;}
/* Detalles de la ropa que van en las piernas (rayas, bandas reflectantes…) */
function legDet(dt,side,x){const out=x+side*-9;let th='',sh='';
 switch(dt){
  case 'track':th=`<path d="M${out} 199 V228" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;sh=`<path d="M${out} 233 V260" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;break;
  case 'fire':sh=`<path d="M${x-12} 246 H${x+12}" stroke="#FFE14D" stroke-width="6"/><path d="M${x-12} 246 H${x+12}" stroke="#C9D3DC" stroke-width="2"/>`;break;
  case 'neon':sh=`<path d="M${x-11} 244 H${x+11}" stroke="#00D9FF" stroke-width="3.5"/>`;th=`<path d="M${out} 200 V226" stroke="#FF2E97" stroke-width="3"/>`;break;
  case 'space':sh=`<path d="M${x-12} 245 H${x+12}" stroke="#FF8A3D" stroke-width="5"/>`;break;
  case 'pj':th=`<circle cx="${x+side*3}" cy="212" r="4.5" fill="#FFE14D" stroke="${OL}" stroke-width="2"/>`;sh=`<circle cx="${x-side*3}" cy="250" r="4" fill="#FFE14D" stroke="${OL}" stroke-width="2"/>`;break;
  case 'hero':sh=`<path d="M${x-11} 248 H${x+11}" stroke="#C21E1E" stroke-width="9"/>`;break;
  case 'armor':th=`<rect x="${x-10}" y="222" width="20" height="14" rx="5" fill="#C9D3E0" ${S}/>`;break;}
 return {th,sh};}
function legSVG(side,O,cfg){const k=side<0?'L':'R',[x,y]=RIG.hp[k],kn=y+RIG.th,an=kn+RIG.sn,D=legDet(O.dt,side,x);
 return `<g data-j="l${k}1" transform="">${limb(x,y+2,kn,23,O.p)}${D.th}<g data-j="l${k}2" transform="">${limb(x,kn,an-3,20,O.p,23)}${D.sh}<g data-j="f${k}" transform="">${shoeLocal(cfg.shoes||'zapas')}</g></g></g>`;}
function armSVG(side,O,col,hand){const k=side<0?'L':'R',[x,y]=RIG.sh[k],el=y+RIG.up,wr=el+RIG.fo,sl=O.sl||O.t,fo=O.dt==='tee'?col:sl;
 const cuff=O.dt==='tee'?'':`<path d="M${x-8} ${wr-7} H${x+8}" stroke="${shade(sl,-.25)}" stroke-width="4" stroke-linecap="round"/>`;
 return `<g data-j="a${k}1" transform="">${limb(x,y,el,15,sl)}<g data-j="a${k}2" transform="">${limb(x,el,wr-6,14,fo,fo===sl?15:0)}${cuff}<circle cx="${x}" cy="${wr}" r="10" fill="${col}" ${S}/><path d="M${x-4} ${wr-5} q-3 4 0 8" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" fill="none" stroke-linecap="round"/>${hand?`<g transform="translate(${x-160} ${wr-176})">${hand}</g>`:''}</g></g>`;}

/* Dibuja el avatar completo (viewBox 200×300). La cabeza reutiliza el retrato sin fondo ni hombros.
   opts.bg: con fondo · opts.cls: clases extra · opts.pose: pose estática (por defecto, reposo).
   Para que se mueva, pásale el <svg> a rigAttach() (js/ui/animador.js). */
function avatarFullSVG(cfg,opts){opts=opts||{};
 const b=BASES[cfg.base]||BASES.gato;const col=AV_COLORS[cfg.color]||AV_COLORS.pink;const dk=shade(col,-0.22),lt=shade(col,0.45);const id='fb'+uid();
 const O0=OUTFITS[cfg.outfit]||SEASON_OUTFITS[cfg.outfit]||OUTFITS.basica;const O=outfitArt(cfg.outfit||'basica',col);
 const hand=(HANDS[cfg.hand]||HANDS.none)();
 /* La cabeza va por capas para poder girar la cara de 3/4 al correr (ver rigPrepFace en animador.js) */
 const head=`<g class="hd-base">${baseArt(cfg.base,col,dk,lt,b)}</g><g class="hd-gl" data-turn="1">${glassesArt(cfg.glasses,b)}</g><g class="hd-hat" data-turn="hat">${hatArt(cfg.hat,b)}</g>`;
 const bg=opts.bg?`<clipPath id="${id}c"><rect width="200" height="300" rx="26"/></clipPath><g clip-path="url(#${id}c)"><g transform="scale(1.5) translate(-33 0)">${BG_ART[cfg.bg]||BG_ART.liso}</g></g>`:'';
 const cls=['fb','rig'];if(opts.stage)cls.push('rig-stage');if(opts.cls)cls.push(opts.cls);
 /* Sombreado del torso: luz desde arriba a la izquierda */
 const tShade=`<g clip-path="url(#${id}t)"><path d="M126 96 Q154 150 140 210 H170 V96Z" fill="#000" opacity=".17"/><path d="M50 186 Q100 200 150 186 V210 H50Z" fill="#000" opacity=".12"/><path d="M64 118 Q58 150 62 184" stroke="#fff" stroke-opacity=".25" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
 /* Escenario tipo «elige tu personaje»: foco de luz, pedestal que brilla, chispas y suelo para la carrera */
 const stage=opts.stage?`<defs><linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><radialGradient id="${id}p" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7FF5FF"/><stop offset=".7" stop-color="#2F6BFF"/><stop offset="1" stop-color="#1B1F5E"/></radialGradient><radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7FF5FF" stop-opacity=".55"/><stop offset="1" stop-color="#7FF5FF" stop-opacity="0"/></radialGradient></defs>
  <path class="rig-beam" d="M72 -10 H128 L178 290 H22Z" fill="url(#${id}l)"/>
  <g class="rig-floor"><path d="M-20 282 H220" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-dasharray="16 22"/><path d="M-20 294 H220" stroke="#fff" stroke-opacity=".2" stroke-width="2" stroke-dasharray="26 30"/></g>
  <ellipse cx="100" cy="289" rx="74" ry="16" fill="#120E33" stroke="${OL}" stroke-width="3"/><ellipse cx="100" cy="284" rx="70" ry="12" fill="url(#${id}p)" stroke="${OL}" stroke-width="3"/>
  <ellipse class="rig-ring" cx="100" cy="284" rx="58" ry="8.5" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-dasharray="10 8"/>
  <ellipse cx="100" cy="270" rx="70" ry="40" fill="url(#${id}g)" class="rig-glow"/>
  ${[[40,.0],[160,.7],[62,1.4],[140,2.1],[100,2.8],[28,3.3],[176,1.1]].map(([x,d])=>`<circle class="rig-spark" cx="${x}" cy="280" r="${(2+((x*7)%3)).toFixed(0)}" fill="#BFFBFF" style="animation-delay:${d}s"/>`).join('')}`:'';
 const slash=opts.stage?`<g class="rig-slash"><path d="M120 60 Q190 120 150 220" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M120 60 Q190 120 150 220" fill="none" stroke="#FFE14D" stroke-width="4" stroke-linecap="round"/></g>`:'';
 const svg=`<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar de cuerpo entero" class="${cls.join(' ')}"><defs><clipPath id="${id}"><rect x="-40" y="-80" width="280" height="248"/></clipPath><clipPath id="${id}t"><path d="${TORSO_D}"/></clipPath></defs>${bg}${stage}
 ${opts.stage?'<g transform="translate(12 30) scale(.88)">':''}<g data-j="fx-back"></g>
 <ellipse data-j="shadow" cx="100" cy="286" rx="58" ry="8" fill="#000" opacity=".3"/>
 <g data-j="root" transform="">
  <g data-j="torso" transform=""><g data-j="cape" transform="">${O.back}</g></g>
  ${legSVG(-1,O0,cfg)}${legSVG(1,O0,cfg)}
  <g data-j="torso" transform="">
   ${O.torso}${tShade}${fullExtraArt(cfg.extra)}
   <path d="M89 112 L89 100 Q100 96 111 100 L111 112Z" fill="${dk}" ${S}/>
   <g data-j="head" transform=""><g transform="translate(22 -19) scale(.78)" clip-path="url(#${id})">${head}</g></g>
   ${armSVG(-1,O0,col,'')}${armSVG(1,O0,col,hand)}
  </g>
 </g>
 ${slash}<g data-j="fx"></g>${opts.stage?'</g>':''}</svg>`;
 return rigApplyStr(svg,Object.assign({},POSE_IDLE,opts.pose||{}));}
/* Pone una pose en el texto del SVG (para miniaturas estáticas) */
function rigApplyStr(svg,P){return svg.replace(/data-j="([A-Za-z0-9]+)" transform=""/g,(m,j)=>`data-j="${j}" transform="${rigTf(j,P)}"`);}

ITEMS.outfit=[{id:'basica',name:'Camiseta básica'},{id:'sudadera',name:'Sudadera'},{id:'chandal',name:'Chándal',u:{lvl:3}},{id:'bombera',name:'Uniforme de bombera',u:{lvl:5}},{id:'sanitaria',name:'Uniforme sanitario',u:{coins:2400}},
 {id:'vaquera',name:'Chaqueta vaquera',u:{coins:120}},{id:'chef',name:'Chaqueta de chef',u:{coins:150}},{id:'pijama',name:'Pijama de estrellas',u:{ach:'diario7'}},{id:'espacial',name:'Traje espacial',u:{lvl:9}},
 {id:'neon',name:'Cazadora neón',u:{coins:220}},{id:'gala',name:'Traje de gala',u:{lvl:12}},{id:'armadura',name:'Armadura',u:{ach:'jefe5'}},{id:'toga',name:'Toga de graduación',u:{coins:300}},{id:'superheroe',name:'Traje de superheroína',u:{ach:'record5'},leg:true}];
ITEMS.shoes=[{id:'zapas',name:'Zapatillas'},{id:'deportivas',name:'Deportivas',u:{ach:'fisico1'}},{id:'botas',name:'Botas de intervención',u:{coins:1800}},{id:'zapatos',name:'Zapatos',u:{coins:80}},{id:'neonz',name:'Zapatillas neón',u:{coins:150}},{id:'pantuflas',name:'Pantuflas',u:{ach:'cuidado7'}}];
ITEMS.hand=[{id:'none',name:'Nada'},{id:'libro',name:'Libro'},{id:'cafe',name:'Café',u:{lvl:2}},{id:'lapiz',name:'Lápiz gigante',u:{ach:'primeraTarea'}},{id:'extintor',name:'Extintor',u:{lvl:6}},
 {id:'mochila',name:'Mochila',u:{coins:90}},{id:'linterna',name:'Linterna',u:{coins:110}},{id:'trofeo',name:'Trofeo',u:{ach:'jefe1'}}];
CATS.splice(CATS.findIndex(c=>c[0]==='bg'),0,['outfit','Ropa'],['shoes','Calzado'],['hand','En la mano']);
const BODY_CATS={outfit:1,shoes:1,hand:1};
