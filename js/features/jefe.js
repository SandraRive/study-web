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
 slime:{name:'Slime del Despiste',taunt:'«¿Por dónde ibas?»',c:'#B6F04A'},
 trasnoche:{a:'murci',name:'Murciélago Trasnochador',taunt:'«Total, por una noche sin dormir…»',c:'#6B5BA8'},
 ultimominuto:{a:'reloj',name:'Reloj del Último Minuto',taunt:'«Aún queda tiempo de sobra.»',c:'#FFCB45'},
 niebla:{a:'nube',name:'Nube de la Niebla Mental',taunt:'«¿Qué estabas leyendo?»',c:'#B9C4D9'},
 pestanas:{a:'arana',name:'Araña de las Pestañas',taunt:'«Abre otra pestaña, solo una.»',c:'#5A607A'},
 tentador:{a:'movil',name:'Móvil Tentador',taunt:'«Tienes 47 mensajes sin leer.»',c:'#2EE6FF'},
 hipnotica:{a:'almohada',name:'Almohada Hipnótica',taunt:'«Túmbate un ratito…»',c:'#F4F0FF',acc:'gorro'},
 excusa:{a:'serpiente',name:'Serpiente de la Excusa',taunt:'«Hoy hace demasiado calor para estudiar.»',c:'#4CC46A'},
 agobio:{a:'cactus',name:'Cactus del Agobio',taunt:'«Es demasiado temario, no llegas.»',c:'#3EDDA8'},
 invernal:{a:'yeti',name:'Yeti de la Pereza Invernal',taunt:'«Con este frío, mejor en la cama.»',c:'#DDE9F5',acc:'gorro'},
 bloqueo:{a:'calabaza',name:'Calabaza del Bloqueo',taunt:'«Te has quedado en blanco.»',c:'#FF8A3D'},
 maraton:{a:'tele',name:'Tele Maratón',taunt:'«Siguiente episodio en 5, 4, 3…»',c:'#8C93A8'},
 anzuelo:{a:'pez',name:'Rape del Anzuelo',taunt:'«Mira qué vídeo tan interesante…»',c:'#3B5BD6'},
 perfeccion:{a:'golem',name:'Gólem del Perfeccionismo',taunt:'«Si no sale perfecto, mejor no empieces.»',c:'#C9D3DC',acc:'gafas'},
 multitarea:{a:'hidra',name:'Hidra de la Multitarea',taunt:'«Haz tres cosas a la vez, ¿qué puede salir mal?»',c:'#FF6FB0'},
 siesta:{a:'sofa',name:'Dragón de la Siesta Eterna',taunt:'«Una siesta de tres horas no hace daño.»',c:'#9B6BFF',acc:'gorro'},
 plazo:{a:'manana',name:'Fantasma del Plazo Olvidado',taunt:'«¿Era para hoy?»',c:'#FFD1E8'},
 memes:{a:'kraken',name:'Kraken de los Memes',taunt:'«Solo uno más y te pones.»',c:'#FF6B5A',acc:'gafas'},
 madrugon:{a:'ogro',name:'Ogro del Madrugón',taunt:'«Apaga el despertador, nadie se enterará.»',c:'#B6F04A'},
 desorden:{a:'caos',name:'Bestia del Desorden',taunt:'«¿Dónde dejaste los apuntes?»',c:'#FF8A3D',acc:'bandana'},
 duda:{a:'slime',name:'Slime de la Duda',taunt:'«¿Y si te has equivocado de temario?»',c:'#2EE6FF',acc:'chistera'},
 vampiro:{a:'murci',name:'Vampiro de la Energía',taunt:'«Dame tus ganas de estudiar.»',c:'#C0392B',acc:'chistera'},
 derretido:{a:'reloj',name:'Reloj Derretido',taunt:'«El tiempo pasa volando, ¿no?»',c:'#FF9EC8'},
 desanimo:{a:'nube',name:'Nubarrón del Desánimo',taunt:'«Total, para qué.»',c:'#6E6890'},
 tarantula:{a:'arana',name:'Tarántula del Agobio',taunt:'«Mira cuánto te queda por hacer.»',c:'#A0592A',acc:'corona'},
 hipnofono:{a:'movil',name:'Smartphone Hipnótico',taunt:'«Solo un vídeo de 10 segundos.»',c:'#FF6FB0',acc:'auris'},
 edredon:{a:'almohada',name:'Edredón Pegajoso',taunt:'«Cinco minutitos más bajo la manta.»',c:'#7D8CFF'},
 comparacion:{a:'serpiente',name:'Víbora de la Comparación',taunt:'«Los demás van mucho más adelantados.»',c:'#E8B923',acc:'corona'},
 estres:{a:'cactus',name:'Cactus del Estrés',taunt:'«No vas a llegar a tiempo.»',c:'#25D7C7',acc:'auris'},
 atracon:{a:'yeti',name:'Abominable del Atracón',taunt:'«Ya lo estudiarás todo la noche antes.»',c:'#C9AEFF'},
 panico:{a:'calabaza',name:'Calabaza del Pánico',taunt:'«¿Y si suspendes?»',c:'#FFCB45',acc:'chistera'},
 consola:{a:'tele',name:'Monitor del Videojuego',taunt:'«Una partida rápida y estudias.»',c:'#3EDDA8',acc:'auris'},
 urgente:{a:'pez',name:'Pez Globo de lo Urgente',taunt:'«¡Todo es para ya!»',c:'#FFE14D'},
 rutina:{a:'golem',name:'Gólem de la Rutina Rota',taunt:'«Hoy no toca, mañana sí.»',c:'#A0592A',acc:'casco'},
 grupos:{a:'hidra',name:'Hidra de los Grupos de Chat',taunt:'«312 mensajes nuevos.»',c:'#3EDDA8'},
 picoteo:{a:'sofa',name:'Dragón del Picoteo',taunt:'«Primero un snack, luego estudias.»',c:'#FF8A3D',acc:'bigote'},
 inseguridad:{a:'manana',name:'Espectro de la Inseguridad',taunt:'«No eres capaz de aprobar.»',c:'#B7A6FF',acc:'aureola'},
 compras:{a:'kraken',name:'Kraken de las Compras Online',taunt:'«Mira esas ofertas…»',c:'#B58CFF',acc:'corona'},
 ruido:{a:'ogro',name:'Ogro del Ruido',taunt:'«¡BLA, BLA, BLA!»',c:'#E0533F',acc:'auris'},
 ansiedad:{a:'caos',name:'Bestia de la Ansiedad',taunt:'«Piensa en todo lo que puede salir mal.»',c:'#9B6BFF'},
 tumbada:{a:'slime',name:'Slime del Estudio en la Cama',taunt:'«Estudia tumbada, que es lo mismo.»',c:'#FF9EC8',acc:'gorro'},
 nocturno:{a:'murci',name:'Murciélago del Scroll Nocturno',taunt:'«Solo son las tres de la mañana.»',c:'#3D3770',acc:'auris'},
 despertador:{a:'reloj',name:'Despertador Traicionero',taunt:'«Pospón la alarma otra vez.»',c:'#FF4D3D',acc:'bigote'},
 zapping:{a:'tele',name:'Tele del Zapping',taunt:'«Cambia de canal, a ver qué echan.»',c:'#FF2E97'},
 brillante:{a:'pez',name:'Pez Payaso de la Distracción',taunt:'«¡Mira, mira, algo brillante!»',c:'#FF8A3D',acc:'bandana'},
 final:{a:'caos',name:'El Gran Procrastinador',taunt:'«Soy el jefe final: el de todas tus excusas.»',c:'#E8B923',acc:'corona',final:true}
};
const BOSS_IDS=Object.keys(BOSSES);
const BOSS_REG=BOSS_IDS.filter(x=>!BOSSES[x].final);

