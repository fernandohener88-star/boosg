#!/usr/bin/env python3
"""Embed local images as base64 data URIs in HTML files to create standalone files."""
import base64
import os
import re

REPO = "/home/user/boosg"

IMAGES = {
    "assets/img/logo-crest.png": "image/png",
    "assets/img/logo-transparent.png": "image/png",
    "assets/img/restaurant.jpg": "image/jpeg",
    "assets/img/steak.jpg": "image/jpeg",
    "assets/img/haehnchen.jpg": "image/jpeg",
}

def encode_image(rel_path, mime):
    full = os.path.join(REPO, rel_path)
    with open(full, "rb") as f:
        data = base64.b64encode(f.read()).decode("ascii")
    return f"data:{mime};base64,{data}"

# Pre-encode all images
encoded = {path: encode_image(path, mime) for path, mime in IMAGES.items()}

def embed(html):
    # Replace all occurrences of image references (in src=, url('...'), url("..."), url(...))
    for path, data_uri in encoded.items():
        # Handle various quote styles and url() forms
        html = html.replace(f'src="{path}"', f'src="{data_uri}"')
        html = html.replace(f"src='{path}'", f"src='{data_uri}'")
        html = html.replace(f'url("{path}")', f'url("{data_uri}")')
        html = html.replace(f"url('{path}')", f"url('{data_uri}')")
        html = html.replace(f'url("{path}")', f'url("{data_uri}")')
        # Also handle the style attribute forms like background-image:url('...')
        html = html.replace(f"url('{path}')", f"url('{data_uri}')")
        html = html.replace(f'background:url("{path}")', f'background:url("{data_uri}")')
        html = html.replace(f"background:url('{path}')", f"background:url('{data_uri}')")
    return html

files = [
    ("index.html", "Paulaner stuben.html"),
    ("speisekarte.html", "Speisekarte.html"),
]

for src, dst in files:
    src_path = os.path.join(REPO, src)
    dst_path = os.path.join(REPO, dst)
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()
    html = embed(html)
    with open(dst_path, "w", encoding="utf-8") as f:
        f.write(html)
    size_kb = os.path.getsize(dst_path) / 1024
    print(f"{dst}: {size_kb:.1f} KB")

print("Done.")
