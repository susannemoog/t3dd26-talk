# Script: Ein Agent ist nett. Neun sind ein Team.

**TYPO3camp Berlin 2026 · 30 Minuten · Video-Session**

Untertitel: *Entwicklerarbeit in mehreren Projekten — orchestriert mit herdr*

> Notation: **[SLIDE n]** = Folie · **[VIDEO]** = vorab gerendertes Video. Sprechtext ist Richtwert.

**Roter Faden:** herdr orchestriert die Agenten — MCP macht sie wirksam. Beispiele mit herdr-Bezug: Worktrees, Update-Runde über neun Repos, Agenten über SSH.

---

## [SLIDE 1 — Titel] (0:00)

> Guten Morgen! Ich bin Susi, Entwicklerin bei neusta. Ich arbeite gleichzeitig in neun Repositories — eine Demo-Landschaft mit TYPO3, Strapi, Payload, Pimcore, Storyblok, Contentful, Magnolia. Neben der eigentlichen Arbeit stapeln sich dort Aufgaben, die in kein Sprint-Ticket passen: Scaffolds, MR-Reviews, Update-Tests, Seeder, CI. Diese Session ist die Geschichte, wie ich diesen Teil des Jobs parallelisiert habe.

## [SLIDE 2 — Neun Projekte, ein Backlog] (2:00)

> Die Ausgangslage: neun Projekte, und neben der eigentlichen Arbeit ein Backlog. Drei offene MR-Reviews. Composer-Updates, die getestet werden wollen. Projekt-Scaffolds mit CI. Content-Strukturen und Seeder für die Demos. Und wöchentlich die Update-Runde über alle neun Repos.
>
> Das ist der Teil des Jobs, der nie fertig wird — weil er sequentiell ist und die Zeit fehlt.

## [SLIDE 3 — herdr] (4:00)

> Das Werkzeug heißt herdr: ein Terminal-Workspace-Manager. Terminals in einer Struktur — Workspaces, Tabs, Panes. Und der entscheidende Teil: herdr erkennt Coding-Agenten. Über zwanzig Typen — pi, claude, codex, gemini, cursor. Pro Pane ein anderer möglich.
>
> "Erkennt" heißt: Der Agent ist kein anonymer Prozess in einem Terminal, sondern ein Objekt mit Namen, Zustand und Schnittstelle. Ohne diese Erkennung wäre Orchestrierung Screen-Scraping.

## [SLIDE 4 — Vier Zustände] (6:00)

> Jeder Agent bekommt einen Lebenszyklus, der als API-Ergebnis lesbar ist: working, idle, blocked, done.
>
> blocked ist der wichtige Zustand: Der Agent steht an einer Frage oder Freigabe — dann entscheide ich. done heißt: Der Auftrag ist abgeschlossen, das Ergebnis liegt in der Datei.

## [SLIDE 5 — Die API] (7:30)

> Über die Agenten legt herdr eine kleine API: `agent start` — Agent starten, Typ und Pane gewählt. `agent prompt` — Auftrag geben, mit `--wait` auf den Abschluss. `agent wait` — auf einen Zustand warten. `agent read` — die Ausgabe lesen.
>
> Weil es eine API ist, kann ein Agent sie selbst bedienen: Meine Steuer-Session promptet andere Agenten. Das ist die Basis der ganzen Orchestrierung.

## [SLIDE 6 — herdr-Agenten vs. Subagenten] (9:00)

> Die Abgrenzung zu Subagenten — die Agent-Funktion im eigenen Tool. Ein Subagent läuft innerhalb meiner Session, sein Ergebnis fließt in meinen Kontext zurück, er erbt Modell und Regeln, und er stirbt mit meiner Session.
>
> Ein herdr-Agent ist eine eigene Session: eigenes Arbeitsverzeichnis, eigene Projekt-AGENTS.md, beliebiger Agent-Typ je Pane. Sein Zustand und seine Ausgabe sind API-Ergebnisse. Kurz: Subagenten sind Delegation innerhalb eines Agenten — herdr ist Orchestrierung über mehrere.

