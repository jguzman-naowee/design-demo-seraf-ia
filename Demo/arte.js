/**
 * Ilustraciones de las cartas del día de SerafIA y sus helpers de color.
 * Todos los colores salen de tokens del SDK (--naotech-color-*): no hay hex.
 * Se carga antes de pantallas/inicio.js y también lo usa ../Estilos/estilos.html.
 *
 * 1 Sin batería · 2 Nublado · 3 A mi ritmo · 4 Cielo despejado · 5 Al 100
 * (los números son los 5 niveles internos; el estudiante nunca los ve)
 */
window.SERAFIA_ARTE = (function () {
  /* ---------- ilustraciones de las cartas (colores = paleta del SDK) ---------- */
  function F(t) { return 'style="fill:var(--naotech-color-' + t + ')"'; }
  function K(t, w) { return 'style="fill:none;stroke:var(--naotech-color-' + t + ');stroke-width:' + (w || 3) + ';stroke-linecap:round;stroke-linejoin:round"'; }
  var defs =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    /* 1 · Sin batería */
    '<g id="art-1"><rect x="16" y="33" width="60" height="34" rx="8" ' + F('white-alpha-100') + ' style="fill:var(--naotech-color-white-alpha-100);stroke:var(--naotech-color-gray-900);stroke-width:4"/>' +
    '<rect x="79" y="45" width="7" height="10" rx="2" ' + F('gray-900') + '/><rect x="22" y="39" width="10" height="22" rx="3" ' + F('purple-700') + '/>' +
    '<path d="M44 50h6 M58 50h6" ' + K('gray-900') + '/></g>' +
    /* 2 · Nublado */
    '<g id="art-2"><ellipse cx="50" cy="44" rx="27" ry="14" ' + F('white-alpha-100') + '/><circle cx="37" cy="38" r="13" ' + F('white-alpha-100') + '/><circle cx="58" cy="34" r="16" ' + F('white-alpha-100') + '/>' +
    '<path d="M36 66l-4 10 M50 66l-4 10 M64 66l-4 10" ' + K('blue-500', 4) + '/><path d="M42 44v3 M58 44v3 M46 52q4-3 8 0" ' + K('blue-700', 2.5) + '/></g>' +
    /* 3 · A mi ritmo */
    '<g id="art-3"><path d="M20 62a30 26 0 0 1 60 0z" ' + F('green-500') + '/><path d="M50 36v26 M32 46l8 16 M68 46l-8 16" ' + K('green-800') + '/>' +
    '<circle cx="84" cy="56" r="9" ' + F('green-300') + '/><circle cx="87" cy="53" r="1.8" ' + F('gray-900') + '/><rect x="28" y="62" width="10" height="9" rx="3" ' + F('green-300') + '/><rect x="62" y="62" width="10" height="9" rx="3" ' + F('green-300') + '/></g>' +
    /* 4 · Cielo despejado */
    '<g id="art-4"><circle cx="50" cy="50" r="17" ' + F('yellow-700') + '/><path d="M50 19v10 M50 71v10 M19 50h10 M71 50h10 M28 28l7 7 M65 65l7 7 M72 28l-7 7 M35 65l-7 7" ' + K('yellow-900', 5) + '/>' +
    '<path d="M43 48v2 M57 48v2 M45 56q5 4 10 0" ' + K('gray-900', 2.5) + '/></g>' +
    /* 5 · Al 100 */
    '<g id="art-5"><ellipse cx="24" cy="42" rx="9" ry="16" ' + F('orange-700') + ' transform="rotate(14 24 42)"/><ellipse cx="76" cy="42" rx="9" ry="16" ' + F('orange-700') + ' transform="rotate(-14 76 42)"/>' +
    '<circle cx="50" cy="52" r="28" ' + F('orange-300') + '/><ellipse cx="50" cy="65" rx="14" ry="10" ' + F('orange-100') + '/><ellipse cx="50" cy="59" rx="5" ry="3.5" ' + F('gray-900') + '/>' +
    '<path d="M44 69q6 6 12 0" ' + K('gray-900', 2.5) + '/><rect x="25" y="41" width="22" height="13" rx="6" ' + F('gray-900') + '/><rect x="53" y="41" width="22" height="13" rx="6" ' + F('gray-900') + '/>' +
    '<path d="M47 46h6" ' + K('gray-900') + '/><path d="M30 45h5 M58 45h5" ' + K('white-alpha-100', 2) + '/></g>' +
    '</defs></svg>';
  return { defs: defs, F: F, K: K };
})();
