/* Contenido: ámbitos, apartados y técnicas de estudio */
'use strict';

/* ================= CONTENIDO ================= */
const AMB=[
{id:'base',name:'Hábitos base',color:'sun',icon:'bolt',tagline:'Lo que funciona estudies lo que estudies',subs:[
 {name:'Entorno',icon:'lamp',tips:[
  {t:'Un sitio, una tarea',d:'Estudia siempre en el mismo lugar y úsalo solo para eso. Tu cerebro asocia ese espacio con concentración y te cuesta menos arrancar.',a:'Elige tu puesto de estudio y no comas ni veas series allí.'},
  {t:'Móvil fuera de la vista',d:'Tenerlo boca abajo en la mesa ya resta atención. Dejarlo en otra habitación es lo que mejor funciona.',a:'Saca el móvil de la habitación durante tu próximo pomodoro.'},
  {t:'Prepara antes de empezar',d:'Agua, material y temario a mano. Cada vez que te levantas a buscar algo pierdes el hilo y te cuesta volver.',a:'Haz un repaso de 2 minutos del material antes del primer bloque.'}]},
 {name:'Concentración',icon:'target',tips:[
  {t:'Técnica Pomodoro',d:'25 minutos de foco total y 5 de descanso. Cada 4 bloques, un descanso largo de 15 a 30 minutos.',a:'Arranca el temporizador de la sección Foco.'},
  {t:'Una cosa por bloque',d:'Cambiar de tarea te cuesta minutos de reenganche cada vez. Decide qué harás en el bloque y haz solo eso.',a:'Cierra todas las pestañas que no sean del bloque actual.'},
  {t:'Aparca las distracciones',d:'Si se te ocurre algo pendiente, anótalo en una hoja y sigue estudiando. Lo revisas en el descanso.',a:'Ten una hoja de "pendientes mentales" junto al cuaderno.'}]},
 {name:'Descanso y cuerpo',icon:'moon',tips:[
  {t:'Dormir consolida',d:'Durante el sueño se fija lo que has estudiado. Dormir 7 a 9 horas rinde más que trasnochar repasando.',a:'Fija una hora de dormir y respétala 5 días seguidos.'},
  {t:'Descansos de verdad',d:'En los 5 minutos levántate, estira y bebe agua. Mirar el móvil no descansa la atención, la sigue gastando.',a:'Haz tu próximo descanso sin pantallas.'},
  {t:'Muévete cada día',d:'Entre 20 y 30 minutos de ejercicio mejoran la memoria y el ánimo durante la jornada de estudio.',a:'Camina o entrena antes de la sesión de tarde.'}]},
 {name:'Planificación',icon:'calendar',tips:[
  {t:'Tareas concretas',d:'"Estudiar historia" no es una tarea. "Esquema del tema 3, apartados 1 a 4" sí, y sabes cuándo has terminado.',a:'Reescribe tus tareas de hoy con verbo y alcance.'},
  {t:'Lo difícil primero',d:'Usa tus horas de más energía para lo que más te cuesta. Lo mecánico, para el final del día.',a:'Pon tu tarea más dura en el primer pomodoro.'},
  {t:'Revisión semanal',d:'15 minutos el domingo: qué ha salido, qué no y qué toca la semana que viene.',a:'Reserva 15 minutos este domingo para revisar la semana.'}]}
]},
{id:'opo',name:'Oposición',color:'pink',icon:'shield',tagline:'Constancia diaria hasta el día del examen',subs:[
 {name:'Temario',icon:'layers',tips:[
  {t:'Vueltas al temario',d:'Primera vuelta para entender, segunda para resumir y las siguientes para memorizar y repasar. Cada vuelta es más rápida que la anterior.',a:'Apunta tus temas en la sección Temario y marca en qué vuelta vas.'},
  {t:'Esquemas propios',d:'Hacer tú el esquema te obliga a entender la estructura. Los de academia sirven para comprobar, no para sustituir el tuyo.',a:'Haz un esquema de una sola página del tema actual.'},
  {t:'Calendario hacia atrás',d:'Parte de la fecha del examen y reparte temas, repasos y simulacros hacia atrás. Deja semanas de margen para imprevistos.',a:'Cuenta los temas que te quedan y las semanas disponibles.'}]},
 {name:'Memoria',icon:'bulb',tips:[
  {t:'Repaso espaciado',d:'Repasa a 1 día, 3 días, 1 semana y 1 mes. Cada repaso llega justo antes de que se te olvide, y dura más.',a:'Cierra la vuelta de un tema en Temario para que se programen solos.'},
  {t:'Recuerdo activo',d:'Cierra el libro y escribe todo lo que recuerdas. Recuperar la información la fija mucho más que releerla.',a:'Al acabar cada pomodoro, 2 minutos de hoja en blanco.'},
  {t:'Reglas y acrónimos',d:'Para listas, protocolos y artículos, crea palabras o frases con las iniciales. Cuanto más absurda, mejor se recuerda.',a:'Inventa una regla para la lista más larga del tema.'}]},
 {name:'Test y simulacros',icon:'clipboard',tips:[
  {t:'Test desde el principio',d:'No esperes a sabértelo todo. Los test te muestran qué falla y entrenan el formato del examen.',a:'Haz 10 preguntas al cerrar cada tema.'},
  {t:'Analiza cada fallo',d:'Apunta por qué fallaste: no lo sabía, lo confundí o leí mal. Cada tipo de error se corrige de forma distinta.',a:'Anota tus fallos en el cuaderno de errores del Temario.'},
  {t:'Simulacro en condiciones',d:'Mismo tiempo, misma hora del examen y sin pausas. Así entrenas el ritmo y los nervios del día real.',a:'Programa un simulacro completo cada 2 semanas.'}]},
 {name:'Pruebas físicas',icon:'run',tips:[
  {t:'Entrena las pruebas oficiales',d:'Revisa las marcas exigidas en las bases de tu convocatoria y entrena esas pruebas concretas, no solo forma general.',a:'Mide hoy tu marca en cada prueba de las bases.'},
  {t:'Entreno como bisagra',d:'Entrenar despeja la cabeza. Úsalo para separar la sesión de mañana de la de tarde y volver con energía.',a:'Coloca el entreno entre dos bloques de estudio.'}]},
 {name:'Mentalidad',icon:'flame',tips:[
  {t:'Horario, no ganas',d:'La motivación va y viene. Un horario fijo te sienta a estudiar también los días que no apetece.',a:'Define tu horario mínimo para los días malos.'},
  {t:'Mide tu progreso',d:'Registrar pomodoros y temas cerrados hace visible el avance cuando parece que no avanzas.',a:'Revisa la sección Progreso al final de la semana.'},
  {t:'Un día libre a la semana',d:'Descansar es parte del plan. Evita el agotamiento que hace abandonar a muchos opositores a mitad de camino.',a:'Elige tu día libre y protégelo.'}]}
]},
{id:'uni',name:'Universidad',color:'cobalt',icon:'cap',tagline:'Asignaturas, prácticas y exámenes sin agobios',subs:[
 {name:'Clases y apuntes',icon:'pen',tips:[
  {t:'Repasa el mismo día',d:'Diez minutos de repaso después de clase te ahorran horas antes del examen.',a:'Relee y completa los apuntes de hoy.'},
  {t:'Método Cornell',d:'Divide la hoja: notas a la derecha, preguntas clave a la izquierda y un resumen de tres líneas abajo.',a:'Prueba el formato Cornell en tu próxima clase.'},
  {t:'Pregunta pronto',d:'Las dudas pequeñas se acumulan. Pregunta en clase o en tutorías antes de que se conviertan en un tema entero.',a:'Lleva una lista de dudas a la próxima tutoría.'}]},
 {name:'Exámenes',icon:'file',tips:[
  {t:'Exámenes de otros años',d:'Te dicen qué entra y cómo lo preguntan. Hazlos con cronómetro, no te limites a leerlos.',a:'Consigue los dos últimos exámenes de cada asignatura.'},
  {t:'Practica, no releas',d:'En asignaturas de problemas se aprende haciendo ejercicios. Leer la solución da una falsa sensación de dominio.',a:'Resuelve 3 ejercicios sin mirar la solución.'},
  {t:'Explícalo en voz alta',d:'Técnica Feynman: explica el concepto como si fuera para alguien que no sabe nada. Donde te atascas está el hueco.',a:'Explica un tema en 3 minutos sin apuntes.'}]},
 {name:'Prácticas y proyectos',icon:'folder',tips:[
  {t:'Trocea las entregas',d:'Divide cada práctica en hitos con fecha propia. Así evitas el maratón la noche antes.',a:'Divide tu próxima entrega en 4 hitos con fecha.'},
  {t:'Empieza aunque quede feo',d:'Una primera versión mala que funcione vale más que un plan perfecto sin empezar.',a:'Dedica un pomodoro a un primer borrador.'}]},
 {name:'Cuatrimestre',icon:'calendar',tips:[
  {t:'Mapa de fechas',d:'Al empezar, apunta todos los exámenes y entregas en un único calendario. Sin sorpresas en diciembre.',a:'Vuelca todas las fechas del cuatrimestre en una tarde.'},
  {t:'Bloques por asignatura',d:'Da a cada asignatura bloques fijos en la semana según sus créditos y su dificultad.',a:'Asigna bloques semanales a cada asignatura.'}]}
]},
{id:'idi',name:'Idiomas',color:'mint',icon:'chat',tagline:'Poco cada día gana a mucho de vez en cuando',subs:[
 {name:'Vocabulario',icon:'grid',tips:[
  {t:'Tarjetas con repetición',d:'Las tarjetas con repaso espaciado programan cada palabra justo antes de que la olvides. 15 minutos diarios bastan.',a:'Crea tus tarjetas en Temario y repasa las de hoy.'},
  {t:'Frases, no palabras sueltas',d:'Aprende cada palabra dentro de una frase real. Recuerdas cómo se usa, no solo su traducción.',a:'Escribe 5 frases con palabras nuevas.'},
  {t:'Lo que tú dirías',d:'Prioriza el vocabulario de tu vida: tu trabajo, tus aficiones, lo que dices cada día.',a:'Apunta 10 palabras que hoy has necesitado.'}]},
 {name:'Escuchar y hablar',icon:'headphones',tips:[
  {t:'Input comprensible',d:'Escucha contenido que entiendas en un 70 u 80 %. Si es demasiado difícil agota, si es demasiado fácil no enseña.',a:'Busca un pódcast de tu nivel y escucha un episodio.'},
  {t:'Shadowing',d:'Repite el audio justo detrás de quien habla, imitando su ritmo y entonación.',a:'Haz 5 minutos de shadowing con un audio corto.'},
  {t:'Habla desde el principio',d:'Intercambios de idiomas o clases cortas. Equivocarte forma parte del proceso.',a:'Reserva una conversación esta semana.'}]},
 {name:'Gramática',icon:'layers',tips:[
  {t:'Patrones antes que reglas',d:'Observa la estructura en ejemplos reales y después confirma la regla. Se queda mejor que al revés.',a:'Busca 5 ejemplos reales de la estructura que estudias.'},
  {t:'Diario de tres frases',d:'Escribe tres frases al día sobre tu día. Aplicas la gramática en algo tuyo.',a:'Escribe 3 frases en el idioma antes de dormir.'}]},
 {name:'Inmersión diaria',icon:'globe',tips:[
  {t:'Cambia el idioma del móvil',d:'Exposición gratis decenas de veces al día con palabras que ya entiendes por el contexto.',a:'Cambia el idioma de una app que uses mucho.'},
  {t:'Subtítulos en el idioma',d:'Mejor subtítulos en el idioma original que en español. Pausa y apunta expresiones que te gusten.',a:'Ve un episodio con subtítulos en el idioma.'},
  {t:'Mínimo diario',d:'Cinco minutos al día mantienen vivo el hábito en los días con poco tiempo.',a:'Define tu mínimo diario no negociable.'}]}
]}
];
const tipId=(a,s,t)=>`${a}-${s}-${t}`;
function tipById(id){const [a,s,t]=id.split('-');const amb=AMB.find(x=>x.id===a);if(!amb)return null;const sub=amb.subs[+s];if(!sub||!sub.tips[+t])return null;return {amb,sub,tip:sub.tips[+t],si:+s};}
const ALL_TIPS=[];AMB.forEach(a=>a.subs.forEach((s,si)=>s.tips.forEach((t,ti)=>ALL_TIPS.push(tipId(a.id,si,ti)))));
const SCOPE={opo:'Oposición',uni:'Universidad',idi:'Idiomas',otro:'Otro'};
const SCOPE_COLOR={opo:'pink',uni:'cobalt',idi:'mint',otro:'sun'};
const AMB_SCOPE={base:'otro',opo:'opo',uni:'uni',idi:'idi'};
const cvar=c=>`--c:var(--${c});--c-ink:var(${c==='cobalt'?'--on-cobalt':'--on-acc'})`;
const DOM=[{n:'Sin empezar',c:'--d0'},{n:'Flojo',c:'--d1'},{n:'Regular',c:'--d2'},{n:'Bien',c:'--d3'},{n:'Dominado',c:'--d4'}];
const domStyle=d=>`--dc:var(${DOM[d].c});--dk:var(${d===0?'--ink':'--on-acc'})`;
const REASONS={nosabia:'No lo sabía',confundi:'Lo confundí',leimal:'Leí mal',prisa:'Prisa o despiste'};
const REASON_C={nosabia:'pink',confundi:'orange',leimal:'cobalt',prisa:'sun'};
