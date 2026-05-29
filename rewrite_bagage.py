#!/usr/bin/env python3
"""Rewrite bagage.html to minimalist white/black style."""

with open('/home/user/boosg/bagage.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ── 1. Font import ──────────────────────────────────────────────────────────
html = html.replace(
    "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');",
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');"
)

# ── 2. CSS tokens / :root ────────────────────────────────────────────────────
old_root = """:root {
  --bg:        #0f0e0c;
  --bg-2:      #16140f;
  --cream:     #f5f0e8;
  --cream-dim: #b8b1a3;
  --red:       #e8401c;
  --gold:      #d4a853;
  --card:      #2a2825;
  --line:      #34302a;

  --ff-display: 'Bebas Neue', 'Arial Narrow', sans-serif;
  --ff-body:    'Libre Baskerville', Georgia, serif;
  --ff-mono:    'Space Mono', ui-monospace, monospace;"""

new_root = """:root {
  --bg:        #ffffff;
  --bg-2:      #f5f5f5;
  --cream:     #000000;
  --cream-dim: #666666;
  --red:       #000000;
  --gold:      #000000;
  --card:      #f0f0f0;
  --line:      #e0e0e0;

  --ff-display: 'Inter', system-ui, sans-serif;
  --ff-body:    'Inter', system-ui, sans-serif;
  --ff-mono:    'Inter', system-ui, monospace;"""

html = html.replace(old_root, new_root)

# ── 3. body font-size & line-height ─────────────────────────────────────────
html = html.replace(
    "  font-size: 17px;\n  line-height: 1.7;",
    "  font-size: 17px;\n  line-height: 1.2;"
)

# ── 4. Remove film-grain body::before ───────────────────────────────────────
grain_start = "/* fine film-grain over everything */"
grain_end = "}"
idx_s = html.find(grain_start)
if idx_s != -1:
    idx_e = html.find(grain_end, idx_s) + 1
    html = html[:idx_s] + html[idx_e:]

# ── 5. Remove old hero CSS block (everything from .hero { up to .scrollcue .bar) ──
old_hero_css_start = "/* ============================================================\n   HERO\n   ============================================================ */\n.hero {"
old_hero_css_end = ".scrollcue .bar { width: 1px; height: 34px; background: var(--cream-dim); margin: 10px auto 0; transform-origin: top;"
idx_s = html.find(old_hero_css_start)
idx_e = html.find(old_hero_css_end)
# find end of that line
idx_e_line = html.find('\n', idx_e) + 1

new_hero_css = """/* ============================================================
   HERO
   ============================================================ */
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 60px;
}
.hero__repeat {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding-top: 60px;
}
.hero__repeat span {
  font-size: 22vw;
  line-height: 0.70;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #000;
  display: block;
  text-align: center;
  white-space: nowrap;
  user-select: none;
}
.hero__inner {
  position: relative;
  z-index: 2;
  padding: 0 var(--pad-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.hero__tag {
  font-size: clamp(14px, 1.5vw, 18px);
  font-weight: 300;
  color: #000;
  font-style: italic;
}
.hero__tag b { font-style: normal; font-weight: 700; }

@keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

/* CTA button */
.btn {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--ff-body); font-weight: 400; font-size: 14px;
  letter-spacing: 0.05em;
  padding: 14px 28px; border: 1px solid #000; color: #000;
  background: #fff; cursor: pointer; transition: background .25s, color .25s;
}
.btn:hover { background: #000; color: #fff; }

.scrollcue {
  position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%);
  z-index: 3; font-family: var(--ff-mono); font-size: 10px; letter-spacing: 0.3em;
  color: var(--cream-dim); text-transform: uppercase; text-align: center;
  opacity: 0; animation: fadeUp 1s var(--ease) 1.4s forwards;
}
.scrollcue .bar { width: 1px; height: 34px; background: var(--cream-dim); margin: 10px auto 0; transform-origin: top;"""

if idx_s != -1 and idx_e != -1:
    html = html[:idx_s] + new_hero_css + html[idx_e_line:]

# ── 6. Nav: solid background to white ───────────────────────────────────────
html = html.replace(
    "  background: rgba(15,14,12,0.86);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid var(--line);",
    "  background: rgba(255,255,255,0.95);\n  backdrop-filter: blur(12px);\n  border-bottom: 1px solid #e0e0e0;"
)

# ── 7. Nav brand: font-size & letter-spacing ─────────────────────────────────
html = html.replace(
    "  font-family: var(--ff-display);\n  font-size: 34px; letter-spacing: 0.04em; line-height: 1;\n  display: flex; align-items: center; gap: 12px;",
    "  font-family: var(--ff-display);\n  font-size: 24px; font-weight: 300; letter-spacing: 0em; line-height: 1;\n  display: flex; align-items: center; gap: 12px;"
)

# ── 8. Nav links: remove uppercase, reduce letter-spacing ────────────────────
html = html.replace(
    "  font-family: var(--ff-mono); font-size: 12px; letter-spacing: 0.18em;\n  text-transform: uppercase; color: var(--cream-dim);",
    "  font-family: var(--ff-body); font-size: 14px; letter-spacing: 0em;\n  color: var(--cream-dim);"
)

# ── 9. Mobile menu: dark bg -> white ────────────────────────────────────────
html = html.replace(
    "  background: var(--bg-2); border-left: 1px solid var(--line);",
    "  background: #fff; border-left: 1px solid #e0e0e0;"
)
html = html.replace(
    "  font-family: var(--ff-display); font-size: 44px; letter-spacing: 0.03em;\n  padding: 10px 0; border-bottom: 1px solid var(--line); color: var(--cream);",
    "  font-family: var(--ff-display); font-size: 32px; font-weight: 300; letter-spacing: 0em;\n  padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #000;"
)

# ── 10. About section: remove red quote mark ────────────────────────────────
html = html.replace(
    "  position: absolute; font-family: var(--ff-display); color: var(--red);",
    "  position: absolute; font-family: var(--ff-display); color: #e0e0e0;"
)

# ── 11. Sections background: make about/phil/gallery etc white ──────────────
# About section uses linear-gradient background
html = html.replace(
    "  linear-gradient(var(--bg), var(--bg)); }",
    "  linear-gradient(var(--bg), var(--bg)); }\n"
)

# ── 12. Phil card: dark bg -> white with border ──────────────────────────────
html = html.replace(
    "  position: relative; padding: 40px 30px 36px; background: var(--bg-2);",
    "  position: relative; padding: 40px 30px 36px; background: #fff; border: 1px solid #e0e0e0;"
)

# ── 13. Phil card gradient bar: gold->red -> black ───────────────────────────
html = html.replace(
    "  background: linear-gradient(90deg, var(--gold), var(--red)); transition: width .7s var(--ease) .15s;",
    "  background: #000; transition: width .7s var(--ease) .15s;"
)

# ── 14. Selection color ──────────────────────────────────────────────────────
html = html.replace(
    "::selection { background: var(--red); color: var(--cream); }",
    "::selection { background: #000; color: #fff; }"
)

# ── 15. Progress bar ─────────────────────────────────────────────────────────
html = html.replace(
    "  background: var(--red); z-index: 10000;\n  box-shadow: 0 0 12px rgba(232,64,28,0.7);",
    "  background: #000; z-index: 10000;"
)

# ── 16. Cursor dot/ring: simplify (hide) ────────────────────────────────────
html = html.replace(
    ".cursor-dot  { width: 7px;  height: 7px; background: var(--red); }\n.cursor-ring { width: 34px; height: 34px; border: 1px solid var(--gold);\n  transition: width .25s var(--ease), height .25s var(--ease), background .25s; }\n.cursor-ring.hot { width: 54px; height: 54px; background: rgba(212,168,83,0.12); }",
    ".cursor-dot  { display: none; }\n.cursor-ring { display: none; }"
)

# ── 17. Hero HTML: replace entire hero section ───────────────────────────────
old_hero_html = """<section class="hero" aria-label="Willkommen">
  <div class="hero__bg" aria-hidden="true"></div>
  <div class="hero__grid" aria-hidden="true"></div>"""

# Find full hero section end
idx_hero_start = html.find(old_hero_html)
if idx_hero_start == -1:
    print("ERROR: could not find hero HTML start")
else:
    # Find end of the hero inner div closing tag after hero__sub
    # The hero section ends before the next <section
    idx_next_section = html.find('<section class="sec about"', idx_hero_start)
    # We need to find </section> before that
    idx_hero_end = html.rfind('</section>', idx_hero_start, idx_next_section) + len('</section>')

    new_hero_html = """<section class="hero" aria-label="Willkommen">
  <div class="hero__repeat" aria-hidden="true">
    <span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span>
    <span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span>
    <span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span>
    <span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span><span>BAGAGE</span>
  </div>
  <div class="hero__inner">
    <p class="hero__tag">Ehrlich. Regional. Lecker. — <b>handgemacht in Landau.</b></p>
    <a href="#menu" class="btn">Zur Speisekarte →</a>
  </div>
  <div class="scrollcue" aria-hidden="true">Scroll<div class="bar"></div></div>
</section>"""

    html = html[:idx_hero_start] + new_hero_html + '\n' + html[idx_hero_end:]

# ── 18. Nav brand text: BAGAGE. -> Bagage ────────────────────────────────────
html = html.replace(
    'BAGAGE<span class="dotmark">.</span>',
    'Bagage'
)

# ── 19. Openbadge border/bg ──────────────────────────────────────────────────
html = html.replace(
    "  border: 1px solid var(--line); border-radius: 999px; padding: 7px 14px;",
    "  border: 1px solid #e0e0e0; border-radius: 999px; padding: 7px 14px;"
)

# ── 20. Sec title colors ─────────────────────────────────────────────────────
html = html.replace(
    ".sec__title .em { color: var(--red); }",
    ".sec__title .em { color: #000; }"
)

# ── 21. About facts style ────────────────────────────────────────────────────
# Keep as-is, var(--cream) now maps to #000 which is fine

# ── 22. Remove JS hero parallax/emblem code (optional cleanup) ──────────────
# Keep JS as-is since heroBg will not exist and it gracefully handles that

print("Done! Writing output...")

with open('/home/user/boosg/bagage.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Written successfully.")
