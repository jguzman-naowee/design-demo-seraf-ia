# SerafIA · Plan visual y de datos para diseño UX/UI

**Para:** UX/UI Designer
**De:** Luis Peñaranda
**Fecha:** 6 de octubre de 2026
**Base:** la demo que está hoy en `staging` (último cambio: PR #15). La demo completa, navegable y sin chat, está en el HTML que acompaña este documento (`serafia-demo.html`).

Este documento cubre solo lo que se ve y los datos que aparecen en pantalla. No entra en cómo funcionan por dentro la interpretación de mensajes ni el servidor.

Cada punto lleva una de tres marcas:

- **Hecho:** ya está en la demo.
- **Pendiente:** ya está identificado como algo que hay que hacer, y se indica de dónde sale.
- **Propuesta:** idea mía para discutir contigo y con el equipo. No está decidida.

---

## 1. Qué es SerafIA, en una frase

Un acompañante conversacional para estudiantes universitarios. El estudiante escribe cómo se siente con sus palabras y SerafIA lo guía por el cuestionario de bienestar que la universidad ya usaba. Mientras tanto, ordena el caso por prioridad y avisa al equipo de Bienestar cuando hace falta. Ante una frase de crisis escala de inmediato. Una persona del equipo es siempre quien decide qué hacer.

## 2. Quién usa qué

| Persona | Pantalla | Qué necesita poder hacer |
|---|---|---|
| Estudiante | Conversación (móvil primero) | Contar cómo se siente sin sentirse evaluado, encontrar ayuda inmediata si la necesita |
| Equipo de Bienestar (psicología, trabajo social, enfermería) | Sala de bienestar | Ver qué casos requieren atención, entender por qué, y confirmar o ajustar la acción |
| Quien presenta la demo | Sala de demo | Mostrar las dos vistas lado a lado y reproducir casos de ejemplo |
| Cliente o directivo que llega por primera vez | Portada | Entender qué hace SerafIA y entrar a la demo |

## 3. Las cuatro superficies que existen hoy (Hecho)

| Ruta | Superficie | Notas |
|---|---|---|
| `/` | Portada | Hero, cómo funciona, seguridad, dos vistas, casos, niveles, preguntas frecuentes, límites, cierre |
| `/chat` | Conversación del estudiante | Pasa primero por un aviso de consentimiento |
| `/ops` | Sala de bienestar | Consola del equipo, con estado vacío cuando no hay conversación |
| `/demo` | Sala de demo | Estudiante y Bienestar lado a lado, con barra de guiones y reproductor. En móvil se alterna con pestañas |

Hay tres guiones de ejemplo que se reproducen en la sala de demo:

| Guion | Turnos | Resultado |
|---|---|---|
| Estrés de parciales | 5 | Baja · Monitorear (sin alerta) |
| Deterioro sostenido | 7 | Alta · Alerta prioritaria |
| Frase de crisis | 2 | Crítica · Escalamiento inmediato |

## 4. Sistema visual actual (Hecho)

El sistema está definido en `app/src/styles.css`. Cualquier propuesta debería partir de aquí o reemplazarlo de forma explícita.

**Tipografía**
- **Newsreader (serif):** titulares y la voz de SerafIA en la conversación (clases `display` y `voice`).
- **Geist (sans):** interfaz y texto corrido.
- **Geist Mono:** etiquetas en mayúsculas (`eyebrow`), códigos de caso, turnos y números.

**Color base**
- **Fondos:** lienzo cálido `#F6F3EE`, superficie blanca y hundido `#EFEAE2`. La consola de Bienestar usa una variante más fría (`.console`, lienzo `#F2F4F1`).
- **Tinta:** `#10201C`, con grises de apoyo de matiz verde.
- **Acento:** escala "pine" (verde azulado), con `#1B7465` como tono medio y `#0A2A24` en los botones principales.
- **Cuidado:** escala terracota (`#B5523A`) para todo lo que es ayuda y crisis del lado del estudiante.
- **Etiqueta DEMO:** ámbar `#F0B45B`.

**Color por nivel de riesgo.** Cada nivel tiene un tono, un texto, un fondo y una línea:

| Nivel | Tono | Uso |
|---|---|---|
| Ninguna | Verde `#3E9A82` | Sin señales |
| Baja | Azul gris `#6F8DB3` | Observación |
| Media | Ámbar `#D49B2F` | Alerta |
| Alta | Naranja `#DC6A3B` | Alerta prioritaria |
| Crítica | Rojo `#B42318` | Escalamiento inmediato |

**Otros tokens**
- **Radios:** de 6 a 32 px.
- **Sombras:** cinco niveles, de `hair` a `pop`.
- **Animaciones:** de 240 a 420 ms, más pulsos lentos para los estados "en vivo".

**Modo oscuro:** no existe hoy.

## 5. Pantalla por pantalla: qué muestra y qué datos usa (Hecho)

### 5.1 Portada

Muestra la propuesta de valor, el flujo en cuatro pasos (Escucha, Reconoce, Explica, Deriva), la regla de oro, las dos vistas, los niveles con su acción y lo que ve el estudiante, los casos de ejemplo, las preguntas frecuentes y los límites ("no es un instrumento clínico validado").

Todos los datos de la portada son de ejemplo. Las maquetas usan casos como SER-0142 y SER-0356.

### 5.2 Consentimiento

Un modal antes de entrar a la conversación o a la sala de demo:
- **Columna izquierda:** qué es la demo, que se habla con una IA, que no se guarda nada, y un recuadro de crisis con los números 123 y 192.
- **Columna derecha:** los cinco pasos del sistema (Interpretación, Evaluación de riesgo, Detección de crisis, Ruta de atención, Alerta al equipo) con una tarjeta de alerta de ejemplo.

Al aceptar, el consentimiento se recuerda solo durante la sesión del navegador.

### 5.3 Conversación del estudiante

**Encabezado:** SerafIA, "Conversación de bienestar" y el botón "Ayuda ahora".

**Bienvenida:** un orbe de color, "Hola, soy SerafIA", la tarjeta del equipo de Bienestar y la primera pregunta: "¿Cómo te sientes hoy? Cuéntamelo con tus palabras".

**Mensajes:**
- **Los de SerafIA** van en serif, sin burbuja.
- **Los del estudiante** van en burbuja, alineados a la derecha, con un pequeño escudo debajo que indica "Revisado por la red de cuidado".

**Entrada de texto:** el cuadro de texto con la franja "Red de cuidado activa · ¿Qué es?".

**Crisis:**
- **Tarjeta de cuidado:** "Estamos contigo / No tienes que pasar por esto a solas", un aviso de que se notificó al equipo, el botón "Llamar a una línea de ayuda", "Emergencias · 123" y "Respirar conmigo un minuto".
- **Cuadro de texto:** su indicación cambia a "Aquí sigo contigo…".

**Cierre:** un resumen con "Qué pasa ahora" y la pregunta "¿Te sirvió este espacio?" (No mucho / Un poco / Sí).

**Lo que el estudiante nunca ve:** niveles de riesgo, puntajes, alertas ni etiquetas clínicas. La red de crisis se le presenta como "red de cuidado".

### 5.4 Sala de bienestar

La estructura tiene tres columnas debajo de una franja de indicadores.

**Franja de indicadores:**
- **Nivel del caso:** el nivel con una barra de cinco segmentos.
- **Acción sugerida.**
- **Alertas abiertas.**
- **Cobertura del instrumento:** n de 8.
- **Factores protectores:** n de 2, con apoyo y afrontamiento.

**Columna izquierda, Alertas:**
- Agrupadas por caso.
- Cada actualización muestra el turno, la pregunta a la que corresponde (por ejemplo "D6 Actividad que le ayuda"), la hora, la cita del estudiante y el tipo de alerta.

**Columna central, el caso:**
- **Encabezado:** código, nombre anonimizado, programa, turno y estado.
- **Recorrido:** Conversación → Señal → Alerta → Revisión humana.
- **Tarjeta de recomendación:** la acción, la propuesta del sistema, la decisión del equipo con "Confirmar acción" y "Ajustar", y el bloque "Quién la elevó".
- **"Por qué este nivel"**, en una frase.
- **"Lo que interpretó el sistema":** qué datos se entendieron del último mensaje y si el estudiante los respondió o los adelantó.
- **Tabla de evaluación:** la grilla de intensidad por factores protectores, con la celda activa marcada.
- **"Qué sostiene la señal":** la cita, el protocolo de seguridad, la evaluación y la revisión de señales.
- **Historial de turnos:** cada turno con su nivel.

**Columna derecha:**
- **Señales por ítem:** D1 a D8, con su estado.
- **Garantías de seguridad:** tres reglas con su estado.
- **"Modelo e instrumento":** las versiones.

**Interruptor Resumen / Detalle:** el modo Detalle agrega información técnica.

**Estado vacío:** "Esperando la conversación", con el botón "Reproducir un guion de demo".

### 5.5 Sala de demo

**Barra superior:**
- **Marca:** logo y etiqueta DEMO, con el texto "Conversación simulada · ninguna alerta llega a un equipo real".
- **Pestañas:** Sala de demo, Estudiante y Bienestar.
- **Recursos de crisis.**

**Barra de guion:**
- **Selector de guiones:** los tres guiones.
- **Reproductor:** Siguiente turno, Reproducir o Repetir, el contador de turnos, Reiniciar e "Mostrar el detalle".

**Cuerpo:**
- **A la izquierda:** el teléfono con la vista del estudiante.
- **A la derecha:** la vista del equipo, con la tira de cinco pasos y el estado de cada uno en el último mensaje, el nivel grande y la recomendación.
- **En crisis:** aparece una banda roja de "Atención inmediata" con el extracto subrayado.

**En móvil:** las pestañas Estudiante y Bienestar (con un contador) y un reproductor fijo abajo.

## 6. Diccionario de datos visibles (Hecho)

Estos son los "objetos" que aparecen en pantalla y los valores que pueden tomar. Sirve para diseñar componentes y estados sin depender del código.

### Caso
| Campo | Ejemplo | Notas |
|---|---|---|
| Código | SER-0142 | Hoy hay un solo caso fijo |
| Nombre | Estudiante A-0142 | Anonimizado; hoy es un valor fijo de ejemplo |
| Programa | Ingeniería · 3.er semestre | Valor fijo de ejemplo |
| Estado | En espera · En vivo, actualizado hace 32 s | |
| Abierto hace | 00:45 | Contador |

### Nivel de riesgo (5 valores)
| Nivel | Resumen que se muestra |
|---|---|
| Ninguna | Sin señales de riesgo por ahora |
| Baja | Malestar leve. Conviene seguir de cerca |
| Media | Señales sostenidas. Requiere triaje del equipo |
| Alta | Señales de riesgo claras. Contacto humano pronto |
| Crítica | Riesgo inmediato. El equipo debe actuar ahora |

### Acción (5 valores, una por nivel)
| Acción | Detalle | Lo que ve el estudiante | ¿Crea alerta? |
|---|---|---|---|
| Acompañar | Seguir el instrumento. No hace falta intervenir | Sin aviso | No |
| Monitorear | Malestar leve. Revisar en el próximo corte | Seguimiento suave | No |
| Alerta | Triaje del equipo de bienestar | Una persona te escribirá | Sí |
| Alerta prioritaria | Contacto humano pronto, hoy mismo | Una persona te escribirá hoy | Sí |
| Escalamiento inmediato | Crisis. Contactar ya y activar el protocolo | El equipo ya fue avisado | Sí |

### Señales por ítem (D1 a D8)
| Código | Señal | Valores posibles |
|---|---|---|
| D1 | Emoción | Una de 12: Triste, Molesto(a), Culpable, Avergonzado(a), Ansioso(a), Temeroso(a), Activo(a), Alegre, Orgulloso(a), Decidido(a), Motivado(a), Agradecido(a) |
| D2 | Intensidad | 1 Muy poco o nada · 2 Un poco · 3 Moderadamente · 4 Mucho · 5 Muchísimo |
| D3 | Algo lo detonó | Sí, algo concreto · Nada específico |
| D4 | Habló con alguien | Sí, ya habló · No ha hablado con nadie |
| D5 | Hablaría con un consejero | Sí, aceptaría · No por ahora |
| D6 | Actividad que le ayuda | Sí, tiene una · No tiene ninguna |
| D7 | Le alcanza para manejarlo | Sí, le alcanza · No le alcanza |
| D8 | Tipo de apoyo | Académico · Bienestar emocional · Social · Salud física y mental |

Cada señal puede estar en uno de estos estados: **Pendiente**, **Preguntando ahora**, **con valor**, **Omitido por la ruta** (la conversación no pasa por esa pregunta) o **No se pudo interpretar**. Cuando tiene valor, se indica si el estudiante **Respondió** o **Lo adelantó** (lo dijo sin que se le preguntara), con un número de confianza de 0 a 1. El color del valor sigue la polaridad: verde si protege, rojo si preocupa, neutro si solo informa.

Las emociones tienen dos rutas. Las seis primeras de la lista son negativas y llevan a evaluar el riesgo. Las seis últimas son positivas y dejan el caso en Ninguna, salvo que aparezca una crisis.

### Factores protectores
| Factor | Valores |
|---|---|
| Apoyo | Sí · No · Por confirmar |
| Afrontamiento | Sí · No · Por confirmar |

Mientras alguno esté "por confirmar", el nivel se marca como **provisional**.

### Tabla de evaluación (ruta negativa)
| Intensidad | 2 factores posibles | 1 | 0 |
|---|---|---|---|
| 1–2 | Ninguna | Ninguna | Baja |
| 3 | Baja | Baja | Media |
| 4–5 | Media | Media | Alta |

### Alerta
Cada alerta guarda la hora, el nivel, la acción, si fue por crisis, el turno y un extracto del mensaje (hasta 180 caracteres).

### Decisión del equipo
Dos valores: **Confirmada** o **Ajustada**. Hoy no se pide un motivo al ajustar.

### Garantías de seguridad
| Garantía | Estados |
|---|---|
| Detección de crisis | En espera · Vigilando · Activada |
| Acción por protocolo institucional | En espera · Aplicado |
| La evaluación solo sube | En espera · Respetado |

### Valoración del estudiante
"¿Te sirvió este espacio?": No mucho / Un poco / Sí. Hoy no se guarda.

### Contenido institucional
Viene del cuestionario original de la universidad:
- recomendaciones por emoción;
- 28 recomendaciones positivas;
- el menú de cuatro tipos de apoyo;
- el directorio institucional con siete dependencias, con correo, teléfono y horario.

## 7. Lo que se observa hoy y conviene corregir

| Observación | Dónde | Marca |
|---|---|---|
| Textos cortados con puntos suspensivos: "Evaluació…", "Resum…", "Acción por protocolo institucio…" | Tira de pasos, interruptor Resumen/Detalle, Garantías | Propuesta |
| Aparecen nombres internos que el equipo de Bienestar no necesita: "Formulario DOCO", "Siguiente en DOCO" y los nombres de proveedores en "Modelo e instrumento" | Sala de bienestar | Propuesta |
| Los números de confianza (0,60, 0,80) se ven también en modo Resumen. Para el equipo pueden leerse como un puntaje clínico | Señales por ítem, Lo que interpretó el sistema, Historial | Propuesta |
| La tabla de evaluación son reglas preliminares que ningún clínico ha validado todavía. Hoy eso no se ve en la pantalla del equipo | Tabla de evaluación | Pendiente (nota de negocio y memo técnico) |
| Las recomendaciones de "Triste" son iguales a las de "Temeroso(a)", y las cuatro categorías de apoyo muestran el mismo contenido | Conversación, al final de la ruta negativa | Pendiente (auditoría de DOCO) |
| Cuando SerafIA no entiende, repite "Quiero asegurarme de entenderte bien" | Conversación | Propuesta: variar el tono |
| No hay modo oscuro | Todo | Propuesta |

## 8. Lo que se planea en lo visual

### 8.1 De demo a producto
- **Separar el modo presentación del producto.** Hoy la etiqueta DEMO, los guiones, el reproductor y "Mostrar el detalle" conviven con las pantallas reales. Para un piloto, el estudiante y el equipo necesitan versiones sin esos controles. La sala de demo se mantiene para presentaciones. *Pendiente* (nota de negocio: "no es operación con estudiantes reales").
- **Diseñar la pantalla de entrada del equipo de Bienestar.** Hoy no hay inicio de sesión ni roles. *Pendiente* (nota de negocio: faltan autenticación y envío real al equipo).
- **Revisar el consentimiento para estudiantes reales.** El texto actual habla de una demo. Para un piloto debe decir quién lee la conversación, cuánto tiempo se guarda y cómo pedir que se borre. *Pendiente*.

### 8.2 Sala de bienestar con muchos casos
- **Bandeja de casos.** Hoy la sala muestra un solo caso (SER-0142). Hay que diseñar una lista de casos ordenada por prioridad, con filtros por nivel y por estado (nueva, en revisión, atendida) y búsqueda por código. *Propuesta*, necesaria si hay piloto.
- **Estados del caso a lo largo del tiempo.** Abierto, en revisión, contactado, cerrado y reabierto. Hoy el caso solo vive mientras dura la conversación. *Pendiente* (rastro durable, memo técnico).
- **Historial de un caso cerrado.** Que se pueda volver a ver por qué se llegó a un nivel días después. *Pendiente* (memo técnico, condición 2).

### 8.3 Decisión del equipo
- **"Ajustar" con motivo.** Cuando el equipo cambia la acción sugerida, pedir un motivo corto (lista más texto libre). *Propuesta*.
- **Registro de quién decidió y cuándo**, visible en el caso. *Pendiente* (rastro durable).
- **Confirmación de contacto.** Un paso para marcar "se contactó al estudiante", con la hora. *Propuesta*.

### 8.4 Estados nuevos que hay que diseñar
- **Lectura degradada.** Si la interpretación automática no está disponible, la conversación sigue, pero con menos capacidad para entender al estudiante. El caso debe mostrarse marcado para que el equipo lo revise con más cuidado. *Pendiente* (memo técnico, condición 4).
- **Nivel provisional, más visible.** Hoy se explica con un texto pequeño debajo de la tabla. Debería entenderse de un vistazo que el nivel puede subir. *Propuesta*.
- **Reglas preliminares.** Una marca discreta en la tabla de evaluación y en el nivel del caso mientras no estén validadas clínicamente. *Pendiente*.
- **Crisis prolongada.** Desde el PR #15 la conversación sigue después de la tarjeta de crisis y el cuestionario queda en pausa. Conviene un estado claro para el equipo ("crisis activa, conversación en curso") y para el estudiante. *Hecho en parte* (hay texto en la consola).

### 8.5 Conversación del estudiante
- **Valoración que sí cuenta.** Hoy "¿Te sirvió este espacio?" no se guarda. Si se guarda, se puede mostrar al equipo de forma agregada. *Propuesta*.
- **Recomendaciones y directorio con mejor formato.** Hoy llegan como lista dentro del mensaje. Se podrían presentar como tarjetas con acciones (copiar correo, ver horario). *Propuesta*.
- **Accesibilidad y lectura en móvil.** El texto de SerafIA en serif es grande y cálido, pero los mensajes largos empujan la pregunta fuera de pantalla. *Propuesta*: revisar el largo visible y el anclaje de la pregunta.

### 8.6 Lenguaje
- **Mantener los nombres de negocio ya acordados (PR #10):** Interpretación, Evaluación de riesgo, Detección de crisis, Ruta de atención, Revisión de señales, Protocolo institucional, Resumen y Detalle.
- **Quitar de la vista del equipo** los nombres internos (DOCO y proveedores) y decidir si los números de confianza se quedan solo en Detalle. *Propuesta*.

## 9. Lo que se planea en datos (lo que la interfaz va a tener que mostrar)

Esta sección dice qué información nueva aparecería en pantalla, no cómo se guarda.

| Dato | Para qué se muestra | Marca |
|---|---|---|
| Lista de casos con prioridad, estado, última actividad y responsable | Bandeja del equipo | Propuesta |
| Historial de cada caso: turnos, niveles, decisiones y contactos | Revisar un caso días después | Pendiente |
| Decisión del equipo con motivo, persona y hora | Trazabilidad | Pendiente / Propuesta |
| Marca de lectura degradada por turno | Saber cuándo revisar con más cuidado | Pendiente |
| Versión de las reglas y si están validadas | Transparencia hacia el equipo | Pendiente |
| Valoración del estudiante al cierre | Medir si el espacio sirve | Propuesta |
| Indicadores agregados para el equipo: casos por nivel, tiempo hasta el primer contacto, alertas sin atender | Vista de coordinación | Propuesta |
| Datos del estudiante: código anonimizado y programa | Encabezado del caso | Hecho con valores fijos. Falta definir qué datos reales se pueden mostrar |

Hay que confirmar con el equipo y con el cliente qué datos del estudiante se pueden mostrar. Son datos sensibles de salud mental (Ley 1581 de 2012). La recomendación es que el equipo vea un código y solo los datos que necesita para contactar.

## 10. Reglas de diseño que no cambian

1. **El estudiante nunca ve niveles, puntajes ni alertas.** Solo ve acompañamiento y, si hace falta, ayuda inmediata.
2. **La ayuda de crisis siempre está a un toque,** en cualquier pantalla del estudiante.
3. **Una persona decide.** El sistema propone, y la interfaz debe dejar claro quién confirma.
4. **Nada automático baja una prioridad.** Si el nivel cambia, solo sube, y la interfaz lo muestra como subida.
5. **Cada alerta muestra su porqué:** la cita del estudiante y las respuestas que llevaron al nivel.
6. **Lenguaje de negocio** en todo lo que ve el equipo. Nada de términos técnicos.

## 11. Preguntas para trabajar juntos

1. ¿La sala de bienestar se diseña pensando primero en escritorio (como hoy) o también en tableta o móvil para el equipo?
2. ¿Los números de confianza se quedan para el equipo o pasan solo al modo Detalle?
3. ¿Hace falta modo oscuro para el equipo, que puede tener la consola abierta todo el día?
4. ¿Cómo se ve una bandeja con 30 casos activos sin perder lo urgente?
5. ¿El modo presentación se mantiene como un producto aparte o como un interruptor?
