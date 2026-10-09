/**
 * SerafIA · app del estudiante, dentro del marco de teléfono. ALTA FIDELIDAD.
 *
 * Mismo escenario que la plantilla de la app JIN (landing-app-intercolegiados):
 * toolbar de Naowee + zoom + teléfono de 428×926 que se encoge para caber.
 * Esta es la versión 1 del demo en HTML (home + vistas completas + chat).
 *
 * Estilos y tokens: SOLO sdk-frontend-foundations (vendor/) y la capa --nws-*
 * de app.css, que apunta a esos tokens. Componentes: los del SDK (sdk.js:
 * Button, IconButton, Avatar, AvatarIcon, Badge, Tag, Progress, Divider,
 * ViewIndicator, Searchbox, Switch, BottomSheet). NO EXISTEN EN EL SDK y se
 * componen con tokens (nws-*): la píldora de navegación flotante, el botón de
 * chat (FAB), la carta del día y el barajeo, el banner de eventos, el mapa.
 * Documentación del sistema: ../Estilos/ESTILOS.md
 *
 * Reglas del producto: el chat está siempre presente (FAB en toda vista),
 * "Ayuda ahora" siempre a un toque, el estudiante nunca ve niveles ni puntajes.
 * Lo que aún no existe responde "Disponible próximamente" (data-toast).
 */
