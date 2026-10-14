# Talks

Talk slides hosted on GitHub Pages. This repository holds a small landing
page in the root and one Reveal.js deck per talk in a subdirectory.

**Landing page:** https://talk.shinyhappypages.de

## Talks

| Deck | Talk | Language |
|---|---|---|
| `t3dd2026/` | **Same Content, Different CMS — Who Does It Better?** (TYPO3 Developer Days 2026) | English |
| `t3camp2026/` | **Ein Agent ist nett. Neun sind ein Team.** (TYPO3camp Berlin 2026) | German |

## Structure

| Path | What |
|---|---|
| `index.html` | Landing page (plain HTML + inline CSS, no build step) — links to both decks |
| `t3dd2026/index.html` | The T3DD 2026 deck (markup + styles + reveal config) |
| `t3dd2026/assets/` | T3DD deck: backgrounds, logos, images |
| `t3dd2026/vendor/reveal.js/` | Vendored reveal.js 4.6.1 (MIT) — no build step, no CDN |
| `t3dd2026/generate_pptx.py` | One-off: renders the T3DD deck to PowerPoint. Needs the teamneusta master template, which is **not** in this repo. |
| `t3camp2026/index.html` | The T3camp Berlin 2026 deck |
| `CNAME` | GitHub Pages custom domain |

## Running locally

```bash
npm start        # serves on http://localhost:3000
```

From the repository root — the landing page is at `/`, both decks at
`/t3dd2026/` and `/t3camp2026/`. It's plain
[reveal.js](https://revealjs.com/) — press `S` in a deck for speaker notes.

## Hosting

GitHub Pages serves the repository root of `main`: the landing page at the
domain root, each deck under its subdirectory. `CNAME` points it at
`talk.shinyhappypages.de`.

## History

The five CMS demos were previously live at `*.shinyhappypages.de` on a
Hetzner server and shown live during the T3DD talk. That server has been
retired; the demo slides now just name each system. Demo source lives in the
sibling projects under `NSD/p_neusta_demos/cms-demos/` on the internal GitLab.
