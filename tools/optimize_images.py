"""Create responsive cockpit copies; retain every original at its native resolution.

Requires the official libwebp cwebp command. Does not run during normal serving.
"""
from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT/'optimized/responsive'
TARGET.mkdir(exist_ok=True)
images = [path for path in (ROOT/'optimized').glob('cockpit-silla-*.webp') if path.stat().st_size > 500000]
report = []
for original in images:
    variants = []
    for width in (640, 1280, 1920):
        target = TARGET/f'{original.stem}-{width}.webp'
        subprocess.run(['cwebp', '-quiet', '-q', '90', '-m', '6', '-resize', str(width), '0', str(original), '-o', str(target)], check=True)
        variants.append({'width':width,'file':str(target.relative_to(ROOT)),'bytes':target.stat().st_size})
    relative = str(original.relative_to(ROOT))
    dimensions = subprocess.check_output(['sips', '-g', 'pixelWidth', str(original)], text=True)
    original_width = int(re.search(r'pixelWidth: (\d+)', dimensions)[1])
    srcset = ', '.join(f'{entry["file"]} {entry["width"]}w' for entry in variants) + f', {relative} {original_width}w'
    for page in ROOT.glob('*.html'):
        source = page.read_text()
        def responsive(match):
            tag = re.sub(r'\s+(?:srcset|sizes)="[^"]*"', '', match[0])
            return tag.replace(' />', f' srcset="{srcset}" sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 960px) 80vw, 50vw" />')
        updated = re.sub(r'<img\b[^>]*\bsrc="'+re.escape(relative)+r'"[^>]*>', responsive, source)
        if source != updated: page.write_text(updated)
    report.append({'original':relative,'original_bytes':original.stat().st_size,'variants':variants})
(ROOT/'docs/seo/responsive-images.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'Responsive copies generated for {len(images)} large images. Originals retained.')
