# Misión Estudio

Web interactiva y gamificada para crear hábitos de estudio, pensada para oposiciones, universidad e idiomas.

Está hecha con HTML, CSS y JavaScript, sin frameworks, sin dependencias y sin proceso de compilación. Solo carga las fuentes desde Google Fonts.

## Qué incluye

- **Inicio**: avatar, nivel y XP, racha, **cofre diario**, **cuenta atrás al examen** con el ritmo necesario, **jefe semanal**, retos diarios, metas semanales y técnica del día.
- **Foco**: temporizador pomodoro configurable, modo a pantalla completa y lista de tareas diarias.
- **Plan**: planificador semanal por días, con reparto automático de temas. Lo de hoy pasa solo a las tareas.
- **Temario**: mapa de temas con vueltas y dominio por colores, repaso espaciado automático a 1, 3, 7 y 30 días, flashcards con sistema de cajas, **simulacro tipo test** (cronómetro, penalización por fallo y banco de preguntas) y cuaderno de errores.
- **Sonidos**: lofi, lluvia, chimenea, olas y ruido blanco, rosa y marrón, todo generado en el navegador con Web Audio.
- **Hábitos**: técnicas de estudio por ámbito y apartado.
- **Avatar y tienda**: más de 50 personajes en colecciones temáticas y decenas de objetos desbloqueables por nivel, logros o monedas. En la tienda también hay **protectores de racha** y **escenarios de la web** (espacio, bosque nocturno, océano, ciudad neón y aurora boreal).
- **Progreso**: calendario de días de estudio, minutos por semana, reparto por ámbito, metas semanales y logros.
- **Ajustes**: instalar la web como app, avisos del pomodoro y copia de seguridad (exportar e importar el progreso).

## App instalable (PWA)

- Se instala desde **Ajustes** o desde el menú del navegador. En iPhone: *Compartir → Añadir a pantalla de inicio*.
- Funciona **sin conexión**: `sw.js` guarda todos los archivos en el dispositivo. Con conexión siempre carga la versión más reciente.
- Si **añades o quitas archivos**, actualiza la lista `APP` de `sw.js` y sube `VERSION`.
- Los **avisos** usan las notificaciones del navegador. Con el móvil bloqueado, el sistema puede pausar la web hasta que vuelvas a abrirla.

## Estructura

```
study-web/
├── index.html              Estructura de la página
├── manifest.webmanifest    Datos de la app instalable (nombre, iconos, colores)
├── sw.js                   Service worker: funcionamiento sin conexión y avisos
├── icons/                  Iconos de la app
├── css/
│   ├── tokens.css          Colores, tipografías y fondo espacial
│   ├── base.css            Reinicio y estilos generales
│   ├── cabecera.css        Menú superior
│   ├── componentes.css     Botones, tarjetas, chips, barras…
│   ├── inicio.css
│   ├── foco.css            Pomodoro y tareas
│   ├── temario.css         Temas, flashcards y errores
│   ├── sonidos.css
│   ├── habitos.css
│   ├── avatar.css
│   ├── progreso.css
│   ├── oposicion.css       Cuenta atrás, simulacro y plan semanal
│   ├── enganche.css        Escenarios, cofre diario, jefe semanal y tienda
│   ├── modo-foco.css       Temporizador a pantalla completa
│   ├── avisos.css          Notificaciones y ventana de nivel
│   ├── ajustes.css         Instalación, avisos y copia de seguridad
│   └── responsive.css      Ajustes para móvil (siempre el último)
└── js/
    ├── core/
    │   ├── utilidades.js   Selectores, fechas e iconos
    │   ├── estado.js       Estado y guardado en localStorage
    │   ├── pwa.js          Instalación, actualizaciones y avisos
    │   └── recompensas.js  XP, monedas, logros, retos y metas
    ├── data/
    │   ├── habitos.js      Contenido de las técnicas de estudio
    │   ├── avatares.js     Dibujo de avatares y catálogo de objetos
    │   └── niveles.js      Curva de niveles, logros y retos
    ├── ui/
    │   ├── efectos.js      Avisos, confeti y subida de nivel
    │   ├── fondo.js        Escenarios animados del fondo e hiperespacio
    │   └── navegacion.js   Pestañas y barra superior
    ├── features/           Una sección de la web por archivo
    │   ├── inicio.js
    │   ├── pomodoro.js
    │   ├── tareas.js
    │   ├── temario.js
    │   ├── sonidos.js
    │   ├── habitos.js
    │   ├── avatar.js
    │   ├── progreso.js
    │   ├── examen.js       Cuenta atrás al examen
    │   ├── simulacro.js    Simulacro tipo test y banco de preguntas
    │   ├── plan.js         Plan semanal
    │   ├── jefe.js         Jefe semanal
    │   ├── cofre.js        Cofre diario
    │   ├── tienda.js       Protector de racha y escenarios
    │   └── ajustes.js      Ajustes y copia de seguridad
    └── main.js             Eventos y arranque
```

Los scripts son clásicos (no módulos) y se cargan en orden desde `index.html`, así que la web funciona también abriendo el archivo directamente, sin servidor. Si añades un archivo nuevo, enlázalo en `index.html` respetando ese orden: `main.js` siempre el último.

## Cómo usarla

Abre `index.html` en el navegador o visita la versión publicada en GitHub Pages.

### Publicarla con GitHub Pages

1. Ve a **Settings → Pages**.
2. En **Source** elige **Deploy from a branch**, con rama `main` y carpeta `/ (root)`.
3. En uno o dos minutos estará en `https://<tu-usuario>.github.io/study-web/`.

## Datos

El progreso se guarda en el `localStorage` del navegador, en la clave `mision-estudio-v1`. Los datos son locales a cada navegador y dominio. Para pasarlos a otro dispositivo o tener una copia, usa **Ajustes → Copia de seguridad**: descarga un archivo `.json` con todo el progreso e impórtalo donde quieras.
