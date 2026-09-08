# Same Content, Different CMS — Who Does It Better?

Talk from **TYPO3 Developer Days 2026**. One simple editorial task, repeated
across five CMS (Payload, Strapi, Pimcore, Storyblok, TYPO3).

**Slides:** https://talk.shinyhappypages.de

## Running locally

```bash
npm start        # serves on http://localhost:3000
```

It's a plain [reveal.js](https://revealjs.com/) deck — `index.html` plus
`assets/`. Press `S` for speaker notes.

## Structure

| Path | What |
|---|---|
| `index.html` | The whole deck (markup + styles + reveal config) |
| `assets/` | Backgrounds, logos, images |
| `vendor/reveal.js/` | Vendored reveal.js 4.6.1 (MIT) — no build step, no CDN |
| `generate_pptx.py` | One-off: renders the deck to PowerPoint. Needs the teamneusta master template, which is **not** in this repo. |

## Hosting

GitHub Pages serves the repository root of `main`. `CNAME` points it at
`talk.shinyhappypages.de`.

## History

The five CMS demos were previously live at `*.shinyhappypages.de` on a
Hetzner server and shown live during the talk. That server has been retired;
the demo slides now just name each system. Demo source lives in the sibling
projects under `NSD/p_neusta_demos/cms-demos/` on the internal GitLab.
