# SerafIA · App integral de bienestar universitario

## Estudio de contexto y propuesta de funcionalidades

**Fecha:** 6 de octubre de 2026
**Estado:** borrador para discusión con negocio y UX/UI  
**Fuentes:** `serafia-demo.html` (demo en staging, PR #15) y `SERAFIA-PLAN-VISUAL-Y-DATOS.md` (plan visual y de datos de Luis Peñaranda).

**Marcas usadas** (mismas del plan visual): **Hecho** = ya existe en la demo · **Pendiente** = identificado en los documentos · **Propuesta** = idea nueva de este estudio, sin decidir.

---

## 1. Resumen ejecutivo

La demo actual es **el 50 % de la solución**: un acompañante conversacional que guía al estudiante por el cuestionario de bienestar de la universidad, clasifica el riesgo (5 niveles), escala las crisis y entrega al equipo de Bienestar una consola para revisar y decidir.

Negocio quiere llevarlo a una **app completa de bienestar y vida universitaria**. La tesis de este estudio:

> **El chat es el protagonista y el punto de entrada a todo.** Los módulos útiles (carnet, horario, calendario, certificados, contactos, mapa, notas) son la razón por la que el estudiante abre la app *todos los días*, y el chat es lo que los une. Cada vez que el estudiante abre la app por algo cotidiano ("¿a qué hora es mi clase?"), SerafIA tiene una oportunidad de acompañarle, sin que se sienta evaluado.

Esto resuelve el problema de fondo de cualquier app de bienestar: **nadie abre una app de "salud mental" cuando está bien**, y por eso no está cuando hace falta. Una app que resuelve la vida universitaria genera hábito; el hábito genera confianza; la confianza hace que el estudiante hable cuando lo necesita.

**Qué se propone:**

1. Un shell de app con el **chat siempre presente** en todas las vistas.
2. **Siete módulos solicitados** por negocio, más **catorce propuestos** agrupados en cuatro ejes (Hoy, Trámites, Cuidado, Comunidad).
3. Un modelo donde **el chat opera los módulos** (acciones) y **los módulos alimentan al chat** (contexto), siempre con las reglas de seguridad de la demo intactas.
4. Un plan por fases que lleva de la demo a un piloto con estudiantes reales.

---

## 2. Lo que ya existe (contexto leído)

### 2.1 Producto actual (Hecho)


| Ruta    | Superficie                                                             | Para quién          |
| ------- | ---------------------------------------------------------------------- | ------------------- |
| `/`     | Portada                                                                | Cliente / directivo |
| `/chat` | Conversación del estudiante (móvil primero), con consentimiento previo | Estudiante          |
| `/ops`  | Sala de bienestar: alertas, caso, señales D1–D8, garantías             | Equipo de Bienestar |
| `/demo` | Estudiante y Bienestar lado a lado con guiones reproducibles           | Quien presenta      |


**Flujo conversacional:** Escucha → Reconoce → Explica → Deriva. El estudiante escribe libre; el sistema interpreta contra 8 ítems (D1 emoción, D2 intensidad, D3 detonante, D4 habló con alguien, D5 aceptaría consejero, D6 actividad que le ayuda, D7 le alcanza, D8 tipo de apoyo).

**Niveles y acciones:** Ninguna (Acompañar) · Baja (Monitorear) · Media (Alerta) · Alta (Alerta prioritaria) · Crítica (Escalamiento inmediato). Las alertas las decide una persona; el sistema solo propone.

**Sistema visual:** Newsreader (serif, voz de SerafIA), Geist (UI), Geist Mono (etiquetas). Lienzo cálido `#F6F3EE`, acento pine `#1B7465` / `#0A2A24`, terracota `#B5523A` para cuidado y crisis. Sin modo oscuro.

**Contenido institucional ya disponible:** recomendaciones por emoción, 28 recomendaciones positivas, menú de 4 tipos de apoyo y un directorio de 7 dependencias (correo, teléfono, horario). Líneas de crisis: **123** emergencias, **192** salud mental (opción 4), **106** escucha (Bogotá).

### 2.2 Reglas que no se pueden romper (sección 10 del plan visual)

1. El estudiante **nunca ve** niveles, puntajes ni alertas.
2. La **ayuda de crisis está siempre a un toque**, en cualquier pantalla del estudiante.
3. **Una persona decide**; el sistema propone.
4. **Nada automático baja** una prioridad.
5. Cada alerta **muestra su porqué** (cita y respuestas).
6. **Lenguaje de negocio** hacia el equipo.

> Estas reglas son el filtro de todo lo que sigue. Cualquier funcionalidad nueva que las comprometa queda fuera.

### 2.3 Deudas y pendientes ya reconocidos (relevantes para la app completa)

- Separar modo demo del producto (etiqueta DEMO, guiones, reproductor).
- Autenticación y roles: hoy no hay inicio de sesión.
- Consentimiento para estudiantes reales (quién lee, cuánto se guarda, cómo borrar).
- Bandeja de casos (hoy un solo caso fijo, SER-0142), estados del caso en el tiempo, rastro durable.
- Reglas de evaluación **preliminares, sin validación clínica**.
- Contenido repetido en recomendaciones (Triste = Temeroso; 4 categorías de apoyo iguales).
- Datos de salud mental: **Ley 1581 de 2012**, tratamiento de datos sensibles.

---

## 3. Principio rector: el chat como protagonista

### 3.1 Cómo se traduce en diseño


| Principio                                             | Decisión de diseño                                                                                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| El chat está **siempre presente**                     | Barra/entrada de SerafIA anclada en todas las vistas (no es una pestaña más: es la capa base).                                            |
| Entrar a un módulo **no saca al estudiante del chat** | Los módulos se abren como *hojas* (sheets) sobre el chat o como vistas con el compositor de SerafIA visible abajo.                        |
| El chat **opera** la app                              | "Muéstrame mi carnet", "¿qué clase tengo ahora?", "genérame un certificado de estudio" → resultado como **tarjeta rica dentro del chat**. |
| La app **alimenta** al chat                           | SerafIA conoce el contexto práctico (semana de parciales, clase en 10 min) para saludar y acompañar mejor.                                |
| **Crisis siempre gana**                               | El botón "Ayuda ahora" persiste en el shell; una frase de crisis interrumpe cualquier módulo.                                             |


### 3.2 Anatomía del shell (propuesta)

```
┌──────────────────────────────────────┐
│  SerafIA   [Hoy]      [Ayuda ahora] │  ← encabezado fijo, crisis siempre visible
├──────────────────────────────────────┤
│                                      │
│   Vista activa (Hoy / Servicios /    │
│   Cuidado / Campus) o el chat        │
│   a pantalla completa                │
│                                      │
├──────────────────────────────────────┤
│  ✦ Pregúntale a SerafIA…        ➤   │  ← compositor SIEMPRE visible
├──────────────────────────────────────┤
│  Hoy  Servicios  ✦Chat  Campus  Yo  │  ← navegación; el chat al centro
└──────────────────────────────────────┘
```

- **Chat al centro de la barra de navegación**, con peso visual mayor (orbe de SerafIA).
- **Compositor persistente**: en cualquier vista se puede escribir. Al enviar, la conversación sube como hoja o se abre a pantalla completa.
- **Chips de sugerencia contextual** sobre el compositor ("Ver mi horario de hoy", "Hablar con alguien"). Cambian según hora, día y contexto académico.
- **Escritorio / tableta:** chat como panel lateral fijo (columna derecha) con los módulos a la izquierda.

### 3.3 Dos tipos de interacción chat ↔ módulo


| Tipo                                     | Ejemplo                                 | Resultado                                                                                                  |
| ---------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Consulta** (lectura)                   | "¿Cuándo es mi próximo examen?"         | Tarjeta de examen en el chat + botón "Abrir calendario".                                                   |
| **Acción** (escritura, con confirmación) | "Recuérdame estudiar cálculo el jueves" | SerafIA propone el recordatorio; el estudiante confirma.                                                   |
| **Navegación**                           | "Llévame al bloque C"                   | Abre el mapa con la ruta.                                                                                  |
| **Acompañamiento**                       | "Estoy agobiado con tantos parciales"   | Flujo de bienestar normal (cuestionario D1–D8), **más** ofrecer ver la semana de parciales para ordenarla. |


> **Regla de oro de la integración:** el contenido académico del estudiante (notas, horario, ausencias) **mejora el acompañamiento pero no genera alertas por sí solo**. Las alertas siguen naciendo de lo que el estudiante *dice* y del protocolo institucional (ver §8).

---

## 4. Módulos solicitados por negocio

Para cada módulo: qué es, qué resuelve, relación con el chat, datos e integraciones, y riesgos.

### 4.1 Carnet estudiantil digital

- **Qué es:** el carnet de la universidad en el teléfono, con foto, nombre, programa, código, vigencia y **QR/código rotativo** verificable.
- **Valor para el estudiante:** nunca se queda sin carnet; entra a biblioteca, laboratorios, cafetería o eventos.
- **Valor para negocio:** es el **gancho de apertura diaria** más fuerte (se usa a diario en el campus).
- **Chat:** "Muéstrame mi carnet" lo abre. Pantalla completa con brillo alto y modo "mostrar en puerta".
- **Datos / integración:** sistema de información estudiantil (SIA/ERP académico) para foto, estado de matrícula y vigencia. QR firmado con rotación corta para evitar capturas.
- **Detalles de UX:** acceso rápido desde la pantalla de bloqueo/widget; funciona **sin conexión** (último estado válido con fecha); versión "carnet vencido / sin matrícula vigente" clara.
- **Riesgos:** suplantación (resuelto con QR rotativo y foto); dependencia de que la universidad acepte carnet digital en portería.

### 4.2 Horario matriculado, clases del día, notificaciones y exámenes

- **Qué es:** horario semanal sincronizado con la matrícula, vista **"Hoy"** con clases, aula, docente y hora; **recordatorios** configurables; fechas de parciales/entregas.
- **Valor:** responde la pregunta más frecuente del día ("¿qué tengo y dónde?") y reduce la ansiedad por olvidos.
- **Chat:** "¿Qué clase tengo ahora?", "¿cuándo es el parcial de física?", "avísame 30 min antes de cada clase".
- **Notificaciones (el estudiante controla):** clase en X minutos · cambio de aula/cancelación · examen en 7 / 3 / 1 días · entrega pendiente. Silencio por franjas y por materia.
- **Conexión con bienestar (Propuesta):** SerafIA puede detectar **semanas de alta carga** (≥3 evaluaciones en 5 días) y ofrecer *ayuda para organizarse* de forma proactiva y opt-in, nunca como alerta de riesgo.
- **Datos / integración:** matrícula + calendario académico oficial. Modelo: `Clase`, `Aula`, `Evaluación`, `Periodo`.
- **Riesgos:** calidad del dato académico; cambios de último minuto → necesita fuente en vivo o push desde la universidad.

### 4.3 Calendario de eventos (universidad + bienestar)

- **Qué es:** calendario unificado con capas filtrables: **Académico** · **Eventos de la U** · **Bienestar** (talleres, deporte, cultura, jornadas de salud, grupos de apoyo) · **Mis recordatorios**.
- **Valor:** el estudiante se entera de lo que existe y la U logra que sus programas de bienestar **se usen** (hoy suele ser su principal queja: poca asistencia).
- **Chat:** "¿Qué hay esta semana para desestresarme?" → SerafIA recomienda actividades de Bienestar acordes a lo que el estudiante contó (ver D6 "actividad que le ayuda").
- **Acciones:** "Me interesa" / **inscribirme** / agregar al calendario del teléfono (.ics) / recordatorio.
- **Datos:** `Evento` (título, tipo, lugar, cupo, inscripción, categoría de bienestar, público). Alimentado por un **panel de gestión** para Bienestar y comunicaciones (ver §7).
- **Riesgos:** si nadie mantiene el calendario, muere; necesita dueño operativo y herramienta de carga simple.

### 4.4 Generación de documentos y certificados

- **Qué es:** solicitud y descarga de **certificado de estudios, constancia de matrícula, certificado de notas, paz y salvo, carta de cumplimiento**, etc., con firma/QR verificable.
- **Valor:** quita la fila y la espera; es de los trámites más odiados. Alto valor percibido por negocio.
- **Chat:** "Necesito un certificado de estudio para la EPS" → SerafIA pregunta destino/idioma, genera y entrega en el chat con botón de descargar/compartir.
- **Flujo:** catálogo → formulario mínimo (para quién, motivo) → generación **inmediata** (los que no requieren aprobación) o **estado de solicitud** (los que sí) → notificación → descarga.
- **Seguridad:** documento con **código de verificación público** (URL/QR) para que un tercero compruebe autenticidad.
- **Datos / integración:** ERP académico (fuente de verdad), plantillas oficiales, firma electrónica institucional.
- **Riesgos:** validez legal depende de la política de la U; documentos que requieren pago o aprobación humana necesitan estado y trazabilidad.

### 4.5 Biblioteca de contactos (Bienestar y canales de ayuda)

- **Qué es:** directorio buscable de **personas y dependencias**: Bienestar (psicología, trabajo social, enfermería), orientación académica, financiera, registro, decanaturas, seguridad, líneas de crisis, y **canales de ayuda externos**.
- **Base ya existente (Hecho):** directorio de 7 dependencias con correo, teléfono y horario + líneas 123 / 192 / 106.
- **Qué se agrega (Propuesta):**
  - **Acciones de un toque:** llamar, escribir, WhatsApp institucional, copiar correo, ver horario, **cómo llegar** (enlaza con el mapa).
  - **"Abierto ahora"** según horario.
  - **Etiquetas por necesidad** ("me siento mal", "problema con una nota", "tema económico", "acoso/violencia", "discapacidad/inclusión").
  - **Agendar** cita (ver §5.8).
- **Chat:** "¿A quién le escribo por un problema con mi beca?" → tarjeta de contacto correcta. En acompañamiento, el menú de apoyo (D8) deja de ser lista de texto y pasa a **tarjetas accionables**, lo cual ya figura como propuesta en el plan visual (§8.5).
- **Regla:** los contactos de **crisis y Bienestar** siempre visibles y accesibles también sin sesión iniciada (crítico en emergencia).
- **Riesgos:** datos desactualizados; asignar responsable del directorio.

### 4.6 Mapa del campus

- **Qué es:** mapa interactivo con **edificios, aulas, laboratorios, biblioteca, cafeterías, baños, enfermería, Bienestar, parqueaderos, puntos de encuentro y puntos de emergencia**.
- **Valor:** vital para estudiantes nuevos (primer semestre = mayor riesgo de abandono y de ansiedad). "No llegar a tiempo" es un estresor real.
- **Chat:** "¿Cómo llego al salón C-302?", "¿dónde está la enfermería?" → ruta y tiempo estimado a pie.
- **Integración con horario:** desde una clase en "Hoy" → **"Cómo llegar"**; tiempo de desplazamiento entre clases consecutivas ("tienes 8 min entre el bloque A y el F: ve ya").
- **Capas útiles (Propuesta):** accesibilidad (rampas, ascensores), **espacios tranquilos**, zonas de estudio libres, salas de lactancia, puntos de hidratación.
- **Datos:** plano indoor/outdoor de la U (PDF/CAD/GeoJSON). Decisión técnica: mapa propio sobre plano vs. proveedor de mapas con capa del campus.
- **Riesgos:** levantamiento de datos indoor es costoso; empezar por edificios y bloques, luego aulas.

### 4.7 Calificaciones finales y calculadora de promedio

- **Qué es:** consulta de **notas por corte y definitivas**, créditos, promedio del periodo y acumulado (PAPA/PPA), más una **calculadora "¿qué necesito?"**.
- **Calculadora (el diferencial):**
  - **Proyección:** "si saco 3.5 en el próximo parcial, mi definitiva queda en X".
  - **Meta inversa:** "¿cuánto necesito en el examen final para pasar con 3.0?".
  - **Promedio ponderado** por créditos; simulación de **semestre completo**.
  - Respeta la **escala y reglas de la universidad** (configurable: porcentajes por corte, nota mínima aprobatoria, redondeo).
- **Chat:** "¿cuánto necesito en el final de cálculo para pasar?" → respuesta con tarjeta de cálculo y botón "Ver detalle".
- **Sensibilidad (importante):** las notas son un **detonante emocional**. Diseñar con cuidado:
  - Mostrar notas **en una vista elegida por el estudiante** (no empujarlas en notificaciones con el valor).
  - Notificación neutra: "Hay una nueva nota disponible", sin el número.
  - Lenguaje de la calculadora enfocado en **posibilidad y plan** ("necesitas 3.2: es alcanzable"), no en reproche.
  - Si el resultado es adverso, SerafIA **ofrece apoyo** de forma suave (ver §8.2), sin asumir.
- **Datos:** ERP académico; calendario de publicación de notas.
- **Riesgos:** error de cálculo = daño de confianza → **pruebas con reglas reales** de cada programa y descargo claro ("cálculo informativo; la nota oficial es la del sistema académico").

---

## 5. Funcionalidades propuestas adicionales

Agrupadas por eje. Cada una con **valor**, **impacto en bienestar**, **esfuerzo** y **dependencias**. Esfuerzo: S (días) · M (semanas) · L (meses).

### Eje A · "Mi día" (utilidad diaria)

#### 5.1 Pantalla "Hoy" (el corazón de la app) — **M**

Un solo lugar con: saludo de SerafIA (una frase, contextual), próxima clase, tareas/entregas del día, evento destacado, clima/aviso del campus y **un micro-chequeo emocional opcional** ("¿cómo vas hoy?" en 1 toque). Es lo que se ve al abrir la app.

- *Impacto en bienestar:* check-in diario de baja fricción que alimenta el acompañamiento sin cuestionario formal.
- *Importante:* el micro-chequeo es **opt-in** y su resultado no es un puntaje visible para el estudiante.

#### 5.2 Agenda de tareas y entregas con planificador de estudio — **M**

Entregas, lecturas, proyectos con fechas; SerafIA ayuda a **dividir una tarea grande en pasos** y a **planificar bloques de estudio** alrededor del horario. Integración con el calendario.

- *Impacto:* la **sobrecarga percibida** es un gran generador de estrés; planificar la reduce.
- *Chat:* "Tengo parcial de cálculo el viernes y entrega el jueves, ayúdame a organizarme."

#### 5.3 Modo foco / Pomodoro con pausa de cuidado — **S**

Temporizador de estudio con pausas guiadas (respiración 60 s, estiramiento). Reutiliza "Respirar conmigo un minuto" (ya existe en la tarjeta de crisis, **Hecho**).

- *Impacto:* convierte un recurso de crisis en **hábito preventivo** a bajo costo.

#### 5.4 Semáforo de semana (carga académica) — **S/M**

Vista de **carga por semana** (evaluaciones + entregas). Alerta amable de semanas pesadas y sugerencia de adelantar tareas.

- *Impacto:* anticipación = menos pánico. Solo informativo.

### Eje B · "Trámites y servicios" (quitar fricción)

#### 5.5 Estado de trámites y solicitudes — **M**

Seguimiento unificado de lo que el estudiante pidió (certificados, homologaciones, cartas, cancelación de materias, reintegro): **estado, responsable, fecha estimada**.

- *Valor:* reduce el "¿en qué quedó mi solicitud?" que satura oficinas y estresa.

#### 5.6 Pagos y financiero — **M/L**

Estado de cuenta, **fechas de pago de matrícula**, enlaces de pago, becas/créditos con vencimientos. Recordatorios antes del vencimiento.

- *Impacto:* la **presión financiera** es una de las primeras causas de deserción y estrés. Un recordatorio claro y un contacto de apoyo financiero valen mucho.
- *Cuidado:* tono sin juicio; conectar con **rutas de ayuda económica** (D8 "apoyo").

#### 5.7 Reserva de espacios y servicios — **M**

Salas de estudio, cubículos de biblioteca, canchas, laboratorios, gimnasio. Con **QR de acceso** vinculado al carnet.

- *Chat:* "Resérvame una sala de estudio mañana a las 3."

#### 5.8 Agendar cita con Bienestar — **M**

Citas de psicología, trabajo social, orientación o enfermería con **disponibilidad real**, recordatorios y reprogramación. Cierra el ciclo que hoy termina en "una persona te escribirá".

- *Valor central:* convierte la **derivación en una acción concreta** que el estudiante controla.
- *Dependencia:* agenda del equipo (ver §7). Debe poder **originarse desde el chat** y desde el directorio.
- *Regla:* agendar cita voluntaria **no** es lo mismo que una alerta; son flujos separados, aunque conectados.

#### 5.9 Biblioteca y préstamos — **S/M**

Búsqueda de catálogo, préstamos activos con **fechas de devolución**, renovación, multas. Integración con carnet.

### Eje C · "Cuidado" (la identidad de SerafIA)

#### 5.10 Caja de herramientas de bienestar — **M**

Recursos de uso inmediato y **autónomo**: respiración guiada, grounding 5-4-3-2-1, relajación muscular, **audio de sueño**, estiramientos, mini-meditaciones de 1–5 min. Parte del contenido ya existe (28 recomendaciones positivas, **Hecho**); se **estructura y enriquece**.

- *Chat:* SerafIA las ofrece según lo que cuenta el estudiante (hoy son listas de texto).
- *Contenido:* validado por el equipo de psicología (no inventado por producto).

#### 5.11 Diario emocional privado y tendencias personales — **M**

Registro de ánimo breve y notas **que solo ve el estudiante** (por defecto), con **vista de tendencias** ("tus semanas más difíciles coinciden con parciales").

- *Impacto:* autoconocimiento y evidencia para que el estudiante *decida* pedir ayuda.
- ***Decisión crítica de privacidad:*** el diario es **privado por defecto**. Compartirlo con Bienestar solo con acción explícita del estudiante. Nada del diario genera alertas automáticas (solo la conversación y el protocolo de crisis).

#### 5.12 Botón de ayuda y plan de seguridad personal — **S/M**

Más que "Ayuda ahora": el estudiante puede construir **su plan personal** (personas de confianza, señales de alerta propias, cosas que le ayudan, números clave) y acceder a él en un toque. Práctica clínica reconocida (*safety plan*), a validar con psicología.

#### 5.13 Rutas de ayuda por situación — **S**

Guías cortas "qué hacer si…": me siento muy mal · me cuesta la plata · sufro acoso/violencia · tengo una discapacidad · extraño mi casa · pienso en dejar la carrera. Cada una con **pasos + contactos + botón de agendar**.

- *Valor:* aterriza el directorio en **situaciones reales** que el estudiante sí reconoce.

#### 5.14 Línea de seguimiento ("¿cómo seguiste?") — **S**

Después de una alerta o conversación difícil, un mensaje de **seguimiento a las 24–72 h** ("pensé en ti, ¿cómo vas?"). Respeta preferencia de contacto.

- *Valor:* cuidado percibido y detecta si algo empeoró (la nueva señal sigue el flujo normal; **solo puede subir**).

### Eje D · "Comunidad y campus" (pertenencia)

#### 5.15 Descubrir: clubes, grupos y voluntariado — **M**

Directorio de grupos estudiantiles, semilleros, deportes, cultura; el chat **recomienda según intereses** y lo que ayuda al estudiante (D6). La **conexión social** es factor protector clave (en el modelo, "apoyo").

#### 5.16 Grupos de pares y tutorías — **L**

Emparejar estudiantes de semestres avanzados como **mentores/tutores** y facilitar grupos de estudio. Alto impacto en primer semestre. Requiere moderación.

#### 5.17 Centro de avisos oficiales — **S**

Comunicados de la U **filtrados por programa/semestre** y con prioridad ("lo importante primero"), en lugar de correos masivos que se ignoran. Con "marcar como visto".

#### 5.18 Inclusión y accesibilidad — **M**

Ruta de apoyo para estudiantes con discapacidad (ajustes razonables, contactos, mapa accesible). Y en la app: **tamaño de texto, contraste, lectura en voz alta, modo oscuro**.

### Eje E · Ventaja competitiva de negocio

#### 5.19 Panel de bienestar y analítica agregada para la U — **M/L**

Indicadores **agregados y anonimizados**: uso de servicios, horas pico de estrés (semanas de parciales), temas más consultados, tiempo hasta primer contacto, alertas sin atender, satisfacción. Ya hay semilla en el plan visual (§9, "indicadores agregados").

- *Valor de negocio:* **argumento de venta** a directivos; ayuda a planificar recursos (más psicólogos en semana 8).
- *Regla:* **nunca individual** sin protocolo; k-anonimato mínimo en reportes.

#### 5.20 Modo "primer semestre" (onboarding universitario) — **S/M**

Ruta guiada para nuevos: mapa de campus, trámites obligatorios, primeras semanas, cómo pedir ayuda. Reduce el abandono temprano y es un **gancho de adopción** (la app llega con la inducción).

#### 5.21 Gamificación **suave** y de hábitos — **S/M**

Rachas de **cuidado** (no de productividad): días de pausa, check-ins, uso de herramientas. **Sin competencia ni rankings** y sin culpa por perder racha (la gamificación punitiva en salud mental hace daño).

---

## 6. Priorización

### 6.1 Matriz valor / esfuerzo


| Prioridad       | Funcionalidad                                                                     | Valor estudiante | Valor negocio | Esfuerzo |
| --------------- | --------------------------------------------------------------------------------- | ---------------- | ------------- | -------- |
| **P0 (base)**   | Shell con chat persistente + Hoy (5.1)                                            | Alto             | Alto          | M        |
| **P0**          | Carnet digital (4.1)                                                              | Alto             | Alto          | M        |
| **P0**          | Horario + clases del día + recordatorios (4.2)                                    | Alto             | Alto          | M        |
| **P0**          | Contactos y canales de ayuda (4.5)                                                | Alto             | Alto          | S        |
| **P1**          | Calendario de eventos y bienestar (4.3)                                           | Alto             | Alto          | M        |
| **P1**          | Calificaciones + calculadora (4.7)                                                | Alto             | Medio         | M        |
| **P1**          | Certificados y documentos (4.4)                                                   | Alto             | Alto          | M/L      |
| **P1**          | Mapa del campus (4.6)                                                             | Medio/Alto       | Medio         | M/L      |
| **P1**          | Agendar cita con Bienestar (5.8)                                                  | Alto             | Alto          | M        |
| **P1**          | Caja de herramientas de bienestar (5.10)                                          | Alto             | Alto          | M        |
| **P2**          | Agenda de tareas + planificador (5.2), semáforo de semana (5.4), modo foco (5.3)  | Alto             | Medio         | M        |
| **P2**          | Rutas de ayuda (5.13), plan de seguridad (5.12), seguimiento (5.14)               | Alto             | Alto          | S/M      |
| **P2**          | Trámites (5.5), centro de avisos (5.17), biblioteca (5.9)                         | Medio            | Medio         | S/M      |
| **P3**          | Diario emocional (5.11), clubes (5.15), reservas (5.7), onboarding (5.20)         | Medio            | Medio         | M        |
| **P3**          | Pagos (5.6), mentores (5.16), accesibilidad extendida (5.18), gamificación (5.21) | Medio            | Medio         | M/L      |
| **Transversal** | Panel de analítica para la U (5.19)                                               | —                | **Alto**      | M/L      |


### 6.2 Criterio de priorización

1. **¿Se usa a diario?** (carnet, horario, Hoy) → genera hábito y abre la puerta al chat.
2. **¿Reduce un estresor real?** (olvidos, filas, plata, notas, perderse) → coherente con la misión.
3. **¿Depende de integraciones difíciles?** Lo que depende del ERP académico va primero en el roadmap de integración porque desbloquea 4.1, 4.2, 4.4, 4.7 y 5.5.
4. **¿Tiene riesgo ético/legal alto?** (diario, notas, analítica) → diseñar con consentimiento y privacidad desde el día uno.

---

## 7. Qué hay detrás: actores, roles e integraciones

### 7.1 Actores


| Actor                        | Qué hace en la app completa                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| **Estudiante**               | App móvil: chat + módulos.                                                                   |
| **Equipo de Bienestar**      | Consola de casos (existente) + agenda de citas + gestión de eventos/contenidos de Bienestar. |
| **Administración académica** | Fuente de datos (matrícula, notas, horarios) y aprobación de ciertos documentos.             |
| **Comunicaciones / Eventos** | Carga de calendario y avisos.                                                                |
| **Administrador SerafIA**    | Configuración por universidad, contenido, reglas, roles.                                     |
| **Directivos**               | Panel agregado.                                                                              |


### 7.2 Integraciones críticas (riesgo principal del proyecto)


| Integración                                                   | Habilita                                                 | Complejidad | Notas                                                                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| **ERP / SIA académico** (matrícula, horario, notas, programa) | Carnet, horario, notas, certificados, trámites           | **Alta**    | Es la **dependencia #1**. Sin API, plan B: carga periódica por archivo (CSV/SFTP) o scraping autorizado (frágil, evitar). |
| **SSO universitario** (Microsoft 365 / Google / CAS)          | Login sin crear contraseñas nuevas; ligar identidad real | Media       | Facilita adopción y seguridad. Mandatorio para el piloto con datos reales.                                                |
| **Firma electrónica / plantillas oficiales**                  | Certificados con validez                                 | Media       | Depende de la política legal de la U.                                                                                     |
| **Notificaciones push** (FCM/APNs) + opcional WhatsApp/SMS    | Recordatorios y avisos                                   | Media       | Respetar preferencias y silencio.                                                                                         |
| **Proveedor de mapas / plano del campus**                     | Mapa                                                     | Media       | Levantamiento de datos del campus.                                                                                        |
| **Agenda del equipo de Bienestar**                            | Citas                                                    | Media       | Puede iniciar con agenda propia de SerafIA.                                                                               |
| **Pagos** (si aplica)                                         | Pagos                                                    | Alta        | Fase tardía; opcional vía redirección.                                                                                    |


### 7.3 Multi-universidad (decisión de arquitectura temprana)

Si negocio venderá a **varias universidades**, la app debe ser **configurable por tenant**: logo, colores, directorio, calendario, políticas de documentos, reglas de notas, textos de consentimiento. Conviene decidirlo ahora; reorganizarlo luego es caro.

---

## 8. Seguridad, privacidad y ética (no negociable)

### 8.1 Separación de datos

Dos mundos de datos con **permisos distintos**:


| Dato                                                  | Quién lo ve                                       | Notas                                                                 |
| ----------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| **Académico/administrativo** (horario, notas, carnet) | El estudiante; la U según sus procesos habituales | Ya existe en la U.                                                    |
| **Conversación y señales de bienestar**               | Equipo de Bienestar **solo vía alerta/caso**      | Datos sensibles de salud mental (Ley 1581). Consentimiento explícito. |
| **Diario / herramientas personales**                  | **Solo el estudiante** (por defecto)              | Compartir = acción explícita y revocable.                             |
| **Analítica agregada**                                | Directivos                                        | Anonimizada, con umbral mínimo (k-anonimato).                         |


### 8.2 Cruce de datos académicos y bienestar: reglas

- Las **notas y asistencia no disparan alertas automáticas** de riesgo emocional. La app **no vigila**; acompaña.
- Se permite que SerafIA **use contexto académico para ofrecer ayuda** (ej. semana de parciales), siempre **opt-in** y explicado ("¿quieres que use tu horario para ayudarte a organizarte?").
- Un cambio de contexto (sacar una nota baja) puede generar una **oferta suave de apoyo** en el chat, nunca un caso en la consola de Bienestar sin que el estudiante lo diga o acepte.
- La **frase de crisis** sigue siendo el único disparador automático de escalamiento inmediato, como hoy.

### 8.3 Consentimiento por capas

1. **Términos y uso de la app** (genérico).
2. **Consentimiento de bienestar** (quién lee, cuánto se guarda, cómo borrar): ya identificado como pendiente.
3. **Permisos opcionales:** usar horario/notas para acompañar, recibir seguimiento proactivo, compartir el diario.
Cada uno **revocable** desde "Yo → Privacidad".

### 8.4 Reglas heredadas que deben seguir cumpliéndose en todos los módulos

- "Ayuda ahora" siempre a un toque, **incluso dentro de carnet, mapa, calculadora**.
- Nada automático **baja** una prioridad.
- El estudiante **nunca ve** niveles ni puntajes.
- Contenido clínico/herramientas validado por **profesionales de Bienestar**.
- Reglas de evaluación **preliminares**: marcar como no validadas hasta que lo sean (pendiente).

### 8.5 Otros riesgos


| Riesgo                                            | Mitigación                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Notas como detonante emocional                    | Notificación neutra, vista elegida, lenguaje de plan.                           |
| Falsa sensación de ser vigilado                   | Transparencia: pantalla "Qué ve SerafIA y qué no".                              |
| Cálculo de notas erróneo                          | Reglas por programa, pruebas, descargo, fuente oficial.                         |
| Carnet/QR suplantado                              | QR rotativo y foto.                                                             |
| Dependencia total de la app en emergencia         | Números de crisis también en la **pantalla de bloqueo** y accesibles sin login. |
| Contenido desactualizado (directorio, calendario) | Dueño operativo y fecha de "última verificación" visible.                       |
| Sobrecarga de notificaciones                      | Centro de preferencias, agrupación, franjas de silencio.                        |


---

## 9. Experiencia: cómo se ve en la práctica

### 9.1 Navegación (propuesta)


| Tab                    | Contenido                                                              |
| ---------------------- | ---------------------------------------------------------------------- |
| **Hoy**                | Saludo, clases, entregas, evento, micro-chequeo.                       |
| **Servicios**          | Carnet, certificados, trámites, notas, reservas, biblioteca.           |
| **✦ SerafIA** (centro) | Chat a pantalla completa.                                              |
| **Campus**             | Mapa, calendario, eventos, clubes, contactos.                          |
| **Yo**                 | Perfil, herramientas de bienestar, diario, privacidad, notificaciones. |


El compositor del chat es visible en **todas** las pestañas.

### 9.2 Ejemplos de tarjetas dentro del chat

- **Carnet:** miniatura + botón "Mostrar en puerta".
- **Clase siguiente:** materia, hora, aula, "Cómo llegar".
- **Examen próximo:** fecha, cuenta atrás, "Planear estudio".
- **Evento de Bienestar:** título, hora, lugar, "Me interesa / Inscribirme".
- **Contacto:** nombre, dependencia, horario, "Llamar / Escribir / Agendar".
- **Certificado:** estado y "Descargar".
- **Cálculo de nota:** "Necesitas 3.2 en el final".
- **Herramienta de bienestar:** "Respirar 1 minuto".

### 9.3 Ejemplos de conversaciones

> **Estudiante:** ¿qué tengo hoy?
> **SerafIA:** Hoy tienes Cálculo II a las 10:00 (aula C-302) y Física a las 14:00. Entre clases tienes 3 horas libres. *\[tarjeta: Cálculo II · 10:00 · C-302 · Cómo llegar\]*

> **Estudiante:** necesito un certificado de estudio
> **SerafIA:** Claro. ¿Es para alguna entidad en particular, o lo necesitas general? *\[chips: EPS · Banco · Embajada · General\]*
> … *\[tarjeta: Certificado de estudios · Listo · Descargar\]*

> **Estudiante:** esta semana tengo 4 parciales y no doy más
> **SerafIA:** Suena a una semana muy pesada. ¿Cómo te sientes con todo eso? *(sigue el flujo de bienestar normal)* … Si quieres, también puedo ayudarte a organizar el estudio con tu horario. *\[ofrecer, no imponer\]*

> **Estudiante:** quiero hablar con alguien
> **SerafIA:** Me alegra que lo pidas. Estas son las opciones del equipo de Bienestar. *\[tarjeta de contacto + "Agendar cita"\]* Y si prefieres hablar ahora mismo, tienes la línea de ayuda a un toque. *\[Ayuda ahora\]*

### 9.4 Sistema visual: continuidad

Partir del sistema actual (Newsreader / Geist / Geist Mono, pine + terracota, riesgo en 5 tonos). Decisiones a resolver con UX/UI:

- Los módulos "útiles" deben sentirse **de la misma familia cálida**, no un dashboard corporativo frío; el **serif** queda para la voz de SerafIA y titulares.
- El **color de riesgo** y la terracota de cuidado quedan **reservados**: no usarlos para estados de módulos (evitar que un "pendiente" se lea como alerta).
- **Modo oscuro** pasa de "propuesta" a recomendable (uso nocturno de estudio, accesibilidad).
- Tokens por **tenant** (logo/acento por universidad).

> Nota: si se diseña en alta definición para el ecosistema Naowee, aplicar las reglas de diseño del SDK (`sdk-frontend-foundations` y `sdk-react-components`) y avisar donde se componga algo que no exista en el SDK.

---

## 10. Hoja de ruta propuesta

### Fase 0 · Fundaciones (4–6 semanas)

- Separar **modo demo** del producto; shell con **chat persistente**.
- **SSO** y autenticación; roles (estudiante / bienestar / admin).
- Consentimiento para estudiantes reales; política de datos.
- Decisión de **fuente académica** (API vs archivo) y arranque de integración.
- Bandeja de casos + estados + rastro durable (consola).

### Fase 1 · "Mi día" (MVP de app) (6–8 semanas)

- **Hoy**, **Carnet**, **Horario + recordatorios**, **Contactos y canales de ayuda**, **Calendario básico**.
- Chat con **acciones de consulta** sobre estos módulos.
- Notificaciones push con preferencias.
- *Objetivo:* uso diario; medir retención D1/D7/D30.

### Fase 2 · Trámites y bienestar activo (6–10 semanas)

- **Notas + calculadora**, **Certificados**, **Mapa** (edificios), **Agendar cita**.
- **Caja de herramientas**, **rutas de ayuda**, **seguimiento**.
- Consola: gestión de eventos y agenda del equipo.

### Fase 3 · Profundización (continuo)

- Planificador y semáforo de carga, diario, plan de seguridad, clubes, reservas, trámites, biblioteca.
- **Panel de analítica** para directivos.
- Onboarding "primer semestre", accesibilidad extendida, pagos, mentores.

> **Estrategia de piloto:** una sola facultad o un solo semestre, con equipo de Bienestar comprometido, para validar integración, tono del chat y carga operativa del equipo antes de escalar.

---

## 11. Cómo medir si funciona


| Métrica                                                   | Qué indica                                              |
| --------------------------------------------------------- | ------------------------------------------------------- |
| **DAU/MAU, retención D7/D30**                             | La app crea hábito (el objetivo del chat protagonista). |
| **% de sesiones que tocan el chat**                       | El chat es de verdad el centro.                         |
| **Conversaciones de bienestar iniciadas desde un módulo** | Los módulos funcionan como puerta de entrada.           |
| **Tiempo hasta primer contacto tras una alerta**          | Eficacia del equipo.                                    |
| **Citas agendadas y asistidas**                           | La derivación se convierte en acción.                   |
| **Asistencia a eventos de Bienestar**                     | El calendario cumple su función.                        |
| **Trámites resueltos sin fila**                           | Valor percibido y ahorro operativo.                     |
| **Valoración "¿Te sirvió?"** (hoy no se guarda)           | Calidad del acompañamiento.                             |
| **Alertas sin atender / reabiertas**                      | Seguridad operativa.                                    |


*Cuidado:* optimizar uso **no debe** empujar a pantallas adictivas. La métrica norte es **el estudiante que necesitaba ayuda la encontró a tiempo**, no el tiempo en pantalla.

---

## 12. Preguntas abiertas para negocio

1. **¿Qué sistemas académicos usa la universidad (o las universidades objetivo)?** ¿Tienen API o solo exportes? Es la decisión que más cambia plazos y costos.
2. **¿Una universidad o plataforma multi-universidad?** Define el diseño de tenants.
3. **¿Qué certificados tienen validez con firma electrónica propia** y cuáles requieren aprobación humana?
4. **¿Quién mantendrá** calendario, directorio y contenidos de bienestar? Sin dueño operativo estos módulos se degradan.
5. **¿Se permite que SerafIA use datos académicos para acompañar?** (Con consentimiento opt-in, según §8.2.)
6. **¿Agenda de citas propia o integración con la agenda de Bienestar existente?**
7. **¿El carnet digital es aceptado en portería/laboratorios/biblioteca?** Si no, ¿qué acuerdo se necesita?
8. **¿Cuál es el modelo comercial?** (licencia por estudiante, por universidad, módulos): condiciona qué va en el MVP.
9. **¿Notificaciones por WhatsApp/SMS además de push?** (costo y adopción).
10. **Del plan visual (§11):** ¿consola del equipo solo escritorio o también tableta/móvil? ¿modo oscuro? ¿modo presentación como producto aparte o interruptor?
11. **Validación clínica:** ¿quién valida las reglas de evaluación y los contenidos de la caja de herramientas, y en qué plazo?
12. **Alcance geográfico:** hoy las líneas incluidas son colombianas (123, 192, 106 Bogotá). ¿Se parametrizan por ciudad/país?

---

## 13. Resumen de decisiones recomendadas

1. **Chat persistente en un shell de app**, con navegación centrada en SerafIA y compositor siempre visible.
2. **Fase 1 centrada en uso diario:** Hoy + Carnet + Horario + Contactos + Calendario.
3. **El ERP académico es la dependencia crítica:** abrir esa conversación con la universidad **ya**.
4. **Privacidad por diseño:** datos académicos nunca generan alertas por sí solos; diario privado; permisos opcionales revocables.
5. **Notas con cuidado:** notificación neutra, calculadora enfocada en posibilidad y plan.
6. **Convertir la derivación en acción:** agendar cita con Bienestar y rutas de ayuda accionables.
7. **Panel agregado para directivos** como argumento comercial, anonimizado.
8. **Piloto acotado** (una facultad) antes de escalar.
9. **Mantener intactas las reglas de oro de seguridad** en todos los módulos.

