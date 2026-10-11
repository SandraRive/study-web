# Misión Estudio

Web interactiva y gamificada para crear hábitos de estudio, pensada para oposiciones, universidad e idiomas.

Es una sola página (`index.html`) en HTML, CSS y JavaScript sin dependencias ni proceso de compilación. Solo carga las fuentes desde Google Fonts.

## Qué incluye

- **Inicio**: avatar, nivel y XP, racha, retos diarios, metas semanales y técnica del día.
- **Foco**: temporizador pomodoro configurable, modo a pantalla completa y lista de tareas diarias con ámbito, prioridad y pomodoros estimados.
- **Temario**
  - Mapa de temas con vueltas y nivel de dominio por colores.
  - Repaso espaciado automático a 1, 3, 7 y 30 días. Los repasos aparecen solos en las tareas del día.
  - Flashcards con sistema de cajas (Leitner).
  - Cuaderno de errores con motivo del fallo.
- **Sonidos**: lofi, lluvia, chimenea, olas y ruido blanco, rosa y marrón. Todo se genera en el navegador con Web Audio.
- **Hábitos**: técnicas de estudio por ámbito y apartado.
- **Avatar**: personajes y objetos desbloqueables por nivel y logros, y tienda con monedas.
- **Progreso**: calendario de días de estudio, minutos por semana, reparto por ámbito, metas semanales y logros.

## Cómo usarla

Abre `index.html` en el navegador. No hace falta servidor.

### Publicarla con GitHub Pages

1. Sube `index.html` y este `README.md` a la rama `main` del repositorio.
2. Ve a **Settings → Pages**.
3. En **Source** elige **Deploy from a branch**, con rama `main` y carpeta `/ (root)`.
4. En uno o dos minutos estará en `https://<tu-usuario>.github.io/study-web/`.

## Datos

El progreso se guarda en el `localStorage` del navegador, en la clave `mision-estudio-v1`. Los datos son locales a cada navegador y dominio: no se comparten entre dispositivos y se pierden si borras los datos del sitio.
