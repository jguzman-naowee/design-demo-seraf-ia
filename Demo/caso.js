/**
 * SerafIA · el caso en vivo que comparten las dos vistas (estudiante y Bienestar).
 *
 * Es el motor del "guion de demo" que trae la demo de Luis (serafia-demo.html):
 * una conversación grabada que se reproduce turno a turno. La vista del
 * estudiante la pinta como chat; la vista de Bienestar la pinta como caso.
 * Las dos leen de acá, así que al cambiar de rol la conversación sigue donde iba.
 *
 * Sin DOM: solo estado, temporizadores y suscriptores. Los datos son GUIONES
 * (guiones.js). Las tarjetas del panel de guiones (CASO.panel) y la barra
 * (CASO.barra) usan componentes del SDK (Badge, Button, IconButton, Progress).
 */
window.CASO = (function () {
  'use strict';

  var G = window.GUIONES, ORDEN = ['leve', 'deterioro', 'crisis'];
  var NIVELES = ['ninguna', 'baja', 'media', 'alta', 'critica'];
  var NIVEL = {
    ninguna: { label: 'Ninguna', tema: 'positive', icon: 'positive', resumen: 'Sin señales de riesgo por ahora' },
    baja:    { label: 'Baja',    tema: 'informative', icon: 'info', resumen: 'Malestar leve. Conviene seguir de cerca' },
    media:   { label: 'Media',   tema: 'warning', icon: 'caution', resumen: 'Señales sostenidas. Requiere triaje del equipo' },
    alta:    { label: 'Alta',    tema: 'primary', icon: 'caution', resumen: 'Señales de riesgo claras. Contacto humano pronto' },
    critica: { label: 'Crítica', tema: 'negative', icon: 'attention', resumen: 'Riesgo inmediato. El equipo debe actuar ahora' }
  };
  var ACCION = {
    acompanar:              { label: 'Acompañar', corto: 'Acompañar', detalle: 'Seguir el instrumento. No hace falta intervenir', estudiante: 'Sin aviso', alerta: false },
    monitorear:             { label: 'Monitorear', corto: 'Monitorear', detalle: 'Malestar leve. Revisar en el próximo corte', estudiante: 'Seguimiento suave', alerta: false },
    alerta:                 { label: 'Alerta', corto: 'Alerta', detalle: 'Triaje del equipo de bienestar', estudiante: 'Una persona te escribirá', alerta: true },
    alerta_prioritaria:     { label: 'Alerta prioritaria', corto: 'Alerta prioritaria', detalle: 'Contacto humano pronto, hoy mismo', estudiante: 'Una persona te escribirá hoy', alerta: true },
    escalamiento_inmediato: { label: 'Escalamiento inmediato', corto: 'Escalamiento', detalle: 'Crisis. Contactar ya y activar el protocolo', estudiante: 'El equipo ya fue avisado', alerta: true }
  };
  /* Las ocho señales del instrumento (D1–D8) y de qué código sale cada una */
  var SENALES = [
    { id: 'D1', clave: 'emocion', label: 'Emoción', opciones: { triste: 'Triste', ansioso: 'Ansioso(a)' }, mal: { triste: 1, ansioso: 1 } },
    { id: 'D2', clave: 'intensidad', label: 'Intensidad', opciones: { 1: '1 · Muy poco o nada', 2: '2 · Un poco', 3: '3 · Moderadamente', 4: '4 · Mucho', 5: '5 · Muchísimo' }, mal: { 4: 1, 5: 1 } },
    { id: 'D3', clave: 'detonante', label: 'Algo lo detonó', opciones: { si: 'Sí, algo concreto', no: 'Nada específico' }, mal: {}, info: true },
    { id: 'D4', clave: 'hablo', label: 'Habló con alguien', opciones: { si: 'Sí, ya habló', no: 'No ha hablado con nadie' }, mal: { no: 1 }, bien: { si: 1 } },
    { id: 'D5', clave: 'consejero', label: 'Hablaría con un consejero', opciones: { si: 'Sí, aceptaría', no: 'No por ahora' }, mal: { no: 1 }, bien: { si: 1 } },
    { id: 'D6', clave: 'actividad', label: 'Actividad que le ayuda', opciones: { si: 'Sí, tiene una', no: 'No tiene ninguna' }, mal: { no: 1 }, bien: { si: 1 } },
    { id: 'D7', clave: 'suficiente', label: 'Le alcanza para manejarlo', opciones: { si: 'Sí, le alcanza', no: 'No le alcanza' }, mal: { no: 1 }, bien: { si: 1 } },
    { id: 'D8', clave: 'apoyo', label: 'Tipo de apoyo', opciones: {}, mal: {}, info: true }
  ];
  var STEP_D = { emocion: 'D1', 'step-1': 'D3', 'step-17': 'D4', 'step-13': 'D5', 'step-5': 'D6', 'step-7': 'D6', 'step-8': 'D7', 'step-9': 'D7', 'step-19': 'D8', 'step-21': 'D8', 'step-24': 'D8' };
  var CODIGO_A_D = {}; SENALES.forEach(function (s) { CODIGO_A_D[s.clave] = s.id; });

  var T = { lee: 900, escribe: 1200, pausa: 900 };
  var s = null, subs = [], timers = [];

  function inicial(id) {
    return { guion: id || 'crisis', enviados: 0, hechos: 0, fase: 'idle', playing: false, modo: false, detalle: false, decision: null, ajustando: false, abierto: true, nuevaCrisis: false };
  }
  s = inicial('crisis');

  function avisar() { subs.slice().forEach(function (f) { f(s); }); }
  function parar() { timers.forEach(clearTimeout); timers = []; }
  function luego(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); }

  function guion() { return G[s.guion]; }
  function total() { return guion().turnos.length; }
  function terminado() { return s.hechos >= total(); }

  /* un turno: el estudiante escribe → el sistema lee → SerafIA contesta */
  function siguiente(auto) {
    if (s.fase === 'estudiante' || s.fase === 'escribiendo') { return; }
    if (terminado()) { if (!auto) { reiniciar(true); } return; }
    s.modo = true; s.decision = null; s.ajustando = false;
    s.enviados = s.hechos + 1; s.fase = 'estudiante'; avisar();
    luego(function () {
      s.fase = 'escribiendo'; avisar();
      luego(function () {
        s.hechos = s.enviados; s.fase = 'listo';
        var t = guion().turnos[s.hechos - 1];
        if (t.crisis.length) { s.playing = false; }
        avisar();
        if (s.playing && !terminado()) { luego(function () { if (s.playing) { siguiente(true); } }, T.pausa); } else if (terminado()) { s.playing = false; avisar(); }
      }, T.escribe);
    }, T.lee);
  }
  function reproducir() {
    if (s.playing) { s.playing = false; avisar(); return; }
    if (terminado()) { reiniciar(true); }
    s.playing = true; s.modo = true; avisar();
    if (s.fase === 'idle' || s.fase === 'listo') { siguiente(true); }
  }
  function reiniciar(sigueActivo) {
    parar(); var g = s.guion, modo = s.modo, det = s.detalle, ab = s.abierto;
    s = inicial(g); s.modo = sigueActivo ? true : modo; s.detalle = det; s.abierto = ab; avisar();
  }
  function seleccionar(id) {
    if (!G[id]) { return; }
    parar(); var det = s.detalle, ab = s.abierto; s = inicial(id); s.modo = true; s.detalle = det; s.abierto = ab; avisar();
  }
  function salirDelModo() { parar(); var det = s.detalle, ab = s.abierto; s = inicial(s.guion); s.detalle = det; s.abierto = ab; avisar(); }

  /* ---------- lo que ve el equipo, calculado de los turnos hechos ---------- */
  function vista(n) {
    var tr = guion().turnos.slice(0, n == null ? s.hechos : n), ult = tr[tr.length - 1] || null;
    var max = -1, alertas = [], i;
    tr.forEach(function (t, n) {
      /* la evaluación solo sube, nunca baja */
      max = Math.max(max, NIVELES.indexOf(t.nivel));
      if (t.alerta) { alertas.push({ turno: n + 1, nivel: t.nivel, accion: t.accion, cita: t.estudiante, crisis: t.crisis.length > 0, item: t.item }); }
    });
    var cod = ult ? ult.codigos : {}, vistas = 0;
    SENALES.forEach(function (sg) { if (cod[sg.clave] !== undefined) { vistas++; } });
    var nuevo = ult ? Object.keys(cod).filter(function (k) { return !tr[tr.length - 2] || tr[tr.length - 2].codigos[k] !== cod[k]; }) : [];
    var f = ult ? [ult.apoyo, ult.afrontamiento] : ['pendiente', 'pendiente'];
    var nivel = max >= 0 ? NIVELES[max] : null;
    var acc = ult ? ult.accion : null;
    /* la acción sube junto con el nivel */
    tr.forEach(function (t) { var a = Object.keys(ACCION); if (a.indexOf(t.accion) > a.indexOf(acc)) { acc = t.accion; } });
    return {
      turnos: tr, ultimo: ult, nivel: nivel, accion: acc, alertas: alertas, codigos: cod, nuevos: nuevo, cobertura: vistas,
      factores: f, nFactores: f.filter(function (x) { return x === 'si'; }).length,
      crisis: tr.some(function (t) { return t.crisis.length > 0; }),
      extractoCrisis: (tr.filter(function (t) { return t.crisis.length; })[0] || {}).estudiante || '',
      spans: (tr.filter(function (t) { return t.crisis.length; })[0] || { crisis: [] }).crisis,
      provisional: ult ? ult.provisional : false,
      subio: tr.length > 1 && NIVELES.indexOf(tr[tr.length - 1].nivel) > NIVELES.indexOf(tr[tr.length - 2].nivel)
    };
  }

  /* ---------- panel de guiones (como en la demo de ellos) ---------- */
  function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function puntito(id) { var n = G[id].color; return '<span class="nws-dp__dot nws-dp__dot--' + n + '"></span>'; }
  function estadoTxt() {
    if (s.fase === 'estudiante') { return 'Leyendo el mensaje'; }
    if (s.fase === 'escribiendo') { return 'SerafIA escribe'; }
    if (s.playing) { return 'Reproduciendo'; }
    if (terminado()) { return 'Terminado'; }
    return s.hechos ? 'En pausa' : 'Listo';
  }
  function tagNivel(S, n, sm) { var v = NIVEL[n]; return S.badge({ label: v.label, icon: v.icon, theme: v.tema, variant: 'quiet', size: sm ? 'small' : 'medium' }); }
  function controles(S) {
    var ocupado = s.fase === 'estudiante' || s.fase === 'escribiendo';
    return '<div class="nws-dp__ctl">' +
      S.iconButton({ icon: s.playing ? 'pause-filled' : 'play-filled', variant: 'loud', theme: 'secondary', size: 'large', label: s.playing ? 'Pausar' : (terminado() ? 'Repetir' : 'Reproducir'), attrs: { 'data-p': 'play' } }) +
      S.iconButton({ icon: 'arrow-right', variant: 'mute', theme: 'neutral', size: 'large', label: 'Siguiente turno', disabled: ocupado || s.playing, attrs: { 'data-p': 'next' } }) +
      S.iconButton({ icon: 'refresh', variant: 'mute', theme: 'neutral', size: 'large', label: 'Reiniciar el guion', attrs: { 'data-p': 'reset' } }) + '</div>';
  }
  function turno(S) {
    var n = s.hechos, t = total(), dots = '';
    for (var i = 0; i < t; i++) { dots += '<i class="' + (i < n ? 'on' : '') + '"></i>'; }
    return '<div class="nws-dp__turno"><span class="nws-mono">Turno ' + n + '/' + t + '</span><span class="nws-dp__dots" aria-hidden="true">' + dots + '</span></div>';
  }

  /* tarjeta flotante (vista estudiante): la de la imagen de referencia */
  function panel(S) {
    var g = guion(), v = NIVEL[g.esperado.nivel], a = ACCION[g.esperado.accion];
    var lista = ORDEN.map(function (id) {
      var on = id === s.guion && true;
      return '<button type="button" class="nws-dp__op' + (on ? ' nws-dp__op--on' : '') + '" data-p="g:' + id + '" aria-pressed="' + on + '">' + puntito(id) + '<span>' + esc(G[id].titulo) + '</span>' + (on ? S.icon('positive') : '') + '</button>';
    }).join('');
    return '<div class="nws-dp' + (s.abierto ? '' : ' nws-dp--cerrado') + '">' +
      '<div class="nws-dp__hd">' + S.badge({ label: 'DEMO', theme: 'warning', variant: 'loud', size: 'small', cls: 'nws-mono' }) + '<span class="nws-dp__t">Guiones</span><span class="nws-grow"></span>' +
        '<button type="button" class="nws-dp__estado" data-p="toggle" aria-expanded="' + s.abierto + '">' + estadoTxt() + S.icon('chevron-down') + '</button></div>' +
      '<div class="nws-dp__cuerpo"><div class="nws-dp__lista">' + lista + '</div>' +
        '<div class="nws-dp__res"><p class="nws-txt">Resultado esperado</p><div class="nws-dp__chips">' + tagNivel(S, g.esperado.nivel) +
          S.badge({ label: a.label, icon: 'caution', theme: v.tema, variant: 'quiet', size: 'medium' }) + '</div></div></div>' +
      '<div class="nws-dp__ft">' + controles(S) + turno(S) + '</div></div>';
  }

  /* barra horizontal (vista Bienestar): selector + reproductor */
  function barra(S, caso) {
    var op = ORDEN.map(function (id) {
      var on = id === s.guion, g = G[id];
      return '<button type="button" class="nws-gb__op' + (on ? ' nws-gb__op--on' : '') + '" data-p="g:' + id + '" aria-pressed="' + on + '">' + puntito(id) +
        '<span class="nws-gb__tx"><b>' + esc(g.titulo) + '</b><small>' + g.turnos.length + ' turnos → ' + ACCION[g.esperado.accion].corto + '</small></span></button>';
    }).join('');
    /* dentro de un caso el guion ya está elegido: la barra solo reproduce ESE onboarding */
    var cabeza = caso ? '<div class="nws-gb__caso"><span class="nws-gb__lb">Onboarding del caso</span><b>' + esc(caso) + '</b></div>' : '<span class="nws-gb__lb">Guion</span><div class="nws-gb__ops">' + op + '</div>';
    return '<div class="nws-gb' + (caso ? ' nws-gb--pie' : '') + '">' + cabeza + controles(S) + turno(S) +
      '<span class="nws-grow"></span><span class="nws-dp__estado nws-dp__estado--txt">' + estadoTxt() + '</span>' +
      '<label class="nws-gb__det"><span>Mostrar el detalle</span>' +
      '<div class="nwt-switch' + (s.detalle ? ' nwt-switch--checked' : '') + '" role="switch" aria-checked="' + s.detalle + '" tabindex="0" data-p="detalle" nwt-theme="secondary"><div class="nwt-switch__component"><div class="nwt-switch__component__element"></div></div></div></label></div>';
  }

  /* los clics del panel y la barra: un solo oyente por contenedor */
  function enlazar(raiz) {
    function accion(ev) {
      var b = ev.target.closest('[data-p]'); if (!b || !raiz.contains(b)) { return; }
      var k = b.getAttribute('data-p');
      if (k === 'play') { reproducir(); }
      else if (k === 'next') { siguiente(false); }
      else if (k === 'reset') { reiniciar(true); }
      else if (k === 'toggle') { s.abierto = !s.abierto; avisar(); }
      else if (k === 'detalle') { s.detalle = !s.detalle; avisar(); }
      else if (k.indexOf('g:') === 0) { seleccionar(k.slice(2)); }
    }
    raiz.addEventListener('click', accion);
    raiz.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[role=switch][data-p]')) { ev.preventDefault(); accion(ev); } });
    return function () { raiz.removeEventListener('click', accion); };
  }

  /* barra superior común: marca + selector de rol (Estudiante / Bienestar) */
  function toolbar(S, activo, extra) {
    return S.toolbar({
      body: '<div class="nws-row nws-title-light"><div class="nws-title__naowee">' + window.NAOWEE.icono + '</div>' +
        S.title({ text: 'SerafIA', subtitle: activo === 'estudiante' ? 'Demo · App del estudiante' : 'Demo · Sala de bienestar' }) + '</div>',
      actions: (extra || '') + '<span class="nws-rolsw-lb">Ver como</span>' + S.tagGroup({ items: [{ label: 'Estudiante', value: 'estudiante' }, { label: 'Bienestar', value: 'bienestar' }], value: activo, size: 'medium', cls: 'nws-rolsw' })
    });
  }
  function enlazarRol(raiz, ir) {
    function f(ev) { var b = ev.target.closest('[data-seg]'); if (!b || !b.closest('.nws-rolsw')) { return; } var v = b.getAttribute('data-seg'); ir(v === 'bienestar' ? '#/bienestar' : '#/'); }
    raiz.addEventListener('click', f);
    return function () { raiz.removeEventListener('click', f); };
  }

  return {
    toolbar: toolbar, enlazarRol: enlazarRol,
    NIVEL: NIVEL, NIVELES: NIVELES, ACCION: ACCION, SENALES: SENALES, CODIGO_A_D: CODIGO_A_D, STEP_D: STEP_D, ORDEN: ORDEN, GUIONES: G,
    estado: function () { return s; }, guion: guion, total: total, terminado: terminado, vista: vista,
    on: function (f) { subs.push(f); return function () { subs = subs.filter(function (x) { return x !== f; }); }; },
    seleccionar: seleccionar, siguiente: siguiente, reproducir: reproducir, reiniciar: reiniciar, salirDelModo: salirDelModo,
    decidir: function (tipo, accion) { s.decision = { tipo: tipo, accion: accion || null, hora: new Date() }; s.ajustando = false; avisar(); },
    ajustando: function (v) { s.ajustando = v; avisar(); },
    panel: panel, barra: barra, enlazar: enlazar, estadoTxt: estadoTxt, esc: esc
  };
})();
