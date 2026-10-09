# SerafIA · Estilos

**Versión 1 · 7 de octubre de 2026** · documento vivo: se actualiza con cada cambio visual del demo.

Representación visual: [`estilos.html`](estilos.html) (lee los tokens en vivo desde `../Demo`).
Foto de la capa de tokens: [`serafia-tokens.css`](serafia-tokens.css) (`python3 sincronizar.py` la regenera y avisa qué falta documentar).

---

## 1. Principios

1. **Una sola fuente de estilos: `sdk-frontend-foundations`.** SerafIA no define colores, fuentes ni tamaños nuevos. Solo *nombra decisiones* como tokens `--nws-*` que apuntan siempre a un token `--naotech-*` (ver `../Demo/app.css`, sección «SerafIA — capa de estilos»).
2. **Componentes: primero los del SDK** (`nwt-*`, replicados en `../Demo/sdk.js`). Lo que el SDK no tiene se compone con tokens, lleva prefijo `nws-` y se lista en la sección 6.
3. **Referencia visual principal: Rootly** (tarjetas blancas con borde gris suave, botón principal negro, barra de navegación flotante con el chat). **El home y las pestañas siguen la referencia «libros / lavanda»**: degradé periwinkle arriba, titular grande y una hoja blanca de esquinas amplias que sube desde abajo. Apoyos de `../Recursos visuales`: ver sección 2.
4. **El chat es el protagonista**: la barra de chat está abierta sobre el menú en toda pestaña (y el botón mini en las vistas completas); su botón de enviar es el único elemento con degradé saturado.
5. **Reglas de producto con efecto visual**: «Ayuda ahora» siempre visible; el estudiante nunca ve niveles, puntajes ni alertas (por eso las cartas del día no usan semáforo verde a rojo); nada de lenguaje clínico.

## 2. Referencias y qué se tomó de cada una

| Referencia (`Recursos visuales/`) | Qué se tomó |
|---|---|
| **Rootly** (`3f8e70da…`) — principal | Lienzo con halos azules, tarjetas blancas translúcidas, botón negro, píldora de navegación + botón de IA, encabezado con saludo y avatar |
| Clases y horario (`207d58ce…`) | Tarjeta destacada con ilustración, selector de días, píldora de navegación con la pestaña activa en gris |
| Caritas de ánimo (`29cd59c2…`) | Un color por estado de ánimo, no semántico; ilustraciones simples y expresivas |
| Libros / lavanda (`561ff0fc…`) | **Estructura del home y de las pestañas**: aviso de racha arriba, titular enorme, estante de cartas con franja de vidrio, pestañas con contador y hoja blanca de esquinas de 40 px con panel de texto + cuadrícula 2×2 |
| Check-in verde (`97006abd…`) | Tarjeta de «¿Cómo te sientes hoy?» como pieza llamativa del home |
| Bienestar tipo Headspace (`cc9b0073…`) | Selección de elementos en cuadrícula de tarjetas de color con bandeja de elegidos y botón «Continuar» |
| Banner 3D (`ce31bb46…`) | Banner corto, muy visual, con un solo botón de acción |

## 3. Color

Todo es token del SDK. La columna «Token» es el de `foundations.css`.

### 3.1 Texto y neutros
| Token | Valor | Uso |
|---|---|---|
| `--nws-ink` → `gray-900` | `#282834` | Texto principal, botón principal (negro), día activo |
| `--nws-ink-2` → `gray-700` | `#646587` | Texto de apoyo, etiquetas, íconos inactivos |
| `gray-050` | `#fafbff` | Fondos muy suaves (campos de apoyo) |
| `gray-100` | `#f4f5f9` | Pestaña activa de la píldora, campos, fecha |
| `gray-200` | `#e7e9f3` | Divisores, bordes de botones quiet |
| `gray-300` | `#d0d4e6` | Tirador de la hoja, vacíos punteados |
| `--nws-surface`, `--nws-canvas` → `white-alpha-100` | `#ffffff` | **Fondo de toda pantalla** y de la hoja de chat; tarjetas |