## [SLIDE 7 — Git-Worktrees pro Agent] (11:00)

> Das Feature für Entwickler: herdr verwaltet Git-Worktrees. `herdr worktree create` legt einen Worktree an — eigenes Verzeichnis, eigener Branch, dieselbe Codebasis.
>
> In der Demo: Agent A baut im Worktree `wt-t3-seeder` das Content-Element mit Seeder — das TCA-Schema fragt er über den typo3-dev-companion ab. Agent B fixt im Worktree `wt-t3-viewhelper` einen ViewHelper, mit Unit-Tests, rot zuerst. Parallel an derselben Codebasis, ohne Konflikt — klassisches Git.

## [SLIDE 8 — Maschinen & Benachrichtigungen] (13:00)

> Zwei Features, die aus dem lokalen Werkzeug etwas Größeres machen:
>
> **Maschinen-Forwarding:** herdr steuert über SSH verbundene Maschinen — gleiche Befehle, entfernter Rechner. Der Agent arbeitet auf der Maschine, auf der das Projekt läuft.
>
> **Notifications:** `herdr notification show` benachrichtigt, wenn ein Agent fertig ist oder auf eine Freigabe wartet. Das ist der Moment, in dem ich nicht auf neun Terminals starre, sondern gerufen werde, wenn es etwas zu entscheiden gibt.

## [SLIDE 9 — VIDEO 1: Agenten auf Worktrees] (14:30)

Datei: `assets/videos/demo1-tui.mp4` (~52 Sek., echte herdr-TUI-Aufnahme, Light-Theme, loop-frei + Pause per Klick).

> Video 1: Agenten auf Worktrees. Die echte herdr-TUI: ein Controller-Agent startet zwei Worker-Agenten im neuen Tab, je 50 % Breite.
>
> 1. Der Controller-Agent tippt live `herdr agent start` × 2 — die Worker erscheinen mit π-Badges.
> 2. Tab-Wechsel auf den Agents-Tab: zwei Panes, je 50 %, daneben der Controller.
> 3. Agent A: Kontraste gegen WCAG 2.1 AA prüfen und fixen. Agent B: script.md enger auf mich anpassen. Parallel, live.
> 4. Am Ende: ✓✓ — beide done. Zwei Branches, eine Codebasis, null Konflikt.

## [SLIDE 10 — Neun Projekte, neun Agenten] (17:00)

> Die Landschaft: neun Projekte. Ich habe viele CMS-Demos aufgebaut — das geht über KI ganz gut. Sieben von ihnen haben saubere REST- oder GraphQL-APIs — da ruft der Agent den Endpunkt direkt auf, MCP ist hier Komfort. Die API-basierten Systeme haben meist auch eine sehr gut maschinenlesbare Doku dazu.
>
> Anders bei TYPO3 — dazu die nächsten beiden Folien.

## [SLIDE 10a — Warum TYPO3 anders ist] (17:45)

> Warum der Sonderfall: Die Daten liegen nicht hinter einem JSON-Endpunkt, sondern hinter TCA-Definitionen. Der DataHandler validiert, was reingeht — Tabelle, PID, Sprache, Versionierung. Und die Konventionen stehen im Core: Translation-Domains, TCA-Formen, Changelog-Regeln.
>
> Ein reiner API-Agent weiß davon nichts. Er bräuchte Schemata, Datensätze, Regeln.

## [SLIDE 10b — Der Companion in Aktion] (18:30)