/* Puntos de referencia de cada tipo de monstruo: parte de arriba de la cabeza (t), altura de los ojos (e) y posición de los ojos (ex) */
const BOSS_ANCHOR={golem:{t:44,e:104,ex:[80,120]},hidra:{t:58,e:100,ex:[72,128]},sofa:{t:56,e:98,ex:[78,122]},manana:{t:40,e:100,ex:[80,120]},kraken:{t:32,e:96,ex:[80,120]},ogro:{t:58,e:104,ex:[100]},caos:{t:48,e:100,ex:[80,120]},slime:{t:66,e:118,ex:[80,122]},
 murci:{t:56,e:104,ex:[80,120]},reloj:{t:42,e:96,ex:[82,118]},nube:{t:50,e:112,ex:[84,120]},arana:{t:70,e:108,ex:[82,118]},movil:{t:30,e:96,ex:[84,116]},almohada:{t:70,e:112,ex:[80,120]},serpiente:{t:42,e:68,ex:[86,114]},cactus:{t:36,e:92,ex:[88,112]},yeti:{t:52,e:104,ex:[86,114]},calabaza:{t:58,e:100,ex:[80,120]},tele:{t:46,e:96,ex:[74,104]},pez:{t:58,e:96,ex:[118]}};

function bossAccSVG(acc,an){
 const t=an.t,e=an.e,l=an.ex.length>1?an.ex[0]:an.ex[0]-15,r=an.ex.length>1?an.ex[an.ex.length-1]:an.ex[0]+15,cx=(l+r)/2;
 switch(acc){
 case 'corona':return `<path d="M${cx-28} ${t+6} L${cx-30} ${t-22} L${cx-14} ${t-8} L${cx} ${t-30} L${cx+14} ${t-8} L${cx+30} ${t-22} L${cx+28} ${t+6}Z" fill="#FFCB45" ${S}/><circle cx="${cx}" cy="${t-4}" r="5" fill="#FF4D3D" stroke="${OL}" stroke-width="2.5"/>`;
 case 'chistera':return `<rect x="${cx-32}" y="${t-6}" width="64" height="11" rx="5" fill="#20263A" ${S}/><rect x="${cx-21}" y="${t-44}" width="42" height="40" rx="4" fill="#20263A" ${S}/><rect x="${cx-21}" y="${t-16}" width="42" height="8" fill="#FF4D3D"/>`;
 case 'gorro':return `<path d="M${cx-34} ${t+8} Q${cx-34} ${t-30} ${cx} ${t-30} Q${cx+34} ${t-30} ${cx+34} ${t+8}Z" fill="#FF4D3D" ${S}/><rect x="${cx-38}" y="${t}" width="76" height="14" rx="7" fill="#fff" ${S}/><circle cx="${cx}" cy="${t-33}" r="9" fill="#fff" ${S}/>`;
 case 'casco':return `<path d="M${cx-38} ${t+12} Q${cx-38} ${t-28} ${cx} ${t-28} Q${cx+38} ${t-28} ${cx+38} ${t+12}Z" fill="#AEB8C6" ${S}/><path d="M${cx} ${t-28} V${t+10}" stroke="#7D8796" stroke-width="5"/><path d="M${cx-36} ${t} Q${cx-54} ${t-12} ${cx-56} ${t-34} Q${cx-40} ${t-18} ${cx-30} ${t-10}Z M${cx+36} ${t} Q${cx+54} ${t-12} ${cx+56} ${t-34} Q${cx+40} ${t-18} ${cx+30} ${t-10}Z" fill="#F2E6C9" ${S}/>`;
 case 'gafas':return an.ex.length>1?`<rect x="${l-17}" y="${e-11}" width="34" height="22" rx="9" fill="${OL}"/><rect x="${r-17}" y="${e-11}" width="34" height="22" rx="9" fill="${OL}"/><path d="M${l+17} ${e-3} H${r-17}" stroke="${OL}" stroke-width="4"/><path d="M${l-9} ${e-4} l8 -3 M${r-9} ${e-4} l8 -3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`:`<circle cx="${an.ex[0]}" cy="${e}" r="20" fill="none" stroke="#FFCB45" stroke-width="4"/><path d="M${an.ex[0]+18} ${e+8} Q${an.ex[0]+30} ${e+30} ${an.ex[0]+20} ${e+50}" stroke="#FFCB45" stroke-width="2.5" fill="none"/>`;
 case 'auris':return `<path d="M${l-24} ${e+4} Q${l-24} ${t-22} ${cx} ${t-22} Q${r+24} ${t-22} ${r+24} ${e+4}" fill="none" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><rect x="${l-34}" y="${e-14}" width="20" height="34" rx="9" fill="#FF2E97" ${S}/><rect x="${r+14}" y="${e-14}" width="20" height="34" rx="9" fill="#FF2E97" ${S}/>`;
 case 'bandana':return `<path d="M${cx-46} ${t+16} Q${cx} ${t} ${cx+46} ${t+16} L${cx+46} ${t+28} Q${cx} ${t+12} ${cx-46} ${t+28}Z" fill="#FF2E97" ${S}/><path d="M${cx+44} ${t+18} l18 -8 l-4 18z" fill="#FF2E97" ${S}/>`;
 case 'bigote':return `<path d="M${cx} ${e+24} q-10 -9 -26 -2 q9 12 26 5 q17 7 26 -5 q-16 -7 -26 2z" fill="${OL}"/>`;
 case 'aureola':return `<ellipse cx="${cx}" cy="${t-18}" rx="34" ry="9" fill="none" stroke="${OL}" stroke-width="9"/><ellipse cx="${cx}" cy="${t-18}" rx="34" ry="9" fill="none" stroke="#FFE14D" stroke-width="4"/>`;
 default:return '';}}

