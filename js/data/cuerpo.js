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
  case 'track':det=`<path d="M100 104 V200" stroke="#fff" stroke-width="4"/><path d="M66 200 L64 258 M134 200 L136 258" stroke="#fff" stroke-width="4"/>`;break;
  case 'denim':det=`<path d="M100 106 V200" stroke="${dk}" stroke-width="3"/><rect x="72" y="132" width="20" height="16" rx="4" fill="none" stroke="#FFCB45" stroke-width="2.5"/><rect x="108" y="132" width="20" height="16" rx="4" fill="none" stroke="#FFCB45" stroke-width="2.5"/><path d="M84 106 L100 128 L116 106" fill="#F4F6FF" ${S}/>`;break;
  case 'pj':det=[[78,135],[118,150],[86,175],[122,182],[72,226],[124,232],[84,250]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#FFE14D" stroke="${OL}" stroke-width="2"/>`).join('')+`<path d="M86 108 Q100 118 114 108" fill="none" ${S}/>`;break;
  case 'fire':det=`<path d="M57 160 L143 160 M57 176 L143 176" stroke="#FFE14D" stroke-width="6"/><path d="M57 160 L143 160 M57 176 L143 176" stroke="#C9D3DC" stroke-width="2"/><path d="M61 240 H96 M104 240 H139" stroke="#FFE14D" stroke-width="6"/><path d="M100 106 V200" stroke="#0E1630" stroke-width="3"/><path d="M84 106 L100 122 L116 106" fill="#0E1630" ${S}/>`;break;
  case 'medic':det=`<path d="M57 168 L143 168" stroke="#2F6BFF" stroke-width="10"/><path d="M57 168 L143 168" stroke="#E4ECEF" stroke-width="3" stroke-dasharray="2 4"/><rect x="104" y="124" width="22" height="22" rx="5" fill="#fff" ${S}/><path d="M115 128 V142 M108 135 H122" stroke="#FF4545" stroke-width="5"/><path d="M84 106 L100 122 L116 106" fill="#2F6BFF" ${S}/>`;break;
  case 'suit':det=`<path d="M84 106 L100 150 L116 106" fill="#F4F6FF" ${S}/><path d="M94 116 L100 124 L106 116 L100 108Z" fill="#FF4D3D" ${S}/><path d="M84 106 L72 140 L100 168 M116 106 L128 140 L100 168" fill="none" ${S}/><circle cx="100" cy="180" r="3" fill="#FFCB45"/>`;break;
  case 'gown':det=`<path d="M60 194 Q54 230 50 258 Q50 264 58 264 H142 Q150 264 150 258 Q146 230 140 194Z" fill="${t}" ${S}/><path d="M86 106 L100 136 L114 106" fill="#FFCB45" ${S}/><path d="M76 120 V250 M124 120 V250" stroke="${dk}" stroke-width="3"/>`;legs='';break;
  case 'armor':det=`<path d="M64 112 Q100 100 136 112 L134 160 Q100 172 66 160Z" fill="#C9D3E0" ${S}/><path d="M100 108 V166" stroke="${OL}" stroke-width="3"/><circle cx="100" cy="136" r="9" fill="#FFCB45" ${S}/><path d="M54 112 Q42 106 40 124 L58 128Z M146 112 Q158 106 160 124 L142 128Z" fill="#8994A8" ${S}/>`;break;
  case 'neon':det=`<path d="M70 120 L70 190 M130 120 L130 190" stroke="#FF2E97" stroke-width="4"/><path d="M70 120 L70 190 M130 120 L130 190" stroke="#fff" stroke-width="1.5"/><path d="M84 150 H116" stroke="#00D9FF" stroke-width="4"/><path d="M63 236 H96 M104 236 H137" stroke="#00D9FF" stroke-width="3"/>`;break;
  case 'space':det=`<rect x="80" y="126" width="40" height="30" rx="7" fill="#5468FF" ${S}/><circle cx="90" cy="141" r="4" fill="#3DFFB0"/><circle cx="103" cy="141" r="4" fill="#FF4D3D"/><rect x="109" y="137" width="6" height="8" fill="#FFE14D"/><path d="M57 186 H143" stroke="#FF8A3D" stroke-width="6"/><path d="M61 236 H96 M104 236 H139" stroke="#FF8A3D" stroke-width="5"/>`;break;
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

/* Dibuja el avatar completo (viewBox 200×300). La cabeza reutiliza el retrato sin fondo ni hombros.
   Con opts.anim respira, balancea los brazos y mueve la cabeza (ver .fb-anim en temporada.css). */
function avatarFullSVG(cfg,opts){opts=opts||{};
 const b=BASES[cfg.base]||BASES.gato;const col=AV_COLORS[cfg.color]||AV_COLORS.pink;const dk=shade(col,-0.22),lt=shade(col,0.45);const id='fb'+uid();
 const O=outfitArt(cfg.outfit||'basica',col);
 const hand=(HANDS[cfg.hand]||HANDS.none)();
 const head=baseArt(cfg.base,col,dk,lt,b)+glassesArt(cfg.glasses,b)+hatArt(cfg.hat,b);
 const bg=opts.bg?`<clipPath id="${id}c"><rect width="200" height="300" rx="26"/></clipPath><g clip-path="url(#${id}c)"><g transform="scale(1.5) translate(-33 0)">${BG_ART[cfg.bg]||BG_ART.liso}</g></g>`:'';
 const cls=['fb'];if(opts.anim)cls.push('fb-anim');if(opts.cls)cls.push(opts.cls);
 return `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar de cuerpo entero" class="${cls.join(' ')}"><defs><clipPath id="${id}"><rect x="-40" y="-80" width="280" height="${opts.full?400:248}"/></clipPath></defs>${bg}
 <ellipse class="fb-shadow" cx="100" cy="286" rx="62" ry="9" fill="#000" opacity=".3"/>
 <g class="fb-all"><g class="fb-low">${O.legs}${shoesArt(cfg.shoes||'zapas')}</g>
 <g class="fb-up">${O.back}${O.torso}${fullExtraArt(cfg.extra)}
 <g class="fb-arm fb-arm-l">${O.armL}<circle cx="40" cy="176" r="10" fill="${col}" ${S}/></g>
 <g class="fb-arm fb-arm-r">${O.armR}<circle cx="160" cy="176" r="10" fill="${col}" ${S}/>${hand}</g>
 <path d="M89 112 L89 100 Q100 96 111 100 L111 112Z" fill="${dk}" ${S}/>
 <g class="fb-head"><g transform="translate(22 -19) scale(.78)" clip-path="url(#${id})">${head}</g></g></g></g></svg>`;}

/* ---- Objetos de cuerpo entero ---- */
ITEMS.outfit=[{id:'basica',name:'Camiseta básica'},{id:'sudadera',name:'Sudadera'},{id:'chandal',name:'Chándal',u:{lvl:3}},{id:'bombera',name:'Uniforme de bombera',u:{lvl:5}},{id:'sanitaria',name:'Uniforme sanitario',u:{ach:'sim1'}},
 {id:'vaquera',name:'Chaqueta vaquera',u:{coins:120}},{id:'chef',name:'Chaqueta de chef',u:{coins:150}},{id:'pijama',name:'Pijama de estrellas',u:{ach:'diario7'}},{id:'espacial',name:'Traje espacial',u:{lvl:9}},
 {id:'neon',name:'Cazadora neón',u:{coins:220}},{id:'gala',name:'Traje de gala',u:{lvl:12}},{id:'armadura',name:'Armadura',u:{ach:'jefe5'}},{id:'toga',name:'Toga de graduación',u:{coins:300}},{id:'superheroe',name:'Traje de superheroína',u:{ach:'record5'},leg:true}];
ITEMS.shoes=[{id:'zapas',name:'Zapatillas'},{id:'deportivas',name:'Deportivas',u:{lvl:2}},{id:'botas',name:'Botas de intervención',u:{ach:'fisico1'}},{id:'zapatos',name:'Zapatos',u:{coins:80}},{id:'neonz',name:'Zapatillas neón',u:{coins:150}},{id:'pantuflas',name:'Pantuflas',u:{ach:'cuidado7'}}];
ITEMS.hand=[{id:'none',name:'Nada'},{id:'libro',name:'Libro'},{id:'cafe',name:'Café',u:{lvl:2}},{id:'lapiz',name:'Lápiz gigante',u:{ach:'primeraTarea'}},{id:'extintor',name:'Extintor',u:{lvl:6}},
 {id:'mochila',name:'Mochila',u:{coins:90}},{id:'linterna',name:'Linterna',u:{coins:110}},{id:'trofeo',name:'Trofeo',u:{ach:'jefe1'}}];
CATS.splice(CATS.findIndex(c=>c[0]==='bg'),0,['outfit','Ropa'],['shoes','Calzado'],['hand','En la mano']);
const BODY_CATS={outfit:1,shoes:1,hand:1};
