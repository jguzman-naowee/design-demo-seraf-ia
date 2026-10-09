# SerafIA · plantilla de demo (móvil, en blanco)

Paquete de front plano (HTML/CSS/JS, sin npm ni build) para montar el demo de
SerafIA en alta fidelidad con el SDK de Naowee. Sale de la plantilla móvil de
`landing-app-intercolegiados` (App JIN), sin nada del contenido de JIN: queda
el escenario con toolbar + zoom y un teléfono de 428×926 con la pantalla en
blanco.

## Abrirlo

Doble clic en `index.html` (una sola página con todo embebido, funciona sin
servidor). Para ver mientras se edita: `python3 -m http.server` y abrir
`dev.html`.

## Dónde se construye el demo

| Qué | Dónde |
|---|---|
| Contenido de la pantalla | `pantallas/inicio.js` → función `contenido()` (va dentro de `#demo-view`) |
| Lógica, estado y animaciones | `pantallas/inicio.js` → `mount()` (devuelve la limpieza) |
| Datos del demo (cartas, horario, eventos, contactos) | `datos.js` → `demo` |
| Estilos propios | `app.css`, al final, prefijo `nws-`, solo con tokens del SDK |
| Imágenes | `assets/` (`publicar.py` las embebe como data URI cuando el script las nombra como `'assets/…'`) |

Más pantallas o vistas inmersivas: crear `pantallas/<nombre>.js` con la forma
`{ titulo, render(ctx), mount(root, ctx) → cleanup }`, cargarlo en `dev.html`
(antes de `app.js`) y registrar su ruta en `RUTAS` (`app.js`).

## Regla de alcance

Nada queda mudo. Todo lo que aún no existe responde con un toast de una línea,
**"‹función› · Disponible próximamente"**: basta con poner `data-toast="Nombre"`
al control. Además hay una red de seguridad para cualquier control clickeable
sin `data-*`.

## Reglas de diseño del demo

- Estilos y tokens solo de `sdk-frontend-foundations` (carpeta `vendor/`).
- Componentes: primero los del SDK (`sdk.js` replica la anatomía de los `Nwt*`).
  Si algo no existe, se compone con tokens del SDK y se avisa.
- El chat de SerafIA está siempre presente en todas las vistas del estudiante.
- "Ayuda ahora" siempre a un toque. El estudiante nunca ve niveles, puntajes ni alertas.
- Contexto de producto: ver `../Contexto/`.

## Estructura

```
index.html      LA página: todo embebido (generada — no se edita a mano)
dev.html        mesa de trabajo con archivos separados — de acá sale index.html
publicar.py     genera index.html desde dev.html (concatena y embebe)
app.css         lo que el SDK no tiene (prefijo nws-), todo en tokens
sdk.js          anatomía de los Nwt*, leída del compilado
marca.js        logo e isotipo de Naowee (SVG inline) + favicon
datos.js        los datos, en JSON
app.js          sesión, router por hash, toast, "Disponible próximamente"
pantallas/      inicio.js (el teléfono del demo, en blanco)
vendor/         copia literal del dist de foundations. NO SE EDITA
```

## Flujo de trabajo

1. Editar las fuentes (`dev.html`, `app.css`, `datos.js`, `pantallas/*.js`).
2. `python3 publicar.py` → `index.html`.
3. Publicar `index.html` (el visor de artifacts bloquea `<link rel="stylesheet">`
   externos; por eso todo va embebido).

## Actualizar el SDK

```bash
S=~/naowee/sdk-frontend-foundations
cp $S/dist/styles.css vendor/foundations.css
cp $S/dist/components.css $S/dist/icons.css vendor/
```
Volver a aplicar la ruta del `@font-face` en `vendor/icons.css` (→ `./icons.woff`)
y regenerar `vendor/fonts.css` desde `$S/fonts/inter.scss`.

## Dos vistas: Estudiante y Bienestar

- `guiones.js` — los tres guiones grabados de la demo de Luis (`Recursos de la iA/serafia-demo.html`): Estrés de parciales, Deterioro sostenido y Frase de crisis.
- `caso.js` — el motor del caso en vivo (`window.CASO`): reproduce el guion turno a turno y lo comparten las dos vistas. También trae el panel de guiones (tarjeta en la vista del estudiante) y la barra de guion (vista Bienestar).
- `pantallas/inicio.js` — vista del estudiante: al abrir el chat aparece el panel de guiones; al reproducir, el chat muestra la conversación (sin niveles ni alertas; con la tarjeta de cuidado en crisis).
- `pantallas/bienestar.js` — Sala de bienestar a pantalla completa (tablero): indicadores, alertas, caso con recomendación y decisión del equipo, señales D1–D8, garantías.
- El selector **Ver como** de la barra superior cambia de vista (`#/` y `#/bienestar`); la conversación sigue donde iba.