### 3.2 Marca de SerafIA y chat (índigo y azul)
| Token | Valor | Uso |
|---|---|---|
| `--nws-lav` → `indigo-600` al 46 % → `indigo-300` al 22 % → transparente | `#5c70fa` → `#c6d8ff` | **Degradé periwinkle** de las pestañas principales (los primeros 640 px de pantalla). Las vistas completas siguen en blanco |
| `--nws-ai` → `indigo-500` a `blue-700` | `#7a95ff` → `#006aff` | **Botón de chat (FAB), dorso de las cartas, botón de enviar.** Único degradé saturado de la app |
| `--nws-ai-glow` → `indigo-600` al 45 % | `#5c70fa` | Sombra de color y anillo del FAB |
| `indigo-100/200/300` | `#e9f1ff` `#dee9ff` `#c6d8ff` | Banner de la carta, tarjetas de herramientas |
| `indigo-600/700` | `#5c70fa` `#434ce4` | Línea del resumen, foco, ruta del mapa |
| `indigo-800/900` | `#353ac5` `#2b2fa1` | Fondo del barajeo (con gray-900) |
| Avatar y avatar-ícono | tema `secondary` (índigo) | Iniciales del estudiante, íconos de acceso |

### 3.3 Cartas del día (fondos; **no semánticos**)
| Carta | Token del fondo | Valor |
|---|---|---|
| Sin batería | `--nws-carta-purple` → `purple-100` | `#f3edff` |
| Nublado | `--nws-carta-cyan` → `cyan-100` | `#e0f4ff` |
| A mi ritmo | `--nws-carta-green` → `green-100` | `#defade` |
| Cielo despejado | `--nws-carta-yellow` → `yellow-100` | `#fffbd9` |
| Al 100 | `--nws-carta-orange` → `orange-100` | `#ffedc7` |

### 3.4 Eventos destacados
`--nws-ev-indigo` (Bienestar) `indigo-200→400` · `--nws-ev-blue` (Universidad) `blue-100→300` · `--nws-ev-green` (Deporte) `green-100→300`.

### 3.5 Estados (SDK, con `nwt-theme`)
`positive` (matrícula vigente, resuelta) · `informative` («En 40 min», Universidad) · `warning` (en revisión, examen) · `primary` (naranja `#ff7b24`: racha, acentos pequeños) · `negative` (**Ayuda ahora** y llamadas de crisis, `red-700` `#da1630` sobre `red-050` `#fff0ee`).

### 3.6 Lista completa de tokens `--nws-*` (capa SerafIA)
| Token | Apunta a | Para qué |
|---|---|---|
| `--nws-ink`, `--nws-ink-2` | gray-900, gray-700 | Texto principal y de apoyo |
| `--nws-surface` | white-alpha-100 | Superficie sólida |
| `--nws-glass`, `--nws-glass-edge` | white-alpha-100, gray-200 | Relleno y borde de las tarjetas |
| `--nws-canvas` | white-alpha-100 | Fondo de las vistas completas y de la hoja |
| `--nws-lav` | degradé de indigo-600 a indigo-300 | Fondo superior de las pestañas principales |
| `--nws-r-hoja` | radius-xxl × 2 (40 px) | Esquinas superiores de la hoja blanca |
| `--nws-shadow-hoja` | shadow-16-up | Sombra de la hoja hacia arriba |
| `--nws-ai`, `--nws-ai-glow` | indigo-500→blue-700, indigo-600 | Chat (FAB, dorso, enviar) |
| `--nws-orbe-fondo` | `Demo/assets/orbe.png` | Esfera de vidrio de SerafIA (logo y orbe de todas las vistas); los colores interiores derivan en dos capas, sin girar |
| `--nws-cta`, `--nws-cta-hover` | gray-900, gray-800 | Botón principal negro |
| `--nws-r-card`, `--nws-r-tile` | radius-xxl, radius-xl | Radios de tarjeta y de ficha |
| `--nws-shadow-card`, `--nws-shadow-float` | shadow-4, shadow-16 | Sombras de tarjeta y de elementos flotantes |
| `--nws-gap`, `--nws-gutter` | sizing-24, sizing-20 | Separación entre bloques y margen lateral |
| `--nws-carta-purple/cyan/green/yellow/orange` | purple-100, cyan-100, green-100, yellow-100, orange-100 | Fondo de cada carta del día |
| `--nws-ev-indigo/blue/green` | degradés de indigo, blue y green | Fondo del evento destacado |

## 4. Tipografía

**Familia única: Inter** (`--naotech-sdk-font-family`, la del SDK). Escalones y tracking son los del SDK; SerafIA solo elige cuál usar.

