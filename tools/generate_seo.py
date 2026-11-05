"""Generate consistent static metadata and a sitemap from the actual HTML pages.

Run after changing seo-pages.json. No timestamps are fabricated. --check is safe in CI.
"""
from pathlib import Path
import argparse
import html
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://simracingec.com/"
NAME = "Sim Racing Ecuador"
VERIFY = "Gu_d4Ptti0s6A-qwPAxk8G0DzkrN6_cwcLYZ2DY35jA"
START, END = "<!-- SEO: generated -->", "<!-- /SEO -->"


def render_pages():
    pages = json.loads((ROOT / "seo-pages.json").read_text())
    output = {}
    for filename, data in pages.items():
        source = (ROOT / filename).read_text()
        url = BASE + ("" if filename == "index.html" else filename[:-5])
        # Cloudflare Pages permanently redirects .html to its extensionless route.
        source = re.sub(r"<!-- SEO: generated -->[\s\S]*?<!-- /SEO -->\s*", "", source)
        source = re.sub(r'<title>[\s\S]*?</title>\s*', '', source)
        source = re.sub(r'<meta (?:name="(?:description|twitter:[^"]+|google-site-verification)"|property="og:[^"]+")[^>]*>\s*', '', source)
        source = re.sub(r'<meta name="robots"[^>]*>\s*', '', source)
        source = re.sub(r'<link rel="canonical"[^>]*>\s*', '', source)
        source = re.sub(r'<script type="application/ld\+json">[\s\S]*?</script>\s*', '', source)
        image = BASE + ("social-logo.png" if filename == "index.html" else data['image'])
        esc = lambda value: html.escape(value, quote=True)
        tags = [START, f'<title>{esc(data["title"])}</title>', f'<meta name="description" content="{esc(data["description"])}" />',
                f'<link rel="canonical" href="{url}" />', '<meta name="robots" content="index, follow, max-image-preview:large" />',
                '<meta property="og:locale" content="es_EC" />', f'<meta property="og:type" content="{"product" if "item_id" in data else "website"}" />',
                f'<meta property="og:site_name" content="{NAME}" />', f'<meta property="og:title" content="{esc(data["title"])}" />',
                f'<meta property="og:description" content="{esc(data["description"])}" />', f'<meta property="og:url" content="{url}" />',
                f'<meta property="og:image" content="{esc(image)}" />', f'<meta property="og:image:alt" content="{esc(NAME if filename == "index.html" else data["name"])}" />',
                '<meta name="twitter:card" content="summary_large_image" />', f'<meta name="twitter:title" content="{esc(data["title"])}" />',
                f'<meta name="twitter:description" content="{esc(data["description"])}" />', f'<meta name="twitter:image" content="{esc(image)}" />']
        graph = []
        if filename == "index.html":
            tags.append(f'<meta name="google-site-verification" content="{VERIFY}" />')
            graph.extend([
                {'@type': 'WebSite', '@id': BASE+'#website', 'url': BASE, 'name': NAME, 'alternateName':'SimRacing Ecuador', 'inLanguage': 'es-EC', 'publisher': {'@id':BASE+'#organization'}},
                {'@type':'Store','@id':BASE+'#organization','name':NAME,'alternateName':'SimRacing Ecuador','url':BASE,'logo':BASE+'logo-primary.png',
                 'image': BASE+'social-logo.png','description':'Equipos y asesoría para simulación de carreras en Ecuador.',
                 'telephone':'+593989019836','areaServed':{'@type':'Country','name':'Ecuador'},
                 'address':{'@type':'PostalAddress','streetAddress':'Av. Eloy Alfaro 40-348','addressLocality':'Quito','postalCode':'170513','addressCountry':'EC'},
                 'currenciesAccepted':'USD',
                 'sameAs':['https://www.instagram.com/SimRacingEcuador/','https://www.facebook.com/simracingecuador','https://www.tiktok.com/@simracingec']}])
        crumbs = [{'@type':'ListItem','position':1,'name':'Inicio','item':BASE}]
        if 'item_id' in data:
            crumbs.append({'@type':'ListItem','position':2,'name':'Productos','item':BASE+'productos'})
            # Google Product snippets require an Offer or reviews. Stock is unconfirmed;
            # describe the factual detail page as ItemPage until an offer can be verified.
        if filename != 'index.html':
            crumbs.append({'@type':'ListItem','position':len(crumbs)+1,'name':data['name'],'item':url})
            graph.append({'@type':'BreadcrumbList','@id':url+'#breadcrumbs','itemListElement':crumbs})
            source = re.sub(r'<nav class="seo-breadcrumb\b[^\"]*"[\s\S]*?</nav>\s*', '', source)
            links = ' <span aria-hidden="true">/</span> '.join(f'<a href="{c["item"].replace(BASE, "/")}">{esc(c["name"])}</a>' if c != crumbs[-1] else f'<span aria-current="page">{esc(c["name"])}</span>' for c in crumbs)
            source = re.sub(r'(<main\b[^>]*>)\s*', r'\1\n<nav class="seo-breadcrumb shell" aria-label="Ruta de navegación">'+links+'</nav>\n', source, count=1)
        graph.append({'@type':'CollectionPage' if filename=='productos.html' else 'ItemPage' if 'item_id' in data else 'WebPage','@id':url+'#page','url':url,'name':data['title'],'description':data['description'],
                      'image':image,'inLanguage':'es-EC','isPartOf':{'@id':BASE+'#website'}})
        tags += ['<script type="application/ld+json">'+json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('<','\\u003c')+'</script>', END]
        source = re.sub(r'\s*</head>', '\n'+'\n'.join(tags)+'\n</head>', source, count=1)
        output[filename] = source
    return output


def main():
    args = argparse.ArgumentParser()
    args.add_argument('--check', action='store_true')
    check = args.parse_args().check
    output = render_pages()
    catalog = {}
    data = json.loads((ROOT / 'seo-pages.json').read_text())
    for filename, details in data.items():
        route = '/' if filename == 'index.html' else '/' + filename[:-5]
        catalog[route] = {**details, 'url': BASE.rstrip('/')+route}
    output['analytics-catalog.js'] = '/* Generated by tools/generate_seo.py from the published catalogue. */\nwindow.SRE_PAGES = Object.freeze('+json.dumps(catalog, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')+');\n'
    locations = []
    for filename, source in output.items():
        if not filename.endswith('.html'): continue
        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', source)[1]
        if not re.search(r'content="noindex', source): locations.append(canonical)
    output['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'  <url><loc>{html.escape(url)}</loc></url>\n' for url in locations)+'</urlset>\n'
    output['robots.txt'] = 'User-agent: *\nAllow: /\n\nSitemap: '+BASE+'sitemap.xml\n'
    stale = []
    for name, content in output.items():
        path = ROOT/name
        if path.exists() and path.read_text() == content: continue
        if check: stale.append(name)
        else: path.write_text(content)
    if stale:
        print('Regenerate SEO files: '+', '.join(stale)); return 1
    print(f'SEO {"verified" if check else "generated"}: {len(locations)} canonical pages')
    return 0


if __name__ == '__main__': sys.exit(main())
