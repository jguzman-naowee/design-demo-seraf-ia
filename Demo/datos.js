/**
 * Datos del demo de SerafIA.
 *
 * Es JSON con una sola línea de JavaScript alrededor: `window.DATOS =`.
 * Va así y no como .json porque el navegador bloquea `fetch` cuando la página
 * se abre con doble clic (file://), y este archivo tiene que servir igual en
 * el escritorio, en un servidor y publicado como artifact.
 *
 * entidad  = quién firma el prototipo.
 * roles    = perfil único del demo (estudiante). Cada rol: id, rol, nombre,
 *            iniciales, organizacion, portal, theme, color, descripcion,
 *            inicio (hash).
 * menus    = vacío: la app móvil no usa sidebar.
 * demo     = contenido del demo (cartas, horario, eventos, contactos…).
 *            Está vacío: se llena a medida que se porta el demo.
 *
 * TODO ES DE DEMOSTRACIÓN. Ningún dato sale de un sistema real.
 */
window.DATOS = {
  "entidad": {
    "sigla": "Naowee",
    "nombre": "Naowee",
    "plataforma": "Naowee Suite",
    "fecha": "martes 6 de octubre"
  },
  "roles": [
    {
      "id": "estudiante",
      "rol": "Estudiante",
      "nombre": "Camila Rojas",
      "iniciales": "CR",
      "organizacion": "Universidad demo",
      "portal": "App móvil",
      "theme": "primary",
      "color": "green",
      "descripcion": "App de bienestar y vida universitaria SerafIA.",
      "inicio": "#/"
    }
  ],
  "menus": {},
  "demo": {
    "hora": "9:41",
    "saludo": "Buenos días",
    "fecha": "Martes 6 de octubre",
    "cartas": [
      { "n": 1, "nombre": "Sin batería", "desc": "Hoy toca enchufarse", "color": "purple",
        "abre": "Hoy sacaste «Sin batería». A veces es la forma de decir que toca recargar. ¿Quieres contarme qué la fue gastando?" },
      { "n": 2, "nombre": "Nublado", "desc": "Con ganas de manta", "color": "cyan",
        "abre": "Hoy sacaste «Nublado». ¿Quieres que hablemos de lo que lo nubló?" },
      { "n": 3, "nombre": "A mi ritmo", "desc": "Ni rápido ni lento", "color": "green" },
      { "n": 4, "nombre": "Cielo despejado", "desc": "Se siente liviano", "color": "yellow" },
      { "n": 5, "nombre": "Al 100", "desc": "Hoy sí, con actitud", "color": "orange" }
    ],
    "ordenMazo": [4, 1, 5, 2, 3],
    "semanaPasada": [5, 4, 2, 2, 3, 4, 4],
    "dias": ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"],
    "estudiante": {
      "nombre": "Camila Rojas", "corto": "Camila", "iniciales": "CR",
      "programa": "Ingeniería · 3.er semestre", "codigo": "20231042",
      "matricula": "Matrícula vigente · 2026-2", "universidad": "Universidad demo"
    },
    "clases": [
      { "dia": "mar", "ini": "10:00", "fin": "12:00", "nombre": "Cálculo II", "aula": "Aula C-302", "bloque": "Bloque C", "proxima": true },
      { "dia": "mar", "ini": "14:00", "fin": "16:00", "nombre": "Física II", "aula": "Aula A-110", "bloque": "Bloque A" }
    ],
    "horario": [
      { "k": "lun", "dow": "LUN", "num": "5", "items": [
        { "ini": "08:00", "fin": "10:00", "nombre": "Programación", "lugar": "Lab 2 · Bloque F" } ] },
      { "k": "mar", "dow": "MAR", "num": "6", "items": [
        { "ini": "10:00", "fin": "12:00", "nombre": "Cálculo II", "lugar": "Aula C-302 · Bloque C", "etiqueta": "Siguiente" },
        { "ini": "14:00", "fin": "16:00", "nombre": "Física II", "lugar": "Aula A-110 · Bloque A" } ] },
      { "k": "mie", "dow": "MIÉ", "num": "7", "items": [
        { "ini": "08:00", "fin": "10:00", "nombre": "Programación", "lugar": "Lab 2 · Bloque F" },
        { "ini": "11:00", "fin": "13:00", "nombre": "Inglés III", "lugar": "Aula B-205 · Bloque B" } ] },
      { "k": "jue", "dow": "JUE", "num": "8", "items": [
        { "ini": "10:00", "fin": "12:00", "nombre": "Cálculo II", "lugar": "Aula C-302 · Bloque C" },
        { "ini": "12:00", "fin": "13:00", "nombre": "Taller de respiración", "lugar": "Bienestar Universitario", "etiqueta": "Evento Seraf" } ] },
      { "k": "vie", "dow": "VIE", "num": "9", "items": [
        { "ini": "14:00", "fin": "16:00", "nombre": "Parcial de Física II", "lugar": "Aula A-110 · Bloque A", "etiqueta": "Examen" } ] }],
    "horarioExtra": [
      { "k": "sab", "dow": "SÁB", "num": "10", "items": [
        { "ini": "08:00", "fin": "10:00", "nombre": "Jornada de deporte y pausa activa", "lugar": "Coliseo", "etiqueta": "Evento Seraf" } ] },
      { "k": "dom", "dow": "DOM", "num": "11", "items": [] }
    ],
    "destacados": [
      { "id": "f1", "tag": "Bienestar", "titulo": "Semana del Bienestar", "meta": "12 al 16 de octubre · Plazoleta central", "color": "indigo" },
      { "id": "f2", "tag": "Universidad", "titulo": "Feria de empleo", "meta": "Miércoles 7 · 9:00 · Plazoleta central", "color": "blue" },
      { "id": "f3", "tag": "Deporte", "titulo": "Jornada de deporte y pausa activa", "meta": "Sábado 10 · 8:00 · Coliseo", "color": "green" }
    ],
    "eventos": [
      { "id": "e2", "inscripcion": true, "semana": true, "cat": "u", "para": false, "dow": "MIÉ", "dia": "7", "titulo": "Feria de empleo", "meta": "9:00 · Plazoleta central" },
      { "id": "e1", "inscripcion": true, "semana": true, "cat": "bienestar", "para": true, "dow": "JUE", "dia": "8", "titulo": "Taller de respiración", "meta": "12:00 · Bienestar Universitario" },
      { "id": "e3", "inscripcion": true, "semana": true, "cat": "bienestar", "para": true, "dow": "SÁB", "dia": "10", "titulo": "Jornada de deporte y pausa activa", "meta": "8:00 · Coliseo" },
      { "id": "e4", "semana": false, "cat": "u", "para": false, "dow": "LUN", "dia": "12", "titulo": "Charla de movilidad internacional", "meta": "15:00 · Auditorio" },
      { "id": "e5", "inscripcion": true, "semana": false, "cat": "bienestar", "para": true, "dow": "MAR", "dia": "13", "titulo": "Grupo de apoyo entre pares", "meta": "16:00 · Sala de Bienestar" },
      { "id": "e6", "semana": false, "cat": "u", "para": false, "dow": "VIE", "dia": "16", "titulo": "Concierto de la orquesta universitaria", "meta": "18:00 · Auditorio" }
    ],
    "documentos": [
      { "nombre": "Certificado de estudios", "nota": "Listo al instante", "accion": "Generar" },
      { "nombre": "Constancia de matrícula", "nota": "Periodo 2026-2", "accion": "Generar" },
      { "nombre": "Certificado de notas", "nota": "Requiere aprobación · 1-2 días", "accion": "Solicitar" },
      { "nombre": "Paz y salvo", "nota": "Listo · generado hoy", "accion": "Descargar" }
    ],
    "tramites": [
      { "nombre": "Homologación de materias", "nota": "Enviada el 2 de octubre", "estado": "En revisión", "tema": "warning" },
      { "nombre": "Cancelación de materia", "nota": "Resuelta el 24 de septiembre", "estado": "Resuelta", "tema": "positive" }
    ],
    "contactos": [
      { "nombre": "Bienestar Universitario", "meta": "Abierto ahora · Lun-Vie 8-18 h · Ext. 2040", "accion": "Agendar cita", "crisis": false },
      { "nombre": "Línea 106", "meta": "Escucha y orientación", "accion": "Llamar", "crisis": true },
      { "nombre": "Salud mental · MinSalud", "meta": "Línea 192 · opción 4", "accion": "Llamar", "crisis": true },
      { "nombre": "Emergencias", "meta": "123 · todo el país · 24/7", "accion": "Llamar", "crisis": true }
    ],
    "herramientas": [
      { "nombre": "Respirar conmigo", "tiempo": "1 min", "icono": "leaf" },
      { "nombre": "Grounding 5-4-3-2-1", "tiempo": "3 min", "icono": "sun" },
      { "nombre": "Modo foco · Pomodoro", "tiempo": "25 + 5 min", "icono": "dispatch-time" },
      { "nombre": "Cronómetro de estudio", "tiempo": "A tu ritmo", "icono": "refresh" }
    ],
    "notificaciones": [
      { "id": "n1", "nombre": "Clases", "nota": "Aviso 30 min antes" },
      { "id": "n2", "nombre": "Exámenes y entregas", "nota": "7, 3 y 1 día antes" },
      { "id": "n3", "nombre": "Seguimiento de SerafIA", "nota": "Un mensaje breve, máximo cada 3 días" }
    ],
    "casos": [
      { "id": "SER-0142", "nombre": "Camila Rojas", "est": "A-0142", "programa": "Ingeniería", "sem": "3.er semestre", "base": "crisis", "turnos": 2, "hace": "hace 4 min", "estado": "Sin atender", "historial": [] },
      { "id": "SER-0231", "nombre": "Mateo Gómez", "est": "A-0231", "programa": "Derecho", "sem": "2.º semestre", "base": "deterioro", "turnos": 7, "hace": "hace 18 min", "estado": "Sin atender", "historial": [{ "cuando": "Ayer · 4:30 p. m.", "texto": "Se le escribió desde Bienestar; no ha respondido", "por": "Psicología" }] },
      { "id": "SER-0178", "nombre": "Valentina Pérez", "est": "A-0178", "programa": "Medicina", "sem": "6.º semestre", "base": "deterioro", "turnos": 5, "hace": "hace 1 h", "estado": "En revisión", "historial": [{ "cuando": "Hace 3 días", "texto": "Cita de orientación agendada", "por": "Equipo de Bienestar" }, { "cuando": "Hoy · 8:10 a. m.", "texto": "Caso en revisión", "por": "Psicología" }] },
      { "id": "SER-0119", "nombre": "Santiago Ríos", "est": "A-0119", "programa": "Diseño", "sem": "4.º semestre", "base": "deterioro", "turnos": 2, "hace": "hace 35 min", "estado": "Sin atender", "historial": [] },
      { "id": "SER-0264", "nombre": "Daniela Castro", "est": "A-0264", "programa": "Arquitectura", "sem": "1.er semestre", "base": "deterioro", "turnos": 2, "hace": "hace 2 h", "estado": "En revisión", "historial": [{ "cuando": "Ayer · 11:00 a. m.", "texto": "Seguimiento por mensaje: respondió que se siente mejor", "por": "Equipo de Bienestar" }] },
      { "id": "SER-0305", "nombre": "Andrés Molina", "est": "A-0305", "programa": "Economía", "sem": "7.º semestre", "base": "leve", "turnos": 5, "hace": "hace 3 h", "estado": "En seguimiento", "historial": [{ "cuando": "Hace 1 semana", "texto": "Asistió al taller de manejo del estrés", "por": "Bienestar Universitario" }] },
      { "id": "SER-0092", "nombre": "Laura Mejía", "est": "A-0092", "programa": "Biología", "sem": "3.er semestre", "base": "leve", "turnos": 3, "hace": "ayer", "estado": "En seguimiento", "historial": [] },
      { "id": "SER-0148", "nombre": "Felipe Duarte", "est": "A-0148", "programa": "Contaduría", "sem": "8.º semestre", "base": "leve", "turnos": 5, "hace": "ayer", "estado": "En seguimiento", "historial": [] }
    ],
    "criticosSemana": [
      { "caso": "SER-0142", "nombre": "Camila Rojas", "programa": "Ingeniería", "detectado": "Hoy · 3:58 p. m.", "respuesta": "—", "estado": "Sin atender", "accion": "Pendiente de decisión del equipo" },
      { "nombre": "Julián Ortiz", "programa": "Administración", "detectado": "Ayer · 9:20 p. m.", "respuesta": "12 min", "estado": "Atendido", "accion": "Contacto y protocolo de crisis activado" },
      { "nombre": "Sara Beltrán", "programa": "Psicología", "detectado": "Lun 5 oct · 2:05 p. m.", "respuesta": "25 min", "estado": "Atendido", "accion": "Remitida a atención en salud" },
      { "nombre": "Nicolás Vega", "programa": "Ingeniería", "detectado": "Dom 4 oct · 11:40 p. m.", "respuesta": "48 min", "estado": "Atendido", "accion": "Contacto con su red de apoyo" },
      { "nombre": "Isabela Torres", "programa": "Medicina", "detectado": "Sáb 3 oct · 6:15 p. m.", "respuesta": "9 min", "estado": "En seguimiento", "accion": "Seguimiento semanal con Psicología" }
    ],
    "chips": ["Ver mi horario", "Mi carnet", "Hablar con alguien"]
  }
};
