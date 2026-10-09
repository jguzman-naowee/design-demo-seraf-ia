#!/usr/bin/env python3
"""
Sincroniza la carpeta Estilos con el demo.

1. Extrae de ../Demo/app.css la capa de tokens de SerafIA (el bloque :root con los --nws-*)
   y la guarda en serafia-tokens.css (foto de lo que está vigente).
2. Compara los tokens --nws-* del demo con los que menciona ESTILOS.md y avisa de los que
   faltan documentar o de los que ya no existen.

estilos.html no necesita sincronizarse: lee los tokens en vivo del demo.
Uso: python3 sincronizar.py
"""
import re, pathlib, datetime

aqui = pathlib.Path(__file__).parent
css = (aqui.parent / 'Demo' / 'app.css').read_text(encoding='utf8')

ini = css.index('SerafIA — capa de estilos')
raiz = css.index(':root {', ini)
fin = css.index('\n}\n', raiz) + 3
bloque = css[raiz:fin]
cab = ('/* Foto de la capa de tokens de SerafIA. Generado por sincronizar.py (%s).\n'
       '   Fuente de verdad: ../Demo/app.css. No editar acá. Todo apunta a tokens --naotech-* del SDK. */\n'
       % datetime.date.today().isoformat())
(aqui / 'serafia-tokens.css').write_text(cab + bloque, encoding='utf8')

en_css = set(re.findall(r'--nws-[a-z0-9-]+(?=\s*:)', bloque))
md = (aqui / 'ESTILOS.md').read_text(encoding='utf8')
en_md = set(re.findall(r'--nws-[a-z0-9-]+', md))
print('tokens --nws-* en el demo: %d' % len(en_css))
faltan = sorted(en_css - en_md)
sobran = sorted(t for t in en_md - en_css if not t.endswith('-'))
print('sin documentar en ESTILOS.md:', ', '.join(faltan) or 'ninguno')
print('documentados que ya no existen:', ', '.join(sobran) or 'ninguno')