window.PANTALLAS = window.PANTALLAS || {};
window.PANTALLAS['inicio'] = (function () {

  var ANCHO = 428, ALTO = 926, BORDE = 12;
  /* tamaños de dispositivo de la demo: móvil (el de siempre), tablet y tablet grande (vertical) */
  var DISPS = { movil: { w: 428, h: 926, n: 'Móvil' }, tablet: { w: 820, h: 1180, n: 'Tablet' }, 'tablet-xl': { w: 1366, h: 1024, n: 'Tablet grande' } };
  var DISP = 'movil';

  /* ilustraciones de las cartas y tokens de color: arte.js (compartido con ../Estilos/estilos.html) */
  var ARTE = window.SERAFIA_ARTE.defs, F = window.SERAFIA_ARTE.F, K = window.SERAFIA_ARTE.K;

  function arte(n, px) { return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 100 100" aria-hidden="true"><use href="#art-' + n + '"/></svg>'; }
  function chispa(px, style) { return '<svg class="nws-spark" width="' + px + '" height="' + px + '" viewBox="0 0 24 24" aria-hidden="true" style="' + style + '"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor"/></svg>'; }
  var QR = '<svg viewBox="0 0 21 21" aria-label="Código QR del carnet" role="img" ' + F('gray-900') + '><path d="M0 0h7v7H0z M14 0h7v7h-7z M0 14h7v7H0z M2 2h3v3H2z M16 2h3v3h-3z M2 16h3v3H2z" fill-rule="evenodd"/><path d="M9 0h2v2H9z M9 4h3v2H9z M8 8h2v2H8z M12 8h3v2h-3z M16 9h2v3h-2z M9 12h2v2H9z M12 13h3v2h-3z M9 16h3v2H9z M14 17h2v3h-2z M18 14h3v2h-3z M18 18h3v3h-3z M11 19h2v2h-2z"/></svg>';

  /* ---------- helpers de SDK ---------- */
  function barraEstado(S, hora) {
    return S.h('div', { class: 'nws-mob__status nwt-smalltext-font-semibold', 'aria-hidden': 'true' },
      S.h('span', null, hora),
      S.h('div', { class: 'nws-mob__status__r' },
        S.h('span', { class: 'nws-mob__status__sig' }, '<i></i><i></i><i></i><i></i>'),
        S.h('span', { class: 'nws-mob__status__bat' })));
  }
  function conmutador(on, accion, label) {
    return '<div class="nwt-switch' + (on ? ' nwt-switch--checked' : '') + '" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" aria-label="' + label + '" tabindex="0" data-a="' + accion + '" nwt-theme="secondary"><div class="nwt-switch__component"><div class="nwt-switch__component__element"></div></div></div>';
  }

  return {
    fullscreen: true,
    estable: true,
    titulo: 'SerafIA',

    render: function (ctx) {
      var S = ctx.S, rol = ctx.rol, D = ctx.D.demo;
      return S.h('div', { class: 'nws-col', style: 'height:100%;background:var(--naotech-app-color-100)' },
        window.CASO.toolbar(S, 'estudiante', '<div class="nws-dispsw" role="radiogroup" aria-label="Dispositivo">' + Object.keys(DISPS).map(function (k) {
          var d = DISPS[k];
          return '<button type="button" role="radio" aria-checked="' + (k === DISP) + '" class="nws-dsp' + (k === DISP ? ' on' : '') + '" data-seg="' + k + '"><span class="nws-dsp__g nws-dsp__g--' + k + '" aria-hidden="true"></span><span class="nws-dsp__t"><b>' + d.n + '</b><small>' + d.w + ' px</small></span></button>';
        }).join('') + '</div>'),
        S.h('div', { class: 'nws-phone-stage', id: 'stage' },
          S.h('div', { class: 'nws-dpanel', id: 'dpanel' }),
          S.h('div', { class: 'nws-phone-zoom' },
            S.iconButton({ icon: 'zoom-out', size: 'small', variant: 'mute', theme: 'neutral', label: 'Alejar', attrs: { 'data-zoom': 'out' } }),
            S.iconButton({ icon: 'refresh', size: 'small', variant: 'mute', theme: 'neutral', label: 'Ajustar al espacio disponible', attrs: { 'data-zoom': 'fit' } }),
            S.iconButton({ icon: 'zoom-in', size: 'small', variant: 'mute', theme: 'neutral', label: 'Acercar', attrs: { 'data-zoom': 'in' } }),
            S.iconButton({ icon: 'return', size: 'small', variant: 'mute', theme: 'neutral', label: 'Reiniciar el demo', attrs: { 'data-reset': true } })),
          S.h('div', { class: 'nws-phone nws-phone--demo', id: 'phone', 'data-disp': DISP, style: 'width:' + DISPS[DISP].w + 'px;height:' + DISPS[DISP].h + 'px', 'nwt-theme': rol.theme },
            S.h('div', { class: 'nws-phone__screen nws-demo nws-demo--' + DISP, id: 'mob' },
              ARTE,
              barraEstado(S, D.hora),
              S.h('div', { id: 'hd' }),
              S.h('div', { id: 'tab', style: 'flex:1;min-height:0;display:flex;flex-direction:column' }),
              S.h('div', { id: 'dock' }),
              S.h('div', { id: 'ov' }),
              S.h('div', { id: 'sheet' }),
              S.h('div', { id: 'mob-toast', class: 'nws-mob__toast' }),
              S.h('div', { class: 'nws-demo__home' })))));
    },

    /* Geometría, no dato: el marco mide (428+24)×(926+24) y se encoge para
       caber en el escenario. Corre en las dos pasadas del router. */
    ajustar: function (root, ctx, mult) {
      var stage = root.querySelector('#stage'), phone = root.querySelector('#phone');
      if (!stage || !phone) { return; }
      var r = stage.getBoundingClientRect();
      var dv = DISPS[DISP], fit = Math.min((r.width - 48) / (dv.w + BORDE * 2), (r.height - 48) / (dv.h + BORDE * 2), 1);
      phone.style.transform = 'scale(' + (fit * (mult || 1)).toFixed(3) + ')';
    },

    mount: function (root, ctx) {
      var self = this, S = ctx.S, D = ctx.D.demo, E = D.estudiante;
      var mob = root.querySelector('#mob');
      var $ = function (id) { return mob.querySelector('#' + id); };
      var timers = [];
      function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
      function clearT() { timers.forEach(clearTimeout); timers = []; }

      /* ---------- estado ---------- */
      function nuevo() {
        return { tab: 'hoy', mood: null, feat: 0, enrolled: {}, saved: {}, evFil: 'todos', notif: { n1: true, n2: true, n3: true }, ctx: false,
                 ov: null, enter: false, nav: false, dia: 'mar', dstage: 'shuffle', dsel: null, sheet: false, msgs: [], typing: false, opts: [], tmp: '' };
      }
      var st = nuevo();
      var carta = function (n) { return D.cartas[n - 1]; };

      /* ---------- botones SDK ---------- */
      function btn(label, a, o) {
        o = o || {};
        return S.button({ label: label, theme: o.theme || 'neutral', variant: o.variant || 'loud', size: o.size || 'medium', icon: o.icon, iconEnd: o.iconEnd, disabled: o.disabled, cls: o.cls,
          attrs: o.toast ? { 'data-toast': o.toast } : { 'data-a': a } });
      }
      function atras(titulo) {
        return '<div class="nws-ov__hd">' +
          S.iconButton({ icon: 'arrow-left', variant: 'mute', theme: 'neutral', size: 'large', label: 'Volver', attrs: { 'data-a': 'ov-close' } }) +
          '<h1 class="nws-h2 nws-grow" style="text-align:center">' + titulo + '</h1>' + ayuda() + '</div>';
      }
      function ayuda(corto) {
        return '<span class="nws-ayuda">' + S.button({ label: corto ? 'Ayuda' : 'Ayuda ahora', icon: 'favorite', theme: 'negative', variant: 'quiet', size: 'medium', attrs: { 'data-a': 'ayuda' } }) + '</span>';
      }
      function fabMini() {
        if (st.ov !== 'cartas') { return ''; }
        return '<button class="nws-fab nws-fab--mini" data-a="sheet-open" aria-label="Hablar con SerafIA">' + S.icon('answer') + '</button>';
      }

      /* ---------- encabezado ---------- */
      function pintarHd() {
        var t = st.tab, sub = '';
        if (t === 'hoy') {
          var pin = st.mood ? '<span class="nws-pin nws-carta" data-c="' + carta(st.mood).color + '" style="border-width:1px;width:32px;height:32px" role="img" aria-label="Carta de hoy: ' + carta(st.mood).nombre + '">' + arte(st.mood, 24) + '</span>' : '';
          sub = '<div class="nws-hd__sub"><span class="nws-mono-over">' + D.fecha + '</span><h1 class="nws-h1 nws-hd__hi">Hola, ' + E.corto + pin + '</h1></div>';
        } else {
          var titulos = { servicios: 'Servicios', campus: 'Campus', yo: 'Yo' };
          sub = '<div class="nws-hd__sub"><h1 class="nws-h1">' + titulos[t] + '</h1></div>';
        }
        $('hd').innerHTML = '<div class="nws-hd"><div class="nws-hd__top"><div class="nws-logo"><span class="nws-orbe nws-orbe--sm"></span><span class="nws-logo__t">SerafIA</span></div>' + ayuda() + '</div>' + sub + '</div>';
      }

      /* ---------- HOY ---------- */
      function heroCarta() {
        var f = D.ordenMazo.slice(0, 3).map(function (n, i) {
          var pos = [['left:2px;top:22px;--r:-14deg;transform:rotate(-14deg)', '0s'], ['left:34px;top:6px;--r:-2deg;transform:rotate(-2deg)', '.4s'], ['left:68px;top:20px;--r:12deg;transform:rotate(12deg)', '.8s']][i];
          return '<div class="nws-carta" data-c="' + carta(n).color + '" style="' + pos[0] + ';animation-delay:' + pos[1] + '">' + arte(n, 48) + '</div>';
        }).join('');
        return '<div class="nws-hero">' + chispa(12, 'left:50%;top:10px;color:var(--naotech-color-white-alpha-100)') + chispa(9, 'left:36%;bottom:12px;color:var(--naotech-color-white-alpha-100);animation-delay:.8s') +
          '<div class="nws-hero__txt"><span class="nws-mono-over">Carta del día</span><h2 class="nws-h2">¿Cómo vas el día de hoy?</h2></div>' +
          '<div class="nws-hero__act">' + btn('Barajar', 'deck-open', { icon: 'refresh', size: 'medium' }) + '</div>' +
          '<div class="nws-hero__fan" aria-hidden="true">' + f + '</div></div>';
      }
      /* DC-009: después de elegir, el banner se ve igual que antes (mismo hero, mismo abanico):
         la carta de hoy va al centro y las de los días anteriores a los lados */
      function cartaHecha() {
        var c = carta(st.mood), ant = [5, 4, 2, 1].filter(function (n) { return n !== st.mood; }).slice(0, 2);
        var orden = [[ant[0], 'left:2px;top:22px;--r:-14deg;transform:rotate(-14deg)', '0s'], [st.mood, 'left:34px;top:6px;--r:-2deg;transform:rotate(-2deg);z-index:2', '.4s'], [ant[1], 'left:68px;top:20px;--r:12deg;transform:rotate(12deg)', '.8s']];
        var f = orden.map(function (o) { return '<div class="nws-carta" data-c="' + carta(o[0]).color + '" style="' + o[1] + ';animation-delay:' + o[2] + '">' + arte(o[0], 48) + '</div>'; }).join('');
        return '<div class="nws-hero">' + chispa(12, 'left:50%;top:10px;color:var(--naotech-color-white-alpha-100)') + chispa(9, 'left:36%;bottom:12px;color:var(--naotech-color-white-alpha-100);animation-delay:.8s') +
          '<div class="nws-hero__txt"><span class="nws-mono-over">Carta de hoy</span><h2 class="nws-h2">' + c.nombre + '</h2></div>' +
          '<div class="nws-hero__act">' + btn('Ver mi semana', 'ov:semana', { icon: 'view-grid', size: 'medium' }) + '</div>' +
          '<div class="nws-hero__fan" aria-hidden="true">' + f + '</div></div>';
      }
      /* DC-025/027: la tarjeta cuenta una sola cosa — tu próxima clase. Toda la tarjeta abre el horario;
         «Cómo llegar» vive junto al aula y la flecha queda en «Después» */
      function claseCard() {
        var c1 = D.clases[0], c2 = D.clases[1];
        return '<div class="nws-glass nws-block nws-clase2 nws-clase2--click" role="button" tabindex="0" data-a="ov:horario" aria-label="Ver mi horario. Próxima clase: ' + c1.nombre + '"><div class="nws-sec"><span class="nws-mono-over">Tu próxima clase</span>' + S.badge({ label: 'Empieza en 40 min', theme: 'informative', variant: 'quiet', size: 'small' }) + '</div>' +
          '<div class="nws-clase2__fila"><h2 class="nws-clase2__t">' + c1.nombre + '</h2><span class="nws-clase2__hora">' + c1.ini + ' – ' + c1.fin + '</span></div>' +
          '<div class="nws-clase2__lugar">' + S.icon('gps-pin') + '<b class="nws-grow">' + c1.aula + ' · ' + c1.bloque + '</b>' + btn('Cómo llegar', null, { variant: 'quiet', theme: 'secondary', size: 'small', toast: 'Cómo llegar' }) + '</div>' +
          '<div class="nws-clase2__luego"><span class="nws-txt">Después: ' + c2.nombre + ' · ' + c2.ini + ' · ' + c2.aula + '</span>' + S.icon('chevron-right') + '</div></div>';
      }
      function tile(icono, tema, titulo, sub, attr) {
        return '<button class="nws-glass nws-tile' + (sub ? '' : ' nws-tile--solo') + '" ' + attr + '>' + S.avatarIcon({ icon: icono, theme: tema }) + '<div><p class="nws-tile__t">' + titulo + '</p>' + (sub ? '<p class="nws-txt">' + sub + '</p>' : '') + '</div></button>';
      }
      function accesos() {
        return '<div><div class="nws-sec" style="margin-bottom:var(--naotech-sizing-12)"><h2 class="nws-h2">Accesos rápidos</h2></div><div class="nws-tiles">' +
          tile('qr-code', 'secondary', 'Carnet', '', 'data-a="ov:carnet"') +
          tile('bill', 'informative', 'Notas', '', 'data-toast="Notas"') +
          tile('gps-pin', 'positive', 'Mapa', '', 'data-toast="Mapa del campus"') +
          tile('phone', 'primary', 'Contactos', '', 'data-toast="Contactos"') + '</div></div>';
      }
      function destacado() {
        var d = D.destacados[st.feat];
        return '<div class="nws-ev" data-c="' + d.color + '"><span class="nws-ev__orb" style="width:190px;height:190px;right:-60px;top:-70px"></span><span class="nws-ev__orb" style="width:96px;height:96px;right:40px;bottom:-30px;opacity:.7"></span>' +
          '<div class="nws-ev__body">' + S.badge({ label: d.tag, theme: 'neutral', variant: 'quiet', size: 'small' }) +
          '<h3 class="nws-h1" style="font-size:var(--naotech-heading5-font-size);line-height:var(--naotech-heading5-line-height);max-width:80%">' + d.titulo + '</h3>' +
          '<p class="nws-txt" style="color:var(--nws-ink)">' + d.meta + '</p>' +
          '<div class="nws-ev__act">' + btn('Ver detalle', null, { variant: 'quiet', toast: 'Detalle del evento' }) + '</div></div></div>' +
          '<button data-a="feat-next" aria-label="Ver el siguiente evento destacado" style="background:none;border:0;padding:var(--naotech-sizing-10) 0 0;cursor:pointer;align-self:center">' + S.viewIndicator({ total: D.destacados.length, current: st.feat }) + '</button>';
      }
      function eventosHoy() {
        return '<div class="nws-stack" style="gap:0"><div class="nws-sec" style="margin-bottom:var(--naotech-sizing-12)"><h2 class="nws-h2">Eventos Seraf</h2><span class="nws-txt">Esta semana</span></div>' +
          '<div class="nws-stack" style="gap:0;align-items:stretch">' + destacado() + '</div>' +
          '<div class="nws-block-btn" style="margin-top:var(--naotech-sizing-12)">' + btn('Ver más eventos', 'ov:eventos', { variant: 'quiet', iconEnd: 'arrow-right' }) + '</div></div>';
      }
      /* ---------- composición para pantallas grandes (tablet y tablet grande) ----------
         No se estira el móvil: cada pestaña reparte sus bloques en áreas y usa componentes pensados para más ancho. */
      function grande() { return DISP !== 'movil'; }
      function vistaG(clase, partes) {
        return '<div class="nws-scroll nws-scroll--g"><div class="nws-gv ' + clase + '">' + partes.map(function (p) { return '<div class="nws-ga-' + p[0] + '">' + p[1] + '</div>'; }).join('') + '</div></div>';
      }
      /* NUEVO · Agenda del día: la jornada como línea de tiempo (en vez de una sola tarjeta de «próxima clase») */
      function agendaDia() {
        var hoy = D.horario.filter(function (d) { return d.k === 'mar'; })[0];
        var items = hoy.items.map(function (c) {
          var sg = c.etiqueta === 'Siguiente';
          return '<div class="nws-ag__it' + (sg ? ' nws-ag__it--sig' : '') + '"><div class="nws-ag__t"><b>' + c.ini + '</b><span>' + c.fin + '</span></div><span class="nws-ag__dot" aria-hidden="true"></span>' +
            '<div class="nws-ag__b"><p class="nws-h3">' + c.nombre + '</p><p class="nws-txt">' + c.lugar + '</p>' +
            (sg ? '<div class="nws-ag__ac">' + S.badge({ label: 'Empieza en 40 min', theme: 'informative', variant: 'quiet', size: 'small' }) + btn('Cómo llegar', null, { variant: 'quiet', theme: 'secondary', size: 'small', toast: 'Cómo llegar' }) + '</div>' : '') + '</div></div>';
        }).join('');
        return '<section class="nws-glass nws-block nws-ag" aria-label="Tu día"><div class="nws-sec"><h2 class="nws-h2">Tu día</h2><span class="nws-txt">Martes 6</span></div><div class="nws-ag__l">' + items + '</div>' +
          '<div class="nws-block-btn">' + btn('Ver mi horario', 'ov:horario', { variant: 'quiet', iconEnd: 'arrow-right' }) + '</div></section>';
      }
      /* NUEVO · Carrusel de eventos con foto: tarjeta con imagen, etiqueta, fecha, lugar, cupos y organizador */
      var EV_IMG = { f1: 'assets/ev-semana.jpg', f2: 'assets/ev-empleo.jpg', f3: 'assets/ev-deporte.jpg', e1: 'assets/ev-semana.jpg', e4: 'assets/ev-biblioteca.jpg', e5: 'assets/ev-semana.jpg', e6: 'assets/ev-biblioteca.jpg' };
      var EV_CUPOS = { f1: [180, 250], f2: [92, 120], f3: [34, 60], e1: [18, 25], e5: [9, 12] };
      var EV_ORG = { Bienestar: 'Bienestar Universitario', Universidad: 'Vida Universitaria', Deporte: 'Deportes' };
      var EV_TEMA = { Bienestar: 'secondary', Universidad: 'informative', Deporte: 'positive' };
      function listaEventos() {
        var vistos = {}, out = [];
        D.destacados.forEach(function (d) {
          var pr = d.meta.split(' · '); vistos[d.titulo] = 1;
          out.push({ id: d.id, tag: d.tag, titulo: d.titulo, fecha: pr.slice(0, -1).join(' · '), lugar: pr[pr.length - 1] });
        });
        D.eventos.forEach(function (e) {
          if (vistos[e.titulo]) { return; }
          var pr = e.meta.split(' · ');
          out.push({ id: e.id, tag: e.cat === 'bienestar' ? 'Bienestar' : 'Universidad', titulo: e.titulo, fecha: e.dow + ' ' + e.dia + ' · ' + pr[0], lugar: pr[1] || '' });
        });
        return out;
      }
      function eventoFoto(e) {
        var c = EV_CUPOS[e.id], org = EV_ORG[e.tag] || 'Seraf';
        var cupos = c ? '<div class="nws-evc__bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + c[1] + '" aria-valuenow="' + c[0] + '" aria-label="Cupos ocupados"><i style="width:' + Math.round(c[0] / c[1] * 100) + '%"></i></div><p class="nws-txt">' + c[0] + ' de ' + c[1] + ' cupos ocupados</p>' : '<div class="nws-evc__bar nws-evc__bar--libre" aria-hidden="true"><i></i></div><p class="nws-txt">Entrada libre</p>';
        return '<article class="nws-evc"><div class="nws-evc__img" style="background-image:url(\'' + EV_IMG[e.id] + '\')" role="img" aria-label="' + e.titulo + '"><span class="nws-evc__tag">' + S.badge({ label: e.tag, theme: EV_TEMA[e.tag] || 'neutral', variant: 'loud', size: 'small' }) + '</span></div>' +
          '<div class="nws-evc__b"><h3 class="nws-evc__t">' + e.titulo + '</h3>' +
          '<div class="nws-evc__f">' + S.icon('calendar') + '<span>' + e.fecha + '</span></div><div class="nws-evc__f">' + S.icon('gps-pin') + '<span>' + e.lugar + '</span></div>' + cupos +
          '<div class="nws-evc__ft">' + S.avatar({ text: org.split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2), size: 'small', theme: 'secondary', variant: 'quiet' }) + '<div class="nws-grow"><b>' + org + '</b><span>Organiza</span></div>' +
          btn('Ver detalle', null, { variant: 'quiet', size: 'small', toast: 'Detalle del evento' }) + '</div></div></article>';
      }
      function eventosCarrusel(titulo, sub) {
        return '<section class="nws-evcar" data-evc aria-label="Eventos Seraf"><div class="nws-sec nws-evcar__h"><h2 class="nws-h2">' + (titulo || 'Eventos Seraf') + '</h2>' + (sub ? '<span class="nws-txt">' + sub + '</span>' : '') + '<span class="nws-grow"></span>' +
          S.iconButton({ icon: 'arrow-left', variant: 'quiet', theme: 'neutral', size: 'medium', label: 'Eventos anteriores', attrs: { 'data-a': 'evcar:-1' } }) +
          S.iconButton({ icon: 'arrow-right', variant: 'loud', theme: 'secondary', size: 'medium', label: 'Más eventos', attrs: { 'data-a': 'evcar:1' } }) + '</div>' +
          '<div class="nws-evcar__t" tabindex="0">' + listaEventos().map(eventoFoto).join('') + '</div></section>';
      }
      /* NUEVO · Rejilla de eventos: los destacados se ven todos a la vez, sin carrusel */
      function eventoCard(d) {
        return '<article class="nws-ev nws-ev--g" data-c="' + d.color + '"><span class="nws-ev__orb" style="width:130px;height:130px;right:-40px;top:-50px"></span><div class="nws-ev__body">' +
          S.badge({ label: d.tag, theme: 'neutral', variant: 'quiet', size: 'small' }) +
          '<h3 class="nws-h1" style="font-size:var(--naotech-heading6-font-size);line-height:var(--naotech-heading6-line-height)">' + d.titulo + '</h3>' +
          '<p class="nws-txt" style="color:var(--nws-ink)">' + d.meta + '</p><div class="nws-ev__act">' + btn('Ver detalle', null, { variant: 'quiet', size: 'small', toast: 'Detalle del evento' }) + '</div></div></article>';
      }
      function eventosRejilla() { return '<div class="nws-evgrid">' + D.destacados.map(eventoCard).join('') + '</div>'; }
      /* NUEVO · Tarjeta de documento: nombre, estado y acción en una sola tarjeta */
      function docCard(d) {
        var q = d.accion === 'Solicitar' || d.accion === 'Descargar';
        return '<article class="nws-glass nws-doc">' + S.avatarIcon({ icon: 'file', theme: q ? 'neutral' : 'secondary' }) + '<div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + d.nombre + '</p><p class="nws-txt">' + d.nota + '</p></div>' +
          btn(d.accion, null, { variant: q ? 'quiet' : 'loud', size: 'small', toast: d.accion + ' · ' + d.nombre }) + '</article>';
      }
      function vistaHoy() {
        if (grande()) {
          return vistaG('nws-gv--hoy', [['hero', st.mood ? cartaHecha() : heroCarta()], ['acc', accesos()], ['agenda', agendaDia()],
            ['ev', eventosCarrusel('Eventos Seraf', 'Esta semana') + '<div class="nws-block-btn" style="margin-top:var(--naotech-sizing-12)">' + btn('Ver más eventos', 'ov:eventos', { variant: 'quiet', iconEnd: 'arrow-right' }) + '</div>']]);
        }
        return vistaHoyMovil();
      }
      function vistaHoyMovil() {
        return '<div class="nws-scroll" id="scroll">' + (st.mood ? cartaHecha() : heroCarta()) + claseCard() + accesos() + eventosHoy() + '</div>';
      }

      /* ---------- SERVICIOS ---------- */
      function vistaServicios() {
        var docs = D.documentos.map(function (d) {
          return '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + d.nombre + '</p><p class="nws-txt">' + d.nota + '</p></div>' +
            btn(d.accion, null, { variant: d.accion === 'Solicitar' || d.accion === 'Descargar' ? 'quiet' : 'loud', size: 'small', toast: d.accion + ' · ' + d.nombre }) + '</div>';
        }).join('');
        var tr = D.tramites.map(function (t) {
          return '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + t.nombre + '</p><p class="nws-txt">' + t.nota + '</p></div>' +
            S.badge({ label: t.estado, theme: t.tema, variant: 'quiet', size: 'small' }) + '</div>';
        }).join('');
        if (grande()) {
          return vistaG('nws-gv--serv', [
            ['docs', '<div class="nws-sec" style="margin-bottom:var(--naotech-sizing-12)"><h2 class="nws-h2">Certificados y documentos</h2></div><div class="nws-docgrid">' + D.documentos.map(docCard).join('') + '</div>'],
            ['sol', '<div class="nws-glass nws-block"><h2 class="nws-h2">Mis solicitudes</h2><div class="nws-stack" style="gap:0">' + tr + '</div></div>'],
            ['tiles', '<div class="nws-tiles">' + tile('bill', 'informative', 'Notas del periodo', 'Abrir calculadora', 'data-toast="Notas"') + tile('file', 'positive', 'Mis solicitudes', '1 en revisión', 'data-toast="Mis solicitudes"') + '</div>']]);
        }
        return '<div class="nws-scroll">' +
          '<div class="nws-glass nws-block"><h2 class="nws-h2">Certificados y documentos</h2><div class="nws-stack" style="gap:0">' + docs + '</div></div>' +
          '<div class="nws-tiles">' + tile('bill', 'informative', 'Notas del periodo', 'Abrir calculadora', 'data-toast="Notas"') + tile('file', 'positive', 'Mis solicitudes', '1 en revisión', 'data-toast="Mis solicitudes"') + '</div>' +
          '<div class="nws-glass nws-block"><h2 class="nws-h2">Mis solicitudes</h2><div class="nws-stack" style="gap:0">' + tr + '</div></div></div>';
      }

      /* ---------- CAMPUS ---------- */
      function mapaSvg() {
        var T = function (t) { return 'style="fill:var(--naotech-color-' + t + ')"'; };
        var X = function (t, w) { return 'style="fill:none;stroke:var(--naotech-color-' + t + ');stroke-width:' + w + ';stroke-linecap:round;stroke-linejoin:round"'; };
        function bloque(x, y, w, h, fondo, tinta, nombre) {
          return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" ' + T(fondo) + '/><text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="600" ' + T(tinta) + ' font-family="inherit">' + nombre + '</text>';
        }
        return '<svg class="nws-mapa" viewBox="0 0 340 190" role="img" aria-label="Mapa esquemático del campus con la ruta hacia el bloque C"><path d="M0 128h340 M104 0v190" ' + X('white-alpha-100', 12) + '/>' +
          bloque(14, 14, 76, 52, 'indigo-200', 'indigo-900', 'Bloque A') + bloque(120, 14, 96, 52, 'blue-200', 'blue-900', 'Bloque C') + bloque(232, 14, 96, 52, 'orange-100', 'orange-900', 'Bienestar') +
          bloque(14, 146, 76, 30, 'yellow-100', 'yellow-900', 'Cafetería') + bloque(120, 146, 96, 30, 'green-100', 'green-800', 'Biblioteca') +
          '<path d="M52 128H104V92H168V66" ' + X('indigo-700', 3.5).replace('stroke-linecap:round', 'stroke-linecap:round;stroke-dasharray:1 8') + '/>' +
          '<circle cx="52" cy="128" r="7" ' + T('gray-900') + '/><circle cx="168" cy="66" r="7" ' + T('indigo-700') + '/></svg>';
      }
      function vistaCampus() {
        var cts = D.contactos.map(function (c) {
          return '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + c.nombre + '</p><p class="nws-txt">' + c.meta + '</p></div>' +
            btn(c.accion, null, { theme: c.crisis ? 'negative' : 'neutral', variant: c.crisis ? 'quiet' : 'loud', size: 'small', toast: c.accion + ' · ' + c.nombre }) + '</div>';
        }).join('');
        if (grande()) {
          return vistaG('nws-gv--campus', [
            ['map', '<div class="nws-glass nws-block nws-mapblock">' + S.searchbox({ placeholder: '¿A dónde vas? Aula, edificio o servicio' }) + mapaSvg() +
              '<div class="nws-rowx"><div class="nws-grow"><p class="nws-h3">Aula C-302</p><p class="nws-txt">8 min a pie · piso 3</p></div>' + btn('Iniciar ruta', null, { toast: 'Iniciar ruta' }) + '</div></div>'],
            ['cont', '<div class="nws-glass nws-block"><h2 class="nws-h2">Contactos y ayuda</h2><div class="nws-stack" style="gap:0">' + cts + '</div></div>'],
            ['ev', '<button class="nws-glass nws-tile" data-a="ov:eventos" style="flex-direction:row;align-items:center;width:100%">' + S.avatarIcon({ icon: 'calendar', theme: 'secondary' }) + '<div class="nws-grow"><p class="nws-tile__t">Eventos Seraf</p><p class="nws-txt">Universidad y Bienestar, con inscripción</p></div>' + S.icon('chevron-right') + '</button>']]);
        }
        return '<div class="nws-scroll">' +
          '<div class="nws-glass nws-block">' + S.searchbox({ placeholder: '¿A dónde vas? Aula, edificio o servicio' }) + mapaSvg() +
          '<div class="nws-rowx"><div class="nws-grow"><p class="nws-h3">Aula C-302</p><p class="nws-txt">8 min a pie · piso 3</p></div>' + btn('Iniciar ruta', null, { toast: 'Iniciar ruta' }) + '</div></div>' +
          '<button class="nws-glass nws-tile" data-a="ov:eventos" style="flex-direction:row;align-items:center">' + S.avatarIcon({ icon: 'calendar', theme: 'secondary' }) + '<div class="nws-grow"><p class="nws-tile__t">Eventos Seraf</p><p class="nws-txt">Universidad y Bienestar, con inscripción</p></div>' + S.icon('chevron-right') + '</button>' +
          '<div class="nws-glass nws-block"><h2 class="nws-h2">Contactos y ayuda</h2><div class="nws-stack" style="gap:0">' + cts + '</div></div></div>';
      }

      /* ---------- YO ---------- */
      function vistaYo() {
        var h = D.herramientas.map(function (x) {
          return '<button data-toast="' + x.nombre + '">' + S.avatarIcon({ icon: x.icono, theme: 'secondary' }) + '<b>' + x.nombre + '</b><span>' + x.tiempo + '</span></button>';
        }).join('');
        var n = D.notificaciones.map(function (x) {
          return '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + x.nombre + '</p><p class="nws-txt">' + x.nota + '</p></div>' + conmutador(st.notif[x.id], 'notif:' + x.id, x.nombre) + '</div>';
        }).join('');
        if (grande()) {
          var priv = '<div class="nws-glass nws-block"><h2 class="nws-h2">Privacidad</h2>' +
            '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">Usar mi horario para acompañarme</p><p class="nws-txt">SerafIA podrá ofrecerte ayuda en semanas pesadas. Nunca crea una alerta por esto.</p></div>' + conmutador(st.ctx, 'ctx', 'Usar mi horario para acompañarme') + '</div>' +
            '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">Qué ve SerafIA y qué no</p></div>' + S.icon('chevron-right') + '</div>' +
            '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">Mi consentimiento y mis datos</p></div>' + S.icon('chevron-right') + '</div></div>';
          return vistaG('nws-gv--yo', [
            ['perfil', '<div class="nws-glass nws-block nws-perfil">' + S.avatar({ text: E.iniciales, size: 'large', theme: 'secondary', variant: 'loud' }) + '<div><p class="nws-h2">' + E.nombre + '</p><p class="nws-txt">' + E.programa + '</p><p class="nws-txt" style="font-feature-settings:\'tnum\'">Código ' + E.codigo + '</p></div>' +
              '<div class="nws-block-btn">' + btn('Cerrar sesión', null, { variant: 'quiet', icon: 'logout', toast: 'Cerrar sesión' }) + '</div></div>'],
            ['herr', '<div class="nws-glass nws-block"><h2 class="nws-h2">Herramientas de bienestar</h2><div class="nws-herr">' + h + '</div></div>'],
            ['not', '<div class="nws-glass nws-block"><h2 class="nws-h2">Notificaciones</h2><div class="nws-stack" style="gap:0">' + n + '</div></div>'],
            ['priv', priv]]);
        }
        return '<div class="nws-scroll">' +
          '<div class="nws-glass nws-block"><div class="nws-rowx">' + S.avatar({ text: E.iniciales, size: 'large', theme: 'secondary', variant: 'loud' }) +
          '<div class="nws-grow"><p class="nws-h3">' + E.nombre + '</p><p class="nws-txt">' + E.programa + ' · ' + E.codigo + '</p></div></div></div>' +
          '<div class="nws-glass nws-block"><h2 class="nws-h2">Herramientas de bienestar</h2><div class="nws-herr">' + h + '</div></div>' +
          '<div class="nws-glass nws-block"><h2 class="nws-h2">Notificaciones</h2><div class="nws-stack" style="gap:0">' + n + '</div></div>' +
          '<div class="nws-glass nws-block"><h2 class="nws-h2">Privacidad</h2>' +
          '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">Usar mi horario para acompañarme</p><p class="nws-txt">SerafIA podrá ofrecerte ayuda en semanas pesadas. Nunca crea una alerta por esto.</p></div>' + conmutador(st.ctx, 'ctx', 'Usar mi horario para acompañarme') + '</div>' +
          '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">Qué ve SerafIA y qué no</p></div>' + S.icon('chevron-right') + '</div>' +
          '<div class="nws-line"><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">Mi consentimiento y mis datos</p></div>' + S.icon('chevron-right') + '</div></div>' +
          '<div class="nws-block-btn">' + btn('Cerrar sesión', null, { variant: 'quiet', icon: 'logout', toast: 'Cerrar sesión' }) + '</div></div>';
      }

      /* ---------- dock: navegación + chat ---------- */
      /* DC-010: el chat es lo primero que se ve y la navegación se pliega en un botón.
         Al tocarlo, el botón se ensancha hacia la derecha y revela las cuatro pestañas (con etiqueta)
         mientras la barra del chat se retira; al elegir una, vuelve a plegarse. */
      function pintarDock() {
        if (st.ov === 'cartas') { $('dock').innerHTML = ''; return; }
        var tabs = [['hoy', 'home', 'Hoy'], ['servicios', 'view-grid', 'Servicios'], ['campus', 'gps-pin', 'Campus'], ['yo', 'user', 'Yo']];
        $('dock').innerHTML = '<div class="nws-dock nws-dock--x' + (st.nav ? ' nws-dock--open' : '') + (st.ov ? ' nws-dock--sobre' : '') + '">' +
          '<button class="nws-chatbar" data-a="sheet-open" aria-label="Hablar con SerafIA"><span class="nws-orbe nws-orbe--sm"></span><span class="nws-chatbar__t">Pregúntale a SerafIA…</span>' +
          '<span class="nws-chatbar__mic">' + S.icon('microphone') + '</span><span class="nws-send">' + S.icon('arrow-up') + '</span></button>' +
          '<div class="nws-navx"><button class="nws-navx__btn" data-a="nav-toggle" aria-expanded="' + !!st.nav + '" aria-label="Menú de navegación"><span class="nws-navx__ic nws-navx__ic--a">' + S.icon('view-grid') + '</span><span class="nws-navx__ic nws-navx__ic--b">' + S.icon('close') + '</span></button>' +
          '<nav class="nws-navx__items" aria-label="Navegación principal">' + tabs.map(function (t, n) {
            return '<button class="nws-navx__it' + (st.tab === t[0] ? ' nws-navx__it--on' : '') + '" style="transition-delay:' + (n * 40 + 80) + 'ms" data-a="tab:' + t[0] + '" aria-label="' + t[2] + '"' + (st.tab === t[0] ? ' aria-current="page"' : '') + '>' + S.icon(t[1]) + '<span>' + t[2] + '</span></button>';
          }).join('') + '</nav></div></div>';
      }
      function alternarNav(abrir) {
        st.nav = abrir === undefined ? !st.nav : abrir;
        var d = $('dock').querySelector('.nws-dock'), b = $('dock').querySelector('.nws-navx__btn');
        if (d) { d.classList.toggle('nws-dock--open', st.nav); } if (b) { b.setAttribute('aria-expanded', String(st.nav)); }
      }

      /* ---------- vistas completas ---------- */
      function ovCarnet() {
        return '<div class="nws-ov">' + atras('Carnet') + '<div class="nws-ov__body">' +
          '<div class="nws-carnet"><div class="nws-carnet__top">' +
          '<div style="position:relative"><span class="nws-mono-over">Carnet estudiantil</span><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + E.universidad + '</p></div>' +
          '<div class="nws-carnet__id">' + S.avatar({ text: E.iniciales, size: 'large', theme: 'secondary', variant: 'loud' }) +
          '<div class="nws-grow"><p class="nws-h1">' + E.nombre + '</p><p class="nws-txt">' + E.programa + '</p><p class="nws-txt" style="font-feature-settings:\'tnum\'">Código ' + E.codigo + '</p></div></div></div>' +
          '<div class="nws-carnet__qr"><div class="nws-qr"><div style="width:196px;height:196px">' + QR + '</div></div>' +
          '<div style="width:100%" class="nws-stack"><div class="nws-sec"><span class="nws-txt">El código se renueva en 0:24</span>' + S.badge({ label: E.matricula, theme: 'positive', variant: 'quiet', size: 'small' }) + '</div>' + S.progress({ value: 80, theme: 'secondary' }) + '</div></div></div>' +
          '<p class="nws-txt" style="text-align:center">Sube el brillo de tu pantalla. Funciona sin conexión con tu último estado válido.</p></div>' + fabMini() + '</div>';
      }
      /* ---------- calendario mensual del horario (tablet y tablet grande) ---------- */
      var DOW = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'], NOMD = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      var NOMM = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      function p2(n) { return (n < 10 ? '0' : '') + n; }
      function clave(f) { return f.getFullYear() + '-' + f.getMonth() + '-' + f.getDate(); }
      /* clases de la semana tipo + lo específico de cada fecha (la semana del 5 al 11 se toma tal cual y los eventos salen de «Eventos Seraf») */
      function itemsFecha(f) {
        var n = f.getDate(), m = f.getMonth(), oct = f.getFullYear() === 2026 && m === 9, k = DOW[f.getDay()];
        var sem = D.horario.concat(D.horarioExtra || []).filter(function (x) { return x.k === k; })[0];
        if (oct && n >= 5 && n <= 11) { return sem ? sem.items : []; }
        var base = sem ? sem.items.filter(function (c) { return !c.etiqueta || c.etiqueta === 'Siguiente'; }).map(function (c) { return { ini: c.ini, fin: c.fin, nombre: c.nombre, lugar: c.lugar }; }) : [];
        if (oct) {
          D.eventos.filter(function (e) { return +e.dia === n; }).forEach(function (e) {
            var pr = e.meta.split(' · '), h = pr[0].split(':'), ini = p2(+h[0]) + ':' + h[1];
            base.push({ ini: ini, fin: p2(+h[0] + 1) + ':' + h[1], nombre: e.titulo, lugar: pr[1] || '', etiqueta: 'Evento Seraf' });
          });
        }
        return base.sort(function (a, b) { return a.ini < b.ini ? -1 : 1; });
      }
      function ovHorarioMes(slot, ctlVista) {
        var off = st.mesOff || 0, base = new Date(2026, 9 + off, 1), y = base.getFullYear(), m = base.getMonth();
        var primero = (base.getDay() + 6) % 7, dim = new Date(y, m + 1, 0).getDate(), total = Math.ceil((primero + dim) / 7) * 7;
        var hoyK = clave(new Date(2026, 9, 6));
        if (!st.diaSel || st.diaSelMes !== off) { st.diaSel = off === 0 ? hoyK : clave(base); st.diaSelMes = off; }
        var cab = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map(function (d) { return '<span>' + d + '</span>'; }).join('');
        var celdas = '';
        for (var i = 0; i < total; i++) {
          var f = new Date(y, m, 1 - primero + i), its = itemsFecha(f), kk = clave(f), fuera = f.getMonth() !== m;
          var pts = its.slice(0, 4).map(function (c) { return '<i class="nws-cal__pt nws-cal__pt--' + (c.etiqueta === 'Examen' ? 'ex' : (c.etiqueta === 'Evento Seraf' ? 'ev' : 'cl')) + '"></i>'; }).join('');
          var chips = its.slice(0, 2).map(function (c) { return '<span class="nws-cal__ch nws-cal__ch--' + (c.etiqueta === 'Examen' ? 'ex' : (c.etiqueta === 'Evento Seraf' ? 'ev' : 'cl')) + '" title="' + c.ini + ' · ' + c.nombre + '">' + c.nombre + '</span>'; }).join('') + (its.length > 2 ? '<span class="nws-cal__mas">+' + (its.length - 2) + ' más</span>' : '');
          celdas += '<button type="button" class="nws-cal__d' + (fuera ? ' nws-cal__d--fuera' : '') + (kk === hoyK ? ' nws-cal__d--hoy' : '') + (kk === st.diaSel ? ' nws-cal__d--sel' : '') + '" data-a="hdia:' + kk + '" aria-pressed="' + (kk === st.diaSel) + '" aria-label="' + f.getDate() + ' de ' + NOMM[f.getMonth()] + (its.length ? ', ' + its.length + (its.length === 1 ? ' actividad' : ' actividades') : ', sin actividades') + '">' +
            '<span class="nws-cal__n">' + f.getDate() + '</span><span class="nws-cal__pts">' + pts + '</span><span class="nws-cal__chs">' + chips + '</span></button>';
        }
        var sp = st.diaSel.split('-'), fs = new Date(+sp[0], +sp[1], +sp[2]), sit = itemsFecha(fs);
        var agenda = '<h2 class="nws-h2">' + NOMD[fs.getDay()].charAt(0).toUpperCase() + NOMD[fs.getDay()].slice(1) + ' ' + fs.getDate() + ' de ' + NOMM[fs.getMonth()] + '</h2>' +
          (sit.length ? '<div class="nws-stack nws-cal__sl">' + sit.map(slot).join('') + '</div>' : '<div class="nws-glass nws-block"><p class="nws-txt">Sin clases ni eventos este día.</p></div>');
        var leyenda = '<div class="nws-cal__ley"><span><i class="nws-cal__pt nws-cal__pt--cl"></i>Clase</span><span><i class="nws-cal__pt nws-cal__pt--ev"></i>Evento Seraf</span><span><i class="nws-cal__pt nws-cal__pt--ex"></i>Examen</span></div>';
        var nav = '<div class="nws-cal__nav"><h2 class="nws-h2 nws-cal__mes">' + NOMM[m].charAt(0).toUpperCase() + NOMM[m].slice(1) + ' ' + y + '</h2>' +
          '<div class="nws-cal__arr" role="group" aria-label="Cambiar de mes">' + S.iconButton({ icon: 'arrow-left', variant: 'mute', theme: 'neutral', size: 'medium', label: 'Mes anterior', disabled: off <= -1, attrs: { 'data-a': 'hmes:-1' } }) +
          S.iconButton({ icon: 'arrow-right', variant: 'mute', theme: 'neutral', size: 'medium', label: 'Mes siguiente', disabled: off >= 2, attrs: { 'data-a': 'hmes:1' } }) + '</div>' +
          (off !== 0 ? btn('Hoy', 'hmes:0', { variant: 'quiet', theme: 'secondary', size: 'medium' }) : '') + '<span class="nws-grow"></span>' + ctlVista + '</div>';
        return '<div class="nws-ov">' + atras('Mi horario') + '<div class="nws-ov__body">' + nav +
          '<div class="nws-cal__v"><div class="nws-glass nws-cal"><div class="nws-cal__cab">' + cab + '</div><div class="nws-cal__rej">' + celdas + '</div>' + leyenda + '</div><section class="nws-cal__ag" aria-live="polite">' + agenda + '</section></div></div>' + fabMini() + '</div>';
      }
      function ovHorario() {
        var grande = DISP !== 'movil', sem = grande ? D.horario.concat(D.horarioExtra || []) : D.horario;
        if (!grande && (st.dia === 'sab' || st.dia === 'dom')) { st.dia = 'mar'; }
        var dias = sem.map(function (d) {
          return '<button class="nws-dia' + (st.dia === d.k ? ' nws-dia--on' : '') + '" data-a="dia:' + d.k + '"><span>' + d.dow + '</span><b>' + d.num + '</b>' + (d.k === 'mar' ? '<i style="width:6px;height:6px;border-radius:50%;background:' + (st.dia === d.k ? 'var(--naotech-color-white-alpha-100)' : 'var(--naotech-color-indigo-600)') + '"></i>' : '<i style="width:6px;height:6px"></i>') + '</button>';
        }).join('');
        var cur = sem.filter(function (d) { return d.k === st.dia; })[0] || sem[1];
        var slots = cur.items.map(function (c) {
          var ex = c.etiqueta === 'Examen', ev = c.etiqueta === 'Evento Seraf', sg = c.etiqueta === 'Siguiente';
          return '<div class="nws-glass nws-slot' + (ex ? ' nws-slot--examen' : '') + (sg ? ' nws-slot--sig' : '') + '"><div class="nws-slot__h"><div class="nws-hora" style="min-width:0">' + c.ini + '</div><p class="nws-txt">' + c.fin + '</p></div>' +
            '<div class="nws-grow"><p class="nws-h3">' + c.nombre + '</p><p class="nws-txt">' + c.lugar + '</p>' +
            (c.etiqueta ? '<div style="margin-top:var(--naotech-sizing-8)">' + S.badge({ label: c.etiqueta, theme: ex ? 'warning' : (ev ? 'positive' : 'secondary'), variant: ex ? 'loud' : 'quiet', size: 'small' }) + '</div>' : '') + '</div></div>';
        }).join('');
        if (!cur.items.length) { slots = '<div class="nws-glass nws-block"><p class="nws-txt">Sin clases ni eventos este día.</p></div>'; }
        function slot(c) {
          var ex = c.etiqueta === 'Examen', ev = c.etiqueta === 'Evento Seraf', sg = c.etiqueta === 'Siguiente';
          return '<div class="nws-glass nws-slot nws-slot--c' + (ex ? ' nws-slot--examen' : '') + (sg ? ' nws-slot--sig' : '') + '"><div class="nws-slot__h"><div class="nws-hora" style="min-width:0">' + c.ini + '</div><p class="nws-txt">' + c.fin + '</p></div>' +
            '<div class="nws-grow"><p class="nws-h3">' + c.nombre + '</p><p class="nws-txt">' + c.lugar + '</p>' + (c.etiqueta ? '<div style="margin-top:var(--naotech-sizing-8)">' + S.badge({ label: c.etiqueta, theme: ex ? 'warning' : (ev ? 'positive' : 'secondary'), variant: ex ? 'loud' : 'quiet', size: 'small' }) + '</div>' : '') + '</div></div>';
        }
        var vH = st.vistaH || 'semana';
        var ctlV = '<div class="nws-vsw" role="tablist" aria-label="Vista del horario">' + [['semana', 'Semana'], ['mes', 'Mes']].map(function (x) { return '<button type="button" role="tab" aria-selected="' + (vH === x[0]) + '" class="' + (vH === x[0] ? 'on' : '') + '" data-a="hvista:' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>';
        if (grande && vH === 'mes') { return ovHorarioMes(slot, ctlV); }
        /* NUEVO · Tablero semanal: toda la semana a la vez, una columna por día (tablet grande) */
        if (DISP === 'tablet-xl') {
          var cols = sem.map(function (d) {
            var hoy = d.k === 'mar';
            return '<section class="nws-wk__d' + (hoy ? ' nws-wk__d--hoy' : '') + '" aria-label="' + d.dow + ' ' + d.num + '"><header><span>' + d.dow + '</span><b>' + d.num + '</b>' + (hoy ? '<i>Hoy</i>' : '') + '</header>' +
              (d.items.length ? d.items.map(slot).join('') : '<p class="nws-txt nws-wk__vacio">Sin clases ni eventos</p>') + '</section>';
          }).join('');
          return '<div class="nws-ov">' + atras('Mi horario') + '<div class="nws-ov__body"><div class="nws-hv"><p class="nws-mono-over">Periodo 2026-2 · Semana del 5 al 11 de octubre</p>' + ctlV + '</div><div class="nws-wk">' + cols + '</div>' +
            '<div class="nws-glass nws-block"><p class="nws-txt">Recordatorios de clase 30 min antes. Puedes cambiarlo en <b style="color:var(--nws-ink)">Yo</b>.</p></div></div>' + fabMini() + '</div>';
        }
        return '<div class="nws-ov">' + atras('Mi horario') + '<div class="nws-ov__body">' +
          (grande ? '<div class="nws-hv"><p class="nws-mono-over">Periodo 2026-2 · Semana del 5 al 11 de octubre</p>' + ctlV + '</div>' : '<p class="nws-mono-over">Periodo 2026-2 · Semana del 5 al 9 de octubre</p>') + '<div class="nws-dias' + (grande ? ' nws-dias--7' : '') + '">' + dias + '</div>' +
          '<div class="nws-stack nws-slots">' + slots + '</div>' +
          '<div class="nws-glass nws-block"><p class="nws-txt">Recordatorios de clase 30 min antes. Puedes cambiarlo en <b style="color:var(--nws-ink)">Yo</b>.</p></div></div>' + fabMini() + '</div>';
      }
      function filas(arr) {
        return arr.map(function (e) {
          var b = e.cat === 'bienestar';
          return '<div class="nws-line nws-line--ev"><div class="nws-fecha"><span>' + e.dow + '</span><b>' + e.dia + '</b></div><div class="nws-grow"><p class="nws-h3" style="font-size:var(--naotech-body-font-size)">' + e.titulo + '</p><p class="nws-txt">' + e.meta + '</p>' +
            '<div style="margin-top:var(--naotech-sizing-4)">' + S.badge({ label: b ? 'Bienestar' : 'Universidad', theme: b ? 'positive' : 'informative', variant: 'quiet', size: 'small' }) + '</div>' +
            (e.inscripcion ? '<div style="margin-top:var(--naotech-sizing-8)">' + btn('Ver información de inscripción', null, { variant: 'quiet', size: 'small', toast: 'Información de inscripción' }) + '</div>' : '') + '</div></div>';
        }).join('');
      }
      function ovEventos() {
        var fl = [['todos', 'Todos'], ['para', 'Para ti'], ['bienestar', 'Bienestar'], ['u', 'Universidad']].map(function (f) {
          return '<button class="nws-fltab' + (st.evFil === f[0] ? ' nws-fltab--on' : '') + '" role="tab" aria-selected="' + (st.evFil === f[0]) + '" data-a="evfil:' + f[0] + '">' + f[1] + '</button>';
        }).join('');
        var keep = D.eventos.filter(function (e) { return st.evFil === 'todos' || (st.evFil === 'para' ? e.para : e.cat === st.evFil); });
        var sem = keep.filter(function (e) { return e.semana; }), mas = keep.filter(function (e) { return !e.semana; });
        return '<div class="nws-ov">' + atras('Eventos Seraf') + '<div class="nws-ov__body">' +
          (grande() ? eventosCarrusel('Destacados', 'Con inscripción y entrada libre') : '<div class="nws-stack" style="gap:0">' + destacado() + '</div>') +
          '<div class="nws-fltabs" role="tablist" aria-label="Filtrar eventos">' + fl + '</div>' +
          (st.evFil === 'para' ? '<p class="nws-txt">Elegidos según actividades que te ayudan, con tu permiso. Puedes cambiarlo en Yo.</p>' : '') +
          '<div class="nws-evcols">' +
          (sem.length ? '<div class="nws-glass nws-block"><h2 class="nws-h2">Esta semana</h2><div class="nws-stack" style="gap:0">' + filas(sem) + '</div></div>' : '') +
          (mas.length ? '<div class="nws-glass nws-block"><h2 class="nws-h2">Más adelante</h2><div class="nws-stack" style="gap:0">' + filas(mas) + '</div></div>' : '') +
          '</div></div>' + fabMini() + '</div>';
      }
      function ovSemana() {
        var m = D.semanaPasada;
        var tiles = m.map(function (n, i) { return '<div><div class="nws-carta" data-c="' + carta(n).color + '">' + arte(n, 34) + '</div><span class="nws-mono-over" style="font-size:9px">' + D.dias[i] + '</span></div>'; }).join('');
        var pts = m.map(function (n, i) { return [(23 + i * 46.7).toFixed(1), (14 + (5 - n) * 20.5).toFixed(1)]; });
        var dots = pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" style="fill:var(--naotech-color-white-alpha-100);stroke:var(--naotech-color-indigo-600);stroke-width:3"/>'; }).join('');
        return '<div class="nws-ov">' + atras('Tu semana') + '<div class="nws-ov__body nws-ov__body--semana"><p class="nws-mono-over">28 sep al 4 oct · ejemplo</p>' +
          '<div class="nws-glass nws-block"><div class="nws-semana">' + tiles + '</div><div style="position:relative"><span class="nws-txt" style="position:absolute;left:0;top:-6px;font-size:var(--naotech-caption-font-size)">Más ligero</span><span class="nws-txt" style="position:absolute;left:0;bottom:-6px;font-size:var(--naotech-caption-font-size)">Más pesado</span>' +
          '<svg viewBox="0 0 326 110" width="100%" role="img" aria-label="Línea de cómo se sintió cada día de la semana"><path d="M0 14h326 M0 55h326 M0 96h326" style="stroke:var(--naotech-color-gray-200);stroke-width:1;fill:none"/>' +
          '<polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" style="fill:none;stroke:var(--naotech-color-indigo-600);stroke-width:3;stroke-linejoin:round;stroke-linecap:round"/>' + dots + '</svg></div></div>' +
          '<div class="nws-glass nws-block"><span class="nws-mono-over" style="color:var(--naotech-color-indigo-700)">Lo que noté</span>' +
          '<p style="margin:0;font-size:var(--naotech-subtitle-font-size);line-height:var(--naotech-sizing-28);font-weight:var(--naotech-font-weight-regular)">Empezaste la semana al 100 y fuiste bajando hasta el miércoles y el jueves, los días con más evaluaciones. Desde el viernes volviste a subir, y el sábado fuiste a un taller de Bienestar.</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap">' + S.badge({ label: 'Racha de 7 días', icon: 'thunder', theme: 'primary', variant: 'quiet', size: 'medium' }) + S.badge({ label: 'Más repetida: Cielo despejado', theme: 'secondary', variant: 'quiet', size: 'medium' }) + '</div></div>' +
          '<div class="nws-stack nws-block-btn">' + btn('Hablar de mi semana', 'semana-hablar', { size: 'large' }) + btn('Ver actividades que me ayudan', 'semana-eventos', { variant: 'quiet', size: 'large' }) + '</div>' +
          '<p class="nws-txt">Solo tú ves este resumen. SerafIA lo usa para acompañarte mejor, con tu permiso, y nunca crea una alerta por él.</p></div>' + fabMini() + '</div>';
      }
      function ovCartas() {
        if (st.dstage === 'shuffle') {
          var backs = [0, 1, 2, 3, 4].map(function (i) {
            var lado = i % 2 === 0 ? 'nws-shL' : 'nws-shR';
            var fx = (i - 2) * 56, fy = Math.abs(i - 2) * 16 - 24, fr = (i - 2) * 11;
            return '<div class="nws-dorso" style="z-index:' + i + ';--fx:' + fx + 'px;--fy:' + fy + 'px;--fr:' + fr + 'deg;animation:' + lado + ' 2s ease-in-out ' + (i * 0.08).toFixed(2) + 's both, nws-fan .9s cubic-bezier(.2,.8,.2,1) ' + (2.35 + i * 0.05).toFixed(2) + 's both"><span class="nws-orbe"></span></div>';
          }).join('');
          return '<div class="nws-ov nws-ov--dark" style="padding-top:44px"><div class="nws-ov__hd">' + S.iconButton({ icon: 'close', variant: 'mute', theme: 'neutral', size: 'large', label: 'Cerrar', attrs: { 'data-a': 'deck-close' } }) + ayuda() + '</div>' +
            '<div style="flex:1;position:relative">' + backs + '</div>' +
            '<div style="flex:none;text-align:center;padding:0 max(32px, var(--nws-gutter)) 120px;animation:nws-rise .8s var(--naotech-animation-deceleration) both"><p class="nws-h1" style="color:inherit">Barajando tu mazo…</p><p style="margin:var(--naotech-sizing-8) 0 0;font-size:var(--naotech-body-font-size);color:var(--naotech-color-indigo-200)">Respira un momento. Hay una carta para ti.</p></div></div>';
        }
        var sel = st.dsel ? carta(st.dsel) : null;
        var ops = D.ordenMazo.map(function (n, k) {
          var c = carta(n), on = st.dsel === n;
          return '<div class="nws-opcion' + (on ? ' nws-opcion--on' : '') + (st.enter ? ' nws-opcion--in' : '') + '" data-c="' + c.color + '" style="animation-delay:' + (k * 0.09).toFixed(2) + 's">' + arte(n, 104) +
            '<div><p class="nws-h3">' + c.nombre + '</p><p class="nws-txt" style="color:var(--nws-ink-2)">' + c.desc + '</p></div>' +
            btn(on ? 'Elegida' : 'Elegir', 'deck-pick:' + n, { variant: on ? 'quiet' : 'loud', icon: on ? 'positive' : undefined, cls: 'nws-block-btn' }) + '</div>';
        }).join('');
        return '<div class="nws-ov"><div class="nws-ov__hd">' + S.iconButton({ icon: 'close', variant: 'mute', theme: 'neutral', size: 'large', label: 'Cerrar', attrs: { 'data-a': 'deck-close' } }) + ayuda() + '</div>' +
          '<div class="nws-ov__body" style="padding-bottom:150px"><div style="text-align:center"><h1 class="nws-h1">Elige tu carta de hoy</h1><p class="nws-txt" style="max-width:300px;margin:var(--naotech-sizing-8) auto 0">Escoge la que más se parezca a tu día. No hay cartas buenas ni malas: todas se coleccionan igual.</p></div>' +
          '<div style="display:flex;align-items:center;justify-content:center;gap:var(--naotech-sizing-16)"><div class="nws-bandeja"' + (sel ? ' data-c="' + sel.color + '"' : '') + '>' + (sel ? arte(st.dsel, 64) : S.icon('add')) + '</div>' +
          '<div style="min-width:130px"><span class="nws-mono-over">Tu carta de hoy</span><p class="nws-h1" style="font-size:var(--naotech-heading6-font-size);line-height:var(--naotech-heading6-line-height)">' + (sel ? sel.nombre : 'Sin elegir') + '</p></div></div>' +
          '<div class="nws-opciones">' + ops + '</div></div>' +
          '<div class="nws-confirma nws-block-btn">' + btn('Coleccionar carta', 'deck-ok', { size: 'large', disabled: !st.dsel }) + '</div></div>';
      }
      /* selectores que cambian de contenido (días, filtros, indicador del carrusel): el marcador activo se desliza
         de su sitio anterior al nuevo y el contenido asociado entra con un fundido hacia el mismo lado */
      var FA = [['.nws-dia--on', 'dias', null], ['.nws-fltab--on', 'fltab', '::after'], ['.nwt-view-indicator__dot--active', 'dots', null], ['.nws-cal__d--sel', 'cal', null]];
      var FC = { dias: '.nws-ov__body > .nws-stack', fltab: '.nws-ov__body > .nws-glass, .nws-ov__body > p.nws-txt', dots: '.nws-ev', cal: '.nws-cal__ag' };
      function marcarFa(host) {
        FA.forEach(function (f) { [].forEach.call(host.querySelectorAll(f[0]), function (e) { e.setAttribute('data-fa', f[1]); if (f[2]) { e.setAttribute('data-fp', f[2]); } }); });
      }
      function claveFa(e) { return e.getAttribute('data-a') || String([].indexOf.call(e.parentNode.children, e)); }
      function capturarFa(host) {
        var o = {}; marcarFa(host);
        [].forEach.call(host.querySelectorAll('[data-fa]'), function (e) { var r = e.getBoundingClientRect(); o[e.getAttribute('data-fa')] = { k: claveFa(e), l: r.left, w: r.width }; });
        return o;
      }
      function animarFa(host, prev) {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
        marcarFa(host);
        [].forEach.call(host.querySelectorAll('[data-fa]'), function (e) {
          var g = e.getAttribute('data-fa'), p = prev[g]; if (!p || !e.animate || p.k === claveFa(e)) { return; }
          var r = e.getBoundingClientRect(), dx = p.l - r.left, op = { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)' }, ps = e.getAttribute('data-fp');
          e.animate([{ transform: 'translateX(' + dx + 'px) scaleX(' + (p.w / r.width) + ')' }, { transform: 'none' }], ps ? Object.assign({ pseudoElement: ps }, op) : op);
          [].forEach.call(host.querySelectorAll(FC[g] || '.nws-none'), function (c) {
            c.animate([{ opacity: 0, transform: 'translateX(' + (dx > 0 ? -18 : 18) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)' });
          });
        });
      }
      function pintarOv() {
        var h = '';
        if (st.ov === 'carnet') { h = ovCarnet(); }
        else if (st.ov === 'horario') { h = ovHorario(); }
        else if (st.ov === 'eventos') { h = ovEventos(); }
        else if (st.ov === 'semana') { h = ovSemana(); }
        else if (st.ov === 'cartas') { h = ovCartas(); }
        var host = $('ov'), sc = host.querySelector('.nws-ov__body'), top = sc ? sc.scrollTop : 0;
        if (st.enter) { h = h.replace('class="nws-ov', 'class="nws-ov nws-ov--in'); }
        var prevFa = capturarFa(host);
        host.innerHTML = h;
        animarFa(host, prevFa);
        st.enter = false;
        mob.classList.toggle('nws-demo--dark', st.ov === 'cartas' && st.dstage === 'shuffle');
        var nb = host.querySelector('.nws-ov__body'); if (nb && top) { nb.scrollTop = top; }
      }

      /* ---------- chat: NwtBottomSheet (half) dentro del teléfono ---------- */
      function sheetShell(full) {
        var dosPaneles = false;
        var cab = '<div class="nwt-bottom-sheet__handle"><span class="nwt-bottom-sheet__handle-bar"></span></div>' +
          '<div class="nwt-bottom-sheet__header"><div class="nws-chat-hd">' + (full ? '<div class="nws-logo"><span class="nws-orbe nws-orbe--sm"></span><span class="nws-logo__t">SerafIA</span></div>' : '<span class="nws-orbe nws-orbe--sm"></span><div class="nws-grow"><p class="nws-h3">SerafIA</p><p class="nws-txt" style="line-height:var(--naotech-sizing-16)">Siempre contigo</p></div>') + '<span class="nws-grow"></span>' +
          (full ? ayuda(true) : '') + S.iconButton({ icon: 'close', variant: 'mute', theme: 'neutral', size: 'medium', label: 'Cerrar el chat', attrs: { 'data-a': 'sheet-close' } }) + '</div></div>' +
          (full ? '<div class="nws-welcome" id="chat-welcome"><span class="nws-orbe nws-orbe--pastel"></span><h2 class="nws-welcome__t"><span>Hola,</span><span>soy SerafIA.</span><span class="nws-welcome__q">¿Cómo estás hoy?</span></h2><p class="nws-welcome__p">Soy una IA y estoy aquí para escucharte. Cuéntame con tus palabras.</p><div class="nws-sug" id="chat-sug"></div></div>' : '') +
          '<div class="nwt-bottom-sheet__body" id="chat-body" style="display:flex;flex-direction:column;gap:var(--naotech-sizing-12)"></div>' +
          '<div class="nwt-bottom-sheet__footer" id="chat-foot" style="display:flex;flex-direction:column;gap:var(--naotech-sizing-12)"></div>';
        /* NUEVO · tablet grande: la conversación a un lado y, al otro, un panel con las opciones y la ayuda inmediata */
        return '<div class="nwt-bottom-sheet" nwt-theme="neutral"><div class="nwt-bottom-sheet__backdrop" data-a="sheet-close"></div>' +
          '<div class="nwt-bottom-sheet__container nwt-bottom-sheet__container--' + (full ? 'full nws-sheet--full' : 'half') + (dosPaneles ? ' nws-sheet--2p' : '') + '" role="dialog" aria-modal="true" aria-label="Conversación con SerafIA"><div class="nwt-bottom-sheet__content">' +
          (dosPaneles ? '<div class="nws-chat-main">' + cab + '</div><aside class="nws-chat-side" id="chat-side" aria-label="Opciones y ayuda"></aside>' : cab) + '</div></div></div>';
      }
      /* NUEVO · Sugerencias como tarjetas (pantallas grandes): icono, título y una línea de apoyo, centradas bajo el saludo */
      var SUG = { 'Hablar con alguien': ['user', 'secondary', 'Cuéntame cómo te sientes, a tu ritmo'], 'Mi horario de hoy': ['calendar', 'informative', 'Tus clases y pausas de hoy'], 'Mi carnet': ['qr-code', 'positive', 'Ábrelo en un toque'] };
      function sugerencias(on) {
        var host = mob.querySelector('#chat-sug'); if (!host) { return; }
        var h = !on || !st.opts.length || st.typing ? '' : st.opts.map(function (o, i) {
          var s = SUG[o.label] || ['answer', 'primary', ''];
          return '<button type="button" class="nws-sug__c" data-a="opt:' + i + '">' + S.avatarIcon({ icon: s[0], theme: s[1] }) + '<b>' + o.label + '</b>' + (s[2] ? '<span>' + s[2] + '</span>' : '') + '</button>';
        }).join('');
        if (host._h !== h) { host._h = h; host.innerHTML = h; }
      }
      /* ---------- chat con guion de demo (CASO): la conversación grabada ---------- */
      var C = window.CASO;
      var CIERRE = { acompanar: 'Seguiré a tu lado, a tu ritmo. Puedes volver cuando quieras.', monitorear: 'Seguiré a tu lado, a tu ritmo. Puedes volver cuando quieras.',
        alerta: 'Una persona del equipo de Bienestar te escribirá.', alerta_prioritaria: 'Una persona del equipo de Bienestar te escribirá hoy.', escalamiento_inmediato: 'El equipo de Bienestar ya fue avisado.' };
      function parrafos(t) { return t.split(/\\n|\n/).filter(function (x) { return x.trim(); }).map(function (x) { return '<p class="nws-msg">' + S.esc(x) + '</p>'; }).join(''); }
      /* Tarjeta de cuidado: UN solo componente (crisis en el guion y «Ayuda ahora» desde cualquier vista),
         con la misma información y composición de la demo de referencia */
      function tarjetaCuidado(fade) {
        return '<div class="nws-care nws-care--ref' + (fade ? ' nws-care--fade' : '') + '"><div class="nws-care__hd"><span class="nws-care__ic">' + S.icon('favorite') + '</span><h3 class="nws-care__t">No tienes que pasar por esto a solas.</h3></div>' +
          '<p>Lo que escribes es importante. Ya avisé a una persona del equipo de bienestar para que te contacte.</p>' +
          '<p>Si estás en peligro ahora, llama al 123 o al 192, opción 4. Aquí sigo, sin irme.</p>' +
          '<div class="nws-care__aviso"><span class="nws-care__ok">' + S.icon('positive') + '</span><div><b>Aviso prioritario enviado al equipo de bienestar</b><span>Hace un momento · una persona te va a contactar</span></div></div>' +
          '<div class="nws-opts">' +
          S.button({ label: 'Llamar a una línea de ayuda', icon: 'phone', theme: 'negative', variant: 'loud', size: 'large', attrs: { 'data-llamar': 'Línea 106 · Escucha y orientación' } }) +
          S.button({ label: 'Emergencias · 123', theme: 'negative', variant: 'quiet', size: 'large', attrs: { 'data-llamar': 'Emergencias · 123' } }) +
          S.button({ label: 'Respirar conmigo un minuto', theme: 'neutral', variant: 'quiet', size: 'large', attrs: { 'data-toast': 'Respirar conmigo' } }) + '</div></div>';
      }
      /* Sin parpadeo: lo que ya estaba pintado no vuelve a animarse ni a recrearse; solo entra lo nuevo.
         El pie (campo de texto y atajos) solo se repinta si cambió. */
      function pintarCuerpo(b, html) {
        /* antes de que lleguen mensajes la bienvenida ocupa todo el espacio: ahí se mide de dónde parte el orbe */
        var c0 = mob.querySelector('.nwt-bottom-sheet__container'), g0 = mob.querySelector('#chat-welcome .nws-orbe--pastel');
        if (st.full && c0 && g0 && !c0.classList.contains('nws-chat--on') && st.pint === 0) { st.orbe0 = g0.getBoundingClientRect(); }
        /* mismo contenido: no se vuelve a pintar (si no, lo recién llegado pierde su fundido a medias) */
        if (st.cuerpoHtml === html && b.children.length) { return; }
        st.cuerpoHtml = html;
        b.innerHTML = html;
        var kids = [].slice.call(b.children).filter(function (k) { return !k.classList.contains('nws-typing'); });
        kids.forEach(function (k, i) { if (i < st.pint) { k.classList.add('nws-old'); } });
        st.pint = kids.length;
        var ty = b.querySelector('.nws-typing');
        if (ty && st.tyOn) { ty.classList.add('nws-old'); }
        st.tyOn = !!ty;
        /* todo queda ya en su posición final; lo nuevo solo aparece con un fundido */
        clearTimeout(st.tScroll);
        b.scrollTop = b.scrollHeight;
      }
      function pintarPie(f, html) {
        if (st.pie === html) { return false; }
        st.pie = html; f.innerHTML = html; return true;
      }
      function pintarGuion(b, f) {
        var e = C.estado(), tr = C.guion().turnos, h = st.full ? '' : '<p class="nws-msg">Hola, soy SerafIA. ¿Cómo te sientes hoy? Cuéntamelo con tus palabras.</p>', i, t;
        for (i = 0; i < e.enviados; i++) {
          t = tr[i];
          h += '<p class="nws-msg nws-msg--yo">' + S.esc(t.estudiante) + '</p><span class="nws-rev" role="img" aria-label="Revisado por la red de cuidado" title="Revisado por la red de cuidado">' + S.icon('privacy') + '</span>';
          if (i < e.hechos) { h += t.crisis.length ? tarjetaCuidado() : parrafos(t.serafia); }
        }
        if (e.fase === 'escribiendo') { h += '<div class="nws-typing" aria-label="SerafIA está escribiendo"><i></i><i></i><i></i></div>'; }
        var ult = e.hechos ? tr[e.hechos - 1] : null, crisis = ult && ult.crisis.length;
        if (C.terminado() && e.fase === 'listo') {
          h += '<div class="nws-cierre"><b>Qué pasa ahora</b><p>' + CIERRE[ult.accion] + '</p>' + (crisis ? '' : (st.valora ? '<p>Gracias por contármelo. Lo tendremos en cuenta.</p>' :
            '<b style="margin-top:var(--naotech-sizing-8)">¿Te sirvió este espacio?</b><div class="nws-opts">' + ['No mucho', 'Un poco', 'Sí'].map(function (x) { return S.button({ label: x, theme: 'neutral', variant: 'quiet', size: 'small', attrs: { 'data-a': 'valora' } }); }).join('') + '</div>')) + '</div>';
        }
        pintarCuerpo(b, h); sincronizarBienvenida();
        pintarPie(f, '<div class="nws-composer nws-composer--off"><input type="text" disabled aria-label="Escribe a SerafIA" placeholder="' + (crisis ? 'Aquí sigo contigo…' : 'Reproduciendo un guion de demo…') + '">' +
          '<span class="nws-fab" style="width:40px;height:40px;box-shadow:none"><button disabled aria-label="Enviar" class="nws-sendbtn" style="all:unset;display:flex;align-items:center;justify-content:center;width:100%;height:100%;line-height:0">' + S.icon('arrow-up') + '</button></span></div>');
      }
      /* chat completo: la bienvenida vive fuera del cuerpo y, al empezar la conversación, sube y se pliega en el encabezado */
      function empezo() { return st.full && (st.msgs.length > 0 || (C.estado().modo && C.estado().enviados > 0)); }
      function sincronizarBienvenida() {
        var c = mob.querySelector('.nwt-bottom-sheet__container'); if (!c || !st.full) { return; }
        var on = empezo(), antes = c.classList.contains('nws-chat--on'), logo = c.querySelector('.nws-logo');
        /* primera pintura tras abrir: sin viaje; si la conversación ya venía en curso, el logo queda puesto */
        if (!st.baseline) { st.baseline = true; c.classList.toggle('nws-chat--on', on); if (logo) { logo.classList.toggle('nws-logo--listo', on); } return; }
        if (on && !antes) { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && logo) { logo.classList.add('nws-logo--listo'); } volarOrbe(); }
        if (!on && antes) { reiniciarOrbe(c); }
        c.classList.toggle('nws-chat--on', on);
      }
      /* si la conversación vuelve a empezar (otro guion o reinicio), el orbe regresa a la bienvenida limpio:
         sin las animaciones del viaje anterior, que lo dejarían arriba y medirían mal el siguiente */
      function reiniciarOrbe(c) {
        var big = c.querySelector('#chat-welcome .nws-orbe--pastel'), logo = c.querySelector('.nws-logo');
        if (big) { (big.getAnimations ? big.getAnimations({ subtree: true }) : []).forEach(function (an) { an.cancel(); }); big.style.visibility = ''; big.style.zIndex = ''; }
        if (logo) { logo.classList.remove('nws-logo--listo'); }
        st.orbe0 = null; st.pint = 0;
        [].slice.call(c.querySelectorAll('.nws-orbe--viajero')).forEach(function (v) { v.parentNode.removeChild(v); });
      }
      /* DC-018: al empezar la conversación el orbe grande se achica y viaja a la izquierda hasta el logo del encabezado */
      function volarOrbe() {
        var c = mob.querySelector('.nwt-bottom-sheet__container'), big = mob.querySelector('#chat-welcome .nws-orbe--pastel'), dst = mob.querySelector('.nws-sheet--full .nws-logo .nws-orbe');
        var logo = mob.querySelector('.nws-sheet--full .nws-logo');
        if (!c || !big || !dst || !big.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { if (logo) { logo.classList.add('nws-logo--listo'); } return; }
        /* El viajero es una copia suelta, fuera del flujo: al empezar la conversación el diseño cambia (llegan los mensajes,
           la bienvenida se pliega) y el orbe original se movería; la copia parte de donde estaba y llega al logo sin deriva. */
        var cr = c.getBoundingClientRect(), a = st.orbe0 || big.getBoundingClientRect(), b = dst.getBoundingClientRect(), sc = a.width / big.offsetWidth || 1;
        var dx = (b.left + b.width / 2 - a.left - a.width / 2) / sc, dy = (b.top + b.height / 2 - a.top - a.height / 2) / sc, k = b.width / a.width, T = 1200;
        var fly = big.cloneNode(true);
        fly.removeAttribute('id'); fly.className = 'nws-orbe nws-orbe--pastel nws-orbe--viajero';
        fly.style.cssText = 'position:absolute;margin:0;z-index:30;pointer-events:none;animation:none;left:' + ((a.left - cr.left) / sc) + 'px;top:' + ((a.top - cr.top) / sc) + 'px;width:' + big.offsetWidth + 'px;height:' + big.offsetHeight + 'px';
        c.appendChild(fly); big.style.visibility = 'hidden';
        var op = { duration: T, easing: 'cubic-bezier(.45,0,.15,1)', fill: 'forwards' };
        /* se achica hasta el tamaño del logo y, de camino, pasa del pastel al azul */
        fly.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')' }], op);
        fly.animate([{ opacity: 0 }, { opacity: 1 }], Object.assign({ pseudoElement: '::after' }, op));
        fly.animate([{ boxShadow: '0 0 36px rgb(from var(--naotech-color-indigo-200) r g b / .8)' }, { boxShadow: '0 0 0 rgb(from var(--naotech-color-indigo-200) r g b / 0)' }], op);
        setTimeout(function () { if (logo) { logo.classList.add('nws-logo--listo'); } }, T - 40);
        setTimeout(function () { if (fly.parentNode) { fly.parentNode.removeChild(fly); } }, T + 60);
      }
      function pintarChat() {
        var b = mob.querySelector('#chat-body'), f = mob.querySelector('#chat-foot');
        if (!b || !f) { return; }
        if (C.estado().modo) { pintarGuion(b, f); return; }
        pintarCuerpo(b, st.msgs.map(function (m) { if (m.html) { return m.html; } return '<p class="nws-msg' + (m.f === 'u' ? ' nws-msg--yo' : '') + '">' + S.esc(m.t) + '</p>'; }).join('') +
          (st.typing ? '<div class="nws-typing" aria-label="SerafIA está escribiendo"><i></i><i></i><i></i></div>' : ''));
        sincronizarBienvenida();
        var sug = grande() && st.full && !empezo(); sugerencias(sug);
        var pie = (!sug && st.opts.length && !st.typing ? '<div class="nws-opts">' + st.opts.map(function (o, i) {
          return S.button({ label: o.label, theme: o.crisis ? 'negative' : 'neutral', variant: o.primary ? 'loud' : 'quiet', size: 'medium', attrs: { 'data-a': 'opt:' + i } });
        }).join('') + '</div>' : '') +
          '<div class="nws-composer"><input type="text" id="chat-in" aria-label="Escribe a SerafIA" placeholder="Pregúntale a SerafIA…" autocomplete="off">' +
          S.iconButton({ icon: 'microphone', variant: 'mute', theme: 'neutral', size: 'medium', label: 'Dictar', attrs: { 'data-toast': 'Dictado por voz' } }) +
          '<span class="nws-fab" style="width:40px;height:40px;box-shadow:none">' + '<button data-a="send" aria-label="Enviar" class="nws-sendbtn" style="all:unset;display:flex;align-items:center;justify-content:center;width:100%;height:100%;cursor:pointer;line-height:0">' + S.icon('arrow-up') + '</button></span></div>';
        if (!pintarPie(f, pie)) { return; }
        var inp = f.querySelector('#chat-in'); if (inp) { inp.value = st.tmp; inp.addEventListener('input', function () { st.tmp = inp.value; }); }
      }
      function say(text, opts, ms) {
        st.typing = true; st.opts = []; pintarChat();
        later(function () { st.typing = false; st.msgs.push({ f: 's', t: text }); st.opts = opts || []; pintarChat(); }, ms || 900);
      }
      function yo(t) { st.msgs.push({ f: 'u', t: t }); st.opts = []; pintarChat(); }
      function abrirSheet(arranque, full, previo) {
        clearT(); st.sheet = true; st.full = !!full; st.baseline = false; st.orbe0 = null; st.pint = 0; st.tyOn = false; st.pie = null; st.cuerpoHtml = null; st.valora = false; st.msgs = []; st.opts = []; st.typing = false; st.tmp = ''; pintarPanel();
        var host = $('sheet'); host.innerHTML = sheetShell(full);
        if (st.ayudaFade) { var cf = host.querySelector('.nwt-bottom-sheet__container'); if (cf) { cf.classList.add('nws-sheet--fade'); } st.ayudaFade = false; }
        requestAnimationFrame(function () {
          var c = host.querySelector('.nwt-bottom-sheet__container'), k = host.querySelector('.nwt-bottom-sheet__backdrop');
          if (c) { c.classList.add('nwt-bottom-sheet__container--open'); } if (k) { k.classList.add('nwt-bottom-sheet__backdrop--open'); }
        });
        if (previo) { previo(); }
        pintarChat(); arranque();
      }
      function cerrarSheet() {
        clearT(); st.sheet = false; pintarPanel();
        var host = $('sheet'), c = host.querySelector('.nwt-bottom-sheet__container'), k = host.querySelector('.nwt-bottom-sheet__backdrop');
        if (c) { c.classList.remove('nwt-bottom-sheet__container--open'); } if (k) { k.classList.remove('nwt-bottom-sheet__backdrop--open'); }
        later(function () { host.innerHTML = ''; }, 360);
      }
      function charlaSaludo() {
        if (C.estado().modo && C.estado().enviados) { abrirSheet(function () {}, true); return; }
        var c1 = D.clases[0], c2 = D.clases[1];
        function ahoraNo() { yo('Ahora no'); say('Está bien. Aquí sigo cuando quieras.', [], 900); }
        var ops = [
          { label: 'Hablar con alguien', run: function () { yo('Hablar con alguien'); charlaApoyo(); } },
          { label: 'Mi horario de hoy', run: function () {
            yo('Mi horario de hoy');
            say('Hoy tienes ' + c1.nombre + ' a las ' + c1.ini + ' en ' + c1.aula + ', y luego ' + c2.nombre + ' a las ' + c2.ini + '. ¿Quieres ver tu horario completo?', [
              { label: 'Ver horario completo', primary: true, run: function () { yo('Ver horario completo'); irDesdeChat('hoy', 'horario'); } },
              { label: 'Ahora no', run: ahoraNo }
            ], 1100);
          } },
          /* el carnet es el único que abre sin preguntar */
          { label: 'Mi carnet', run: function () {
            yo('Mi carnet'); say('Claro, te llevo a tu carnet.', [], 900);
            /* la respuesta se lee con calma antes de pasar a la vista */
            later(function () { irDesdeChat('hoy', 'carnet'); }, 900 + 2800);
          } }
        ];
        abrirSheet(function () { st.opts = ops; pintarChat(); }, true);
      }
      function charlaApoyo() {
        say('Me alegra que lo pidas. Puedes contarme con tus palabras, o te muestro las opciones del equipo de Bienestar.', [
          { label: 'Contarte a ti', primary: true, run: function () { yo('Contarte a ti'); say('Te escucho. ¿Qué es lo que más te pesa hoy?', [], 900); } },
          { label: 'Ver opciones de Bienestar', run: function () { yo('Ver opciones de Bienestar'); irDesdeChat('campus'); } }
        ], 900);
      }
      function charlaCarta(n) {
        var c = carta(n);
        abrirSheet(function () {
          say(c.abre, [
            { label: 'Sí, hablemos', primary: true, run: function () { yo('Sí, hablemos'); say('Gracias por confiar en mí. Cuéntame con tus palabras: ¿qué fue lo que más pesó hoy?', [
              { label: 'Algo académico', run: function () { yo('Algo académico'); say('Te escucho. Lo que sientes importa, y no tienes que poder con todo. Cuando quieras, cuéntame un poco más.', [], 1000); } },
              { label: 'Algo personal', run: function () { yo('Algo personal'); say('Te escucho. Lo que sientes importa, y no tienes que poder con todo. Cuando quieras, cuéntame un poco más.', [], 1000); } },
              { label: 'No lo sé bien', run: function () { yo('No lo sé bien'); say('Está bien no saberlo. Podemos ir despacio, a tu ritmo.', [], 1000); } }
            ], 900); } },
            { label: 'Ahora no', run: function () { yo('Ahora no'); say('Está bien, sin presión. Aquí estoy cuando quieras. Y si en algún momento lo necesitas, «Ayuda ahora» está siempre arriba.', [{ label: 'Cerrar', primary: true, run: cerrarSheet }], 900); } }
          ], 1000);
        });
      }
      function charlaSemana() {
        abrirSheet(function () {
          say('Revisé tu semana contigo. Hubo un par de días más pesados, el miércoles y el jueves. ¿Quieres que hablemos de lo que pasó?', [
            { label: 'Sí, hablemos', primary: true, run: function () { yo('Sí, hablemos'); say('Gracias por confiar en mí. Cuéntame con tus palabras: ¿qué fue lo que más pesó?', [], 900); } },
            { label: 'Ahora no', run: function () { yo('Ahora no'); say('Está bien, sin presión. Aquí estoy cuando quieras.', [{ label: 'Cerrar', primary: true, run: cerrarSheet }], 900); } }
          ], 1000);
        });
      }
      /* DC-024/026: «Ayuda ahora», desde cualquier vista, abre el chat con la tarjeta de cuidado.
         Si el chat ya está abierto no se reinicia ni se repite la animación: se agrega en la misma conversación. */
      function charlaAyuda() {
        if (C.estado().modo) { C.salirDelModo(); }
        if (st.sheet) {
          if (st.msgs.some(function (m) { return m.html; })) { return; }
          st.opts = []; st.msgs.push({ f: 's', html: tarjetaCuidado(true) }); pintarChat();
          return;
        }
        /* chat cerrado: se abre ya con la conversación en curso, así no aparece la bienvenida ni el viaje del orbe */
        st.ayudaFade = true;
        abrirSheet(function () {}, true, function () { st.msgs.push({ f: 's', html: tarjetaCuidado(true) }); });
      }

      /* ---------- navegación ---------- */
      function pintarTab() {
        var prev = $('tab').querySelector('.nws-scroll'), top = prev ? prev.scrollTop : 0;
        var v = { hoy: vistaHoy, servicios: vistaServicios, campus: vistaCampus, yo: vistaYo }[st.tab]();
        var prevFa = capturarFa($('tab'));
        $('tab').innerHTML = v;
        animarFa($('tab'), prevFa);
        if (st.tabAnim) {
          var te = $('tab'), he = $('hd');
          [te, he].forEach(function (e) { e.classList.remove('nws-tab--out'); e.style.setProperty('--dx', (st.tabDir * 28) + 'px'); e.classList.remove('nws-tab--in'); });
          void te.offsetWidth; te.classList.add('nws-tab--in'); he.classList.add('nws-tab--in'); st.tabAnim = false;
        }
        var sc = $('tab').querySelector('.nws-scroll'); if (sc && top && !st._reset) { sc.scrollTop = top; } st._reset = false;
      }
      function pintar() { mob.classList.add('nws-demo--lav'); pintarHd(); pintarTab(); pintarDock(); pintarOv(); }
      /* cambio de pestaña: lo que sale se desvanece hacia un lado y lo nuevo entra desde el otro */
      var ORDEN_TABS = ['hoy', 'servicios', 'campus', 'yo'];
      function cambiarTab(t) {
        if (st.tabBusy) { return; }
        if (t === st.tab) { pintar(); return; }
        var dir = ORDEN_TABS.indexOf(t) > ORDEN_TABS.indexOf(st.tab) ? 1 : -1, tb = $('tab'), hd = $('hd');
        var sinMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function cambiar() { st.tab = t; st._reset = true; st.tabAnim = true; st.tabDir = dir; st.tabBusy = false; pintar(); }
        if (sinMov || !tb) { cambiar(); return; }
        st.tabBusy = true;
        tb.style.setProperty('--dx', (-dir * 18) + 'px'); hd.style.setProperty('--dx', (-dir * 18) + 'px');
        tb.classList.remove('nws-tab--in'); hd.classList.remove('nws-tab--in'); tb.classList.add('nws-tab--out'); hd.classList.add('nws-tab--out');
        later(cambiar, 150);
      }
      /* salir del chat hacia otra vista: el chat se cierra, la vista nueva entra con suavidad y el menú se abre
         y queda abierto para que se vea en qué sección quedó la persona */
      function irDesdeChat(tab, ov) {
        cerrarSheet();
        later(function () {
          if (st.tab !== tab || st.ov) { st.ov = null; $('ov').innerHTML = ''; cambiarTab(tab); }
          if (ov) { later(function () { irOv(ov); }, 120); }
          later(function () {
            alternarNav(true);
          }, ov ? 520 : 380);
        }, 380);
      }
      function irOv(o) { st.ov = o; st.enter = true; pintarDock(); pintarOv(); }
      function cerrarOv() { clearT(); st.ov = null; st.dstage = 'shuffle'; st.dsel = null; $('ov').innerHTML = ''; pintar(); }
      function abrirMazo() {
        clearT(); st.dstage = 'shuffle'; st.dsel = null; irOv('cartas');
        later(function () { st.dstage = 'pick'; st.enter = true; pintarOv(); }, 3600);
      }

      /* ---------- eventos del teléfono ---------- */
      function onClick(ev) {
        if (ev.target.closest('[data-toast]')) { return; }
        var ll = ev.target.closest('[data-llamar]');
        if (ll && mob.contains(ll)) { ctx.toast({ title: 'Llamada simulada', message: 'En la app real se marcaría «' + ll.getAttribute('data-llamar') + '».', icon: 'phone', origen: mob }); return; }
        var el = ev.target.closest('[data-a]');
        if (!el || !mob.contains(el)) { return; }
        var a = el.getAttribute('data-a'), p = a.split(':'), k = p[0], v = p.slice(1).join(':');
        if (k === 'tab') { if (st.ov) { st.nav = false; cerrarOv(); cambiarTab(v); return; } if (st.nav) { alternarNav(false); later(function () { cambiarTab(v); }, 240); } else { cambiarTab(v); } }
        else if (k === 'nav-toggle') { alternarNav(); }
        else if (k === 'ov') { irOv(v); }
        else if (k === 'ov-close') { cerrarOv(); }
        else if (k === 'deck-open') { abrirMazo(); }
        else if (k === 'deck-close') { cerrarOv(); }
        else if (k === 'deck-pick') { st.dsel = +v; pintarOv(); }
        else if (k === 'deck-ok') {
          if (!st.dsel) { return; }
          var n = st.dsel; cerrarOv(); st.mood = n; pintar();
          if (n <= 2) { charlaCarta(n); }
        }
        else if (k === 'feat-next') { st.feat = (st.feat + 1) % D.destacados.length; st.ov ? pintarOv() : pintarTab(); }
        else if (k === 'enroll') { st.enrolled[v] = !st.enrolled[v]; st.ov ? pintarOv() : pintarTab(); }
        else if (k === 'save') { st.saved[v] = !st.saved[v]; pintarOv(); }
        else if (k === 'evfil') { st.evFil = v; pintarOv(); }
        else if (k === 'dia') { st.dia = v; pintarOv(); }
        else if (k === 'evcar') { var tr = el.closest('[data-evc]').querySelector('.nws-evcar__t'), cd = tr.querySelector('.nws-evc'); tr.scrollBy({ left: (+v) * (cd ? cd.offsetWidth + 16 : tr.clientWidth * 0.8), behavior: 'smooth' }); }
        else if (k === 'hvista') { st.vistaH = v; pintarOv(); }
        else if (k === 'hdia') { st.diaSel = v; pintarOv(); }
        else if (k === 'hmes') { st.mesOff = v === '0' ? 0 : Math.max(-1, Math.min(2, (st.mesOff || 0) + (+v))); pintarOv(); }
        else if (k === 'notif') { st.notif[v] = !st.notif[v]; pintarTab(); }
        else if (k === 'ctx') { st.ctx = !st.ctx; pintarTab(); }
        else if (k === 'semana-hablar') { cerrarOv(); charlaSemana(); }
        else if (k === 'semana-eventos') { st.evFil = 'para'; irOv('eventos'); }
        else if (k === 'sheet-open') { if (st.nav) { alternarNav(false); } else { charlaSaludo(); } }
        else if (k === 'sheet-close') { cerrarSheet(); }
        else if (k === 'valora') { st.valora = true; pintarChat(); }
        else if (k === 'ayuda') { charlaAyuda(); }
        else if (k === 'opt') { var o = st.opts[+v]; if (o) { o.run(); } }
        else if (k === 'send') {
          var t = (st.tmp || '').trim(); if (!t) { return; }
          st.tmp = ''; yo(t); say('Gracias por contármelo. Sigo aquí contigo.', [], 900);
        }
      }
      function onKey(ev) {
        if (ev.key === 'Enter' && ev.target.id === 'chat-in') { var b = mob.querySelector('[data-a="send"]'); if (b) { b.click(); } return; }
        if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('[role="switch"][data-a], .nwt-tag[data-a], .nws-clase2--click')) { ev.preventDefault(); ev.target.click(); }
      }

      /* ---------- zoom + reinicio ---------- */
      var zoom = { mult: 1 };
      function aplicarZoom() { self.ajustar(root, ctx, zoom.mult); }
      /* selector de dispositivo (barra superior): cambia el marco y el contenido se reacomoda con CSS */
      function onDisp(ev) {
        var b = ev.target.closest && ev.target.closest('.nws-dispsw [data-seg]'); if (!b) { return; }
        var k = b.getAttribute('data-seg'); if (!DISPS[k] || k === DISP) { return; }
        DISP = k;
        var ph = root.querySelector('#phone'); ph.setAttribute('data-disp', k); ph.style.width = DISPS[k].w + 'px'; ph.style.height = DISPS[k].h + 'px';
        mob.className = mob.className.replace(/\bnws-demo--(movil|tablet|tablet-xl)\b/g, '').trim() + ' nws-demo--' + k;
        [].forEach.call(root.querySelectorAll('.nws-dispsw .nws-dsp'), function (x) { var on = x.getAttribute('data-seg') === k; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(on)); });
        zoom.mult = 1; aplicarZoom(); st._reset = false; pintar(); if (st.sheet) { st.cuerpoHtml = null; pintarChat(); } ctx.posicionarIndicadores(root);
      }
      root.addEventListener('click', onDisp);
      function onZoom(ev) {
        var z = ev.target.closest('[data-zoom]');
        if (z) {
          var a = z.getAttribute('data-zoom');
          if (a === 'in') { zoom.mult = Math.min(2, zoom.mult + 0.15); }
          if (a === 'out') { zoom.mult = Math.max(0.5, zoom.mult - 0.15); }
          if (a === 'fit') { zoom.mult = 1; }
          aplicarZoom(); return;
        }
        if (ev.target.closest('[data-reset]')) { clearT(); C.salirDelModo(); st = nuevo(); $('sheet').innerHTML = ''; pintar(); }
      }

      /* panel de guiones: flota junto al teléfono mientras el chat está abierto */
      var dp = root.querySelector('#dpanel');
      function pintarPanel() { dp.innerHTML = C.panel(S); dp.classList.toggle('nws-dpanel--on', !!st.sheet); }
      var quitarPanel = C.enlazar(dp), quitarRol = C.enlazarRol(root, ctx.ir);
      var offCaso = C.on(function () { if (st.sheet) { pintarChat(); } pintarPanel(); });
      var pintarBase = pintar;
      pintar = function () { pintarBase(); pintarPanel(); };
      mob.addEventListener('click', onClick);
      mob.addEventListener('keydown', onKey);
      root.addEventListener('click', onZoom);
      window.addEventListener('resize', aplicarZoom);
      pintar();
      ctx.posicionarIndicadores(mob);
      aplicarZoom();
      return function () {
        clearT(); offCaso(); quitarPanel(); quitarRol();
        mob.removeEventListener('click', onClick); root.removeEventListener('click', onDisp);
        mob.removeEventListener('keydown', onKey);
        root.removeEventListener('click', onZoom);
        window.removeEventListener('resize', aplicarZoom);
      };
    }
  };
})();
