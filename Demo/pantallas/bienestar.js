/**
 * SerafIA · Sala de bienestar (vista del equipo). ALTA FIDELIDAD, solo escritorio.
 *
 * Es la mitad "Bienestar" de la demo de Luis (serafia-demo.html), separada de la
 * del estudiante y armada como un tablero. Lee el caso en vivo de CASO (caso.js):
 * lo que el estudiante escribe en el teléfono aparece acá turno a turno.
 *
 * Componentes del SDK (sdk.js): Toolbar, TagGroup, StatCard, Card, Alert, Badge,
 * Button, Progress, Stepper, Timeline, Breadcrumb, EmptyState, Switch. Lo que el
 * SDK no tiene y se compone con tokens (nws-*): la barra de cinco segmentos del
 * nivel, la tira de pasos, la tabla de evaluación, la fila de señal y la fila de
 * alerta. Reglas: el estudiante nunca ve niveles; acá sí, con su porqué; el nivel
 * solo sube; una persona decide.
 */
window.PANTALLAS = window.PANTALLAS || {};
window.PANTALLAS['bienestar'] = (function () {
  var C = window.CASO;

  function bloque(titulo, cuerpo, derecha, cls) {
    return '<section class="nws-sl__bl ' + (cls || '') + '"><header class="nws-sl__bl-hd"><h3 class="nws-sl__h">' + titulo + '</h3>' + (derecha || '') + '</header>' + cuerpo + '</section>';
  }
  function sub(t) { return '<p class="nws-sl__sub">' + t + '</p>'; }
  function cap(t) { t = String(t == null ? '' : t); return t.charAt(0).toUpperCase() + t.slice(1); }

  return {
    fullscreen: true,
    estable: true,
    titulo: 'Sala de bienestar',

    render: function (ctx) {
      var S = ctx.S;
      return '<div class="nws-col nws-sala" style="height:100%;background:var(--naotech-color-white-alpha-100)"><div id="cab"></div>' +
        '<div class="nws-sala__shell"><nav class="nws-side" aria-label="Sala de bienestar">' +
        [['view-grid', 'Resumen', 'resumen'], ['answer', 'Mis casos', 'casos'], ['notification', 'Alertas'], ['calendar', 'Eventos'], ['settings', 'Ajustes']].map(function (m) {
          return '<button class="nws-side__it" ' + (m[2] ? 'data-nav="' + m[2] + '"' : 'data-toast="' + m[1] + '"') + '>' + S.icon(m[0]) + '<span>' + m[1] + '</span></button>';
        }).join('') +
        '<div class="nws-side__pie"><span class="nws-side__it">' + S.icon('privacy') + '<span>Una persona decide</span></span></div></nav>' +
        '<div class="nws-sala__body nws-scroll" id="sala"></div></div><div id="gbar"></div><div id="gpanel" class="nws-gpanel"></div></div>';
    },

    mount: function (root, ctx) {
      var S = ctx.S, $ = function (id) { return root.querySelector('#' + id); }, esc = S.esc;
      var NIVEL = C.NIVEL, ACCION = C.ACCION, SEN = C.SENALES;

      function nivelBadge(n, sm) { var v = NIVEL[n]; return S.badge({ label: v.label, icon: v.icon, theme: v.tema, variant: 'quiet', size: sm ? 'small' : 'medium' }); }
      function accionBadge(a, n, sm) { return S.badge({ label: ACCION[a].label, icon: NIVEL[n].icon, theme: NIVEL[n].tema, variant: 'loud', size: sm ? 'small' : 'medium' }); }
      function segmentos(n) {
        var idx = C.NIVELES.indexOf(n), out = '';
        for (var i = 0; i < 5; i++) { out += '<i class="' + (n && i <= idx ? 'on nws-nv--' + n : '') + '"></i>'; }
        return '<span class="nws-seg" role="img" aria-label="' + (n ? 'Nivel ' + NIVEL[n].label : 'Sin nivel') + '">' + out + '</span>';
      }
      function resaltar(texto, spans) {
        var t = esc(texto);
        (spans || []).forEach(function (sp) { var e = esc(sp); t = t.replace(e, '<mark class="nws-mark">' + e + '</mark>'); });
        return t;
      }
      function etiquetaSenal(sg, val) {
        if (sg.id === 'D8') { return String(val); }
        var o = sg.opciones[val]; return o || cap(val);
      }

      var tab = 'evidencia';
      var G = C.GUIONES, ORDEN_NV = ['critica', 'alta', 'media', 'baja'];
      var vista = 'resumen', sel = null, cabPrev = 0, modo = 'resumen', fNiv = {}, fEst = 'todos', colapsada = false, animarDerecha = false, alertasOk = {}, abiertoAl = false, ajusteSel = null, motivoSel = null, prevH = 0, marc = {}, verAte = false;

      /* cada caso del roster reproduce su propio onboarding: una grabación base cortada en el turno donde iba el caso */
      var CASOS = (ctx.datos || window.DATOS).demo.casos.map(function (c) {
        var base = G[c.base], tr = base.turnos.slice(0, c.turnos), max = 0, acc = tr[0].accion, ACC = Object.keys(ACCION);
        tr.forEach(function (t) { max = Math.max(max, C.NIVELES.indexOf(t.nivel)); if (ACC.indexOf(t.accion) > ACC.indexOf(acc)) { acc = t.accion; } });
        var gid = 'caso:' + c.id;
        G[gid] = Object.assign({}, base, { id: gid, titulo: 'Caso ' + c.est, turnos: tr, esperado: { nivel: C.NIVELES[max], accion: acc }, color: C.NIVELES[max] });
        return Object.assign({}, c, { gid: gid, nivel: C.NIVELES[max], accion: acc, ultimo: tr[tr.length - 1].estudiante, alertas: tr.filter(function (t) { return t.alerta; }).length,
          cob: SEN.filter(function (sg) { return tr[tr.length - 1].codigos[sg.clave] !== undefined; }).length });
      });
      function casoPorId(id) { return CASOS.filter(function (c) { return c.id === id; })[0]; }

      /* ---------- tira de cinco pasos ---------- */
      function pasos(v, s) {
        var corre = s.fase === 'estudiante' ? 1 : (s.fase === 'escribiendo' ? 3 : 0), listo = s.fase === 'listo' || (s.fase === 'idle' && v.ultimo);
        var u = v.ultimo;
        var def = [
          ['Interpretación', 'lee el mensaje', u ? cap(u.codigos.emocion || '') + (u.codigos.intensidad ? ' · ' + u.codigos.intensidad : '') : ''],
          ['Evaluación de riesgo', 'estima el nivel', u ? 'Nivel ' + NIVEL[v.nivel].label : ''],
          ['Detección de crisis', 'revisa cada mensaje', u ? (v.crisis ? 'Crisis detectada' : 'Sin crisis') : ''],
          ['Ruta de atención', 'nivel → acción', u ? ACCION[v.accion].corto : ''],
          ['Alerta al equipo', 'avisa al equipo', u ? (v.alertas.length ? 'Alerta creada' : 'Sin alerta') : '']
        ];
        return '<ol class="nws-pasos">' + def.map(function (p, i) {
          var estado = listo ? 'ok' : (corre && i < corre ? 'run' : '');
          var crisis = i === 2 && v.crisis && listo ? ' nws-paso--crisis' : '';
          return '<li class="nws-paso' + (estado ? ' nws-paso--' + estado : '') + crisis + '"><span class="nws-mono">0' + (i + 1) + '</span><div><b>' + p[0] + '</b><small>' + (listo && p[2] ? esc(p[2]) : p[1]) + '</small></div></li>';
        }).join('') + '</ol>';
      }

      /* ---------- encabezado, portada y resumen ---------- */
      function cabecera() {
        return '<header class="nws-ah"><div class="nws-logo nws-ah__logo"><span class="nws-orbe nws-orbe--sm"></span><span class="nws-logo__t">SerafIA</span><span class="nws-ah__sep"></span><span class="nws-ah__ctx">Sala de bienestar</span></div>' +
          '<span class="nws-grow"></span>' +
          '<div class="nws-cab__r"><span id="cabst"></span>' +
          '<span class="nws-rolsw-lb">Ver como</span>' + S.tagGroup({ items: [{ label: 'Estudiante', value: 'estudiante' }, { label: 'Bienestar', value: 'bienestar' }], value: 'bienestar', size: 'medium', cls: 'nws-rolsw' }) +
          '<span class="nws-cab__ic">' + S.icon('notification') + '</span>' + S.avatar({ text: 'EB', size: 'small', theme: 'secondary', variant: 'loud' }) + '</div></header>';
      }

      /* ---------- resumen: mis casos por nivel de escalamiento (primera versión) ---------- */
      function tarjetaCaso(c) {
        return '<button type="button" class="nws-cs" data-caso="' + c.id + '"><div class="nws-cs__r1"><b>' + c.nombre + '</b><span class="nws-txt">' + c.hace + '</span></div>' +
          '<span class="nws-txt">' + c.programa + ' · ' + c.sem + '</span><p class="nws-cs__cita">“' + esc(c.ultimo) + '”</p>' +
          '<div class="nws-cs__r3">' + S.badge({ label: estadoDe(c), theme: estadoDe(c) === 'Sin atender' ? 'negative' : (estadoDe(c) === 'En revisión' ? 'warning' : 'neutral'), variant: 'quiet', size: 'small' }) +
          '<span class="nws-txt nws-cs__ch">' + S.icon('answer') + c.turnos + ' turnos</span><span class="nws-grow"></span>' + S.icon('arrow-right') + '</div></button>';
      }
      function vacioEs(icono, texto) { return '<div class="nws-vz"><span class="nws-vz__ic">' + S.icon(icono) + '</span><p>' + texto + '</p></div>'; }
      function pendiente(c) {
        if (estadoDe(c) === 'Sin atender') { return true; }
        if (estadoDe(c) === 'En seguimiento') { return false; }
        return alertasDe(c, false, C.estado()).some(function (a) { return !a.ok; });
      }
      function tablero() {
        return '<div class="nws-tabl">' + ORDEN_NV.map(function (n) {
          var lista = CASOS.filter(function (c) { return c.nivel === n && pendiente(c); }), v = NIVEL[n];
          var a = n === 'critica' ? 'escalamiento_inmediato' : (n === 'alta' ? 'alerta_prioritaria' : (n === 'media' ? 'alerta' : 'monitorear'));
          return '<section class="nws-tabl__c"><header class="nws-tabl__hd">' + nivelBadge(n) + '<span class="nws-txt">' + lista.length + (lista.length === 1 ? ' caso' : ' casos') + '</span></header><p class="nws-txt nws-tabl__sub">' + ACCION[a].label + ' · ' + ACCION[a].detalle + '</p>' +
            '<div class="nws-tabl__l">' + (lista.length ? lista.map(tarjetaCaso).join('') : vacioEs('positive', 'Sin casos pendientes en este nivel')) + '</div></section>';
        }).join('') + '</div>';
      }
      function tablaConversaciones() {
        var filas = ((ctx.D || window.DATOS).demo.criticosSemana || []);
        var bad = function (e) { return S.badge({ label: e, theme: e === 'Sin atender' ? 'negative' : (e === 'Atendido' ? 'positive' : 'warning'), variant: 'quiet', size: 'small' }); };
        return '<section class="nws-rt"><div class="nws-rt__h"><h2>Casos críticos de la última semana</h2><span class="nws-txt">' + filas.length + ' casos · toca el que está sin atender para abrirlo</span></div><div class="nws-sl__bl nws-rt__c"><div class="nws-conv nws-conv--crit">' +
          '<div class="nws-conv__hd"><span>Estudiante</span><span>Programa</span><span>Detectado</span><span>Primera respuesta</span><span>Estado</span><span>Acción tomada</span></div>' +
          filas.map(function (f) {
            var tag = f.caso ? 'button' : 'div';
            return '<' + tag + (f.caso ? ' type="button" data-caso="' + f.caso + '"' : '') + ' class="nws-conv__r' + (f.caso ? '' : ' nws-conv__r--so') + '"><b>' + f.nombre + '</b><span>' + f.programa + '</span><span>' + f.detectado + '</span><span>' + f.respuesta + '</span><span>' + bad(f.estado) + '</span><span class="nws-conv__m">' + f.accion + '</span></' + tag + '>';
          }).join('') + '</div></div></section>';
      }
      function resumen() {
        var abiertos = CASOS.length, porAtender = CASOS.filter(function (c) { return estadoDe(c) === 'Sin atender'; }).length;
        return '<div class="nws-pagehd"><div><h1 class="nws-pag">Balance general de casos</h1><p class="nws-txt">Visualiza un resumen de los casos generados</p></div>' +
          S.button({ label: 'Descargar informe', icon: 'download', variant: 'quiet', theme: 'neutral', size: 'medium', attrs: { 'data-d': 'informe' } }) + '</div>' +
          '<div class="nws-kpis nws-kpis--4">' + [
            S.statCard({ label: 'Conversaciones esta semana', value: '312', hint: abiertos + ' generaron un caso · el resto, sin señales de riesgo', icon: 'answer' }),
            S.statCard({ label: 'Casos abiertos', value: String(abiertos), hint: 'En los 4 niveles', icon: 'view-list' }),
            S.statCard({ label: 'Sin atender', value: String(porAtender), hint: 'Esperan una persona del equipo', icon: 'notification' }),
            S.statCard({ label: 'Primer contacto', valueHtml: '38 <small>min</small>', hint: 'Meta del equipo: 60 min', icon: 'calendar' })
          ].join('') + '</div><section class="nws-cp"><h2 class="nws-cp__t">Casos pendientes</h2>' + tablero() + '</section>' + tablaConversaciones();
      }

      /* ---------- detalle del caso ---------- */
      function migas(c) {
        return '<nav class="nws-migas" aria-label="Ruta">' + S.button({ label: 'Mis casos', icon: 'arrow-left', variant: 'mute', theme: 'neutral', size: 'small', attrs: { 'data-d': 'volver' } }) +
          '<span class="nws-txt">/</span><b>' + c.id + '</b></nav>';
      }
      function portada(v, c, live) {
        var n = live ? v.nivel : c.nivel, a = live ? v.accion : c.accion, na = live ? v.alertas.length : c.alertas;
        var tarjetas = [
          ['01', 'indigo', 'Nivel del caso', n ? NIVEL[n].label : '—', segmentos(n), n ? (live && v.provisional ? 'Provisional · puede subir' : NIVEL[n].resumen) : 'Aún sin nivel'],
          ['02', 'blue', 'Acción sugerida', a ? ACCION[a].label : '—', '', a ? ACCION[a].detalle : 'Aún sin recomendación'],
          ['03', 'green', live ? 'Cobertura del instrumento' : 'Alertas del caso', live ? v.cobertura + '<small> de 8</small>' : String(na), live ? S.progress({ value: v.cobertura / 8 * 100, theme: 'secondary', size: 'small' }) : '', live ? 'Señales recogidas' : 'Se arman al reproducir el onboarding']
        ].map(function (t) {
          return '<article class="nws-pt" data-c="' + t[1] + '"><span class="nws-mono">' + t[0] + '</span><span class="nws-mono-over">' + t[2] + '</span><b class="nws-pt__v">' + t[3] + '</b>' + t[4] + '<span class="nws-pt__h">' + t[5] + '</span></article>';
        }).join('');
        return '<section class="nws-portada"><div class="nws-portada__t"><span class="nws-mono-over">' + c.id + ' · ' + c.hace + '</span><h2 class="nws-portada__h">' + c.nombre + '</h2><span class="nws-txt">' + c.programa + ' · ' + c.sem + '</span>' +
          (live ? '' : S.button({ label: 'Reproducir onboarding', icon: 'play-filled', variant: 'quiet', theme: 'neutral', size: 'medium', attrs: { 'data-d': 'reproducir' } })) + '</div><div class="nws-portada__c">' + tarjetas + '</div></section>';
      }
      function indicadores(v) {
        var turno = v.turnos.length;
        return '<div class="nws-kpis nws-kpis--3">' + [
          S.statCard({ label: 'Alertas abiertas', value: String(v.alertas.length), hint: v.alertas.length ? 'Sin atender' : 'Ninguna por ahora', icon: 'notification' }),
          S.statCard({ label: 'Factores protectores', valueHtml: v.nFactores + ' <small>de 2</small>', hint: 'Apoyo · ' + factor(v.factores[0]) + ' / Afrontamiento · ' + factor(v.factores[1]) }),
          S.statCard({ label: 'Turno de la conversación', valueHtml: turno + ' <small>de ' + C.total() + '</small>', hint: turno ? 'Caso SER-0142' : 'Sin conversación' })
        ].join('') + '</div>';
      }
      function factor(x) { return x === 'si' ? 'Sí' : (x === 'no' ? 'No' : 'Por confirmar'); }

      /* ---------- alertas (columna izquierda) ---------- */
      function alertas(v) {
        var orden = v.alertas.slice().sort(function (x, y) { return y.turno - x.turno; });
        var body = orden.length ? orden.map(function (al, i) {
          var d = SEN.filter(function (sg) { return sg.id === al.item; })[0];
          return '<article class="nws-al nws-al--' + al.nivel + '"><div class="nws-al__r1">' + S.badge({ label: ACCION[al.accion].label, icon: NIVEL[al.nivel].icon, theme: NIVEL[al.nivel].tema, variant: 'quiet', size: 'small' }) +
            '<span class="nws-mono">' + casoPorId(sel).id + '</span>' + (al.turno === v.turnos.length && !estatico ? S.badge({ label: 'Nueva', theme: 'positive', variant: 'loud', size: 'small' }) : '') + '</div>' +
            '<p class="nws-al__cita">“' + resaltar(al.cita, al.crisis ? v.spans : []) + '”</p>' +
            '<div class="nws-al__r3"><span class="nws-txt">' + (d ? al.item + ' ' + d.label : '') + '</span><span class="nws-mono">T' + al.turno + '</span></div></article>';
        }).join('') : vacioEs('notification', 'Cuando una conversación sume señales, la alerta aparece aquí con la cita que la causó');
        return bloque('<span id="alertas">Alertas</span> ' + S.badge({ label: String(v.alertas.length), theme: 'neutral', variant: 'quiet', size: 'small' }), body, '<span class="nws-txt">Más recientes primero</span>', 'nws-sl__bl--lista');
      }

      /* ---------- caso (columna central) ---------- */
      var bit = {}, estatico = false, decidido = {};
      function estadoDe(c) { return decidido[c.id] && c.estado === 'Sin atender' ? 'En revisión' : c.estado; }
      var MOTIVOS = ['Ya hablé con el estudiante', 'Tengo más información del caso', 'Ya está en atención con otro servicio', 'Otro motivo'];
      var ORDEN_ACC = ['acompanar', 'monitorear', 'alerta', 'alerta_prioritaria', 'escalamiento_inmediato'];
      function abiertasDe(id, v) { return (v.alertas || []).filter(function (al) { return !alertasOk[id + ':' + al.turno]; }); }
      function aplicarDecision(tipo, accion, motivo) {
        var s = C.estado(), v = C.vista(s.hechos > 0 ? undefined : C.total()), ab = abiertasDe(sel, v).filter(function (al) { return marc[sel + ':' + al.turno]; }), hh = ahora();
        ab.forEach(function (al) { alertasOk[sel + ':' + al.turno] = hh; delete marc[sel + ':' + al.turno]; });
        if (!bit[sel]) { bit[sel] = { ev: [], contacto: false, proto: false }; } else { bit[sel].contacto = false; bit[sel].proto = false; }
        registrar((tipo === 'Confirmada' ? 'Acción confirmada: ' : 'Acción ajustada a ') + ACCION[accion].label + (motivo ? ' · Motivo: ' + motivo : '') + (ab.length ? ' · ' + ab.length + (ab.length === 1 ? ' alerta atendida' : ' alertas atendidas') : ''));
        ajusteSel = null; motivoSel = null; decidido[sel] = true;
        C.decidir(tipo, tipo === 'Ajustada' ? accion : null);
      }
      function ahora() { return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }); }
      function siguientes(v, s) {
        var dec = s.decision; if (!dec) { return ''; }
        var fin = dec.tipo === 'Ajustada' ? dec.accion : v.accion;
        if (!ACCION[fin].alerta) { return ''; }
        var r = bit[sel] || { ev: [], contacto: false, proto: false };
        var linea = r.ev.map(function (e) { return '<li><b>' + e.h + '</b><span>' + esc(e.t) + '</span></li>'; }).join('');
        return '<div class="nws-next"><div class="nws-next__a"><span class="nws-next__k">Siguientes pasos</span><div class="nws-next__b">' +
          S.button({ label: r.contacto ? 'Contacto registrado' : 'Contactar ahora', icon: r.contacto ? 'positive' : 'phone', variant: r.contacto ? 'quiet' : 'loud', theme: r.contacto ? 'neutral' : 'secondary', size: 'medium', disabled: r.contacto, attrs: { 'data-d': 'contactar' } }) +
          S.button({ label: r.proto ? 'Protocolo activado' : 'Activar protocolo', icon: r.proto ? 'positive' : 'attention', variant: 'quiet', theme: r.proto ? 'neutral' : 'negative', size: 'medium', disabled: r.proto, attrs: { 'data-d': 'protocolo' } }) + '</div></div>' +
          '<ol class="nws-next__l" aria-label="Historial del caso">' + linea + '</ol></div>';
      }
      function registrar(txt, flag) { var r = bit[sel] || (bit[sel] = { ev: [], contacto: false, proto: false }); r.ev.push({ h: ahora(), t: txt }); if (flag) { r[flag] = true; } }

      /* ---------- decisión y alertas en un solo panel: por defecto en conjunto, o eligiendo cuáles ---------- */
      function panelDecision(v, s, resumido) {
        var c = casoPorId(sel), a = ACCION[v.accion], n = v.nivel, dec = s.decision;
        var al = (v.alertas || []).map(function (x) { return { n: x.turno, accion: x.accion, nivel: x.nivel, cita: x.cita, ok: alertasOk[sel + ':' + x.turno] || null }; }).sort(function (p, q) { return q.n - p.n; });
        var abiertas = al.filter(function (x) { return !x.ok; }), cerradas = al.filter(function (x) { return x.ok; });
        if (resumido) {
          return '<section class="nws-pd nws-pd--res nws-lv--' + n + '" aria-label="Acción recomendada"><div class="nws-pd__i"><span class="nws-pd__k">Acción recomendada · ' + NIVEL[n].label + '</span><b>' + a.label + '</b><small>' + a.detalle + '</small></div>' +
            (dec ? '<div class="nws-pd__c nws-pd__c--res">' + recomendacion(v, s, 'cierre') + '</div>' : '') +
            '<div class="nws-pd__go">' + S.button({ label: 'Gestionar', icon: 'arrow-right', theme: 'secondary', variant: 'loud', size: 'medium', attrs: { 'data-modo': 'detalle' } }) +
            '<span class="nws-txt">' + (abiertas.length ? abiertas.length + (abiertas.length === 1 ? ' alerta sin atender' : ' alertas sin atender') : 'Sin alertas por atender') + '</span></div></section>';
        }
        var marcadasN = abiertas.filter(function (x) { return marc[sel + ':' + x.n]; }), N = marcadasN.length;
        var accionFin = ajusteSel || v.accion, A = ACCION[accionFin];
        var pendiente = !dec || abiertas.length > 0;
        var resultado = dec ? recomendacion(v, s, 'cierre') : '';
        var VERBO = { acompanar: 'Acompañar', monitorear: 'Monitorear', alerta: 'Alertar', alerta_prioritaria: 'Alertar con prioridad', escalamiento_inmediato: 'Escalar' };
        var todasM = N === abiertas.length;

        /* las alertas siempre visibles, cada una con su acción; se marcan para decidir sobre ellas */
        var lista = '';
        if (abiertas.length) {
          lista = '<div class="nws-pd__l"><div class="nws-pd__lh"><b>Alertas sin atender · ' + abiertas.length + '</b><button type="button" class="nws-pd__tg" data-d="selal-' + (todasM ? 'ninguna' : 'todas') + '">' + (todasM ? 'Quitar selección' : 'Seleccionar todas') + '</button></div><ul>' +
            abiertas.map(function (x) {
              var on = !!marc[sel + ':' + x.n];
              return '<li><button type="button" class="nws-pd__r' + (on ? ' nws-pd__r--on' : '') + '" role="checkbox" aria-checked="' + on + '" data-d="selal:' + x.n + '"><span class="nws-pd__cb"></span>' +
                '<span class="nws-pd__q"><span class="nws-pd__m">' + S.badge({ label: ACCION[x.accion].label, icon: NIVEL[x.nivel].icon, theme: NIVEL[x.nivel].tema, variant: 'quiet', size: 'small' }) + '<small>Mensaje ' + x.n + '</small></span><i>“' + esc(x.cita) + '”</i></span></button></li>';
            }).join('') + '</ul>' + (!N && pendiente ? '<p class="nws-pd__h">Marca las alertas sobre las que quieres decidir.</p>' : '') + '</div>';
        }

        /* barra de decisión: aparece al marcar alertas (o de una vez si el caso no tiene alertas) */
        var barra = '';
        if (pendiente && (N > 0 || !abiertas.length)) {
          var opciones = '';
          if (s.ajustando && !ajusteSel) {
            opciones = '<div class="nws-adj__l">' + Object.keys(ACCION).map(function (k) {
              return '<button type="button" class="nws-adj__o" data-d="ajuste:' + k + '"><span class="nws-adj__t"><b>' + ACCION[k].label + '</b><small>' + ACCION[k].detalle + '</small></span>' +
                (k === v.accion ? S.badge({ label: 'Propuesta', theme: 'neutral', variant: 'quiet', size: 'small' }) : '') + '<span class="nws-adj__go" aria-hidden="true">' + S.icon('arrow-right') + '</span></button>';
            }).join('') + '</div>';
          } else if (ajusteSel) {
            var baja = ORDEN_ACC.indexOf(ajusteSel) < ORDEN_ACC.indexOf(v.accion);
            opciones = (baja ? '<div class="nws-adj__w">' + S.icon('caution') + '<span>' + (v.crisis ? 'Estás bajando una crisis detectada. El modelo no puede hacerlo; tú sí, y queda registrado con tu motivo.' : 'Estás bajando la acción que propone el sistema. Queda registrado con tu motivo.') + '</span></div>' : '') +
              '<div class="nws-adj__m"><span class="nws-adj__k">Motivo (obligatorio)</span><div class="nws-adj__mm" role="radiogroup" aria-label="Motivo del cambio">' + MOTIVOS.map(function (m, ix) { return '<button type="button" class="nws-mot' + (motivoSel === m ? ' nws-mot--on' : '') + '" role="radio" aria-checked="' + (motivoSel === m) + '" data-d="motivo:' + ix + '">' + m + '</button>'; }).join('') + '</div></div>';
          }
          var alcance = !abiertas.length ? '' : (todasM ? (N === 1 ? ' la alerta' : (N === 2 ? ' ambas' : ' las ' + N + ' alertas')) : (N === 1 ? ' la alerta marcada' : ' las ' + N + ' marcadas'));
          var etiqueta = ajusteSel ? 'Guardar cambio a ' + A.label + (abiertas.length ? ' · ' + N + (N === 1 ? ' alerta' : ' alertas') : '') : VERBO[accionFin] + (abiertas.length ? alcance : '');
          var faltaMotivo = ajusteSel && !motivoSel;
          barra = '<div class="nws-pd__b"><div class="nws-pd__bi"><div class="nws-st__t"><span class="nws-st__k">' + (abiertas.length ? (N === 1 ? '1 alerta marcada' : N + ' alertas marcadas') + ' · ' : '') + 'Acción' + (ajusteSel ? ' (cambiada)' : '') + '</span><b>' + A.label + (ajusteSel ? '' : ' ' + S.badge({ label: 'Propuesta', theme: 'neutral', variant: 'quiet', size: 'small' })) + '</b></div>' +
            '<button type="button" class="nws-pd__tg" data-d="ajustar">' + (ajusteSel || s.ajustando ? 'Elegir otra' : 'Cambiar acción') + '</button></div>' + opciones +
            (!(s.ajustando && !ajusteSel) ? '<div class="nws-pd__f">' + S.button({ label: etiqueta, theme: 'secondary', variant: 'loud', size: 'large', icon: 'positive', disabled: !!faltaMotivo, attrs: { 'data-d': ajusteSel ? 'guardar-ajuste' : 'confirmar' } }) +
              (ajusteSel || s.ajustando ? '<button type="button" class="nws-adj__x" data-d="cancelar">Cancelar el cambio</button>' : '') +
              (faltaMotivo ? '<span class="nws-pd__h">Elige un motivo para guardar el cambio.</span>' : '') + '</div>' : '<div class="nws-pd__f"><button type="button" class="nws-adj__x" data-d="cancelar">Cancelar el cambio</button></div>') + '</div>';
        }
        var ate = cerradas.length ? '<div class="nws-pd__a"><button type="button" class="nws-pd__tg" data-d="ver-ate" aria-expanded="' + verAte + '">' + (verAte ? 'Ocultar' : 'Ver') + ' ' + cerradas.length + (cerradas.length === 1 ? ' atendida' : ' atendidas') + '</button>' +
          (verAte ? '<ul>' + cerradas.map(function (x) { return '<li><span class="nws-pd__ok">' + S.icon('positive') + '</span><span class="nws-pd__q"><span class="nws-pd__m">' + S.badge({ label: ACCION[x.accion].label, icon: NIVEL[x.nivel].icon, theme: NIVEL[x.nivel].tema, variant: 'quiet', size: 'small' }) + '<small>Mensaje ' + x.n + ' · atendida ' + x.ok + '</small></span><i>“' + esc(x.cita) + '”</i></span></li>'; }).join('') + '</ul>' : '') + '</div>' : '';
        return '<section class="nws-pd nws-lv--' + n + '" aria-label="Decisión del equipo"><div class="nws-pd__i"><span class="nws-pd__k">Acción recomendada · ' + NIVEL[n].label + '</span><b>' + a.label + '</b><small>' + a.detalle + '</small></div>' +
          (resultado ? '<div class="nws-pd__c nws-pd__c--res">' + resultado + '</div>' : '') + siguientes(v, s) + lista + barra + ate + '</section>';
      }

      function recomendacion(v, s, compacto) {
        var a = ACCION[v.accion], n = v.nivel, elev = v.crisis ? 'Detección de crisis' : 'Evaluación de riesgo';
        var dec = s.decision;
        var cierre;
        if (dec) {
          cierre = '<div class="nws-dec nws-dec--ok">' + S.badge({ label: dec.tipo, icon: 'positive', theme: 'positive', variant: 'quiet', size: 'medium' }) +
            '<span class="nws-txt">' + (dec.tipo === 'Ajustada' ? 'Acción ajustada a «' + ACCION[dec.accion].label + '»' : 'Acción confirmada: «' + a.label + '»') + ' · decidió una persona del equipo</span></div>';
        } else if (s.ajustando && ajusteSel) {
          var baja = ORDEN_ACC.indexOf(ajusteSel) < ORDEN_ACC.indexOf(v.accion);
          cierre = '<div class="nws-adj"><div class="nws-adj__h"><b>Cambiar a «' + ACCION[ajusteSel].label + '»</b><span>' + ACCION[ajusteSel].detalle + '</span></div>' +
            (baja ? '<div class="nws-adj__w">' + S.icon('caution') + '<span>' + (v.crisis ? 'Estás bajando una crisis detectada. El modelo no puede hacerlo; tú sí, y queda registrado con tu motivo.' : 'Estás bajando la acción que propone el sistema. Queda registrado con tu motivo.') + '</span></div>' : '') +
            '<div class="nws-adj__m"><span class="nws-adj__k">Motivo (obligatorio)</span><div class="nws-adj__mm">' + MOTIVOS.map(function (m, ix) { return '<button type="button" class="nws-fchip' + (motivoSel === m ? ' nws-fchip--on' : '') + '" data-d="motivo:' + ix + '" aria-pressed="' + (motivoSel === m) + '">' + m + '</button>'; }).join('') + '</div></div>' +
            '<div class="nws-adj__b">' + S.button({ label: 'Guardar decisión', theme: 'secondary', variant: 'loud', size: 'medium', icon: 'positive', disabled: !motivoSel, attrs: { 'data-d': 'guardar-ajuste' } }) +
            S.button({ label: 'Elegir otra', theme: 'neutral', variant: 'quiet', size: 'medium', attrs: { 'data-d': 'ajustar' } }) + '<button type="button" class="nws-adj__x" data-d="cancelar">Cancelar</button></div></div>';
        } else if (s.ajustando) {
          cierre = '<div class="nws-adj"><div class="nws-adj__h"><b>¿Qué acción corresponde?</b><span>El sistema propone «' + a.label + '». Tú decides.</span></div><div class="nws-adj__l">' +
            Object.keys(ACCION).map(function (k) {
              return '<button type="button" class="nws-adj__o' + (k === v.accion ? ' nws-adj__o--p' : '') + '" data-d="ajuste:' + k + '"><span class="nws-adj__t"><b>' + ACCION[k].label + '</b><small>' + ACCION[k].detalle + '</small></span>' +
                (k === v.accion ? S.badge({ label: 'Propuesta', theme: 'secondary', variant: 'quiet', size: 'small' }) : '') + '<span class="nws-adj__go" aria-hidden="true">' + S.icon('arrow-right') + '</span></button>';
            }).join('') + '</div><button type="button" class="nws-adj__x" data-d="cancelar">Cancelar</button></div>';
        } else {
          cierre = '<div class="nws-dec"><div class="nws-dec__col"><span class="nws-mono-over">Propuesta del sistema</span><b>' + a.label + '</b></div>' +
            '<div class="nws-dec__col"><span class="nws-mono-over">Decisión del equipo</span><span class="nws-dec__btns">' +
            S.button({ label: 'Confirmar acción', theme: 'secondary', variant: 'loud', size: 'medium', icon: 'positive', attrs: { 'data-d': 'confirmar' } }) +
            S.button({ label: 'Ajustar', theme: 'neutral', variant: 'quiet', size: 'medium', attrs: { 'data-d': 'ajustar' } }) + '</span></div></div>';
        }
        if (compacto === 'cierre') { return cierre; }
        if (compacto) {
          return '<section class="nws-dbar nws-lv--' + n + '" aria-label="Decisión del equipo"><div class="nws-dbar__i"><span class="nws-dbar__k">Acción recomendada · ' + NIVEL[n].label + '</span><b>' + a.label + '</b><small>' + a.detalle + (!dec && abiertasDe(sel, v).length ? ' · Cubre ' + abiertasDe(sel, v).length + (abiertasDe(sel, v).length === 1 ? ' alerta sin atender' : ' alertas sin atender') : '') + '</small></div>' + cierre + siguientes(v, s) + '</section>';
        }
        return '<section class="nws-reco nws-reco--' + n + '"><div class="nws-reco__top"><div><span class="nws-mono-over">Acción recomendada</span><h2 class="nws-reco__t">' + a.label + '</h2>' +
          '<p class="nws-reco__d">' + a.detalle + '</p></div><div class="nws-reco__bd">' + nivelBadge(n) + (v.provisional && !v.crisis ? S.badge({ label: 'Provisional', theme: 'warning', variant: 'quiet', size: 'medium', icon: 'caution' }) : '') +
          (v.subio ? S.badge({ label: 'Subió de nivel', theme: 'negative', variant: 'quiet', size: 'medium', icon: 'arrow-up' }) : '') + '</div></div>' +
          '<div class="nws-reco__elev"><span class="nws-txt">Quién la elevó</span><b>' + elev + '</b>' + (v.crisis ? '<span class="nws-txt">· el modelo no puede bajar este nivel</span>' : '') + '</div>' + cierre + siguientes(v, s) + '</section>';
      }
      function porQue(v) {
        var u = v.ultimo, razon;
        if (v.crisis) { razon = 'Se detectó una frase de crisis. El protocolo institucional eleva el caso a nivel Crítico y ninguna evaluación automática puede bajarlo.'; }
        else {
          var int = u.codigos.intensidad, np = v.factores.filter(function (x) { return x !== 'no'; }).length;
          razon = 'Intensidad ' + (int >= 4 ? 'alta' : (int == 3 ? 'moderada' : 'baja')) + ' con ' + v.nFactores + ' de 2 factores protectores confirmados' + (v.provisional ? ' (hay factores por confirmar, por eso el nivel es provisional y puede subir)' : '') + '.';
        }
        return bloque('Por qué este nivel', '<p class="nws-sl__p">' + razon + '</p>' + (!v.crisis ? '<p class="nws-sl__nota">Reglas preliminares: ningún clínico las ha validado todavía.</p>' : ''), S.badge({ label: 'Reglas preliminares', theme: 'warning', variant: 'quiet', size: 'small' }));
      }
      function interpretado(v, s) {
        var u = v.ultimo;
        var filas = v.nuevos.map(function (k) {
          var d = C.CODIGO_A_D[k], sg = SEN.filter(function (x) { return x.id === d; })[0];
          if (!sg) { return ''; }
          var resp = d === u.item || (k === 'intensidad' && u.item === 'D1');
          return '<li><span class="nws-cod">' + d + '</span><div class="nws-grow"><b>' + sg.label + '</b><span class="nws-txt">' + esc(etiquetaSenal(sg, u.codigos[k])) + '</span></div>' +
            S.badge({ label: resp ? 'Respondió' : 'Lo adelantó', theme: resp ? 'neutral' : 'informative', variant: 'quiet', size: 'small' }) +
            (s.detalle ? '<span class="nws-mono nws-conf">' + (u.conf || 0).toFixed(2).replace('.', ',') + '</span>' : '') + '</li>';
        }).join('');
        var sig = u.siguiente && C.STEP_D[u.siguiente] ? 'Siguiente pregunta · ' + C.STEP_D[u.siguiente] + ' ' + (SEN.filter(function (x) { return x.id === C.STEP_D[u.siguiente]; })[0] || {}).label : 'Fin del recorrido';
        return bloque('Lo que interpretó el sistema', '<ul class="nws-int">' + (filas || '<li class="nws-txt">Sin datos nuevos en este mensaje.</li>') + '</ul><p class="nws-sl__nota">' + sig + '</p>');
      }
      function tabla(v) {
        var u = v.ultimo, int = +u.codigos.intensidad || 0, np = v.factores.filter(function (x) { return x !== 'no'; }).length;
        var fila = int >= 4 ? 2 : (int === 3 ? 1 : 0);
        var M = [['ninguna', 'ninguna', 'baja'], ['baja', 'baja', 'media'], ['media', 'media', 'alta']];
        var etq = ['Intensidad 1–2', 'Intensidad 3', 'Intensidad 4–5'], col = 2 - np;
        var head = '<tr><th></th><th>2 factores posibles</th><th>1</th><th>0</th></tr>';
        return bloque('Tabla de evaluación', '<table class="nws-tab"><thead>' + head + '</thead><tbody>' + M.map(function (r, i) {
          return '<tr><th>' + etq[i] + '</th>' + r.map(function (c, j) { var on = int && i === fila && j === col; return '<td class="' + (on ? 'on nws-nv--' + c : '') + '">' + NIVEL[c].label + (on ? ' ←' : '') + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table>', S.badge({ label: 'Reglas preliminares', theme: 'warning', variant: 'quiet', size: 'small' }));
      }
      function sostiene(v) {
        var u = v.ultimo, ult = v.turnos[v.turnos.length - 1];
        var cita = v.crisis ? v.extractoCrisis : ult.estudiante;
        return bloque('Qué sostiene la señal', '<blockquote class="nws-cita">“' + resaltar(cita, v.spans) + '”</blockquote>' +
          '<dl class="nws-def"><div><dt>Protocolo de seguridad</dt><dd>' + (v.crisis ? 'Activado por la frase marcada' : 'Sin frases de crisis') + '</dd></div>' +
          '<div><dt>Evaluación</dt><dd>' + NIVEL[v.nivel].label + (v.provisional ? ' · provisional' : '') + '</dd></div>' +
          '<div><dt>Revisión de señales</dt><dd>' + v.cobertura + ' de 8 recogidas</dd></div></dl>');
      }
      function historial(v, s) {
        var items = v.turnos.map(function (t, i) {
          return { title: 'T' + (i + 1) + ' · ' + NIVEL[t.nivel].label + ' · ' + ACCION[t.accion].corto, subtitle: '“' + t.estudiante + '”' + (s.detalle ? '  ·  confianza ' + (t.conf || 0).toFixed(2).replace('.', ',') : ''), theme: NIVEL[t.nivel].tema };
        }).reverse();
        return bloque('Historial de turnos', S.timeline({ items: items }));
      }
      function conversacion(v) {
        var msgs = v.turnos.map(function (t) {
          var par = String(t.serafia || '').split(/\\n|\n/).filter(function (x) { return x.trim(); }).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('');
          return '<div class="nws-chat nws-chat--yo"><small class="nws-mono">Estudiante · T' + (v.turnos.indexOf(t) + 1) + '</small><div class="nws-chat__b">' + resaltar(t.estudiante, t.crisis) + '</div></div>' +
            '<div class="nws-chat"><small class="nws-mono">SerafIA</small><div class="nws-chat__b">' + par + '</div></div>';
        }).join('');
        return bloque('Conversación', '<div class="nws-chat__l">' + msgs + '</div>', '<span class="nws-txt">Solo visible por la alerta del caso</span>');
      }
      function caso(v, s) {
        return '<div class="nws-caso"><header class="nws-caso__hd"><div><span class="nws-mono-over">' + casoPorId(sel).id + ' · onboarding en vivo</span><h2 class="nws-caso__t">' + casoPorId(sel).nombre + '</h2><p class="nws-txt">' + casoPorId(sel).programa + ' · ' + casoPorId(sel).sem + '</p></div>' +
          '<div class="nws-caso__st">' + S.badge({ label: s.fase === 'estudiante' || s.fase === 'escribiendo' ? 'Procesando' : 'En espera de revisión', theme: s.fase === 'listo' || s.fase === 'idle' ? 'warning' : 'informative', variant: 'quiet', size: 'medium' }) +
          '<span class="nws-mono nws-txt">Turno ' + v.turnos.length + ' de ' + C.total() + '</span></div></header>' +
          (s.detalle ? S.stepper({ steps: ['Conversación', 'Señal', 'Alerta', 'Revisión humana'], position: s.decision ? 5 : (v.alertas.length ? 4 : (v.nivel && v.nivel !== 'ninguna' ? 2 : 1)), theme: 'secondary', cls: 'nws-recorrido' }) : '') +
          panelDecision(v, s) +
          '<div class="nws-fltabs" role="tablist">' + [['evidencia', 'Evidencia'], ['evaluacion', 'Evaluación'], ['historial', 'Historial']].map(function (t) {
            return '<button class="nws-fltab' + (tab === t[0] ? ' nws-fltab--on' : '') + '" role="tab" aria-selected="' + (tab === t[0]) + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
          }).join('') + '</div>' +
          (tab === 'evidencia' ? sostiene(v) + interpretado(v, s) : (tab === 'evaluacion' ? porQue(v) + tabla(v) : (bloque('Historial del caso', historialVista(casoPorId(sel), true, s)) + historial(v, s)))) + '</div>';
      }

      /* ---------- señales y garantías (columna derecha) ---------- */
      function senales(v, s) {
        var u = v.ultimo, fin = s.finForzado || C.terminado();
        var sig = (v.crisis || s.finForzado) ? null : (u && u.siguiente ? C.STEP_D[u.siguiente] : (u ? null : 'D1'));
        var filas = SEN.map(function (sg) {
          var val = v.codigos[sg.clave], estado, cls = '';
          if (val !== undefined) {
            estado = esc(etiquetaSenal(sg, val));
            if (sg.mal && sg.mal[val]) { cls = ' nws-tn--mal'; } else if (sg.bien && sg.bien[val]) { cls = ' nws-tn--bien'; } else { cls = ' nws-tn--info'; }
          } else if (sg.id === sig) { estado = 'Preguntando ahora'; cls = ' nws-tn--ahora'; }
          else if (v.crisis) { estado = 'En pausa · crisis activa'; cls = ' nws-tn--off'; }
          else if (fin || (u && v.cobertura > 0 && !u.siguiente)) { estado = 'Omitido por la ruta'; cls = ' nws-tn--off'; }
          else { estado = 'Pendiente'; cls = ' nws-tn--off'; }
          return '<li class="nws-sn' + (sg.id === sig && val === undefined ? ' nws-sn--ahora' : '') + (val === undefined && sg.id !== sig ? ' nws-sn--off' : '') + '"' + (val === undefined && sg.id !== sig ? ' aria-disabled="true"' : '') + '><span class="nws-cod">' + sg.id + '</span><div class="nws-grow"><b>' + sg.label + '</b><span class="nws-txt' + cls + '">' + estado + '</span></div></li>';
        }).join('');
        return bloque('Señales por ítem', '<ul class="nws-sns">' + filas + '</ul>', '<span class="nws-txt"><b>' + v.cobertura + '</b> de 8</span>');
      }
      function garantias(v, s) {
        var ya = v.turnos.length > 0;
        var g = [
          ['Detección de crisis', v.crisis ? 'Activada' : (ya ? 'Vigilando' : 'En espera'), v.crisis ? 'negative' : (ya ? 'positive' : 'neutral')],
          ['Acción por protocolo institucional', ya ? 'Aplicado' : 'En espera', ya ? 'positive' : 'neutral'],
          ['La evaluación solo sube', ya ? 'Respetado' : 'En espera', ya ? 'positive' : 'neutral']
        ];
        return bloque('Garantías de seguridad', '<ul class="nws-gar">' + g.map(function (x) { return '<li><span>' + x[0] + '</span>' + S.badge({ label: x[1], theme: x[2], variant: 'quiet', size: 'small' }) + '</li>'; }).join('') + '</ul>');
      }
      function modelo() {
        return bloque('Modelo e instrumento', '<dl class="nws-def"><div><dt>Reglas de evaluación</dt><dd>Preliminares · 2026.1</dd></div><div><dt>Cuestionario institucional</dt><dd>Versión 2026.06</dd></div><div><dt>Protocolo de seguridad</dt><dd>Versión 2026.1</dd></div></dl>');
      }
      function vacio() {
        return '<div class="nws-vacio-sl">' + S.emptyState({ illustration: '<span class="nws-vacio-sl__ic">' + S.icon('answer') + '</span>', title: 'Reproduce el onboarding de este caso', description: 'Verás turno a turno lo que escribe el estudiante, lo que interpreta SerafIA, el nivel que sube y la alerta con su porqué.', actionLabel: 'Reproducir onboarding' }) +
          '<div class="nws-trio"><div><b>Cuestionario institucional</b><span class="nws-txt">Guía la conversación y se salta lo que ya se respondió.</span></div><div><b>Detección de crisis</b><span class="nws-txt">Revisa cada mensaje antes que cualquier modelo.</span></div><div><b>Una persona decide</b><span class="nws-txt">Ninguna acción sin el equipo de bienestar.</span></div></div></div>';
      }

      /* ---------- pintar ---------- */

      /* ---------- caso como bandeja de correo: lista a la izquierda, resumen arriba y chat abajo ---------- */
      function listaCasos() {
        var ok = Object.keys(fNiv).filter(function (k) { return fNiv[k]; });
        var orden = CASOS.filter(function (c) { return !ok.length || ok.indexOf(c.nivel) >= 0; }).sort(function (x, y) { return C.NIVELES.indexOf(y.nivel) - C.NIVELES.indexOf(x.nivel); });
        var chips = '<button type="button" class="nws-fchip' + (!ok.length ? ' nws-fchip--on' : '') + '" data-fniv="todos">Todos</button>' + ORDEN_NV.map(function (n) {
          var k = CASOS.filter(function (c) { return c.nivel === n; }).length;
          return '<button type="button" class="nws-fchip nws-lv--' + n + (fNiv[n] ? ' nws-fchip--on' : '') + '" data-fniv="' + n + '" aria-pressed="' + (!!fNiv[n]) + '" aria-label="Nivel ' + NIVEL[n].label + ', ' + k + ' casos">' + NIVEL[n].label + ' <small>' + k + '</small></button>'; }).join('');
        return '<header class="nws-mcl__h"><h1>Mis casos</h1><span class="nws-txt nws-mcl__cnt">' + orden.length + ' de ' + CASOS.length + '</span>' + S.iconButton({ icon: colapsada ? 'arrow-right' : 'arrow-left', variant: 'mute', theme: 'neutral', size: 'medium', label: colapsada ? 'Ampliar la lista de casos' : 'Colapsar la lista de casos', cls: 'nws-mcl__tg', attrs: { 'data-d': 'lista' } }) + '</header>' +
          '<div class="nws-fchips nws-mcl__f nws-slider" role="group" aria-label="Filtrar por nivel">' + chips + '</div><div class="nws-mcl__l nws-scroll">' +
          (orden.length ? orden.map(function (c) {
            return '<button type="button" class="nws-mc nws-lv--' + c.nivel + (c.id === sel ? ' nws-mc--on' : '') + '" data-caso="' + c.id + '" aria-current="' + (c.id === sel) + '" title="' + c.nombre + ' (' + c.est + ') · ' + c.programa + ' · ' + NIVEL[c.nivel].label + '"><span class="nws-mc__av" aria-hidden="true">' + c.est.slice(-3) + '</span>' +
              '<span class="nws-mc__t"><b>' + c.nombre + '</b><small>' + c.programa + ' · ' + c.hace + ' · ' + (estadoDe(c) === 'Sin atender' ? '<em>Sin atender</em>' : estadoDe(c)) + '</small></span>' + nivelBadge(c.nivel, true) + '</button>';
          }).join('') : vacioEs('search', 'Ningún caso en este nivel')) + '</div>';
      }
      function anillo(p, lv, txt) {
        return '<span class="nws-ring nws-lv--' + lv + '" style="--p:' + p + '" role="img" aria-label="' + p + '%"><b>' + (txt != null ? txt : p + '<small>%</small>') + '</b></span>';
      }
      function resumenFilas(v, c, live) {
        var n = live ? (v.nivel || 'ninguna') : c.nivel, a = live ? (v.accion || 'acompanar') : c.accion, na = alertasDe(c, live, C.estado()).filter(function (a) { return !a.ok; }).length, cob = live ? v.cobertura : c.cob;
        var d = function (l, val, cls) { return '<div class="nws-rs"><span>' + l + '</span><b' + (cls ? ' class="' + cls + '"' : '') + '>' + val + '</b></div>'; };
        return '<div class="nws-rss">' + d('Nivel del caso', '<i class="nws-lv--' + n + '"></i>' + NIVEL[n].label + (estadoDe(c) === 'Sin atender' ? S.badge({ label: 'Sin atender', theme: 'negative', variant: 'quiet', size: 'small' }) : ''), 'nws-rs__nv') + d('Qué hacer', ACCION[a].label) + d('Alertas sin atender', String(na)) + d('Preguntas respondidas', cob + ' de 8') + '</div>';
      }
      /* ---------- gestión de alertas e historial del estudiante ---------- */
      function alertasDe(c, live, s) {
        var tr = G[c.gid].turnos, n = live ? s.hechos : tr.length, out = [];
        tr.slice(0, n).forEach(function (t, i) { if (t.alerta) { out.push({ n: i + 1, nivel: t.nivel, accion: t.accion, cita: t.estudiante, ok: alertasOk[c.id + ':' + (i + 1)] || null }); } });
        return out;
      }
      function alertasBloque(c, live, s) {
        var al = alertasDe(c, live, s); if (!al.length) { return ''; }
        var abiertas = al.filter(function (a) { return !a.ok; }).length;
        var filas = abiertoAl ? '<ul class="nws-aw__l">' + al.slice().reverse().map(function (a) {
          return '<li><div class="nws-aw__t">' + S.badge({ label: ACCION[a.accion].label, icon: NIVEL[a.nivel].icon, theme: NIVEL[a.nivel].tema, variant: 'quiet', size: 'small' }) + '<span class="nws-txt">Mensaje ' + a.n + '</span></div>' +
            '<p class="nws-aw__q">“' + esc(a.cita) + '”</p>' +
            (a.ok ? '<span class="nws-aw__ok">' + S.icon('positive') + 'Atendida · ' + a.ok + '</span>' : S.button({ label: 'Marcar como atendida', variant: 'quiet', theme: 'neutral', size: 'small', attrs: { 'data-d': 'alerta:' + a.n } })) + '</li>';
        }).join('') + '</ul>' : '';
        return '<section class="nws-aw"><button type="button" class="nws-aw__h" data-d="alertas-toggle" aria-expanded="' + abiertoAl + '"><b>Alertas del caso</b><span>' +
          (abiertas ? S.badge({ label: abiertas + ' sin atender', theme: 'negative', variant: 'quiet', size: 'small' }) : S.badge({ label: 'Todas atendidas', theme: 'positive', variant: 'quiet', size: 'small' })) +
          '</span><span class="nws-aw__c">' + (abiertoAl ? 'Ocultar' : 'Gestionar') + S.icon(abiertoAl ? 'chevron-up' : 'chevron-down') + '</span></button>' + filas + '</section>';
      }
      function historialVista(c, live, s) {
        var ev = [];
        (c.historial || []).forEach(function (h) { ev.push({ cuando: h.cuando, texto: h.texto, por: h.por, previo: true }); });
        alertasDe(c, live, s).forEach(function (a) { ev.push({ cuando: 'Hoy', texto: 'Alerta en el mensaje ' + a.n + ' · ' + ACCION[a.accion].label + (a.ok ? ' · atendida a las ' + a.ok : ' · sin atender'), por: 'SerafIA', alerta: !a.ok }); });
        ((bit[c.id] || {}).ev || []).forEach(function (e) { ev.push({ cuando: 'Hoy · ' + e.h, texto: e.t, por: 'Tú' }); });
        var ultima = ev.filter(function (e) { return e.por !== 'SerafIA'; }).slice(-1)[0];
        return '<div class="nws-hv"><p class="nws-hv__r">' + (ultima ? '<b>Última acción del equipo:</b> ' + esc(ultima.texto) + ' <span class="nws-txt">(' + esc(ultima.cuando) + ')</span>' : '<b>Aún no hay acciones del equipo en este caso.</b>') + '</p>' +
          '<ol class="nws-hv__l">' + ev.map(function (e) { return '<li' + (e.alerta ? ' class="nws-hv__a"' : '') + '><span class="nws-hv__w">' + esc(e.cuando) + '</span><div><b>' + esc(e.texto) + '</b><small>' + esc(e.por) + '</small></div></li>'; }).join('') + '</ol></div>';
      }
      function selectorVista() {
        return '<div class="nws-mcr__vt"><div class="nws-seg2" role="tablist" aria-label="Vista del caso">' + [['resumen', 'Resumen'], ['detalle', 'Detalle']].map(function (m) {
          return '<button type="button" role="tab" aria-selected="' + (modo === m[0]) + '" class="' + (modo === m[0] ? 'on' : '') + '" data-modo="' + m[0] + '">' + m[1] + '</button>';
        }).join('') + '</div></div>';
      }
      function cabCaso(c, live) {
        var n = live && C.vista().nivel ? C.vista().nivel : c.nivel;
        return '<header class="nws-mcr__h">' +
          '<div class="nws-mcr__t"><h1>' + c.nombre + '</h1><span class="nws-mcr__sub">' + c.programa + ' · ' + c.sem + '</span>' +
          '<div class="nws-mcr__m"><span class="nws-txt">Caso ' + c.id + ' · código ' + c.est + ' · ' + c.hace + '</span></div></div>' +
          '<span class="nws-grow"></span>' + S.iconButton({ icon: 'download', variant: 'mute', theme: 'neutral', size: 'large', label: 'Descargar informe', attrs: { 'data-d': 'informe' } }) +
          '</header>';
      }
      /* el chat tal como se ve en la app del estudiante; las alertas cuelgan del mensaje que las causó */
      function hilo(v, c, s, live) {
        var g = G[c.gid], n = live ? s.hechos : g.turnos.length, tr = g.turnos.slice(0, n), out = '';
        function par(t) { return String(t || '').split(/\\n|\n/).filter(function (x) { return x.trim(); }).map(function (x) { return '<p class="nws-msg">' + esc(x) + '</p>'; }).join(''); }
        tr.forEach(function (t, i) {
          var d = SEN.filter(function (sg) { return sg.id === t.item; })[0];
          out += '<div class="nws-th__t"><span class="nws-mono">Mensaje ' + (i + 1) + '</span></div><p class="nws-msg nws-msg--yo">' + resaltar(t.estudiante, t.crisis) + '</p>' +
            (t.alerta ? '<div class="nws-flag" style="--nv:var(--nws-nv-' + t.nivel + ')">' + S.badge({ label: ACCION[t.accion].label, icon: NIVEL[t.nivel].icon, theme: NIVEL[t.nivel].tema, variant: 'quiet', size: 'small' }) + '<span class="nws-txt">' + (d ? d.label + ' · ' : '') + 'Nivel ' + NIVEL[t.nivel].label + '</span></div>' : '') +
            '<div class="nws-th__s"><span class="nws-orbe nws-orbe--sm"></span><div>' + par(t.serafia) + '</div></div>';
        });
        if (live && (s.fase === 'estudiante' || s.fase === 'escribiendo') && g.turnos[s.hechos]) {
          out += '<div class="nws-th__t"><span class="nws-mono">Mensaje ' + (s.hechos + 1) + '</span></div><p class="nws-msg nws-msg--yo">' + esc(g.turnos[s.hechos].estudiante) + '</p>' +
            (s.fase === 'escribiendo' ? '<div class="nws-th__s"><span class="nws-orbe nws-orbe--sm"></span><div class="nws-typing"><i></i><i></i><i></i></div></div>' : '');
        }
        return '<div class="nws-th" id="hilo">' + out + '</div>';
      }
      function informe(c) {
        var g = G[c.gid], filas = g.turnos.map(function (t, i) {
          return '<tr><td>T' + (i + 1) + '</td><td>' + esc(t.estudiante) + '</td><td>' + NIVEL[t.nivel].label + '</td><td>' + ACCION[t.accion].label + '</td></tr>';
        }).join('');
        var html = '<!doctype html><meta charset="utf-8"><title>Informe ' + c.id + '</title><style>body{font:14px/1.5 Inter,system-ui,sans-serif;max-width:760px;margin:32px auto;color:#282834}h1{font-size:22px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #e7e9f3;padding:8px;text-align:left;vertical-align:top}small{color:#6b6e85}</style>' +
          '<h1>Informe del caso ' + c.id + '</h1><p><b>' + c.nombre + '</b> (código ' + c.est + ') · ' + c.programa + ' · ' + c.sem + '<br>Nivel: <b>' + NIVEL[c.nivel].label + '</b> · Acción sugerida: <b>' + ACCION[c.accion].label + '</b> · Estado: ' + estadoDe(c) + '</p>' +
          '<table><tr><th>Turno</th><th>Mensaje del estudiante</th><th>Nivel</th><th>Acción</th></tr>' + filas + '</table><p><small>Documento de demostración. Una persona del equipo decide; el nivel solo sube.</small></p>';
        try {
          var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'informe-' + c.id + '.html';
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        } catch (e) { /* sin descarga en este visor: queda el aviso */ }
        ctx.toast({ title: 'Informe listo', message: 'Informe del caso ' + c.id + ' descargado' });
      }


      /* ---------- panel «Guiones» igual que en la app del estudiante: elige el guion y muestra el resultado esperado ---------- */
      function panelGuiones() {
        var s = C.estado(), c = casoPorId(sel), g = G[c.gid], ex = g.esperado, v = NIVEL[ex.nivel], a = ACCION[ex.accion];
        var lista = C.ORDEN.map(function (id) {
          var on = id === c.base;
          return '<button type="button" class="nws-dp__op' + (on ? ' nws-dp__op--on' : '') + '" data-guion="' + id + '" aria-pressed="' + on + '"><span class="nws-dp__dot nws-dp__dot--' + G[id].color + '"></span><span>' + esc(G[id].titulo) + '</span>' + (on ? S.icon('positive') : '') + '</button>';
        }).join('');
        var ocupado = s.fase === 'estudiante' || s.fase === 'escribiendo', t = C.total(), dots = '';
        for (var i = 0; i < t; i++) { dots += '<i class="' + (i < s.hechos ? 'on' : '') + '"></i>'; }
        var ctl = '<div class="nws-dp__ctl">' +
          S.iconButton({ icon: s.playing ? 'pause-filled' : 'play-filled', variant: 'loud', theme: 'secondary', size: 'large', label: s.playing ? 'Pausar' : (C.terminado() ? 'Repetir' : 'Reproducir'), attrs: { 'data-p': 'play' } }) +
          S.iconButton({ icon: 'arrow-right', variant: 'mute', theme: 'neutral', size: 'large', label: 'Siguiente turno', disabled: ocupado || s.playing, attrs: { 'data-p': 'next' } }) +
          S.iconButton({ icon: 'refresh', variant: 'mute', theme: 'neutral', size: 'large', label: 'Reiniciar el guion', attrs: { 'data-p': 'reset' } }) + '</div>';
        return '<div class="nws-dp' + (s.abierto ? '' : ' nws-dp--cerrado') + '">' +
          '<div class="nws-dp__hd">' + S.badge({ label: 'DEMO', theme: 'warning', variant: 'loud', size: 'small', cls: 'nws-mono' }) + '<span class="nws-dp__t">Guiones</span><span class="nws-grow"></span>' +
            '<button type="button" class="nws-dp__estado" data-p="toggle" aria-expanded="' + s.abierto + '">' + C.estadoTxt() + S.icon('chevron-down') + '</button></div>' +
          '<div class="nws-dp__cuerpo"><div class="nws-dp__lista">' + lista + '</div>' +
            '<div class="nws-dp__res"><p class="nws-txt">Resultado esperado</p><div class="nws-dp__chips">' + nivelBadge(ex.nivel) +
              S.badge({ label: a.label, icon: 'caution', theme: v.tema, variant: 'quiet', size: 'medium' }) + '</div></div>' +
            '<label class="nws-dp__sw"><span>Ver cómo razona el sistema<small>Solo para explicar la demo</small></span><div class="nwt-switch' + (s.detalle ? ' nwt-switch--checked' : '') + '" role="switch" aria-checked="' + s.detalle + '" tabindex="0" data-p="detalle" nwt-theme="secondary"><div class="nwt-switch__component"><div class="nwt-switch__component__element"></div></div></div></label></div>' +
          '<div class="nws-dp__ft">' + ctl + '<div class="nws-dp__turno"><span class="nws-mono">Turno ' + s.hechos + '/' + t + '</span><span class="nws-dp__dots" aria-hidden="true">' + dots + '</span></div></div></div>';
      }
      var jugando = false;

      function pintar() {
        var s = C.estado(), v = C.vista();
        var sala = $('sala'), top = sala.scrollTop, gb = $('gbar');
        var live = vista === 'caso' && (s.hechos > 0 || s.fase === 'estudiante' || s.fase === 'escribiendo');
        /* el encabezado se pinta una sola vez (así el selector de rol no se reanima); solo cambia el estado del caso */
        if (!cabPrev) { $('cab').innerHTML = cabecera(); cabPrev = 1; ctx.posicionarIndicadores(root); }
        $('cabst').innerHTML = vista === 'caso' ? (live ? S.badge({ label: 'En vivo', icon: 'point', theme: 'positive', variant: 'quiet', size: 'medium', cls: 'nwt-badge--pulse' }) : S.badge({ label: 'En espera', theme: 'neutral', variant: 'quiet', size: 'medium' })) : '';
        if (vista === 'resumen') {
          sala.innerHTML = resumen(); gb.innerHTML = ''; $('gpanel').innerHTML = '';
        } else {
          var c = casoPorId(sel), started = live && v.ultimo;
          /* el caso ya existe: sin reproducir se ve su estado actual completo; al reproducir se arma turno a turno */
          var tot = C.total(), vv = live ? v : C.vista(tot);
          var ss = live ? s : Object.assign({}, s, { hechos: tot, fase: 'listo', playing: false, finForzado: true });
          estatico = !live;
          var hay = !!vv.ultimo;
          var crisis = vv.crisis ? '<div class="nws-crisis" role="alert"><span class="nws-crisis__ic">' + S.icon('attention') + '</span><div><b>Atención inmediata</b><p>“' + resaltar(vv.extractoCrisis, vv.spans) + '”</p></div>' +
            S.badge({ label: 'Escalamiento inmediato', theme: 'negative', variant: 'loud', size: 'medium' }) + '</div>' : '';
          var idle = !live ? '<div class="nws-ib-idle">' + S.button({ label: 'Reproducir onboarding', icon: 'play-filled', variant: 'loud', theme: 'secondary', size: 'medium', attrs: { 'data-d': 'reproducir' } }) +
            '<span class="nws-txt">Estado actual del caso. Repite la conversación turno a turno con ▶</span></div>' : '';
          var cuerpo;
          var fijo = crisis + (hay ? panelDecision(vv, ss, true) : '');
          if (modo === 'resumen') { cuerpo = idle + '<div class="nws-ib-th">' + hilo(v, c, s, live) + '</div>'; }
          else { cuerpo = crisis + idle + (hay ? '<div class="nws-sala__cols"><div class="nws-sala__c2">' + (s.detalle ? pasos(vv, ss) : '') + caso(vv, ss) + '</div><div class="nws-sala__c3">' + senales(vv, ss) + garantias(vv, ss) + (s.detalle ? modelo() : '') + '</div></div>' : vacioEs('answer', 'Esperando el primer mensaje del estudiante')); }
          var secChat = '';
          var derecha = '<section class="nws-mcr">' + cabCaso(c, started) + '<div class="nws-mcr__main' + (modo === 'resumen' ? ' nws-mcr__main--chat' : ' nws-scroll') + '" id="ibmain">' + resumenFilas(v, c, live) + selectorVista() + (modo === 'resumen' ? fijo + secChat + '<div class="nws-mcr__chat nws-scroll" id="ibchat">' + cuerpo + '</div>' : cuerpo) + '</div></section>';
          var cajaPrev = sala.querySelector('.nws-mcw');
          if (cajaPrev && sala.querySelector('.nws-mcl')) {
            var lp = sala.querySelector('.nws-mcl__l'), lt = lp ? lp.scrollTop : 0;
            cajaPrev.classList.toggle('nws-mcw--col', colapsada);
            sala.querySelector('.nws-mcl').innerHTML = listaCasos();
            var lp2 = sala.querySelector('.nws-mcl__l'); if (lp2) { lp2.scrollTop = lt; }
            sala.querySelector('.nws-mcr').outerHTML = derecha;
          } else {
            sala.innerHTML = '<div class="nws-mcw' + (colapsada ? ' nws-mcw--col' : '') + '"><aside class="nws-mcl" aria-label="Mis casos">' + listaCasos() + '</aside>' + derecha + '</div>';
          }
          if (animarDerecha) { var mr = sala.querySelector('.nws-mcr__main'); if (mr) { mr.classList.add('nws-mcr__main--in'); } animarDerecha = false; }

          var mm = $('ibchat'); if (mm && started) { mm.scrollTop = mm.scrollHeight; }
          gb.innerHTML = '';
          if (s.playing && !jugando) { s.abierto = false; }
          if ((s.playing && !jugando) || (s.hechos === 0 && prevH > 0)) { Object.keys(alertasOk).forEach(function (k) { if (k.indexOf(sel + ':') === 0) { delete alertasOk[k]; } }); }
          prevH = s.hechos;
          jugando = s.playing;
          $('gpanel').innerHTML = panelGuiones();
        }
        if (vista === 'resumen') { sala.scrollTop = top; }
        sala.classList.toggle('nws-sala__body--ib', vista === 'caso');
        [].slice.call(root.querySelectorAll('.nws-side__it[data-nav]')).forEach(function (bt) { var on = bt.getAttribute('data-nav') === (vista === 'caso' ? 'casos' : 'resumen'); bt.classList.toggle('nws-side__it--on', on); if (on) { bt.setAttribute('aria-current', 'page'); } else { bt.removeAttribute('aria-current'); } });
        ctx.posicionarIndicadores(root);
      }
      function abrir(id) { var c = casoPorId(id); if (!c) { return; } sel = id; vista = 'caso'; tab = 'evidencia'; modo = 'resumen'; colapsada = false; C.seleccionar(c.gid); C.estado().abierto = true; jugando = false; $('sala').scrollTop = 0; pintar(); }
      function volver() { vista = 'resumen'; sel = null; $('sala').innerHTML = ''; C.salirDelModo(); pintar(); }

      function onClick(ev) {
        var cs = ev.target.closest('[data-caso]');
        if (cs) { abrir(cs.getAttribute('data-caso')); return; }
        var an = ev.target.closest('[data-abrirnv]');
        if (an) { var pri = CASOS.filter(function (c) { return c.nivel === an.getAttribute('data-abrirnv'); })[0]; if (pri) { abrir(pri.id); } return; }
        var nv = ev.target.closest('[data-fniv]');
        if (nv) { var k0 = nv.getAttribute('data-fniv'); var yaOn = fNiv[k0]; fNiv = {}; if (k0 !== 'todos' && !yaOn) { fNiv[k0] = true; } pintar(); return; }
        var fe = ev.target.closest('[data-fest]');
        if (fe) { fEst = fe.getAttribute('data-fest'); pintar(); return; }
        var nav = ev.target.closest('[data-nav]');
        if (nav) { if (nav.getAttribute('data-nav') === 'casos') { abrir(sel || CASOS.slice().sort(function (x, y) { return C.NIVELES.indexOf(y.nivel) - C.NIVELES.indexOf(x.nivel); })[0].id); } else { volver(); } return; }
        var gu = ev.target.closest('[data-guion]');
        if (gu) { var bid = gu.getAttribute('data-guion'), actual = casoPorId(sel); if (actual && actual.base === bid) { return; } var cand = CASOS.filter(function (c) { return c.base === bid; }).sort(function (x, y) { return C.NIVELES.indexOf(y.nivel) - C.NIVELES.indexOf(x.nivel); })[0]; if (cand) { abrir(cand.id); } return; }
        var md = ev.target.closest('[data-modo]');
        if (md) { modo = md.getAttribute('data-modo'); colapsada = modo === 'detalle'; animarDerecha = true; pintar(); return; }
        var tb = ev.target.closest('[data-tab]');
        if (tb) { tab = tb.getAttribute('data-tab'); pintar(); return; }
        var d = ev.target.closest('[data-d]');
        if (d) {
          var k = d.getAttribute('data-d');
          if (k === 'volver') { volver(); }
          else if (k === 'lista') { colapsada = !colapsada; pintar(); }
          else if (k === 'alertas-toggle') { abiertoAl = !abiertoAl; pintar(); }
          else if (k.indexOf('selal:') === 0) { var kk = sel + ':' + k.slice(6); if (marc[kk]) { delete marc[kk]; } else { marc[kk] = true; } pintar(); }
          else if (k === 'selal-ninguna' || k === 'selal-todas') { var vv2 = C.estado().hechos > 0 ? C.vista() : C.vista(C.total()); abiertasDe(sel, vv2).forEach(function (al2) { if (k === 'selal-ninguna') { delete marc[sel + ':' + al2.turno]; } else { marc[sel + ':' + al2.turno] = true; } }); pintar(); }
          else if (k === 'ver-ate') { verAte = !verAte; pintar(); }
          else if (k.indexOf('alerta:') === 0) { var nn = k.slice(7), hh = ahora(); alertasOk[sel + ':' + nn] = hh; registrar('Alerta del mensaje ' + nn + ' marcada como atendida'); pintar(); }
          else if (k === 'contactar') { var cc = casoPorId(sel); if (C.estado().decision) { registrar('Contacto con ' + cc.nombre + ' registrado', 'contacto'); } ctx.toast({ title: 'Contacto registrado', message: 'Se abrió el mensaje a ' + cc.nombre + ' y queda anotado en el caso' }); if (C.estado().decision) { pintar(); } }
          else if (k === 'protocolo') { var cp = casoPorId(sel); registrar('Protocolo de crisis activado', 'proto'); ctx.toast({ title: 'Protocolo activado', message: 'Se avisó a la ruta institucional por el caso de ' + cp.nombre }); pintar(); }
          else if (k === 'informe') { if (sel) { informe(casoPorId(sel)); } else { ctx.toast({ title: 'Informe listo', message: 'Informe general de casos descargado' }); } }
          else if (k === 'reproducir') { C.reproducir(); }
          else if (k === 'confirmar') { aplicarDecision('Confirmada', (C.estado().hechos > 0 ? C.vista() : C.vista(C.total())).accion); }
          else if (k === 'ajustar') { ajusteSel = null; motivoSel = null; C.ajustando(true); pintar(); }
          else if (k === 'cancelar') { ajusteSel = null; motivoSel = null; C.ajustando(false); }
          else if (k.indexOf('ajuste:') === 0) { ajusteSel = k.slice(7); motivoSel = null; pintar(); }
          else if (k.indexOf('motivo:') === 0) { motivoSel = MOTIVOS[+k.slice(7)]; pintar(); }
          else if (k === 'guardar-ajuste') { if (ajusteSel && motivoSel) { aplicarDecision('Ajustada', ajusteSel, motivoSel); } }
          return;
        }
        if (ev.target.closest('.nwt-empty-state__action')) { C.reproducir(); }
      }

      var quitarRol = C.enlazarRol(root, ctx.ir), quitarPanel = C.enlazar(root), off = C.on(pintar);
      root.addEventListener('click', onClick);
      function onKey(ev) { var t = ev.target.closest && ev.target.closest('[data-fniv][role=button]'); if (t && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); var k0 = t.getAttribute('data-fniv'); fNiv[k0] = !fNiv[k0]; pintar(); } }
      root.addEventListener('keydown', onKey);
      pintar();
      return function () { off(); quitarRol(); quitarPanel(); root.removeEventListener('click', onClick); root.removeEventListener('keydown', onKey); };
    }
  };
})();
