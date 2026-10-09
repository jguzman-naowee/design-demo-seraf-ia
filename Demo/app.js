/**
 * Arranque: perfil único App SerafIA, router por hash y el shell del SDK
 * (NwtSidebar + NwtToolbar + .nwt-app__content) alrededor de cada pantalla.
 */
(function () {
  'use strict';

  var S = window.SDK, D = window.DATOS, P = window.PANTALLAS, N = window.NAOWEE;
  var app = document.getElementById('app');
  var limpiar = null;

  /* ---------- sesión ---------- */
  /* Demo de un solo perfil: no hay selector, la sesión es siempre App SerafIA. */
  var sesion = { rol: D.roles[0].id, ultimoRol: D.roles[0].id };
  function rolPorId(id) { return D.roles.filter(function (r) { return r.id === id; })[0] || null; }
  function salir() { ir('#/'); }
  function ir(hash) { if (location.hash === hash) { navegar(); } else { location.hash = hash; } }

  /* ---------- rutas ---------- */
  /* Una línea por pantalla. Para sumar un rol: agregarlo en datos.js
     (roles + menus si usa sidebar), crear pantallas/<rol>-<vista>.js,
     cargarlo en dev.html y registrar aquí su ruta. */
  var RUTAS = {
    '#/': { pantalla: 'inicio', rol: 'estudiante' },
    '#/bienestar': { pantalla: 'bienestar', rol: 'estudiante' }
  };

  /* ---------- toast ----------
     Un host por superficie: el de la página (#toast-host, como hace
     NwtApplication) y, cuando el aviso nace dentro del teléfono de una app móvil,
     el de la pantalla del teléfono (#mob-toast) — el aviso sale donde se tocó,
     no en la página que aloja el device. `key` deduplica: si el mismo aviso
     ya está visible (p.ej. se sigue tecleando en un buscador que no filtra),
     solo se estira el tiempo en vez de volver a animar la entrada. */
  function hostDe(origen) {
    var mob = origen && origen.closest ? origen.closest('#mob') : null;
    return (mob && mob.querySelector('#mob-toast')) || document.getElementById('toast-host');
  }
  function toast(cfg) {
    var host = cfg.host || hostDe(cfg.origen);
    if (!host) { return; }
    var visible = host.querySelector('.nwt-toast--visible');
    if (!(cfg.key && visible && host._toastKey === cfg.key)) {
      host.innerHTML = S.toast({ title: cfg.title, message: cfg.message, theme: cfg.theme || 'neutral', icon: cfg.icon, cls: cfg.cls, visible: false });
      requestAnimationFrame(function () { var t = host.querySelector('.nwt-toast'); if (t) { t.classList.add('nwt-toast--visible'); } });
    }
    host._toastKey = cfg.key || null;
    clearTimeout(host._toastTimer);
    host._toastTimer = setTimeout(function () { cerrarToast(host); }, cfg.ms || 4200);
  }
  function cerrarToast(host) {
    var hosts = host ? [host] : document.querySelectorAll('#toast-host, .nws-mob__toast');
    hosts.forEach(function (h) { var t = h.querySelector('.nwt-toast'); if (t) { t.classList.remove('nwt-toast--visible'); } h._toastKey = null; });
  }

  /* Lo que está fuera de la exploración no se simula ni queda mudo: dice
     "Disponible próximamente" con el nombre de la función, en UNA línea:
     solo título, sin mensaje. */
  function proximamente(label, origen) {
    label = (label || '').replace(/\s+/g, ' ').trim() || 'Esta función';
    toast({ key: 'prox:' + label, title: label + ' · Disponible próximamente', cls: 'nws-toast--linea', theme: 'neutral', icon: 'info', origen: origen });
  }

  /* Botones marcados a mano con data-toast: el rótulo que se le muestra al
     usuario en el aviso. Si no está acá se toma del propio botón. */
  var FUERA = {
    exportar: 'Exportar',
    /* landing pública: piezas cuyo aria-label es largo (el titular, el alt
       del banner) y no sirve como rótulo del aviso */
    inscribete: 'Inscripciones',
    novedad: 'Novedades',
    noticia: 'Noticias',
    galeria: 'Galería multimedia',
    videotutoriales: 'Videotutoriales'
  };

  /* Red de seguridad: cualquier control que se vea clickeable y no tenga a
     nadie escuchándolo. Todas las pantallas enganchan por atributos data-*
     (closest('[data-…]')); los que emite el SDK como estructura y no como
     gancho se descartan. Si el clic llega acá sin ninguno, la función no
     existe en la exploración → "Disponible próximamente". */
  var SIN_GANCHO = { 'data-bind': 1, 'data-field': 1, 'data-tabs-indicator': 1, 'data-origen': 1, 'data-step': 1, 'data-pill': 1, 'data-search': 1 };
  function enganchado(el) {
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      for (var i = 0; i < n.attributes.length; i++) { var a = n.attributes[i].name; if (a.indexOf('data-') === 0 && !SIN_GANCHO[a]) { return true; } }
      if (n.matches('a[href], .nwt-empty-state__action')) { return true; }
    }
    return false;
  }
  function rotuloDe(el) {
    return el.getAttribute('aria-label') || el.getAttribute('title') || (el.querySelector('.nwt-button__content, .nwt-tabs__label-text, .nwt-card__header') || el).textContent;
  }

  /* ---------- indicadores animados de tabs y segmentado ----------
     En React los posiciona useTrackedIndicator midiendo el tab activo.
     Acá se hace lo mismo después de pintar. */
  /* DC-086: getBoundingClientRect() mide en píxeles de PANTALLA (después del
     transform:scale del escenario del teléfono en landing-app.js), pero insetInlineStart se aplica en el espacio
     LOCAL del elemento, antes de ese transform — con escala != 1 quedaba
     desfasado (escalado dos veces). offsetLeft/offsetWidth son medidas de
     layout, ajenas a cualquier transform de un ancestro, e igual de válidas
     acá: tanto el tab activo como el tag activo tienen como offsetParent al
     contenedor relative de al lado (.nwt-tabs__list / .nwt-tag-group__track),
     que es exactamente el origen que insetInlineStart necesita. */
  function posicionarIndicadores(scope) {
    (scope || document).querySelectorAll('.nwt-tabs').forEach(function (tabs) {
      var act = tabs.querySelector('.nwt-tabs__tab--active'), ind = tabs.querySelector('.nwt-tabs__indicator');
      if (!ind) { return; }
      if (!act) { ind.style.width = '0px'; return; }
      ind.style.insetInlineStart = act.offsetLeft + 'px'; ind.style.width = act.offsetWidth + 'px';
    });
    (scope || document).querySelectorAll('.nwt-tag-group').forEach(function (g) {
      var act = g.querySelector('.nwt-tag-group__tag--active'), pill = g.querySelector('.nwt-tag-group__pill');
      if (!pill) { return; }
      if (!act) { pill.style.width = '0px'; return; }
      pill.style.insetInlineStart = act.offsetLeft + 'px'; pill.style.width = act.offsetWidth + 'px';
    });
  }

  /* La entrada de la vista la hace S.repintar (sdk.js): emite el mismo
     `nwt-motion="fade"` que React emite con renderMotionAttributes, y además
     anima el cambio de alto. `fade` y no `slide` porque al cambiar de pantalla
     cambia todo el contenido, y desplazar un bloque entero se lee como que la
     página se corrió, no como que algo entró.

     Cuánto dura la fase de esqueleto. No sale de un token: los tokens de
     foundations miden ANIMACIONES, y esto es latencia de red simulada — otra
     cosa. 520ms es lo que tarda en leerse como "está cargando" sin que la
     navegación del prototipo se sienta lenta; es la única perilla que hay que
     tocar para ajustarlo (0 la apaga y todo vuelve a pintarse de una).
     Para mirar el esqueleto con calma hay un `?lento` en la query (junto a
     `?rol=`, no en el hash: el hash es la ruta y ensuciarlo la rompe) que lo
     sube a 4s — p.ej. dev.html?lento */
  /* Hook opcional para lo que es GEOMETRÍA y no dato: hay que medir el DOM ya
     pintado, pero no puede esperar a que lleguen los datos. Corre en las dos
     pasadas, la del esqueleto y la de los datos.
     Lo pide la app del conductor: la escala del marco del teléfono se calcula
     contra el alto del escenario, y mientras vivió dentro de mount el teléfono
     se veía a tamaño 1 —desbordado— durante toda la carga, y saltaba a su
     tamaño al llegar los datos. */
  function ajustar(pantalla, root, ctx) {
    if (pantalla.ajustar) { pantalla.ajustar(root, ctx); }
  }

  var LATENCIA = 520;
  var LENTO = /[?&]lento\b/.test(location.search);
  function pintarCuandoCargue(root, fn) {
    var ms = LENTO ? 4000 : LATENCIA;
    if (!ms) { fn(root); return; }
    setTimeout(function () {
      /* si ya se navegó a otra parte, este render quedó viejo: no pisar */
      if (!document.body.contains(root)) { return; }
      fn(root);
    }, ms);
  }

  /* ---------- shell ---------- */
  function menuDe(rol, hash) {
    var items = D.menus[rol.id] || [];
    return items.map(function (m) {
      var activa = (m.activa || [m.route]).indexOf(hash) >= 0;
      return { section: m.section, id: m.id, label: m.label, icon: m.icon, route: m.route, count: m.count, active: activa };
    });
  }

  function shell(rol, hash, pantalla, ctx) {
    var tb = pantalla.toolbar ? pantalla.toolbar(ctx) : { body: S.title({ text: pantalla.titulo }), actions: '' };
    var colapsado = false; try { colapsado = localStorage.getItem('proto.nav') === 'colapsado'; } catch (e) { /* */ }
    /* Shell con sidebar para los roles de escritorio (los fullscreen, como
       la app del conductor, no pasan por acá). */
    return S.h('div', { class: 'nwt-app', 'nwt-theme': rol.theme },
      S.h('div', { class: 'nwt-app__body' },
        S.sidebar({
          collapsed: colapsado,
          menus: menuDe(rol, hash),
          logoutLabel: 'Cambiar de perfil',
          /* Marca Naowee: horizontal expandido, isotipo colapsado (CSS decide
             cuál se ve). Debajo, el portal del rol como badge. Si un cliente
             necesita co-branding, su logo va en .nws-brand__tenant. */
          logo: S.h('div', { class: 'nws-brand' },
            S.h('div', { class: 'nws-brand__naowee' }, N.logo),
            S.h('div', { class: 'nws-brand__naowee--compact' }, N.icono),
            S.h('div', { class: 'nws-brand__tenant' },
              S.h('div', { class: 'nws-row nws-row--sm nws-brand__text' },
                S.badge({ label: rol.portal, size: 'small', theme: rol.theme })))),
          /* Mismo avatar que el selector de rol (iniciales del rol, color del
             rol) y el rol como primera línea; debajo quién lo ocupa y dónde. */
          footer: S.h('div', { class: 'nws-owner' },
            S.h('div', { class: 'nws-row' },
              S.avatar({ text: rol.iniciales, size: 'small', variant: 'loud', color: rol.color }),
              S.h('div', { class: 'nws-col' }, S.h('span', { class: 'nwt-smalltext-font-semibold nws-ink' }, S.esc(rol.rol)), S.h('span', { class: 'nwt-smalltext-font-regular nws-clip' }, S.esc(rol.nombre + ' · ' + rol.organizacion)))))
        }),
        S.h('div', { class: 'nwt-app__main' },
          S.toolbar({ body: tb.body, actions: tb.actions }),
          S.h('div', { class: 'nwt-app__content', id: 'view' }))));
  }

  function fueraDeAlcance(rol, hash) {
    var label = hash.split('/').pop().replace(/-/g, ' ');
    var titulo = label.charAt(0).toUpperCase() + label.slice(1);
    return {
      titulo: titulo, menu: null,
      toolbar: function () { return { body: S.title({ text: titulo, subtitle: rol.portal }), actions: S.avatar({ text: rol.iniciales, size: 'small', variant: 'loud', theme: rol.theme }) }; },
      render: function () { return S.h('div', { style: 'display:flex;align-items:center;justify-content:center;flex:1' }, S.emptyState({ title: 'Disponible próximamente', description: '«' + titulo + '» estará disponible en una próxima versión del módulo. Las secciones construidas se abren desde el menú.', actionLabel: 'Volver al inicio del rol' })); },
      mount: function (root) { var b = root.querySelector('.nwt-empty-state__action'); var f = function () { ir(rol.inicio); }; if (b) { b.addEventListener('click', f); } return function () { if (b) { b.removeEventListener('click', f); } }; }
    };
  }

  /* ---------- navegación ---------- */
  function navegar() {
    var hash = location.hash || '#/';
    if (hash === '#/salir') { salir(); return; }
    var ruta = RUTAS[hash];

    if (limpiar) { limpiar(); limpiar = null; }
    cerrarToast();

    {
      var rol = rolPorId(sesion.rol);
      var pantalla = ruta ? P[ruta.pantalla] : fueraDeAlcance(rol, hash);
      var ctx = { S: S, D: D, rol: rol, sesion: sesion, ir: ir, toast: toast, cerrarToast: cerrarToast, proximamente: proximamente, salir: salir, posicionarIndicadores: posicionarIndicadores, cargando: false };
      document.title = pantalla.titulo + ' · SerafIA';
      var destino = pantalla.fullscreen ? app : null;
      if (!destino) { app.innerHTML = shell(rol, hash, pantalla, ctx); destino = document.getElementById('view'); }

      /* Dos pasadas: primero la pantalla con ctx.cargando=true (los componentes
         que reciben `skeleton` pintan su silueta) y después con los datos. Es
         lo que pasa en el micro-frontend real, donde el repositorio va a la API
         y la vista ya está montada esperando — no una demora decorativa.
         El mount va SOLO en la segunda: en la fase de esqueleto no hay nada que
         escuchar ni intervalos que arrancar, y una silueta que responde promete
         algo que todavía no está. */
      ctx.cargando = true;
      destino.innerHTML = pantalla.render(ctx);
      ajustar(pantalla, destino, ctx);
      ctx.cargando = false;
      pintarCuandoCargue(destino, function (root) {
        /* Las siluetas y los datos no miden lo mismo, así que el cambio de
           esqueleto a contenido también es un cambio de tamaño: S.repintar lo
           anima y de paso hace la entrada, en vez de que la vista dé un salto
           justo en el momento en que el usuario está mirando.
           Excepción: una pantalla `estable` pinta lo mismo en las dos pasadas
           (su render es puro cromo y la carga vive adentro, la resuelve su
           mount). Repintarla haría parpadear un marco que no cambió. */
        if (!pantalla.estable) { S.repintar(root, pantalla.render(ctx)); }
        limpiar = pantalla.mount(root, ctx);
        ajustar(pantalla, root, ctx);
        posicionarIndicadores(document);
      });
    }
    posicionarIndicadores(document);
    requestAnimationFrame(function () { posicionarIndicadores(document); });
  }

  /* ---------- eventos globales ---------- */
  function menuLabel(href) {
    var items = (sesion.rol && D.menus[sesion.rol]) || [];
    for (var i = 0; i < items.length; i++) { if (items[i].route === href) { return items[i].label; } }
    return href.split('/').pop();
  }
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    var ir_ = t.closest('[data-ir]');
    if (ir_) {
      ev.preventDefault();
      /* un botón que lleva a otra pantalla Y abre algo ahí: el destino lee
         window.PROTO_ABRIR al montarse. */
      var abrir = ir_.getAttribute('data-abrir-modal');
      if (abrir) { window.PROTO_ABRIR = abrir; }
      ir(ir_.getAttribute('data-ir')); return;
    }
    if (t.closest('[data-logout]')) { ev.preventDefault(); salir(); return; }
    var ct = t.closest('[data-close-toast]'); if (ct) { cerrarToast(ct.closest('#toast-host, .nws-mob__toast')); return; }
    var ts = t.closest('[data-toast]'); if (ts) { var k = ts.getAttribute('data-toast'); proximamente(FUERA[k] || rotuloDe(ts) || k, ts); return; }
    /* Chips de notificación del toolbar: scrollean a la sección y la
       resaltan un instante. */
    var nf = t.closest('[data-notif]');
    if (nf) {
      var idDestino = nf.getAttribute('data-notif');
      var destino = document.getElementById(idDestino);
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        destino.classList.add('nws-notif-resalte');
        setTimeout(function () { destino.classList.remove('nws-notif-resalte'); }, 1600);
      }
      /* el toolbar está fuera de #view: la reacción de la propia pantalla
         (p.ej. cambiar de tab) va por evento — la pantalla escucha 'nao:notif'. */
      document.dispatchEvent(new CustomEvent('nao:notif', { detail: { destino: idDestino } }));
      return;
    }
    if (t.closest('[data-toggle-nav]')) {
      var nav = document.getElementById('nav'), col = nav.classList.toggle('nwt-sidebar--collapsed');
      var b = nav.querySelector('[data-toggle-nav]'); b.setAttribute('aria-pressed', col ? 'true' : 'false'); b.setAttribute('aria-label', col ? 'Expandir menú' : 'Colapsar menú');
      var ic = b.querySelector('.nwt-sidebar__toolbar__toggle'); ic.classList.toggle('nwt-sidebar__toolbar__toggle--back', !col); ic.querySelector('i').className = col ? 'naotech-icon-drawer' : 'naotech-icon-chevron-right';
      try { localStorage.setItem('proto.nav', col ? 'colapsado' : 'abierto'); } catch (e) { /* */ }
      posicionarIndicadores(document);
      return;
    }
    var link = t.closest('.nwt-sidebar__menu__link[href^="#/"]');
    if (link) {
      ev.preventDefault();
      var href = link.getAttribute('href');
      /* sección del mapa del módulo sin pantalla construida: se avisa y se
         queda donde está, en vez de llevar a una página vacía */
      if (!RUTAS[href]) { proximamente(menuLabel(href), link); return; }
      ir(href); return;
    }
    /* paginador y controles de tabla que no tienen datos detrás */
    var pag = t.closest('.nwt-pagination'); if (pag && t.closest('button:not([disabled])')) { proximamente('Paginación', pag); return; }
    /* red de seguridad */
    var ctl = t.closest('button:not([disabled]), [role="tab"], [role="button"], .nwt-card--clickable, .nws-list__row--click');
    if (ctl && !enganchado(ctl)) { proximamente(rotuloDe(ctl), ctl); }
  });
  /* buscadores sin nombre: nadie los escucha, así que no filtran nada */
  document.addEventListener('input', function (ev) {
    var q = ev.target.closest && ev.target.closest('input[data-search=""]');
    if (q) { proximamente('Búsqueda', q); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter') { return; }
    var q = ev.target.closest && ev.target.closest('input[data-search=""], .nwt-pagination__control');
    if (q) { proximamente(q.matches('.nwt-pagination__control') ? 'Paginación' : 'Búsqueda', q); }
  });
  window.addEventListener('hashchange', navegar);
  window.addEventListener('resize', function () { posicionarIndicadores(document); });

  /* ---------- barras de scroll: 2px → 8px con el mouse encima ----------
     La clase nws-scroll--hover va en el contenedor que scrollea más cercano
     al mouse. Es una clase y no :hover porque Chrome no vuelve a resolver el
     estilo de las partes de la barra al cambiar el :hover del contenedor
     (ver app.css). Un solo listener delegado, sin escuchar cada lista. */
  var scrollConMouse = null;
  function scrollable(el) {
    for (; el && el !== document.body && el.nodeType === 1; el = el.parentElement) {
      var ov = getComputedStyle(el).overflowY;
      if ((ov === 'auto' || ov === 'scroll') && el.scrollHeight > el.clientHeight + 1) { return el; }
    }
    return null;
  }
  document.addEventListener('mouseover', function (ev) {
    var s = scrollable(ev.target);
    if (s === scrollConMouse) { return; }
    if (scrollConMouse) { scrollConMouse.classList.remove('nws-scroll--hover'); }
    scrollConMouse = s;
    if (s) { s.classList.add('nws-scroll--hover'); }
  });
  document.addEventListener('mouseleave', function () { if (scrollConMouse) { scrollConMouse.classList.remove('nws-scroll--hover'); scrollConMouse = null; } });

  document.body.insertAdjacentHTML('beforeend', '<div id="toast-host"></div>');
  navegar();
})();
