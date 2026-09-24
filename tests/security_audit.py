"""Dependency-free security checks for this static site."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
ALLOWED_FRAME_HOSTS = {"www.youtube.com"}
CSP_MARKER = "content-security-policy"
FORBIDDEN_TEXT = re.compile(
    r"(?:innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\s*\(|new\s+Function\s*\(|javascript:|on(?:error|load|click|mouseover)\s*=)",
    re.IGNORECASE,
)


class SecurityParser(HTMLParser):
    def __init__(self, path: Path) -> None:
        super().__init__(convert_charrefs=True)
        self.path = path
        self.errors: list[str] = []
        self.has_csp = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {name.lower(): value or "" for name, value in attrs}

        if any(name.lower().startswith("on") for name, _ in attrs):
            self.errors.append("inline event handler found")

        if tag.lower() == "meta" and attributes.get("http-equiv", "").lower() == CSP_MARKER:
            self.has_csp = True
            content = attributes.get("content", "")
            for directive in ("default-src 'self'", "object-src 'none'", "script-src 'self'"):
                if directive not in content:
                    self.errors.append(f"CSP is missing {directive}")

        if tag.lower() == "script" and "src" not in attributes:
            script_type = attributes.get("type", "").lower()
            if script_type != "application/ld+json":
                self.errors.append("inline executable script found")

        if tag.lower() == "a" and attributes.get("target", "").lower() == "_blank":
            rel = set(attributes.get("rel", "").lower().split())
            if not {"noopener", "noreferrer"}.issubset(rel):
                self.errors.append("target=_blank link lacks noopener and noreferrer")

        if tag.lower() == "iframe":
            source = urlparse(attributes.get("src", ""))
            if source.scheme != "https" or source.hostname not in ALLOWED_FRAME_HOSTS:
                self.errors.append("iframe source is not an approved HTTPS origin")
            if "sandbox" not in attributes:
                self.errors.append("iframe is missing sandbox")

        for name in ("src", "href"):
            value = attributes.get(name, "")
            if value.lower().startswith("http://"):
                self.errors.append(f"insecure HTTP URL in {name}")


def audit_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    parser = SecurityParser(path)
    parser.feed(text)
    errors = [f"{path.relative_to(ROOT)}: {error}" for error in parser.errors]
    if not parser.has_csp:
        errors.append(f"{path.relative_to(ROOT)}: missing CSP meta tag")
    if FORBIDDEN_TEXT.search(text):
        errors.append(f"{path.relative_to(ROOT)}: dangerous DOM or JavaScript pattern found")
    return errors


def main() -> int:
    errors: list[str] = []
    if not HTML_FILES:
        errors.append("no HTML pages found")
    for path in HTML_FILES:
        errors.extend(audit_file(path))
    for path in sorted(ROOT.glob("*.js")):
        if FORBIDDEN_TEXT.search(path.read_text(encoding="utf-8")):
            errors.append(f"{path.relative_to(ROOT)}: dangerous DOM or JavaScript pattern found")

    if errors:
        print("Security audit failed:")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    print(f"Security audit passed for {len(HTML_FILES)} HTML pages and {len(list(ROOT.glob('*.js')))} JavaScript files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
