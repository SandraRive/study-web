# Misión Estudio

Web interactiva y gamificada para crear hábitos de estudio, pensada para oposiciones, universidad e idiomas.

Está hecha con HTML, CSS y JavaScript, sin frameworks, sin dependencias y sin proceso de compilación. Solo carga las fuentes desde Google Fonts.

## Qué incluye

- **Inicio**: avatar, nivel y XP, racha, retos diarios, metas semanales y técnica del día.
- **Foco**: temporizador pomodoro configurable, modo a pantalla completa y lista de tareas diarias.
- **Temario**: mapa de temas con vueltas y dominio por colores, repaso espaciado automático a 1, 3, 7 y 30 días, flashcards con sistema de cajas y cuaderno de errores.
- **Sonidos**: lofi, lluvia, chimenea, olas y ruido blanco, rosa y marrón, todo generado en el navegador con Web Audio.
- **Hábitos**: técnicas de estudio por ámbito y apartado.
- **Avatar**: 26 personajes y decenas de objetos desbloqueables por nivel, por logros o en la tienda con monedas.
- **Progreso**: calendario de días de estudio, minutos por semana, reparto por ámbito, metas semanales y logros.

## Estructura

```
study-web/
├── index.html              Estructura de la página
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
│   ├── modo-foco.css       Temporizador a pantalla completa
│   ├── avisos.css          Notificaciones y ventana de nivel
│   └── responsive.css      Ajustes para móvil (siempre el último)
└── js/
    ├── core/
    │   ├── utilidades.js   Selectores, fechas e iconos
    │   ├── estado.js       Estado y guardado en localStorage
    │   └── recompensas.js  XP, monedas, logros, retos y metas
    ├── data/
    │   ├── habitos.js      Contenido de las técnicas de estudio
    │   ├── avatares.js     Dibujo de avatares y catálogo de objetos
    │   └── niveles.js      Curva de niveles, logros y retos
    ├── ui/
    │   ├── efectos.js      Avisos, confeti y subida de nivel
    │   ├── fondo.js        Estrellas animadas e hiperespacio
    │   └── navegacion.js   Pestañas y barra superior
    ├── features/           Una sección de la web por archivo
    │   ├── inicio.js
    │   ├── pomodoro.js
    │   ├── tareas.js
    │   ├── temario.js
    │   ├── sonidos.js
    │   ├── habitos.js
    │   ├── avatar.js
    │   └── progreso.js
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

El progreso se guarda en el `localStorage` del navegador, en la clave `mision-estudio-v1`. Los datos son locales a cada navegador y dominio: no se comparten entre dispositivos y se pierden si borras los datos del sitio.