| Escalón SDK | Tamaño / interlineado | Peso | Uso en SerafIA |
|---|---|---|---|
| `heading4` (`nws-h1`) | 28 / 32 | 700 | Saludo del home y título de pestaña (Servicios, Campus, Yo), nombre en carnet |
| `heading5` | 24 / 28 | 700 | Título del banner y del evento destacado; hora de clase (`nws-hora`) |
| `heading6` (`nws-h2`) | 20 / 24 | 700 | Título de sección y de tarjeta; nombre en el encabezado |
| `subtitle` (`nws-h3`) | 18 / 24 | 700 | Título de fila, de clase y de carta |
| `body` | 16 / 24 (chat) | 500 / 400 | Texto de botones; mensajes de SerafIA en el chat (peso 400, sin burbuja) |
| `smalltext` (`nws-txt`) | 14 / 20 | 400 | Texto de apoyo, burbuja del estudiante, etiquetas de la píldora |
| `caption` | 12 / 14 | 400 | Saludo «Buenos días,», notas al pie |
| `overline` (`nws-mono-over`) | 10 / 12 | 600, mayúsculas, +0,08 em | Etiquetas de sección («CARTA DEL DÍA», «SIGUIENTE CLASE») |

## 5. Forma, sombras y espacio

| Tema | Decisión |
|---|---|
| Radios | Tarjetas y vistas `radius-xxl` (20 px) · cartas, tiles, campos `radius-xl` (12 px) · botones, chips, píldora `radius-pill` · botones de ícono `radius-circle` |
| Sombras | Tarjetas `shadow-4` · dock y píldora `shadow-8` · carta elegida y carnet `shadow-16` · FAB: sombra de color `--nws-ai-glow` |
| Tarjeta | `--nws-glass` = blanco + borde `--nws-glass-edge` (`gray-200`) + `shadow-4`. Las piezas de color (banner, eventos, cartas) llevan borde blanco |
| Espacio | Margen lateral `sizing-20` · entre bloques `sizing-24` (`--nws-gap`) · dentro de tarjeta `sizing-12/16` |
| Táctil | Mínimo 44 px (`sizing-40 + sizing-4`); botones de ícono grandes 44 px |
| Marco del teléfono | 428 × 926 de pantalla + 12 de borde; barra de estado de 44 px con isla dinámica |

## 6. Componentes

### 6.1 Del SDK (clases `nwt-*`)
| Componente | Cómo se usa |
|---|---|
| NwtButton | Principal: `neutral` + `loud` con fondo `gray-900` (override `--nws-cta`). Secundario: `quiet` (vidrio con borde gray-200). Tamaños `large` (acción de pantalla), `medium` (acciones de tarjeta), `small` (filas). Radio pill |
| NwtIconButton | `mute`, círculo de vidrio de 44 px (volver, cerrar, cómo llegar, micrófono) |
| NwtBadge | `quiet`, para estados y racha |
| NwtTag | Filtros de eventos (`neutral`, `large`) |
| NwtAvatar / NwtAvatarIcon | Iniciales del estudiante; íconos de accesos y herramientas |
| NwtSwitch | Notificaciones y permisos, tema `secondary` |
| NwtProgressBar | Renovación del código QR |
| NwtViewIndicator | Puntos del carrusel de eventos |
| NwtSearchbox | Buscador del mapa |
| NwtDivider | Entre clases |
| **NwtBottomSheet** | **Chat de SerafIA a media pantalla** (se reposiciona dentro del teléfono) |