> Was der typo3-dev-companion dem Agenten konkret gibt:
>
> *typo3_schema_lookup* listet die Spalten, die TYPO3 aus der TCA ableitet — das DDL-Schema hinter der Definition. *typo3_record_lookup* liest echte Datensätze der Demo-Landschaft. *typo3_translation_domain_lookup* berechnet die Label-Referenz, die das Core selbst anwendet. Der *Changelog-Lookup* sagt, was eine Version deprecated hat. Und *Forge und Gerrit* zeigen offene Issues und Patches, bevor man einen Patch schreibt.
>
> **herdr orchestriert die Agenten — MCP macht sie wirksam.**

## [SLIDE 11 — VIDEO 2: Die Update-Runde] (19:00)

Datei: `assets/videos/demo2-tui.mp4` (~48 Sek., echte herdr-TUI-Aufnahme, Light-Theme, vier Worker parallel).

> Video 2: Die wöchentliche Update-Runde. Die echte herdr-TUI: ein Controller-Agent startet vier Worker (t3, strapi, payload, magnolia) im separaten Tab, je 1/4 Breite.
>
> 1. Der Controller tippt live `herdr agent start` × 4 — die Worker erscheinen mit π-Badges.
> 2. Tab-Wechsel auf den Repos-Tab: vier Panes, parallel.
> 3. Jeder Worker prüft sein Repo: git-Stand, offene MRs, Prod-URL. Bericht nach /tmp/herdr-talk/<repo>.md.
> 4. Am Ende: DONE vom Controller. Berichte in Dateien, Audit bei mir.

## [SLIDE 12 — Die Update-Runde in Zahlen] (21:00)

> Die Zahlen: neun Repos parallel. Das Limit liegt bei fünf parallelen Prompts — ein API-Limit, nicht eines von herdr. Der sechste Agent bekommt ein 429 und läuft nicht.
>
> Elf Minuten Gesamtdauer, vier einhalb davon war ich aktiv. Vorher: eine Stunde sequentielle Kleinarbeit.

## [SLIDE 13 — Ein Agent pro Aufgabe] (22:30)

> Der Workflow darauf: Ein Agent pro Aufgabe — nicht ein Agent mit einer Liste. Review, Update, Scaffold, Seeder: je eine Sache zu Ende gebracht.
>
> Beauftragt in Batches von maximal fünf, wegen des API-Limits. Jeder Agent schreibt sein Ergebnis in eine Datei und antwortet nur mit DONE — Pane-Output ist keine verlässliche Schnittstelle.
>
> Und das Audit bleibt bei mir: Berichte lesen, MRs prüfen, mergen oder liegen lassen.

## [SLIDE 13a — Der Review-Loop] (24:00)

> Der Kern meines Workflows: Mit dem Modell-Scope *coder* entwickle ich den Code. Dann reviewt *brain* denselben Stand in einer frischen Session — ohne den Entstehungskontext. Ein Modell ist gegenüber seiner eigenen Lösung systematisch unkritisch; wer den Entstehungsweg nicht kennt, liest den Code mit fremdem Blick.
>
> Die Befunde gehen zurück an coder: berechtigt wird gefixt, unberechtigt wird begründet. Orchestriert mit herdr — beide Agenten in eigenen Panes, ich kann in jede einzelne Session eingreifen.

## [SLIDE 13b — VIDEO 3: Der Review-Loop in Aktion] (25:00)

Datei: `assets/videos/demo3-review-loop.mp4` (~56 Sek., echte herdr-TUI-Aufnahme, Light-Theme).

> Video 3: Der Review-Loop. Ein Controller-Agent startet coder und brain, jeder in einer eigenen Session.
>
> 1. Der Controller tippt live die agent-start-Befehle — beide erscheinen mit ihren Badges.
> 2. Tab-Wechsel auf den Loop-Tab: links coder, rechts brain.
> 3. coder baut, brain liefert Befunde als nummerierte Liste, coder prüft jeden und antwortet begründet.
> 4. In dieser Demo war der Befund unberechtigt — der coder rät nicht, er begründet. Auch das ist das Muster.

