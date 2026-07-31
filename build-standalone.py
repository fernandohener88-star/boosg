#!/usr/bin/env python3
"""Baut aus den Quelldateien zwei eigenständige HTML-Dateien.

CSS, JavaScript und alle Bilder werden eingebettet, sodass jede Datei
ohne weitere Dateien im Browser läuft. Die beiden Seiten verlinken
untereinander über ihren Dateinamen — sie müssen also im selben Ordner
liegen.

    python3 build-standalone.py
"""

import base64
import mimetypes
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent

# Quelle -> Ziel
PAGES = {
    "index.html": "District-Null41.html",
    "speisekarte.html": "District-Null41-Speisekarte.html",
}


def data_uri(path: pathlib.Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def build(source: str, target: str) -> int:
    html = (ROOT / source).read_text(encoding="utf-8")

    html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        "<style>\n" + (ROOT / "style.css").read_text(encoding="utf-8") + "\n</style>",
    )
    html = html.replace(
        '<script src="script.js"></script>',
        "<script>\n" + (ROOT / "script.js").read_text(encoding="utf-8") + "\n</script>",
    )

    for image in sorted((ROOT / "assets/img").iterdir()):
        html = html.replace(f'src="{image.relative_to(ROOT).as_posix()}"', f'src="{data_uri(image)}"')

    # Querverweise auf die jeweils andere eigenständige Datei umbiegen
    for src, dst in PAGES.items():
        html = re.sub(rf'(href=")({re.escape(src)})(?=[#"])', rf"\1{dst}", html)

    # Nichts darf mehr auf eine lokale Datei zeigen — außer auf die
    # jeweils andere eigenständige Seite
    allowed = tuple(PAGES.values())
    leftovers = [
        ref
        for ref in re.findall(r'(?:src|href)="(?!https?:|mailto:|tel:|data:|#)([^"]+)"', html)
        if not ref.startswith(allowed)
    ]
    if leftovers:
        raise SystemExit(f"{target}: nicht eingebettete Verweise: {leftovers}")

    (ROOT / target).write_text(html, encoding="utf-8")
    size = len(html.encode("utf-8")) // 1024
    print(f"{target:38} {size:>5} KB")
    return size


if __name__ == "__main__":
    for src, dst in PAGES.items():
        build(src, dst)
    sys.exit(0)
