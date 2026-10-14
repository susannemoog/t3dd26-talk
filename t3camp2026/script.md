# Script: Ein Agent ist nett. Neun sind ein Team.

**TYPO3camp Berlin 2026 · 30 Minuten · Demo-Session**

Untertitel: *Wie ich meine DXP-Demo-Landschaft mit parallelen KI-Agenten am Leben halte*

> Notation: **[SLIDE]** = Folienwechsel · **[DEMO]** = Live-Demo · **[VIDEO]** = vorab aufgezeichnete Demo · **[FALLBACK]** = Screenshot-Ersatz, falls Live nicht klappt.
> Sprechtext ist wörtlich gemeint, aber ruhig paraphrasieren. Zeitmarken sind Richtwerte.

---

## Akt 1 — Hook (0:00 – 2:00)

**[SLIDE 1 — Titelfolie]**

> Guten Morgen! Ich bin Susi, bei neusta, und ich pflege eine etwas absurde Demo-Landschaft: neun Repositories — TYPO3, Strapi, Payload, Pimcore, Storyblok, Contentful, Magnolia … jede Headless- und CMS-Welt, die wir unseren Kunden zeigen wollen. Und alle paar Wochen stellt sich die gleiche Frage: Ist der Stand eigentlich noch aktuell? Ziehen die Repos? Sind die Merge Requests weg?

**[SLIDE 2 — Die These]**

> Vor einem Jahr hätte ich dafür einen Freitag verbrannt. Heute starte ich dafür neun KI-Agenten parallel, trinke einen Kaffee, und lese danach neun Berichte. Diese Session ist die ehrliche Anleitung dazu — inklusive allem, was schiefgegangen ist.
>
> Der Plan: erst der eine Agent und TYPO3 — da passiert die eigentliche Magie. Dann die Skalierung auf neun. Und dann die unbequemen Wahrheiten.

---

## Akt 2 — Setup: der eine Agent (2:00 – 6:00)

**[SLIDE 3 — Der Stack]**

> Zuerst der Stack, ganz ohne Mystik. Drei Bausteine:
>
> 1. **Ein Coding-Agent im Terminal** — bei mir pi, aber der Agent ist austauschbar. Wichtig ist: er kann Dateien lesen, Befehle ausführen, Git bedienen.
> 2. **MCP — Model Context Protocol.** Der Agent bekommt damit Werkzeuge an die Hand, die über "Datei lesen, Befehl ausführen" hinausgehen. Bei mir: ein TYPO3-Dev-Companion mit rund 30 Werkzeugen, die direkt gegen die Installation und gegen die TYPO3-Infrastruktur fragen — Forge, Gerrit, Changelog, die Datenbank, das DI-Image, TCA.
> 3. **AGENTS.md — das Gedächtnis.** Regeln und Lessons Learned, die in jedem Agent-Start mitgelesen werden.

**[SLIDE 4 — Warum MCP für TYPO3 der Unterschied ist]**

> Warum ist MCP der Unterschied zwischen "nett" und "produktiv"? Ohne MCP rät der Agent: Welche TCA-Config hat das Feld? Welcher Content-Type rendert über welches Template? Was steht in der Datenbank? Ohne Werkzeuge ist das Halluzination mit gutem Stil.
>
> Mit MCP werden daraus Fragen: Ich frage das Schema der Tabelle ab, ich lese die Datensätze, ich frage das DI-Image, welchen Service ein Interface auflöst. Der Agent hört auf zu raten und fängt an nachzuschauen. Genau das ist der Sprung.

**[SLIDE 5 — AGENTS.md als Vertrag]**

> Und das dritte Bauteil: eine AGENTS.md pro Projekt. Mein Regelwerk ist erstaunlich banal und trotzdem Gold wert: "Deployment immer über GitLab CI, nie manuell von der Maschine." "Richtext-Felder mit HTML, Plain-Text-Felder ohne." "Unit-Tests zuerst schreiben, dann den Fix." Jede Zeile darin ist übrigens ein Unfall, der einmal passiert ist. Darauf komme ich in Akt 4 zurück.

---

## Akt 3 — Demo 1: Ein Agent schreibt TYPO3-Content (6:00 – 14:00)

**[SLIDE 6 — Demo-Absage: das Beispiel]**

> Jetzt Live-Demo. Das Szenario: Unsere TYPO3-Demo "Acme Outdoor" soll eine neue Produktseite bekommen — "Workations". Seite, neun Content-Elemente, Teaser, ein News-Artikel, englische Übersetzung. Vorher: ein halber Tag Redaktion im Backend. Heute: eine Unterhaltung.

**[DEMO 1a — Auslesen statt raten, ca. 3 Min]**

Vorbereitung: t3-Demo läuft lokal (ddev), pi geöffnet, Projektkontext geladen.

1. Schema zeigen:
   `typo3_schema_lookup` für `tt_content` — "Was liefert mir ein Teaser-Feld für Spalten?"