function bossSVG(id,down){
 const b=BOSSES[id]||BOSSES.golem,a=b.a||id,c=b.c,dk=shade(c,-0.28),lt=shade(c,0.4);
 const eye=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S}/><circle cx="${x+1}" cy="${y+1}" r="${r*.45}" fill="${OL}"/>`;
 const xeye=(x,y)=>`<path d="M${x-7} ${y-7}L${x+7} ${y+7}M${x+7} ${y-7}L${x-7} ${y+7}" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
 const eyes=(pts,r)=>pts.map(([x,y])=>down?xeye(x,y):eye(x,y,r)).join('');
 const brows=(l,r,y)=>down?'':`<path d="M${l-12} ${y-14}L${l+10} ${y-8}M${r+12} ${y-14}L${r-10} ${y-8}" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
 const line=(d,w)=>`<path d="${d}" stroke="${OL}" stroke-width="${w||5}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
 let o='';
 switch(a){
 case 'hidra':o=`<path d="M70 62 Q60 30 48 20 M100 56 V14 M130 62 Q140 30 152 20" stroke="${OL}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="48" cy="20" r="11" fill="#FF4D3D" ${S}/><circle cx="100" cy="14" r="11" fill="#FF4D3D" ${S}/><circle cx="152" cy="20" r="11" fill="#FF4D3D" ${S}/><text x="48" y="25" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">9</text><text x="100" y="19" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">!</text><text x="152" y="25" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">3</text><ellipse cx="100" cy="118" rx="68" ry="62" fill="${c}" ${S}/>${eyes([[72,104],[100,92],[128,104]],12)}<path d="M74 140 Q100 158 126 140" fill="${OL}" ${S}/>`;break;
 case 'sofa':o=`<rect x="22" y="146" width="156" height="40" rx="16" fill="#C0392B" ${S}/><path d="M60 64 L52 30 L78 54Z M140 64 L148 30 L122 54Z" fill="#FFE14D" ${S}/><path d="M36 100 L10 76 L24 112Z M164 100 L190 76 L176 112Z" fill="${dk}" ${S}/><ellipse cx="100" cy="110" rx="62" ry="56" fill="${c}" ${S}/><ellipse cx="100" cy="132" rx="34" ry="20" fill="${lt}" ${S}/>${eyes([[78,98],[122,98]],11)}${brows(78,122,98)}<path d="M84 136 L90 146 L96 136 L102 146 L108 136 L114 146" fill="#fff" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;break;
 case 'manana':{let w='';for(let i=0;i<6;i++)w+=' q-10 16 -20 0';o=`<path d="M40 182 V98 A60 60 0 0 1 160 98 V182${w}Z" fill="${c}" ${S}/>${down?xeye(80,100)+xeye(120,100):line('M70 100 Q80 92 90 100')+line('M110 100 Q120 92 130 100')}<ellipse cx="100" cy="128" rx="10" ry="13" fill="${OL}"/><circle cx="152" cy="52" r="20" fill="#fff" ${S}/><path d="M152 40 V52 L160 58" stroke="${OL}" stroke-width="4" fill="none" stroke-linecap="round"/>`;break;}
 case 'kraken':o=`<path d="M50 120 Q20 160 36 194 M78 136 Q66 176 82 200 M122 136 Q134 176 118 200 M150 120 Q180 160 164 194" stroke="${OL}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M50 120 Q20 160 36 194 M78 136 Q66 176 82 200 M122 136 Q134 176 118 200 M150 120 Q180 160 164 194" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="146" y="150" width="30" height="48" rx="6" fill="#20263A" ${S}/><rect x="151" y="156" width="20" height="32" rx="3" fill="#5CF2FF"/><ellipse cx="100" cy="92" rx="62" ry="62" fill="${c}" ${S}/><circle cx="70" cy="60" r="7" fill="${lt}"/><circle cx="128" cy="56" r="5" fill="${lt}"/>${eyes([[80,96],[120,96]],13)}${brows(80,120,96)}${line('M86 128 Q100 120 114 128')}`;break;
 case 'ogro':o=`${b.acc?'':`<path d="M48 82 Q60 18 140 40 Q170 50 176 30 Q186 60 152 80Z" fill="#5468FF" ${S}/><circle cx="178" cy="28" r="10" fill="#fff" ${S}/>`}<ellipse cx="100" cy="116" rx="64" ry="60" fill="${c}" ${S}/>${down?xeye(100,104):`<circle cx="100" cy="104" r="22" fill="#fff" ${S}/><circle cx="100" cy="108" r="9" fill="${OL}"/><path d="M78 100 Q100 90 122 100 L122 92 Q100 80 78 92Z" fill="${c}" stroke="${OL}" stroke-width="4"/>`}${line('M80 146 Q100 136 120 146')}<path d="M84 144 L88 132 L92 142 M116 144 L112 132 L108 142" fill="#fff" stroke="${OL}" stroke-width="2.5"/><text x="150" y="80" font-size="18" font-weight="900" fill="#fff" font-family="Arial" opacity=".9">z</text><text x="162" y="66" font-size="13" font-weight="900" fill="#fff" font-family="Arial" opacity=".7">z</text>`;break;
 case 'caos':{let sp='';for(let i=0;i<12;i++){const g=i*Math.PI/6,r1=58,r2=82;const p=(ang,rad)=>`${(100+Math.cos(ang)*rad).toFixed(1)} ${(108+Math.sin(ang)*rad).toFixed(1)}`;sp+=`<path d="M${p(g-.2,r1)}L${p(g,r2)}L${p(g+.2,r1)}Z" fill="${dk}" ${S}/>`;}
  o=`${b.final?'<circle cx="100" cy="108" r="96" fill="#FFE14D" opacity=".18"/>':''}${sp}<circle cx="100" cy="108" r="62" fill="${c}" ${S}/>${eyes([[80,100],[120,100]],12)}${brows(80,120,100)}<path d="M74 136 Q100 160 126 136Z" fill="${OL}"/><path d="M82 138 L88 148 L94 140 L100 150 L106 140 L112 148 L118 138" fill="#fff"/>`;break;}
 case 'slime':o=`<path d="M30 180 Q24 110 60 80 Q100 44 140 80 Q176 110 170 180 Q150 170 140 184 Q124 168 108 186 Q92 168 76 184 Q60 168 46 184Z" fill="${c}" ${S}/><circle cx="74" cy="90" r="8" fill="#fff" opacity=".6"/>${down?xeye(80,118)+xeye(122,118):`<circle cx="80" cy="118" r="14" fill="#fff" ${S}/><circle cx="122" cy="118" r="14" fill="#fff" ${S}/><path d="M80 118 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3" stroke="${OL}" stroke-width="2.5" fill="none"/><path d="M122 118 m-6 0 a6 6 0 1 1 6 6 a3 3 0 1 1 -3 -3" stroke="${OL}" stroke-width="2.5" fill="none"/>`}${line('M90 150 Q100 144 110 150',4)}`;break;
 case 'murci':o=`<path d="M56 100 Q20 70 8 96 Q22 100 18 116 Q32 110 36 126 Q46 116 56 124Z" fill="${dk}" ${S}/><path d="M144 100 Q180 70 192 96 Q178 100 182 116 Q168 110 164 126 Q154 116 144 124Z" fill="${dk}" ${S}/><path d="M68 74 L62 40 L88 62Z M132 74 L138 40 L112 62Z" fill="${c}" ${S}/><circle cx="100" cy="112" r="58" fill="${c}" ${S}/><ellipse cx="100" cy="140" rx="30" ry="18" fill="${lt}"/>${eyes([[80,104],[120,104]],12)}${brows(80,120,104)}${line('M86 128 Q100 136 114 128',4)}<path d="M90 130 L94 141 L98 131 M110 130 L106 141 L102 131" fill="#fff" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>`;break;
 case 'reloj':{let ticks='';for(let i=0;i<12;i++){const g=i*Math.PI/6;ticks+=`<path d="M${(100+Math.cos(g)*44).toFixed(1)} ${(108+Math.sin(g)*44).toFixed(1)}L${(100+Math.cos(g)*50).toFixed(1)} ${(108+Math.sin(g)*50).toFixed(1)}" stroke="${OL}" stroke-width="3"/>`;}
  o=`<path d="M66 168 L58 188 M134 168 L142 188" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><circle cx="62" cy="46" r="17" fill="#FFCB45" ${S}/><circle cx="138" cy="46" r="17" fill="#FFCB45" ${S}/><path d="M72 58 L80 66 M128 58 L120 66" stroke="${OL}" stroke-width="5"/><circle cx="100" cy="108" r="66" fill="${c}" ${S}/><circle cx="100" cy="108" r="54" fill="#FFF8E6" ${S}/>${ticks}${line('M100 108 L100 76 M100 108 L128 120',5)}<circle cx="100" cy="108" r="5" fill="${OL}"/>${eyes([[82,96],[118,96]],8)}${line('M86 136 Q100 144 114 136',4)}`;break;}
 case 'nube':{const blobs=[[64,114,34],[92,88,40],[132,92,36],[152,120,28],[100,126,44]];
  o=`<path d="M70 168 q-6 12 0 16 q6 -4 0 -16Z M100 172 q-6 12 0 16 q6 -4 0 -16Z M130 168 q-6 12 0 16 q6 -4 0 -16Z" fill="#5CF2FF" stroke="${OL}" stroke-width="2.5"/>${blobs.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}" stroke="${OL}" stroke-width="8"/>`).join('')}${blobs.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}<circle cx="82" cy="74" r="9" fill="#fff" opacity=".55"/>${eyes([[84,112],[120,112]],11)}${line('M88 140 Q96 134 104 140 Q112 146 120 140',4)}`;break;}
 case 'arana':{const legs='M70 110 Q40 78 22 96 M68 120 Q34 110 16 130 M70 132 Q40 142 26 166 M78 142 Q58 164 48 186 M130 110 Q160 78 178 96 M132 120 Q166 110 184 130 M130 132 Q160 142 174 166 M122 142 Q142 164 152 186';
  o=`<path d="${legs}" stroke="${OL}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="${legs}" stroke="${dk}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="100" cy="118" r="50" fill="${c}" ${S}/>${eyes([[82,108],[118,108]],11)}${eyes([[90,90],[110,90]],6)}<path d="M90 140 Q88 152 94 154 M110 140 Q112 152 106 154" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/>`;break;}
 case 'movil':o=`<path d="M50 120 L28 136 M150 120 L172 136" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><rect x="50" y="30" width="100" height="150" rx="20" fill="${c}" ${S}/><rect x="60" y="46" width="80" height="116" rx="10" fill="#14204A" stroke="${OL}" stroke-width="3"/><rect x="88" y="36" width="24" height="5" rx="2.5" fill="${OL}"/>${down?xeye(84,96)+xeye(116,96):`<circle cx="84" cy="96" r="10" fill="#5CF2FF"/><circle cx="116" cy="96" r="10" fill="#5CF2FF"/><circle cx="86" cy="98" r="4" fill="${OL}"/><circle cx="118" cy="98" r="4" fill="${OL}"/>`}<path d="M84 126 Q100 138 116 126" stroke="#5CF2FF" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="148" cy="32" r="15" fill="#FF4D3D" ${S}/><text x="148" y="37" font-size="13" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">99</text>`;break;
 case 'almohada':o=`<path d="M34 78 Q100 60 166 78 Q180 120 166 162 Q100 178 34 162 Q20 120 34 78Z" fill="${c}" ${S}/><path d="M34 78 l-10 -10 M166 78 l10 -10 M34 162 l-10 10 M166 162 l10 10" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M46 88 Q100 74 154 88" stroke="${dk}" stroke-width="3" fill="none" stroke-dasharray="6 6"/>${down?xeye(80,112)+xeye(120,112):line('M70 110 Q80 120 90 110')+line('M110 110 Q120 120 130 110')}<ellipse cx="100" cy="138" rx="8" ry="10" fill="${OL}"/><text x="140" y="70" font-size="18" font-weight="900" fill="#fff" font-family="Arial" opacity=".9">z</text>`;break;
 case 'serpiente':o=`<ellipse cx="100" cy="172" rx="72" ry="18" fill="${c}" ${S}/><ellipse cx="100" cy="150" rx="58" ry="16" fill="${dk}" ${S}/><ellipse cx="100" cy="130" rx="46" ry="14" fill="${c}" ${S}/><path d="M84 130 Q78 106 86 96 L114 96 Q122 106 116 130Z" fill="${c}" ${S}/><ellipse cx="100" cy="74" rx="42" ry="34" fill="${c}" ${S}/><path d="M70 60 Q100 46 130 60" stroke="${dk}" stroke-width="5" fill="none"/>${eyes([[86,70],[114,70]],10)}${brows(86,114,70)}<path d="M100 98 V112 L94 118 M100 112 L106 118" stroke="#FF4D3D" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;break;
 case 'cactus':o=`<path d="M62 162 L138 162 L130 194 L70 194Z" fill="#C97436" ${S}/><rect x="56" y="154" width="88" height="14" rx="5" fill="#B5652B" ${S}/><path d="M66 112 H46 Q36 112 36 100 V76 Q36 66 46 66 Q56 66 56 76 V94 H66Z" fill="${c}" ${S}/><path d="M134 96 H154 Q164 96 164 84 V64 Q164 54 154 54 Q144 54 144 64 V80 H134Z" fill="${c}" ${S}/><rect x="66" y="36" width="68" height="126" rx="34" fill="${c}" ${S}/><path d="M74 70 l-6 -3 M126 70 l6 -3 M72 126 l-6 2 M128 120 l6 2 M80 150 l-5 3 M120 146 l5 3" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>${eyes([[88,92],[112,92]],9)}${brows(88,112,92)}${line('M90 116 Q100 110 110 116',4)}`;break;
 case 'yeti':o=`<path d="M64 62 Q50 44 58 30 Q66 46 78 54Z M136 62 Q150 44 142 30 Q134 46 122 54Z" fill="#F2E6C9" ${S}/><path d="M40 180 Q30 110 60 74 Q100 40 140 74 Q170 110 160 180 L148 170 L136 182 L124 170 L112 182 L100 170 L88 182 L76 170 L64 182 L52 170Z" fill="${c}" ${S}/><ellipse cx="100" cy="112" rx="40" ry="34" fill="#9FB2C8" ${S}/>${eyes([[86,104],[114,104]],9)}${brows(86,114,104)}${line('M86 128 H114',4)}<path d="M92 128 V134 M108 128 V134" stroke="#fff" stroke-width="4"/>`;break;
 case 'calabaza':o=`<rect x="94" y="36" width="12" height="22" rx="4" fill="#4CC46A" ${S}/><path d="M106 44 Q126 30 136 44 Q122 52 106 50Z" fill="#4CC46A" ${S}/><ellipse cx="70" cy="114" rx="40" ry="56" fill="${dk}" ${S}/><ellipse cx="130" cy="114" rx="40" ry="56" fill="${dk}" ${S}/><ellipse cx="100" cy="114" rx="46" ry="60" fill="${c}" ${S}/>${down?xeye(80,100)+xeye(120,100):`<path d="M70 108 L80 90 L90 108Z M110 108 L120 90 L130 108Z" fill="#FFE14D" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`}<path d="M72 130 L80 140 L88 130 L96 140 L104 130 L112 140 L120 130 L128 140 Q100 158 72 140Z" fill="#FFE14D" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;break;
 case 'tele':o=`<path d="M100 46 L74 16 M100 46 L126 16" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><circle cx="74" cy="14" r="6" fill="#FF4D3D" ${S}/><circle cx="126" cy="14" r="6" fill="#FF4D3D" ${S}/><path d="M60 158 L52 182 M140 158 L148 182" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><rect x="30" y="46" width="140" height="114" rx="20" fill="${c}" ${S}/><rect x="44" y="60" width="90" height="86" rx="16" fill="#14204A" stroke="${OL}" stroke-width="3"/><path d="M50 74 H128 M50 90 H128 M50 106 H128 M50 122 H128" stroke="#fff" stroke-width="2" opacity=".08"/><circle cx="152" cy="84" r="8" fill="${dk}" ${S}/><circle cx="152" cy="112" r="8" fill="${dk}" ${S}/>${down?xeye(74,96)+xeye(104,96):`<circle cx="74" cy="96" r="9" fill="#5CF2FF"/><circle cx="104" cy="96" r="9" fill="#5CF2FF"/><circle cx="76" cy="98" r="4" fill="${OL}"/><circle cx="106" cy="98" r="4" fill="${OL}"/>`}<path d="M74 124 Q89 134 104 124" stroke="#5CF2FF" stroke-width="4" fill="none" stroke-linecap="round"/>`;break;
 case 'pez':o=`<path d="M40 112 L8 82 L8 142Z" fill="${dk}" ${S}/><path d="M112 58 Q126 16 156 24" stroke="${OL}" stroke-width="4" fill="none"/><circle cx="158" cy="28" r="16" fill="#FFE14D" opacity=".35"/><circle cx="158" cy="28" r="9" fill="#FFE14D" ${S}/><path d="M30 112 Q40 56 110 56 Q172 60 178 112 Q172 166 110 168 Q40 168 30 112Z" fill="${c}" ${S}/><path d="M86 70 Q76 90 86 112" stroke="${dk}" stroke-width="5" fill="none"/>${eyes([[118,96]],15)}${down?'':line('M100 76 L134 84')}<path d="M118 132 Q150 152 178 124 L170 134 L162 128 L156 140 L148 132 L140 144 L132 134 L124 142Z" fill="#fff" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`;break;
 default:o=`<rect x="36" y="44" width="128" height="136" rx="26" fill="${c}" ${S}/><path d="M58 70 L74 86 L66 100 M140 140 L126 150 L132 164" stroke="${dk}" stroke-width="4" fill="none"/><rect x="22" y="110" width="22" height="46" rx="10" fill="${dk}" ${S}/><rect x="156" y="110" width="22" height="46" rx="10" fill="${dk}" ${S}/>${down?xeye(80,104)+xeye(120,104):`<circle cx="80" cy="104" r="12" fill="#fff" ${S}/><circle cx="120" cy="104" r="12" fill="#fff" ${S}/><circle cx="80" cy="108" r="5" fill="${OL}"/><circle cx="120" cy="108" r="5" fill="${OL}"/><path d="M66 100 H94 M106 100 H134" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M67 98 Q80 88 93 98Z M107 98 Q120 88 133 98Z" fill="${c}"/>`}${line('M84 140 H116')}${b.acc?'':'<text x="150" y="40" font-size="20" font-weight="900" fill="#fff" font-family="Arial" opacity=".85">Z</text><text x="166" y="24" font-size="14" font-weight="900" fill="#fff" font-family="Arial" opacity=".6">z</text>'}`;
 }
 return wrapBoss(o+(b.acc?bossAccSVG(b.acc,BOSS_ANCHOR[a]||BOSS_ANCHOR.golem):''),down);}