## [SLIDE 14 — Sinnvolle Sachen, übertriebene nicht] (26:30)

> Es gibt ein Handbuch zu dem Thema — Softwareentwicklung mit KI, mit einem Neun-Schritt-Prozess, Board, Vault und Nacht-Runner. Ich halte vieles davon für übertrieben, aber ein paar Sachen kann man sauber ableiten:
>
> *Review in einer frischen Session durch ein anderes Modell* — das mache ich, Demo 3. *Test-First*, weil der Test das Modell an die Realität bindet — der Test ist der ausdrückliche Vertrag. *Stop-Punkte beim Menschen* — Push und Merge entscheide ich, eine frühere Freigabe gilt nicht für neue Commits. Und *Coverage ist nicht Prüfung* — 98 Prozent sagen nichts über die Assertions.
>
> Der Rest ist Overhead für ein Team dieser Größe. Das Werkzeug liefert die Mechanik, die Disziplin liefert man.

## [SLIDE 15 — Stolpersteine] (28:00)

> Was schiefgeht: Das Concurrency-Limit — Agent Nummer sechs bekommt ein 429 und existiert nicht, das dauerte, bis ich es verstanden hatte. Pane-Output ist keine Schnittstelle — nicht eingesammelte Antworten sind weg, deshalb Dateien.
>
> Ein unvorsichtiger Agent macht echte Git-Historie — deshalb stehen Deployment- und Commit-Regeln in der AGENTS.md jedes Projekts, nicht im Prompt. Und Parallelität bedeutet auch paralleles Fehlverhalten: Mehrere Agenten mit demselben falschen Kontext sind mehrere falsche Ergebnisse. Der Kontext muss vor dem Start stimmen.

## [SLIDE 16 — Drei Sätze] (29:00)

> Drei Sätze zum Mitnehmen: Orchestrierung braucht keine Intelligenz, sondern Schnittstellen — herdr macht Agenten steuerbar über Zustand, Prompt und Ausgabe.
>
> Worktrees sind der Schlüssel für echtes Parallel-Arbeiten: ein Agent pro Branch, eine Codebasis, null Konflikt.
>
> Und die Verträge schreibt man selbst — AGENTS.md pro Projekt, Concurrency-Limits, Audit bei mir. Das Werkzeug liefert die Mechanik, die Disziplin liefert man.

## [SLIDE 17 — Ende] (30:00)

> Zusammengefasst: herdr orchestriert — Agenten mit Zustand, Schnittstelle und Worktrees. MCP macht die Agenten wirksam — bei TYPO3 konkret der dev-companion. Und die Entscheidung bleibt bei euch.
>
> Wenn ihr ausprobieren wollt: herdr installieren, drei Tabs, drei Agenten — und jedem die Aufgabe geben, die ihr am längsten vor euch herschiebt. Danke!

---

## Timing

| Abschnitt | Minuten | Kumulativ |
|---|---|---|
| Titel + Ausgangslage | 4 | 4 |
| herdr: Werkzeug, Zustände, API | 5 | 9 |
| Abgrenzung, Worktrees, Features | 5,5 | 14,5 |
| Video 1 | 2,5 | 17 |
| Neun Projekte + TYPO3-Sonderfall + Companion | 2,5 | 19,5 |
| Video 2 + Zahlen | 3,5 | 23 |
| Review-Loop + Video 3 + Whitepaper | 4 | 27 |
| Stolpersteine + Drei Sätze + Ende | 3 | 30 |

## Checkliste (Camp-Morgen)

| # | Was | Stand |
|---|---|---|
| 1 | Beide Videos prüfen: `assets/videos/demo1-tui.mp4`, `assets/videos/demo2-tui.mp4` | ☐ |
| 2 | Wiedergabe im Browser testen (Pause per Leertaste zum Erzählen) | ☐ |
| 3 | Beamer-HDMI-Adapter, zweiter Monitor für Speaker Notes | ☐ |