2. Bestehenden Datensatz zeigen:
   `typo3_record_lookup` auf `tt_content` mit `{"CType": "acme_teaser"}` — "Wie sieht so ein Element bei uns aus?"
3. Sprechtext: *"Ich sage dem Agenten nicht, wie unsere Felder heißen. Ich lasse ihn nachschauen. Er liest die bestehende Workations-Seite? Nein — er liest ein bestehendes Teaser-Element und ahmt dessen Format nach. Genau das hätte ein neuer Kollege auch tun sollen."*

**[FALLBACK 1a]** `assets/screenshots/website-setup.png` + `assets/Acme-Outdoor-Startseite.png` — fertiges Ergebnis zeigen,Workflow erzählen.

**[DEMO 1b — Schreiben mit Fallstricken, ca. 3 Min]**

1. Auftragen: *"Lege die Seite /tours/workations auf doktype 101 an, mit Feature-Elementen und einem Teaser. Englische Übersetzung gleich mit."*
2. Live mitschauen, wie der Agent: Seite anlegt → Inline-Records als Array schreibt → Übersetzung macht.
3. Absichtlicher Moment: *"Und jetzt der Teil, den ich in der Session-Vorbereitung kaputt bekommen habe:"* Plain-Text-Feld mit `<p>`-HTML beschreiben → im Frontend zeigen → Tags sichtbar als Text. → Fix aus der AGENTS.md: Feldtyp entscheidet das Rendering, nicht das Template.
4. Sprechtext: *"Dieser Fehler ist dreimal passiert, bevor er in die AGENTS.md kam. Heute liest der Agent die Regel, bevor er schreibt. Das ist der Unterschied zwischen einem Spielzeug und einem Werkzeug."*

**[SLIDE 7 — Test-first mit Agenten]**

> Kurzer Ausflug, weil bei TYPO3-Leuten gleich die Nachfrage kommt: Was ist mit Tests? Meine Regel im AGENTS.md: Kein Verhaltenswechsel ohne Unit-Test, Bugfixes test-first. Beispiel aus dem Repo: YouTube-Watch-URLs in einem ViewHelper normalisiert — zwölf Unit-Tests, rot zuerst, dann der Fix. Der Agent schreibt Tests tatsächlich besser als die meisten Menschen, weil er keine Langeweile dabei empfindet.

---

## Akt 4 — Skalierung: neun Agenten mit herdr (14:00 – 22:00)

**[SLIDE 8 — Das Problem skaliert nicht]**

> Zurück zur Ausgangsfrage: neun Repos. Ein Agent arbeitet das sequentiell ab — Repofür-Repo, jede Runde dreißig Minuten. Beim dritten Mal hatte ich die Nase voll. Die Antwort heißt herdr: ein Terminal-Workspace-Manager, mit dem ich mehrere Coding-Agenten parallel steuern kann.

**[SLIDE 9 — Das Modell: ein Agent pro Repo]**

> Das Modell ist einfach:
>
> - **Ein Tab pro Projekt**, in jedem Tab ein Agent.
> - Der Steuer-Agent (ich, bzw. diese Session) beauftragt alle nacheinander — **maximal fünf parallel**, das ist das API-Limit. Wichtig zu wissen: die Grenze liegt nicht bei herdr, sondern einen Layer darüber.
> - Jeder Agent schreibt sein Ergebnis **in eine Datei** und antwortet nur mit "DONE". Nicht in den Pane-Output — den kann man nicht zuverlässig einsammeln.
> - Ich sammle die Dateien ein und mache daraus den Bericht.

**[DEMO 2 — Live: Update-Runde über mehrere Repos, ca. 5 Min]**

Vorbereitung: herdr-Workspace offen, mind. drei Demo-Tabs bereit (t3, strapi, payload reichen für die Demo).

1. Auftragen: *"Prüfe in jedem Repo: git-Stand, offene MRs, Prod-URL erreichbar. Ergebnis nach /tmp/herdr-talk/<repo>.md, antworte nur mit DONE."*
2. Während die Agenten laufen — das ist der Moment für die Erzählung: *"Und jetzt passiert … erstmal nichts Sichtbares. Das ist der Punkt, den Leute am schwersten glauben: Ich warte. Fünf Agenten arbeiten, ich trinke Kaffee."*
3. Ergebnisse einsammeln, Bericht vorlesen: *"Strapi ist aktuell, keine offenen MRs. Payload war zwei Commits behind, jetzt gezogen. Pimcore-EE hat zwei Major-Bump-MRs offen, die lasse ich liegen — rote Pipeline."*
4. Sprechtext: *"Das war vor einem Jahr mein freier Freitag. Heute: elf Minuten, davon war ich aktiv viereinhalb."*

**[FALLBACK 2]** Aufzeichnung der Runde vom 30.9. (`[VIDEO]`, 90 Sek., geschnitten) — vorbereiten: `assets/videos/herdr-update-round.mp4`.

**[SLIDE 10 — Wo es bricht]**

