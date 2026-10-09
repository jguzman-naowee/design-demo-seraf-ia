/* Guiones de ejemplo del demo de ellos (serafia-demo.html), conversaciones grabadas.
   Cada turno trae lo que dice el estudiante, la respuesta de SerafIA y lo que ve el equipo. */
window.GUIONES = {
 "leve": {
  "id": "leve",
  "titulo": "Estrés de parciales",
  "resumen": "Ansiedad moderada, con gente cerca y algo que le ayuda.",
  "esperado": {
   "nivel": "baja",
   "accion": "monitorear"
  },
  "color": "baja",
  "turnos": [
   {
    "estudiante": "Estoy un poco ansioso por los parciales de la otra semana, diría que un 3.",
    "serafia": "Entiendo, los parciales de la próxima semana te tienen con los nervios un poco activados. Es normal sentir esa presión cuando vienen exámenes importantes.\\n\\n¿Has tenido la oportunidad de hablar con alguien sobre cómo te sientes con todo esto?",
    "item": "D1",
    "nivel": "baja",
    "accion": "monitorear",
    "alerta": false,
    "codigos": {
     "emocion": "ansioso",
     "intensidad": "3",
     "detonante": "si"
    },
    "apoyo": "pendiente",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=baja · intensidad moderada · factores protectores 2 de 2 (apoyo pendiente, afrontamiento pendiente) · provisional",
    "conf": 1,
    "siguiente": "step-17"
   },
   {
    "estudiante": "Sí, lo hablé con mis compañeros de grupo y nos estamos apoyando.",
    "serafia": "Qué bien que tengas ese apoyo de tus compañeros, eso hace una diferencia real. Gracias por compartir eso conmigo, es importante reconocer cómo te sientes y en quién puedes confiar.\\n\\n¿Has encontrado alguna actividad que te ayude a relajarte o sentirte mejor cuando te sientes ansioso así?",
    "item": "D4",
    "nivel": "baja",
    "accion": "monitorear",
    "alerta": false,
    "codigos": {
     "emocion": "ansioso",
     "intensidad": "3",
     "detonante": "si",
     "hablo": "si"
    },
    "apoyo": "si",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=baja · intensidad moderada · factores protectores 2 de 2 (apoyo si, afrontamiento pendiente) · provisional",
    "conf": 1,
    "siguiente": "step-5"
   },
   {
    "estudiante": "Cuando me estreso salgo a trotar un rato y eso me ayuda bastante.",
    "serafia": "Eso es muy bueno que hayas encontrado algo que realmente te funcione. Trotar es una forma muy efectiva de descargar esa energía y aclarar la mente.\\n\\n¿Crees que podrías encontrar unos minutos hoy para salir a trotar un rato?",
    "item": "D6",
    "nivel": "baja",
    "accion": "monitorear",
    "alerta": false,
    "codigos": {
     "emocion": "ansioso",
     "intensidad": "3",
     "detonante": "si",
     "hablo": "si",
     "actividad": "si"
    },
    "apoyo": "si",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=baja · intensidad moderada · factores protectores 2 de 2 (apoyo si, afrontamiento pendiente) · provisional",
    "conf": 1,
    "siguiente": "step-7"
   },
   {
    "estudiante": "Sí, en la tarde tengo un espacio.",
    "serafia": "Perfecto, entonces tienes ese espacio en la tarde para hacerlo. Tomarte ese tiempo puede hacer una gran diferencia en cómo te sientes.\\n\\n¿Crees que eso es suficiente para ayudarte a manejar la ansiedad que traes?",
    "item": "D6",
    "nivel": "baja",
    "accion": "monitorear",
    "alerta": false,
    "codigos": {
     "emocion": "ansioso",
     "intensidad": "3",
     "detonante": "si",
     "hablo": "si",
     "actividad": "si"
    },
    "apoyo": "si",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=baja · intensidad moderada · factores protectores 2 de 2 (apoyo si, afrontamiento pendiente) · provisional",
    "conf": 1,
    "siguiente": "step-8"
   },
   {
    "estudiante": "Sí, con eso me alcanza.",
    "serafia": "Gracias por confiar en mí y compartir cómo te sientes. Me alegra que hayas encontrado en la trotar algo que te funciona, y que tengas a tus compañeros cerca. Eso es un buen punto de partida.\\n\\nAquí estoy cuando quieras seguir hablando, sin presiones. ¡Buena suerte con los parciales y asegúrate de cuidarte!",
    "item": "D7",
    "nivel": "baja",
    "accion": "monitorear",
    "alerta": false,
    "codigos": {
     "emocion": "ansioso",
     "intensidad": "3",
     "detonante": "si",
     "hablo": "si",
     "actividad": "si",
     "suficiente": "si"
    },
    "apoyo": "si",
    "afrontamiento": "si",
    "provisional": false,
    "crisis": [],
    "razon": "nivel=baja · intensidad moderada · factores protectores 2 de 2 (apoyo si, afrontamiento si)",
    "conf": 1,
    "siguiente": null
   }
  ]
 },
 "deterioro": {
  "id": "deterioro",
  "titulo": "Deterioro sostenido",
  "resumen": "Tristeza muy intensa, sin apoyo y sin nada que le ayude.",
  "esperado": {
   "nivel": "alta",
   "accion": "alerta_prioritaria"
  },
  "color": "alta",
  "turnos": [
   {
    "estudiante": "Me siento muy triste, desde que terminé con mi pareja no hago sino llorar y no se lo he contado a nadie.",
    "serafia": "Entiendo, una ruptura puede dejar mucho dolor, y llevar eso solo es bastante difícil.\\n\\nEs comprensible que hayas estado llorando estos días. A veces cuando guardamos lo que sentimos, se queda dentro y pesa más. A veces, compartir tus preocupaciones puede ayudar a sentirte mejor. ¿Te gustaría considerar hablar con tu consejero o con alguien para obtener apoyo?",
    "item": "D1",
    "nivel": "media",
    "accion": "alerta",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no"
    },
    "apoyo": "pendiente",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=media · intensidad alta · factores protectores 2 de 2 (apoyo pendiente, afrontamiento pendiente) · provisional",
    "conf": 1,
    "siguiente": "step-13"
   },
   {
    "estudiante": "No, no quiero hablar con ningún consejero.",
    "serafia": "Está bien, no es para todos en este momento.\\n\\nLo que sí me gustaría saber es si hay algo que hayas hecho antes, o que puedas hacer ahora, que te ayude a sentirte un poco mejor o más tranquilo cuando la tristeza es muy fuerte.",
    "item": "D5",
    "nivel": "media",
    "accion": "alerta",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no",
     "consejero": "no"
    },
    "apoyo": "no",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=media · intensidad alta · factores protectores 1 de 2 (apoyo no, afrontamiento pendiente) · provisional",
    "conf": 1,
    "siguiente": "step-5"
   },
   {
    "estudiante": "No, la verdad nada me ayuda.",
    "serafia": "Veo que en este momento nada parece aliviarte, y eso es parte de lo difícil que estás sintiendo.\\n\\nA veces cuando la tristeza es muy fuerte, es difícil ver qué podría ayudar. Pensando en los próximos días, ¿hay algo que hayas decidido hacer o cambiar para intentar manejar lo que sientes?",
    "item": "D6",
    "nivel": "alta",
    "accion": "alerta_prioritaria",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no",
     "consejero": "no",
     "actividad": "no"
    },
    "apoyo": "no",
    "afrontamiento": "no",
    "provisional": false,
    "crisis": [],
    "razon": "nivel=alta · intensidad alta · factores protectores 0 de 2 (apoyo no, afrontamiento no)",
    "conf": 1,
    "siguiente": "step-9"
   },
   {
    "estudiante": "Todavía no he decidido nada.",
    "serafia": "Está bien estar en ese punto donde aún no sabes qué hacer. Lo importante es que existen espacios en tu universidad pensados para acompañarte en momentos como este.\\n\\nAquí tienes algunas opciones: puedes acceder a apoyo de bienestar emocional con técnicas para manejar lo que sientes, como meditación o ejercicios de respiración; hay grupos de apoyo social donde conoces a otros estudiantes pasando por situaciones similares; también está disponible la coordinación para una cita con psicólogo, o apoyo académico si tus estudios se han visto afectados. ¿Cuál de estas te parece que podría ser más útil para ti en este momento?",
    "item": "D7",
    "nivel": "alta",
    "accion": "alerta_prioritaria",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no",
     "consejero": "no",
     "actividad": "no"
    },
    "apoyo": "no",
    "afrontamiento": "no",
    "provisional": false,
    "crisis": [],
    "razon": "nivel=alta · intensidad alta · factores protectores 0 de 2 (apoyo no, afrontamiento no)",
    "conf": 1,
    "siguiente": "step-19"
   },
   {
    "estudiante": "Creo que necesito apoyo emocional.",
    "serafia": "Qué bueno que hayas identificado eso, porque el apoyo emocional puede hacer una diferencia real.\\n\\nDentro de bienestar emocional tienes acceso a técnicas como meditación y ejercicios de respiración, y también talleres donde aprendes habilidades para manejar lo que sientes. Además, si en algún momento sientes que necesitas hablar con un psicólogo, puedes coordinar una cita, y también hay acceso a servicios de salud y bienestar. Puedes comunicarte en la Sede Bogotá (Carrera 11 n.° 101-80), en la Facultad de Medicina y Ciencias de la Salud (Transversal 3 n.° 49-00), en la Sede Posgrados (Calle 94 A # 13-54), o en Campus Nueva Granada (Kilómetro 2, vía Cajicá-Zipaquirá, Edificio E, Piso 3, aula 303, correo acompanamiento.cng@unimilitar.edu.co, teléfono 6500000 extensiones 3037-3038). El horario es de lunes a viernes de 8:00 a. m. a 5:00 p. m. ¿Te gustan estas opciones?",
    "item": "D8",
    "nivel": "alta",
    "accion": "alerta_prioritaria",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no",
     "consejero": "no",
     "actividad": "no",
     "apoyo": "Bienestar Emocional"
    },
    "apoyo": "no",
    "afrontamiento": "no",
    "provisional": false,
    "crisis": [],
    "razon": "nivel=alta · intensidad alta · factores protectores 0 de 2 (apoyo no, afrontamiento no)",
    "conf": 1,
    "siguiente": "step-21"
   },
   {
    "estudiante": "No mucho.",
    "serafia": "Entiendo que esas opciones no te llaman mucho la atención en este momento.\\n\\nHay otras cosas que podrías probar: participar en juegos de mesa estratégicos o grupos recreativos puede ayudarte a conectar con emociones diferentes; el peer coaching o mentoría te permite recibir apoyo de alguien más cercano; practicar mindfulness te enseña a observar lo que sientes sin juzgarte; y a veces recordar momentos donde te sentiste seguro antes de situaciones difíciles también da perspectiva. ¿Hay algo específico de estas opciones que te gustaría intentar, o tienes otra idea para manejar lo que sientes?",
    "item": "D8",
    "nivel": "alta",
    "accion": "alerta_prioritaria",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no",
     "consejero": "no",
     "actividad": "no",
     "apoyo": "Bienestar Emocional"
    },
    "apoyo": "no",
    "afrontamiento": "no",
    "provisional": false,
    "crisis": [],
    "razon": "nivel=alta · intensidad alta · factores protectores 0 de 2 (apoyo no, afrontamiento no)",
    "conf": 1,
    "siguiente": "step-24"
   },
   {
    "estudiante": "No se me ocurre nada.",
    "serafia": "Agradezco mucho que hayas compartido conmigo lo que sientes. Sé que en este momento todo se ve gris y difícil, pero quiero que sepas que estoy aquí para ti siempre que necesites hablar, sin presión y sin juicios.\\n\\nA veces las cosas cambian poco a poco, y a veces necesitamos tiempo. Cuídate y no dudes en volver cuando quieras conversar. ¡Mucho ánimo.",
    "item": "D8",
    "nivel": "alta",
    "accion": "alerta_prioritaria",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4",
     "detonante": "si",
     "hablo": "no",
     "consejero": "no",
     "actividad": "no",
     "apoyo": "Bienestar Emocional"
    },
    "apoyo": "no",
    "afrontamiento": "no",
    "provisional": false,
    "crisis": [],
    "razon": "nivel=alta · intensidad alta · factores protectores 0 de 2 (apoyo no, afrontamiento no)",
    "conf": 1,
    "siguiente": null
   }
  ]
 },
 "crisis": {
  "id": "crisis",
  "titulo": "Frase de crisis",
  "resumen": "Una frase de riesgo activa la detección de crisis al instante.",
  "esperado": {
   "nivel": "critica",
   "accion": "escalamiento_inmediato"
  },
  "color": "critica",
  "turnos": [
   {
    "estudiante": "Estoy muy triste, cansado de todo.",
    "serafia": "Entiendo que estés pasando por un momento muy difícil en este momento. Estar así es agotador, y me importa escucharte.\\n\\n¿Hay algo en particular que te haya hecho sentir tan triste, o es más bien una sensación que ha ido creciendo?",
    "item": "D1",
    "nivel": "media",
    "accion": "alerta",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4"
    },
    "apoyo": "pendiente",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [],
    "razon": "nivel=media · intensidad alta · factores protectores 2 de 2 (apoyo pendiente, afrontamiento pendiente) · provisional",
    "conf": 0.9,
    "siguiente": "step-1"
   },
   {
    "estudiante": "A veces pienso que sería mejor desaparecer para siempre, no quiero seguir vivo.",
    "serafia": "Lo que escribes es importante y no tienes que pasar por esto a solas. Ya avisé a una persona del equipo de bienestar para que te contacte. Si estás en peligro ahora, llama al 123 o al 192, opción 4. Aquí sigo, sin irme.",
    "item": "D3",
    "nivel": "critica",
    "accion": "escalamiento_inmediato",
    "alerta": true,
    "codigos": {
     "emocion": "triste",
     "intensidad": "4"
    },
    "apoyo": "pendiente",
    "afrontamiento": "pendiente",
    "provisional": true,
    "crisis": [
     "no quiero seguir viv",
     "desaparecer para siempre"
    ],
    "razon": "nivel=media · intensidad alta · factores protectores 2 de 2 (apoyo pendiente, afrontamiento pendiente) · provisional",
    "conf": 0,
    "siguiente": "step-1"
   }
  ]
 }
};
