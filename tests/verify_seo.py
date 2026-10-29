"""Verify SEO relationships against files, indexable inventory and real content."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://simracingec.com'
PAGES = json.loads((ROOT/'seo-pages.json').read_text())
urls = []
titles = set()

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.images = []; self.canonicals = []; self.h1 = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1': self.h1 += 1
        if tag == 'a': self.links.append(attrs.get('href', ''))
        if tag == 'img': self.images.append(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical': self.canonicals.append(attrs['href'])

for filename, data in PAGES.items():
    text = (ROOT/filename).read_text(); parser = Page(); parser.feed(text)
    policy = re.search(r'<meta http-equiv="Content-Security-Policy" content="([^"]+)"',text)[1]
    header = next(line.split(': ',1)[1] for line in (ROOT/'_headers').read_text().splitlines() if 'Content-Security-Policy:' in line)
    assert policy == header, (filename, 'CSP differs between document and server')
    assert 'unsafe-inline' not in policy and 'unsafe-eval' not in policy and 'https://*' not in policy
    assert parser.h1 == 1, (filename, 'one main heading')
    assert len(parser.canonicals) == 1, filename
    route = '/' if filename == 'index.html' else '/' + filename[:-5]
    assert parser.canonicals[0] == BASE+route, filename
    urls.append(BASE+route)
    title = re.search(r'<title>(.*?)</title>', text)[1]
    assert title not in titles, filename
    titles.add(title)
    assert 'name="robots" content="index, follow' in text, filename
    graph = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)[1])['@graph']
    if filename == 'index.html':
        website = next(entry for entry in graph if entry['@type'] == 'WebSite')
        assert website['name'] == 'Sim Racing Ecuador' and website['url'] == BASE+'/'
    else:
        assert len(re.findall(r'<nav class="seo-breadcrumb',text)) == 1, filename
        crumbs = next(entry for entry in graph if entry['@type'] == 'BreadcrumbList')['itemListElement']
        assert crumbs[-1]['item'] == BASE+route
    if 'item_id' in data:
        product = next(entry for entry in graph if entry['@type'] == 'Product')
        assert not any(key in product for key in ['offers', 'aggregateRating', 'review', 'gtin', 'sku'])
        assert data['name'].split()[0].lower() in text.lower()
    for image in parser.images:
        assert image.get('width') and image.get('height'), (filename, image)
        assert (ROOT/unquote(image['src'].split('?')[0].lstrip('/'))).exists(), (filename, image['src'])
    for link in parser.links:
        url = urlsplit(link)
        if url.netloc and url.netloc != 'simracingec.com': continue
        if url.scheme and url.scheme != 'https': continue
        if not url.path: target = ROOT/filename
        else:
            relative = unquote(url.path.lstrip('/'))
            target = ROOT/(relative or 'index.html')
            if not target.suffix and not target.is_dir(): target = target.with_suffix('.html')
        assert target.exists(), (filename, link)
        if url.fragment and target.suffix == '.html':
            assert re.search(r'\bid=["\']'+re.escape(unquote(url.fragment))+r'["\']', target.read_text()), (filename, link, 'missing fragment')

tree = ET.parse(ROOT/'sitemap.xml')
actual = [node.text for node in tree.findall('.//{*}loc')]
assert set(actual) == set(urls) and len(actual) == len(urls)
assert 'lastmod' not in (ROOT/'sitemap.xml').read_text()
assert 'Sitemap: '+BASE+'/sitemap.xml' in (ROOT/'robots.txt').read_text()
assert 'noindex' in (ROOT/'404.html').read_text()
print(f'PASS: SEO inventory, canonical URLs, structured data, headings, images and links ({len(PAGES)} pages)')