> Und damit zu dem, was schiefgeht — weil das der Teil ist, den jede Präsentation zu KI-Arbeit unterschlägt:
>
> - **Concurrency-Limit 5**: Agent Nummer sechs bekommt ein 429 und läuft nie. Er ist nicht fehlgeschlagen — er existiert nicht. Das dauerte, bis ich es verstanden hatte.
> - **Pane-Output ist keine Schnittstelle**: Nicht eingesammelte Antworten sind weg. Dateien, immer Dateien.
> - **Ein unvorsichtiger Agent macht echte Git-Historie**: Deshalb stehen Deployment- und Commit-Regeln in der AGENTS.md, nicht im Prompt.
> - **Parallelität bedeutet auch paralleles Fehlverhalten**: Neun Agenten, die denselben falschen Kontext haben, sind neun falsche Ergebnisse. Der Kontext muss vor dem Start stimmen.

---

## Akt 5 — Lessons Learned & Grenzen (22:00 – 27:00)

**[SLIDE 11 — Was ich gelernt habe]**

> Fünf Sätze, die ich gern mitgegeben hätte an mich von vor einem Jahr:
>
> 1. **Der eine Agent ist der Produktivitätssprung, nicht die neun.** Content via MCP, test-first, Repohygiene — das ist der Hebel. Skalierung ist Bonus.
> 2. **Halluzination ist fehlender Zugriff, fehlender Zugriff ist MCP.** Jedes "der Agent erfindet was" war bei mir "der Agent konnte nicht nachschauen".
> 3. **AGENTS.md ist die einzige Form von Prompts, die sich lohnt.** Sie überlebt die Session, sie überlebt den Modellwechsel.
> 4. **Parallele Agenten brauchen Verträge, nicht Beaufsichtigung.** Concurrency-Limits, Ergebnis-Dateien, klare Don'ts.
> 5. **Audit bleibt meine Arbeit.** Ich lese die Berichte, ich prüfe die MRs, ich merge. Agenten machen Vorschläge, ich trage Verantwortung.

**[SLIDE 12 — Was es (noch) nicht kann]**

> Ehrlich: Was es nicht kann.
>
> - **Architekturentscheidungen treffen.** Major-Bump-MRs liegen bei mir, weil "wir upgraden jetzt Symfony v8" eine Frage an den Kunden ist, nicht an den Agenten.
> - **Kontext über Session-Grenzen mitnehmen** — außer ich schreibe ihn in die AGENTS.md. Das Gedächtnis ist eine Datei, kein Gehirn.
> - **Sich selbst kontrollieren.** Feedback-Loops an den MCP-Server sind Gold wert — ich melde jedes falsche Antwortverhalten zurück, damit der Server besser wird —, aber der Loop schließt bei mir.

**[SLIDE 13 — Der Ausblick]**

> Und was als Nächstes kommt: Der Schritt, den ich gerade teste — dieselben Agenten nicht nur lesen lassen, sondern deployen. Mit Playwright-Smoke-Tests als Zaun drumherum: Deploy, Test, bei Rot zurückrollen. Das ist der Punkt, an dem aus "Agenten machen Vorschläge" "Agenten liefern". Dafür braucht es die Tests, und genau deshalb sind sie in jedem meiner Repos.

---

## Akt 6 — Fazit & Q&A (27:00 – 30:00)

**[SLIDE 14 — Fazit]**

> Zusammengefasst in einem Satz: **Ein Agent mit Zugriff auf Ihre Daten schlägt einen Agenten mit gutem Prompt. Neun Agenten mit Regeln schlagen einen mit Momentum. Und Sie — nicht der Agent — bleiben derjenige, der mergt.**
>
> Wenn Sie eine Sache mitnehmen: fangen Sie mit der AGENTS.md an, nicht mit dem Agenten. Der Agent ist Kommodität. Ihr Kontext ist der Moat.

**[SLIDE 15 — Links & Ende]**

- Slides & Demo-Repos: Link aufs Repo / Landingpage
- Kontakt: look@susi.dev

> Danke! Fragen?

---

## Demo-Checkliste (Vorbereitung am Camp-Morgen)

| # | Was | Stand |
|---|---|---|
| 1 | t3-Demo lokal hochfahren (ddev start), Backend-Login parat | ☐ |
| 2 | pi im t3-Repo mit geladenem Projektkontext öffnen | ☐ |
| 3 | herdr-Workspace mit t3/strapi/payload-Tabs aufsetzen | ☐ |
| 4 | Fallback-Screenshots prüfen (`assets/screenshots/`) | ☐ |
| 5 | Fallback-Video schneiden (90 Sek. Update-Runde) → `assets/videos/` | ☐ |
| 6 | Beamer-HDMI-Adapter, zweiter Monitor für Speaker Notes | ☐ |

## Timing-Budget (Kontrolle)

| Akt | Minuten | Kumulativ |
|---|---|---|
| Hook | 2 | 2 |
| Setup | 4 | 6 |
| Demo 1 | 8 | 14 |
| herdr-Skalierung | 8 | 22 |
| Lessons & Grenzen | 5 | 27 |
| Fazit + Q&A | 3 | 30 |