### 6.2 Compuestos con tokens (no existen en el SDK; prefijo `nws-`)
| Pieza | Clase | Descripción |
|---|---|---|
| Titular grande | `nws-big` | `heading1` (40 / 48) en peso 600 y tracking -0,01 em; es lo que da jerarquía a cada pestaña |
| Aviso de racha | `nws-aviso` | Ícono `thunder` en círculo translúcido + dos líneas + `NwtViewIndicator` |
| Estante de cartas | `nws-estante` | Fila horizontal de cartas (dorso o semana) con una franja de vidrio que desenfoca su parte baja |
| Pestañas con contador | `nws-tab2` | Texto con pastilla de número; la activa en negrita |
| Hoja blanca | `nws-hoja` + `nws-panel` + `nws-mini` | Hoja de esquinas de 40 px con panel: chips, título, subtítulo gris, **número gigante** (`sizing-56`) y cuadrícula 2×2 de mini-tarjetas de color |
| Tarjeta de vidrio | `nws-glass` | Contenedor estándar de bloques; `nws-clase` es su variante compacta (siguiente clase) y `nws-tile--solo` el acceso rápido de una fila: ícono y nombre |
| Banner de la carta del día | `nws-hero` | Corto (≈ 124 px): degradé `indigo-100→blue-200→indigo-300`, tres cartas flotando, título de una línea y un solo botón negro |
| Tarjeta de carta ya elegida | `nws-hecha` | Compacta: nombre, racha y «Ver mi semana» |
| Carta | `nws-carta` / `nws-opcion` | Ficha de color con ilustración, nombre y frase |
| Dorso de carta | `nws-dorso` | Degradé `--nws-ai`, borde blanco, orbe de SerafIA |
| Píldora de navegación | `nws-pill` | Cuatro pestañas repartidas en todo el ancho; **todas muestran su etiqueta** (ícono arriba, texto abajo, caption 12 px); la activa va sobre gray-100 y en gray-900 |
| Encabezado | `nws-hd` | Fila superior con el **logo de SerafIA** (orbe `nws-orbe--sm` + «SerafIA» en `heading6` extrabold) y «Ayuda ahora»; debajo, la fecha en overline y el saludo «Hola, Camila» en `heading4` (o el título de la pestaña). Es la diagramación del artefacto de diseño |
| Barra de chat | `nws-chatbar` + `nws-send` | **Chat abierto arriba del menú, en toda pestaña**: orbe de SerafIA, «Pregúntale a SerafIA…», micrófono y botón de enviar con `--nws-ai`. Al tocarla abre la hoja del chat |
| Botón de chat | `nws-fab` (mini, 56 px) | Solo en vistas completas, donde no hay barra de chat; `--nws-ai` con anillo que respira (`--naotech-duration-pulse`) |
| Dock | `nws-dock` | Barra de chat arriba + píldora de navegación abajo, sobre un velo del color del lienzo |
| Vista completa | `nws-ov` | Vista a pantalla completa con volver y «Ayuda ahora» |
| Carnet | `nws-carnet` | Tarjeta blanca con QR de 232 px |
| Banner de evento | `nws-ev` | Degradé por categoría con dos círculos translúcidos |
| Mapa esquemático | `nws-mapa` | SVG con bloques de color del SDK y ruta punteada |
| Mensajes del chat | `nws-msg`, `nws-msg--yo`, `nws-typing` | SerafIA sin burbuja; el estudiante en negro; puntos de «escribiendo» |

### 6.3 Íconos
Solo la fuente de íconos del SDK (`naotech-icon-*`): `home`, `view-grid`, `gps-pin`, `user` (navegación) · `answer` (chat) · `favorite` (ayuda) · `qr-code`, `bill`, `phone`, `calendar`, `leaf`, `sun`, `moon` (accesos y herramientas) · `thunder` (racha). Las ilustraciones de las cartas son SVG propios que usan **solo tokens de color del SDK** (`arte.js`).

## 7. Las cinco cartas del día

Un color por carta, a propósito **no semántico**. El nivel interno es información para el chat y para el equipo de Bienestar; **el estudiante nunca lo ve** y la carta por sí sola nunca dispara un escalamiento: el nivel final lo define la conversación y una persona decide.

| Carta | Frase | Ilustración | Color | Nivel interno (solo documentación) |
|---|---|---|---|---|
| Al 100 | Hoy sí, con actitud | Perro con gafas negras | orange-100 | Ninguna |
| Cielo despejado | Se siente liviano | Sol sonriente | yellow-100 | Baja |
| A mi ritmo | Ni rápido ni lento | Tortuga | green-100 | Media |
| Nublado | Con ganas de manta | Nube con lluvia | cyan-100 | Alta (abre el chat) |
| Sin batería | Hoy toca enchufarse | Batería casi vacía | purple-100 | Crítica (abre el chat) |

Orden en el mazo (mezclado a propósito para que no se lea como una escala): Cielo despejado, Sin batería, Al 100, Nublado, A mi ritmo.

## 8. Movimiento

| Token / animación | Valor | Dónde |
|---|---|---|
| `--naotech-duration-fast` | 160 ms | Hover y foco |
| `--naotech-duration-base` | 240 ms | Pestaña activa, interruptores |
| `--naotech-duration-slow` | 320 ms | Entrada de vistas completas y de la hoja del chat |
| `--naotech-duration-pulse` | 1400 ms | Anillo del botón de chat |
| `nws-shL` / `nws-shR` / `nws-fan` | 2 s + 0,9 s | **Barajeo**: partir el mazo en dos, entrelazar con saltos escalonados 0,08 s y abrir en abanico |
| `nws-flipin` | 0,55 s, escalonado 0,09 s | Las cartas giran al aparecer en la elección |
| `nws-floaty`, `nws-twinkle` | 3,6 s y 2,6 s en bucle | Cartas y destellos del banner |

