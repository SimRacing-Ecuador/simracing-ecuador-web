"""Local preview with Cloudflare Pages style extensionless routes. Always noindex."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import os

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        url = urlsplit(self.path)
        candidate = ROOT / url.path.lstrip('/')
        if url.path != '/' and not candidate.suffix and candidate.with_suffix('.html').is_file():
            self.path = url.path + '.html' + ('?' + url.query if url.query else '')
        super().do_GET()

    def end_headers(self):
        self.send_header('X-Robots-Tag', 'noindex, nofollow')
        super().end_headers()

ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