function wrapBoss(inner,down){return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Jefe semanal"${down?' class="boss-down"':''}><ellipse cx="100" cy="192" rx="70" ry="8" fill="#000" opacity=".35"/>${inner}</svg>`;}

/* Calendario: cada año baraja los 52 jefes y asigna uno a cada semana; la última semana de diciembre es la del jefe final */
function bossForWeek(ws){
 const y=+ws.slice(0,4);const xm=`${y}-12-25`;if(ws<=xm&&addDays(ws,6)>=xm)return 'final';
 const r=rng('jefes-'+y),order=BOSS_REG.slice();for(let i=order.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 const n=Math.max(0,Math.floor(daysBetween(`${y}-01-01`,ws)/7));return order[n%order.length];}


/* Fondo de avatar que se gana al vencer al primer jefe */
BG_ART.arena='<rect width="200" height="200" fill="#2A0A12"/>'+[96,76,56,36].map((r,i)=>`<circle cx="100" cy="100" r="${r}" fill="${i%2?'#5A1428':'#3D0E1C'}"/>`).join('')+'<path d="M40 160 L160 40 M40 40 L160 160" stroke="#FFCB45" stroke-width="8" stroke-linecap="round" opacity=".55"/>';
ITEMS.bg.push({id:'arena',name:'Arena del jefe',u:{ach:'jefe1'}});
const BOSS_MOVES=[['timer','Pomodoro','−40'],['check','Tarea','−15'],['repeat','Repaso o vuelta','−25 / −30'],['clipboard','Acierto en test','−5'],['cards','Flashcard','−3']];
let bossFx=0;

/* ---- Estado del jefe ---- */
function ensureBoss(){
 const ws=weekStart(today()),b=state.boss;if(b&&b.week===ws)return false;
 if(b){state.bossHist.push({week:b.week,id:b.id,won:!!b.won,hp:b.hp,max:b.max,revenge:!!b.revenge});if(state.bossHist.length>80)state.bossHist.shift();
  if(!b.won){state.bossEscaped={id:b.id,hp:b.hp,max:b.max,week:b.week,revenge:!!b.revenge,seen:false};
   if(!b.revenge&&!state.revenge.some(x=>x.id===b.id))state.revenge.push({id:b.id,due:addDays(b.week,14)});}}
 const lv=levelInfo(state.xp).level,max=500+25*(Math.min(lv,30)-1);
 /* Revancha: un jefe que se escapó vuelve dos semanas después, un 30 % más fuerte y con doble recompensa */
 const ri=state.revenge.findIndex(x=>x.due<=ws);
 if(ri>=0){const [x]=state.revenge.splice(ri,1);const rmax=Math.round(max*1.3/10)*10;state.boss={week:ws,id:x.id,max:rmax,hp:rmax,won:false,wonAt:null,hits:[],revenge:true};return !!b;}
 let id=bossForWeek(ws);if(b&&b.id===id)id=BOSS_REG[(BOSS_REG.indexOf(id)+1)%BOSS_REG.length];
 state.boss={week:ws,id,max,hp:max,won:false,wonAt:null,hits:[]};return !!b;}
/* ---- Guardia del jefe: cuanto más daño le haces en un mismo día, más esquiva ----
   · Hasta el 25 % de su vida en el día: despistado, esquiva poco y, si esquiva, tu siguiente golpe es un contraataque ×1,5.
   · Del 25 % al 40 %: en guardia, esquiva la mitad de los golpes grandes.
   · Al llegar al 40 % se esconde hasta mañana. Así nunca cae en menos de 3 días. */
const GUARD_CAP=.4;
const GUARD=[{max:.25,p:.15,crit:true,name:'Despistado',em:'😴'},{max:GUARD_CAP,p:.5,crit:false,name:'En guardia',em:'🛡️'},{max:9,p:1,crit:false,name:'Escondido hasta mañana',em:'🫣',hide:true}];
function bossDayDmg(b){return b.day&&b.day.d===today()?b.day.dmg:0;}
function bossGuard(b){const r=bossDayDmg(b)/b.max;return GUARD.find(g=>r<g.max-1e-9);}
function bossHit(n,why){
 ensureBoss();const b=state.boss;n=Math.round(n);if(b.won||n<=0)return;
 const name=BOSSES[b.id].name,from=b.hp,g=bossGuard(b),big=n>=10;let crit=false;
 if(!b.day||b.day.d!==today())b.day={d:today(),dmg:0};
 /* Escondido: ya no le entra nada hoy (solo avisamos con los golpes grandes) */
 if(g.hide){if(big)showBossHit(0,from,b.hp,b.max,b.id,false,why,{dodge:true,hide:true});return;}
 /* Los golpes pequeños (flashcards, errores) siempre entran; los grandes pueden fallar */
 if(big){
  if(b.crit){crit=true;b.crit=false;n=Math.round(n*1.5);}
  else if(!(b.lastDodge&&g.crit)&&Math.random()<g.p){
   b.lastDodge=true;b.crit=g.crit;b.dodges=(b.dodges||0)+1;b.hits.unshift({n:0,why,at:Date.now(),dodge:true});b.hits=b.hits.slice(0,5);
   showBossHit(0,from,b.hp,b.max,b.id,false,why,{dodge:true,crit:g.crit});return;}
  b.lastDodge=false;
 }
 /* Nunca más del 40 % de su vida en un día */
 n=Math.min(n,Math.max(0,Math.round(b.max*GUARD_CAP)-b.day.dmg),b.hp);if(n<=0)return;
 b.day.dmg+=n;b.hp-=n;b.hits.unshift({n,why,at:Date.now(),crit});b.hits=b.hits.slice(0,5);bossFx=Date.now();
 if(b.hp<=0){b.won=true;b.wonAt=Date.now();state.counts.bossWins=(state.counts.bossWins||0)+1;
  const mult=b.revenge?2:1;if(b.revenge)state.counts.revengeWins=(state.counts.revengeWins||0)+1;
  const fz=Math.max(0,Math.min(mult,3-state.freezes));state.freezes+=fz;const coins=120*mult+(mult-fz)*50;
  grantXP(250*mult,b.revenge?'¡Revancha cumplida!':'¡Jefe derrotado!',coins,true);
  toast(`<b>¡Has derrotado a ${esc(name)}${b.revenge?' en su revancha':''}!</b><br>+${250*mult} XP · +${coins} monedas${fz?` · +${fz} ${fz===1?'protector':'protectores'} de racha`:''}`,'trophy','ach');confetti(b.revenge?300:220);}
 const hid=!b.won&&bossGuard(b).hide;
 showBossHit(n,from,b.hp,b.max,b.id,b.won,why,{crit,hid});}

/* ---- Animación de golpe en mitad de la pantalla (no bloquea nada y se va sola) ---- */
const bossPop={timer:null,dmg:0,from:0};
const ATK={Pomodoro:'⏱️',Tarea:'✅',Repaso:'🔁','Vuelta cerrada':'📚','Récord':'🏅',Entrega:'📄',Flashcard:'🃏',Simulacro:'🎯','Error resuelto':'🩹'};
function showBossHit(n,from,to,max,id,won,why,o){o=o||{};
 let el=$('#bossPop');
 if(!el){el=document.createElement('div');el.id='bossPop';el.className='boss-pop';el.setAttribute('aria-hidden','true');el.hidden=true;document.body.appendChild(el);}
 const again=bossPop.timer&&!el.hidden;
 if(again){bossPop.dmg+=n;}else{bossPop.dmg=n;bossPop.from=from;}
 const lbl=o.hide?'¡Se esconde!':o.dodge?'¡Esquivado!':`−${bossPop.dmg}`;
 clearTimeout(bossPop.timer);
 const pf=bossPop.from/max*100,pt=to/max*100,em=ATK[why]||'⚡';
 const hero=typeof avatarFullSVG==='function'?avatarFullSVG(state.avatar,{cls:'fb-atk'}):avatarSVG(state.avatar);
 el.innerHTML=`<div class="bp-card${won?' win':''}${again?' again':''}${o.dodge?' dodge':''}${o.crit&&!o.dodge?' crit':''}">
  <div class="bp-arena"><div class="bp-hero">${hero}</div><span class="bp-shot" aria-hidden="true">${em}</span>
   <div class="bp-art">${bossSVG(id,won)}<svg class="bp-slash" viewBox="0 0 100 100" aria-hidden="true"><path d="M12 82 Q50 50 90 14" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M12 82 Q50 50 90 14" fill="none" stroke="#FFE14D" stroke-width="4" stroke-linecap="round"/></svg><span class="bp-flash"></span><span class="bp-dmg">${lbl}</span>${o.crit&&!o.dodge?'<span class="bp-crit">¡Contraataque! ×1,5</span>':''}</div></div>
  <div class="bp-name">${esc(BOSSES[id].name)}</div><div class="bp-bar"><i class="bp-ghost" style="width:${pf}%"></i><i class="bp-fill" style="width:${pf}%"></i></div><div class="bp-hp"><b>${to}</b> / ${max} PV${why?` · ${esc(why)}`:''}</div>${o.hide?'<div class="bp-note">Se ha escondido hasta mañana. Lo que estudies hoy sigue dándote XP y monedas.</div>':o.dodge?`<div class="bp-note">${o.crit?'Ha esquivado tu golpe… ¡pero el siguiente será un contraataque ×1,5!':'Está en guardia y ha esquivado. ¡Sigue intentándolo!'}</div>`:o.hid?'<div class="bp-note">¡Le has dado tanta caña que se esconde hasta mañana!</div>':''}${won?'<div class="bp-win">¡Derrotado!</div>':''}</div>`;
 el.classList.remove('out');el.hidden=false;
 const fill=el.querySelector('.bp-fill'),ghost=el.querySelector('.bp-ghost');
 /* La vida baja justo cuando llega el golpe */
 setTimeout(()=>{if(fill)fill.style.width=pt+'%';if(ghost)ghost.style.width=pt+'%';},again?120:620);
 bossPop.timer=setTimeout(()=>{el.classList.add('out');bossPop.timer=setTimeout(()=>{el.hidden=true;el.classList.remove('out');bossPop.timer=null;},400);},won?3300:2300);}

function renderBoss(){
 const el=$('#bossCard');if(!el)return;ensureBoss();
 const b=state.boss,B=BOSSES[b.id],pct=b.hp/b.max*100,wd=(pdate(today()).getDay()+6)%7,left=6-wd;
 const hit=Date.now()-bossFx<1600&&!b.won;
 const when=b.won?`Derrotado el ${new Date(b.wonAt).toLocaleDateString('es-ES',{weekday:'long'})}`:left===0?'¡Último día para vencerlo!':`Quedan ${left} ${left===1?'día':'días'} · hasta el domingo`;
 el.className=`card boss-card${b.revenge?' revenge':''}${b.won?' down':''}${hit?' hit':''}${!b.won&&left===0?' urgent':''}`;
 el.innerHTML=`<div class="boss-art">${bossSVG(b.id,b.won)}${hit&&b.hits[0]?`<span class="boss-dmg">−${b.hits[0].n}</span>`:''}${b.won?'<span class="boss-stamp">¡Vencido!</span>':''}</div>
 <div class="boss-info"><span class="eyebrow">${b.revenge?'<span class="chip revenge">¡Revancha!</span> ':''}Jefe de la semana · ${when}</span><h2 class="boss-name">${esc(B.name)}</h2><p class="boss-taunt">${b.won?'Vuelve el lunes con un jefe nuevo. ¡Buen trabajo!':b.revenge?'Ha vuelto más fuerte tras escaparse. Vencerlo da doble recompensa.':esc(B.taunt)}</p>
  <div class="boss-hp"><div class="boss-hpbar" role="progressbar" aria-label="Vida del jefe" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></div><span>${b.hp} / ${b.max} PV</span></div>
  <ul class="boss-moves">${BOSS_MOVES.map(([i,l,d])=>`<li>${ico(i)}<span>${l}</span><b>${d}</b></li>`).join('')}</ul>
  ${b.won?'':guardHTML(b)}
  <div class="boss-foot"><span class="boss-reward">${ico('gift')}${b.won?'Recompensa conseguida':(b.revenge?'Recompensa doble: 500 XP · 240 monedas · 2 protectores de racha':'Recompensa: 250 XP · 120 monedas · 1 protector de racha')}</span>${b.hits.length?`<span class="boss-last">Último golpe: ${b.hits[0].dodge?'¡esquivado!':`−${b.hits[0].n}${b.hits[0].crit?' (contraataque)':''}`} · ${esc(b.hits[0].why)}</span>`:''}</div>
 </div>`;}

function guardHTML(b){const g=bossGuard(b),d=bossDayDmg(b),i=GUARD.indexOf(g),cap=Math.round(b.max*GUARD_CAP);
 const msg=g.hide?`Hoy le has quitado <b>${d} PV</b>, el máximo del día. Mañana vuelve a estar despistado.`
  :b.crit?'Ha esquivado: tu próximo golpe es un <b>contraataque ×1,5</b>.'
  :i===0?`Hoy le has quitado <b>${d} PV</b>. A partir de ${Math.round(b.max*g.max)} se pone en guardia.`
  :`Hoy le has quitado <b>${d} PV</b>. Al llegar a ${cap} se esconde hasta mañana.`;
 const head=g.hide?g.name:`${g.name} · esquiva el ${Math.round(g.p*100)}% de los golpes grandes`;
 return `<div class="boss-guard g${i}"><span class="bg-em">${g.em}</span><div><b>${head}</b><span>${msg}</span></div></div>`;}

/* ---- Galería de jefes (Progreso) ---- */
function renderBossGallery(){
 const el=$('#bossGallery');if(!el)return;ensureBoss();
 const H=state.bossHist,cur=state.boss;
 const isSeen=id=>H.some(x=>x.id===id)||cur.id===id;
 const unseen=BOSS_IDS.filter(id=>!isSeen(id));
 const tiles=BOSS_IDS.filter(isSeen).map(id=>{const h=H.filter(x=>x.id===id);const isCur=cur.id===id;
  const won=h.filter(x=>x.won).length+(isCur&&cur.won?1:0),esc_=h.filter(x=>!x.won).length,seen=h.length>0||isCur;
  const pend=state.revenge.some(x=>x.id===id);
  return `<div class="bg-tile${seen?'':' unknown'}${won?' won':''}"><span class="bg-art">${bossSVG(id,false)}</span><b>${seen?esc(BOSSES[id].name):'???'}</b><span class="bg-chips">${isCur&&!cur.won?'<span class="chip now">Esta semana</span>':''}${won?`<span class="chip ok">Vencido ×${won}</span>`:''}${esc_?`<span class="chip bad">Escapó ×${esc_}</span>`:''}${pend?'<span class="chip revenge">Vuelve pronto</span>':''}${!seen?'<span class="chip">Sin descubrir</span>':''}</span></div>`;}).join('');
 const seenN=BOSS_IDS.filter(id=>H.some(x=>x.id===id)||cur.id===id).length;
 const wins=state.counts.bossWins||0,escapes=H.filter(x=>!x.won).length;
 const rows=[{week:cur.week,id:cur.id,won:cur.won,hp:cur.hp,max:cur.max,revenge:cur.revenge,now:true}].concat(H.slice().reverse()).slice(0,8);
 el.innerHTML=`<div class="card-head"><h3 class="card-title">${ico('bolt')}Galería de jefes</h3><span class="chip">${seenN}/${BOSS_IDS.length} descubiertos · ${wins} vencidos · ${escapes} escapados</span></div>
 <div class="bg-grid">${tiles}</div>
 ${unseen.length?`<h4 class="bg-sub">Por descubrir · ${unseen.length}</h4><div class="bg-unknown">${unseen.map(id=>`<span class="bg-sil${BOSSES[id].final?' final':''}" title="${BOSSES[id].final?'Jefe final · última semana de diciembre':'Sin descubrir'}">${bossSVG(id,false)}</span>`).join('')}</div>`:''}
 <h4 class="bg-sub">Últimas semanas</h4>
 <ul class="bg-hist">${rows.map(r=>`<li><span class="bg-week">${fmtShort(r.week)}</span><span class="bg-mini">${bossSVG(r.id,r.won)}</span><span class="bg-hname">${esc(BOSSES[r.id].name)}${r.revenge?' · revancha':''}</span>${r.now&&!r.won?`<span class="chip now">En curso · ${r.hp} PV</span>`:r.won?'<span class="chip ok">Vencido</span>':`<span class="chip bad">Escapó con ${r.hp} / ${r.max} PV</span>`}</li>`).join('')}</ul>`;}
