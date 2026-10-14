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

Datei: `assets/casts/demo1-herdr-worktree.cast` (asciinema, ~75 Sek., 110×34).

> Video 1: Agenten auf Worktrees. Eine Steuer-Session, zwei Worktree-Workspaces.
>
> 1. `herdr worktree create` × 2 — wt-talk-a11y, wt-talk-script, eigener Branch je Agent.
> 2. `herdr agent start` × 2 (pi), je Worktree-Root-Pane.
> 3. Agent A: Kontraste beider Decks gegen WCAG 2.1 AA prüfen und fixen. Agent B: script.md enger auf mich anpassen.
> 4. `agent read` zeigt die Zusammenfassungen, `git status` in beiden Worktrees: zwei Branches, eine Codebasis, null Konflikt.

## [SLIDE 10 — Neun Projekte, neun Agenten] (17:00)

> Die Landschaft: neun Projekte. Sieben von ihnen haben saubere REST- oder GraphQL-APIs — da ruft der Agent den Endpunkt direkt auf, MCP ist hier Komfort.
>
> Anders bei TYPO3: Die Daten liegen hinter TCA-Definitionen, der DataHandler validiert, was reingeht. Dort ist der typo3-dev-companion der Unterschied — TCA-Schema, Datensätze, Konventionen, Forge und Gerrit als Werkzeuge. **herdr orchestriert die Agenten — MCP macht sie wirksam.**

## [SLIDE 11 — VIDEO 2: Die Update-Runde] (19:00)

Datei: `assets/casts/demo2-herdr-round.cast` (asciinema, ~7 Sek., kompakt geschnitten — die Wartezeit ist der eine lange Beat).

> Video 2: Die wöchentliche Update-Runde. Eine Steuer-Session, zwei Agent-Panes mit Lebenszyklus.
>
> 1. `herdr agent rename` — die Agenten heißen nach dem Repo: t3, strapi.
> 2. Auftrag: *"Prüfe: git-Stand, offene MRs, Prod-URL. Ergebnis nach /tmp/herdr-talk/<repo>.md, antworte nur mit DONE."*
> 3. Während die Agenten laufen: passiert erstmal nichts Sichtbares. Ich warte.
> 4. Berichte: *"t3: 8 Commits behind, keine MRs, Prod 401 (Auth). strapi: Renovate-Dep-Updates, keine MRs, Prod erreichbar."*
> 5. Der Punkt: Berichte in Dateien, nicht Pane-Output. Audit bei mir.

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

## [SLIDE 14 — Stolpersteine] (24:30)

> Was schiefgeht: Das Concurrency-Limit — Agent Nummer sechs bekommt ein 429 und existiert nicht, das dauerte, bis ich es verstanden hatte. Pane-Output ist keine Schnittstelle — nicht eingesammelte Antworten sind weg, deshalb Dateien.
>
> Ein unvorsichtiger Agent macht echte Git-Historie — deshalb stehen Deployment- und Commit-Regeln in der AGENTS.md jedes Projekts, nicht im Prompt. Und Parallelität bedeutet auch paralleles Fehlverhalten: Mehrere Agenten mit demselben falschen Kontext sind mehrere falsche Ergebnisse. Der Kontext muss vor dem Start stimmen.

## [SLIDE 15 — Drei Sätze] (26:30)

> Drei Sätze zum Mitnehmen: Orchestrierung braucht keine Intelligenz, sondern Schnittstellen — herdr macht Agenten steuerbar über Zustand, Prompt und Ausgabe.
>
> Worktrees sind der Schlüssel für echtes Parallel-Arbeiten: ein Agent pro Branch, eine Codebasis, null Konflikt.
>
> Und die Verträge schreibt man selbst — AGENTS.md pro Projekt, Concurrency-Limits, Audit bei mir. Das Werkzeug liefert die Mechanik, die Disziplin liefert man.

## [SLIDE 16 — Ende] (28:00)

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
| Neun Projekte + Video 2 + Zahlen | 5,5 | 22,5 |
| Workflow + Stolpersteine | 4 | 26,5 |
| Drei Sätze + Ende | 3,5 | 30 |

## Checkliste (Camp-Morgen)

| # | Was | Stand |
|---|---|---|
| 1 | Beide Casts prüfen: `assets/casts/demo1-herdr-worktree.cast`, `assets/casts/demo2-herdr-round.cast` (asciinema-Player im Deck) | ☐ |
| 2 | Wiedergabe im Browser testen (asciinema-CLI als Reserve: `asciinema play`) | ☐ |
| 3 | Beamer-HDMI-Adapter, zweiter Monitor für Speaker Notes | ☐ |