Todo se apaga con `prefers-reduced-motion`.

## 9. Archivos

```
Estilos/
  ESTILOS.md           este documento
  estilos.html         representación visual (tokens leídos en vivo de ../Demo)
  serafia-tokens.css   foto de la capa --nws-* (generada)
  sincronizar.py       regenera la foto y avisa qué falta documentar
Demo/
  vendor/              sdk-frontend-foundations (NO se edita)
  app.css              capa SerafIA (--nws-*) + componentes compuestos
  arte.js              ilustraciones de las cartas (solo tokens de color del SDK)
  datos.js             contenido de ejemplo
  pantallas/inicio.js  el teléfono: home, pestañas, vistas completas y chat
```

## 10. Cómo se actualiza

1. Cambiar el estilo en `Demo/app.css` (o `arte.js`), siempre apuntando a tokens `--naotech-*`.
2. Anotar el cambio en la sección que corresponda de este documento y en el registro de abajo.
3. `python3 sincronizar.py` → regenera `serafia-tokens.css` y lista tokens sin documentar.
4. `estilos.html` se actualiza solo; abrirlo para verificar.

## 11. Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-07 | Home y pestañas rehechos con la referencia «libros / lavanda»: degradé periwinkle, titular grande, estante de cartas, pestañas con contador y hoja blanca de 40 px. Se retiran el banner, la tarjeta de clase y los accesos como tarjetas sueltas (ahora viven en el panel de la hoja: Accesos, Clase, Eventos) |
| 2026-10-07 | Encabezado con el logo de SerafIA arriba y la diagramación del artefacto (DC-008); se quita el avatar del encabezado (queda en Yo) |
| 2026-10-07 | Navbar: las etiquetas de las cuatro pestañas siempre visibles |
| 2026-10-07 | Fondo general blanco: se eliminan los halos del lienzo; tarjetas blancas con borde `gray-200` |
| 2026-10-07 | Ajustes de los comentarios del equipo: dock con la barra de chat abierta arriba y el menú abajo (DC-001); banner de carta más corto (DC-003); tarjeta de clase compacta para que los cuatro accesos se vean sin scroll (DC-002); accesos rápidos sin subtítulo, en fila (DC-004 a DC-007) |
| 2026-10-07 | Versión 1. Demo en alta fidelidad del home, cartas con barajeo, vistas completas (carnet, horario, eventos, resumen de semana) y chat a media pantalla. Referencia principal Rootly. Tokens `--nws-*` sobre el SDK |
| 2026-10-08 | Dos vistas: selector «Ver como» (Estudiante / Bienestar), panel de guiones y barra de guion, y Sala de bienestar como tablero de escritorio. Color por nivel de riesgo solo para el equipo (Ninguna green-500, Baja blue-500, Media yellow-500, Alta orange-500, Crítica red-600). El SDK no trae fuente monoespaciada: las etiquetas «mono» se resuelven con Inter y números tabulares |
| 2026-10-08 | Sala de bienestar rehecha como plataforma de tres bloques (referencia «cursos» de `Recursos visuales/6827b6c1…`): **panel lateral** (Resumen · Mis casos · Alertas · Estudiantes · Informes · Ajustes) + **casos por nivel** en hoja lavanda de 40 px (`indigo-050`) con tarjetas de color sólido (`nws-dc`: Crítica red-700, Alta orange-600, Media yellow-500 con texto gray-900, Baja blue-700; número del nivel en ficha blanca y barra de atendidos) + **filtro y lista** (`nws-fchip`, `nws-dl` con anillo `nws-ring` de cobertura del instrumento, barras de la semana `nws-wk`). «Mis casos» es el segundo botón del panel y abre los chats como bandeja de correo (`nws-ib`: lista de casos, franja de resumen `nws-franja` y chat como en la app). Botón «Descargar informe» en ambas vistas. Se retiran las opciones «Escalera» y «Tablero» |
| 2026-10-08 | Se revierte el dashboard de tres bloques: «Resumen» vuelve a la primera versión de la Sala de bienestar (indicadores, tablero por nivel `nws-tabl`/`nws-cs` y tabla de conversaciones `nws-conv`), conservando el encabezado con el logo y el panel lateral. «Mis casos» sigue siendo la bandeja de chats |
