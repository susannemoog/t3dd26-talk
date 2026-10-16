# Script: Ein Agent ist nett. Neun sind ein Team.

**TYPO3camp Berlin 2026 · 30-Minuten-Slot: ~23 Min Talk + ~7 Min Fragen · Video-Session**

Untertitel: *Entwicklerarbeit in mehreren Projekten — orchestriert mit herdr*

> Notation: **[SLIDE n]** = Folie (Nummer = Position im Deck, `#id` = Anker in der URL) · **[VIDEO]** = vorab gerendertes Video · ⏸ = Pausenpunkt (Klick aufs Video). Sprechtext ist Richtwert; die Speaker Notes im Deck sind derselbe Text.

**Roter Faden:** herdr orchestriert die Agenten — MCP macht sie wirksam. Angekündigt auf Folie 3, eingelöst auf Folie 13, auf Arbeitsalltag und Tickets übertragen auf Folie 23–24, Schluss auf Folie 25.

**Zusammenfassung in drei Sätzen:** Ich orchestriere mit herdr neun Coding-Agenten parallel — über Zustände, Prompts und Ausgaben, die ich als API lese. Git-Worktrees pro Agent geben mir echte Parallel-Arbeit: ein Agent pro Branch, eine Codebasis. Die Verträge halte ich selbst fest — AGENTS.md pro Projekt, fünf Prompts pro Batch, das Audit bei mir.

---

## Akt 1 — Problem & Werkzeug

## [SLIDE 1 — Titel] `#title` (0:00)

> Hallo zusammen! Freitag, 18 Uhr: neun Repos, eine Update-Runde. Früher hat mich das eine Stunde gekostet — nach Feierabend. Heute sind es elf Minuten, und davon bin ich viereinhalb aktiv. Wie das geht und wo es schiefgeht, zeige ich euch in den nächsten zwanzig Minuten.
>
> Ich bin Susi, Entwicklerin bei neusta. Ich arbeite gleichzeitig in neun Repositories — eine Demo-Landschaft mit TYPO3, Strapi, Payload, Pimcore, Storyblok, Contentful und Magnolia. Daneben stapeln sich Aufgaben, die in kein Sprint-Ticket passen. Seit etwa einem halben Jahr arbeite ich dafür mit herdr — und diese Session ist die Geschichte, wie ich diesen Teil meines Jobs parallelisiert habe.

## [SLIDE 2 — Neun Projekte, ein Backlog] `#aufgaben` (0:50)

> Am Montag stand bei mir konkret auf der Liste: drei offene MR-Reviews, vier Composer-Updates, die ich testen will, Projekt-Scaffolds mit CI, Content-Strukturen und Seeder für die Demos. Und freitags die Update-Runde über alle neun Repos.
>
> Das ist der Teil meines Jobs, der nie fertig wurde — weil ich ihn nacheinander abgearbeitet habe.

## [SLIDE 3 — herdr] `#was-ist-herdr` (1:20)

> Mein Werkzeug dafür ist herdr, von herdr.dev: ein Terminal-Workspace-Manager. Terminals in einer Struktur — Workspaces, Tabs, Panes. Der entscheidende Teil: herdr erkennt Coding-Agenten. Zweiundzwanzig Agent-CLIs — Claude Code, Codex, Gemini, Cursor und pi, ein schlanker Coding-Agent fürs Terminal. Pro Pane ein anderer; bei mir laufen pi, claude und codex im Wechsel.
>
> „Erkennt“ heißt: Der Agent ist kein anonymer Prozess, sondern ein Objekt mit Namen, Zustand und Schnittstelle. Vorher habe ich Agenten-Ausgaben per Hand aus dem Terminal gelesen — genau das Screen-Scraping, das ich loswerden wollte.
>
> Merkt euch zwei Wörter für heute: **orchestrieren** und **wirksam machen**. Das erste ist herdr. Das zweite kommt beim TYPO3-Teil.

## [SLIDE 4 — Vier Zustände] `#lifecycle` (2:30)

> Jeder Agent hat einen Lebenszyklus, den ich als API-Ergebnis lese: working, idle, blocked, done. idle heißt: Er wartet auf den nächsten Auftrag.
>
> blocked ist der Zustand, auf den ich warte: Der Agent steht an einer Frage oder Freigabe — dann entscheide ich. In meiner letzten Update-Runde waren vier Agenten gleichzeitig blocked; alle vier hatte ich in fünf Minuten abgehandelt. done heißt: Auftrag abgeschlossen, das Ergebnis liegt in der Datei.

## [SLIDE 5 — Die API] `#api` (3:15)

> Über die Agenten legt herdr eine kleine API: `agent start` — Agent starten, Typ und Pane wählen. `agent prompt` — Auftrag geben; mit `--wait` wartet der Aufruf gleich mit. `agent wait` — warten, bis ein Zustand erreicht ist. `agent read` — die Ausgabe lesen.
>
> Weil es eine API ist, kann ein Agent sie selbst bedienen: Meine Steuer-Session — im Video heißt sie *controller* — startet und promptet die anderen Agenten, in Batches. Ich formuliere den Auftrag einmal pro Runde.

## [SLIDE 6 — herdr-Agenten vs. Subagenten] `#subagents` (4:00)

> Die Frage kommt immer: Warum nicht einfach Subagenten — die Agent-Funktion im eigenen Tool? Ein Subagent läuft innerhalb meiner Session, sein Ergebnis fließt in meinen Kontext zurück, er erbt Modell und Regeln, und er endet mit meiner Session. Bei neun Repos heißt das: neun Berichte in einem Kontext.
>
> Ein herdr-Agent ist eine eigene Session: eigenes Arbeitsverzeichnis, eigene Projekt-AGENTS.md, beliebiger Agent-Typ je Pane. Zustand und Ausgabe sind API-Ergebnisse. Kurz: Subagenten sind Delegation innerhalb eines Agenten — herdr ist Orchestrierung über mehrere.

## [SLIDE 7 — Git-Worktrees pro Agent] `#worktrees` (5:00)

> Das Feature, das mir am meisten gebracht hat: herdr verwaltet Git-Worktrees. `herdr worktree create` legt einen an — eigenes Verzeichnis, eigener Branch, dieselbe Codebasis.
>
> Im ersten Video seht ihr das an meinem ehrlichsten Testfall: dem Repo dieses Talks. Agent *a11y* prüft im Worktree `wt-talk-a11y` die Farbkontraste der Slides gegen WCAG 2.1 AA. Agent *scripter* überarbeitet im Worktree `wt-talk-script` dieses Sprechskript. Beide parallel an derselben Codebasis, ohne sich in die Quere zu kommen — klassisches Git, das ich vorher nie so genutzt habe.

## [SLIDE 8 — Maschinen, Benachrichtigungen, Handy] `#features` (6:00)

> Drei Dinge, die aus dem lokalen Werkzeug etwas Größeres machen:
>
> **Maschinen-Forwarding:** herdr steuert über SSH verbundene Maschinen — gleiche Befehle, entfernter Rechner. Ich leite so meine Befehle an meine zwei Demo-Maschinen weiter — der Agent arbeitet direkt dort, wo das jeweilige Projekt läuft.
>
> **Notifications:** `herdr notification show` meldet sich, wenn ein Agent fertig ist oder auf eine Freigabe wartet. Vorher habe ich zwanzig Minuten auf neun Terminals gestarrt und den einen Moment trotzdem verpasst — heute werde ich gerufen, wenn es etwas zu entscheiden gibt.
>
> **Vom Handy:** Ich muss dafür nicht am Schreibtisch sitzen. Ich verbinde mich vom Handy per SSH — zum Beispiel mit Moshi — und bediene das Ganze von dort. Dieselbe TUI, dieselben Agenten. Wenn mich unterwegs eine Notification ruft, antworte ich direkt vom Handy.

## [SLIDE 9 — Was herdr sonst noch kann] `#mehr-herdr` (6:50)

> Noch ein paar Dinge, die herdr mitbringt — und die im Alltag mehr ausmachen, als man denkt. Erstens: Es läuft weiter. Die Terminals leben in einem Hintergrund-Server, nicht in meiner Shell. Verbindung weg, Terminal zu — die Agenten arbeiten weiter. Sessions kann ich trennen und wieder anhängen, und nach einem Neustart stellt herdr sie wieder her; die Agenten setzen ihre eigene Session fort. Sogar Updates gehen per Live-Handoff, ohne dass ich laufende Agenten stoppe.
>
> Zweitens: Es passt sich an. Eigene Workflows baue ich als Plugins, mit Manifest und Event-Hooks — und teilen geht über ein GitHub-Topic. Bedienen lässt es sich mit der Maus oder mit `ctrl+b` für alle, die tmux oder zellij in den Fingern haben. Und es läuft auf macOS, Linux und Windows, Open Source unter Apache 2.0.

---

## Akt 2 — Beweis

## [SLIDE 10 — VIDEO 1: Agenten auf Worktrees] `#video1` (8:00)

Datei: `assets/videos/demo1-tui.mp4` (38 Sek., echte herdr-TUI, Light-Theme, startet beim Folienwechsel). Mit Pausen ~1:30.

> Video 1: zwei Agenten, zwei Worktrees, ein Repo.
>
> ⏸ **0:04** — Der Auftrag an die Steuer-Session: sechs herdr-Befehle. Zwei Agenten starten, zwei prompten, auf zwei warten. Mehr Orchestrierung ist es nicht.
> ⏸ **0:08** — `agent start` antwortet mit JSON: Name, Pane, `agent_status idle`. Das ist die API von eben.
> **0:16** — `agent wait` läuft, Elapsed zählt hoch. Für mich passiert hier nichts — genau das ist der Punkt.
> ⏸ **0:28** — Tab *agents*: links rechnet a11y Kontraste nach, rechts editiert scripter in seinem eigenen Worktree.
> **0:36** — a11y: alles bereits AA-konform, keine Änderung nötig. Zwei Agenten, zwei Branches, eine Codebasis.

*Nicht bei 0:36 anhalten: Rechts steht scripters alte Änderungsliste.*

## [SLIDE 11 — Neun Repos, sieben Systeme] `#systeme` (9:30)

> Meine Landschaft: neun Repos, sieben Systeme. Viele dieser CMS-Demos habe ich mit KI aufgebaut — das geht gut. Sechs der Systeme haben saubere REST- oder GraphQL-APIs mit gut maschinenlesbarer Doku: Da ruft der Agent den Endpunkt direkt auf, MCP ist dort Komfort.
>
> Anders bei TYPO3.

## [SLIDE 12 — Warum TYPO3 anders ist] `#typo3-anders` (10:00)

> Warum ist TYPO3 der Sonderfall? Die Daten liegen nicht hinter einem JSON-Endpunkt, sondern hinter TCA-Definitionen. Der DataHandler validiert, was reingeht — Tabelle, PID, Sprache, Versionierung. Und die Konventionen stehen im Core: Translation-Domains, TCA-Formen, Changelog-Regeln.
>
> Ein reiner API-Agent weiß davon nichts. Er bräuchte Schemata, Datensätze, Regeln — genau die liefert der typo3-dev-companion.

## [SLIDE 13 — Was der typo3-dev-companion liefert] `#companion` (10:40)

> Was der Companion meinen Agenten konkret gibt: *schema_lookup* — die Spalten und Typen, die TYPO3 aus der TCA ableitet. *record_lookup* — echte Datensätze meiner Demo-Landschaft. *translation_domain_lookup* — die Label-Referenz, wie der Core sie selbst bildet. *changelog_lookup* — was eine Version deprecated hat. Und *Forge und Gerrit* — offene Issues und Patches, bevor ich selbst einen schreibe.
>
> Da sind die zwei Wörter vom Anfang: **herdr orchestriert die Agenten — MCP macht sie wirksam.**

## [SLIDE 14 — VIDEO 2: Die Update-Runde] `#video2` (11:30)

Datei: `assets/videos/demo2-tui.mp4` (31 Sek., echte herdr-TUI, Light-Theme, vier Worker parallel). Mit Pausen ~1:15.

> Video 2: die Update-Runde. Vier Worker — t3, strapi, payload, magnolia —, jeder in seinem Repo. Der t3-Worker prüft hier übrigens das Repo dieses Talks.
>
> **0:09** — viermal `agent start`, je ein Pane.
> ⏸ **0:15** — Der Auftrag, viermal derselbe: git-Stand, offene MRs per glab, Prod-URL per curl. Bericht nach `/tmp/herdr-talk/<repo>.md`, antworte nur mit DONE.
> **0:21** — Tab *repos*: vier Panes parallel.
> ⏸ **0:28** — Die Antworten: ERLEDIGT. FERTIG. Ich hatte „nur DONE“ verlangt. Genau deshalb lese ich Dateien und nicht die Antworten. Die Berichte liegen in `/tmp/herdr-talk`, das Audit liegt bei mir.

## [SLIDE 15 — Die Update-Runde in Zahlen] `#resultat` (12:45)

> Meine Zahlen aus einer echten Runde: neun Repos, in zwei Batches — fünf und vier. Fünf parallele Prompts sind ein API-Limit, nicht eines von herdr.
>
> Elf Minuten insgesamt, viereinhalb davon war ich aktiv. Vorher: eine Stunde nacheinander, meistens freitags nach Feierabend.

---

## Akt 3 — Was es braucht

## [SLIDE 16 — Ein Agent pro Aufgabe] `#workflow` (13:15)

> Mein Workflow darauf: ein Agent pro Aufgabe — nicht ein Agent mit einer Liste. Review, Update, Scaffold, Seeder: je eine Sache, zu Ende gebracht.
>
> Beauftragt in Batches von höchstens fünf. Jeder Agent schreibt sein Ergebnis in eine Datei — ihr habt eben gesehen, warum. Und das Audit behalte ich: Ich lese die Berichte, prüfe die MRs und entscheide über jeden Merge.

## [SLIDE 17 — Der Review-Loop] `#review-loop` (13:55)

> Der Kern meines Workflows: *coder* und *brain* sind bei mir zwei Modell-Profile — coder schreibt, brain prüft. Mit coder entwickle ich. Dann reviewt brain denselben Stand in einer frischen Session — ohne den Entstehungskontext. Ein Modell ist gegenüber seiner eigenen Lösung systematisch unkritisch; wer den Entstehungsweg nicht kennt, liest den Code mit fremdem Blick.
>
> Die Befunde gehen zurück an coder: berechtigt wird gefixt, unberechtigt wird begründet. Beide laufen in eigenen herdr-Panes — ich kann in jede Session eingreifen.

## [SLIDE 18 — VIDEO 3: Der Review-Loop in Aktion] `#video3` (14:55)

Datei: `assets/videos/demo3-review-loop.mp4` (57 Sek., echte herdr-TUI, Light-Theme). Mit Pausen ~1:45.

> Video 3: der Review-Loop am Repo dieses Talks. Die Steuer-Session startet coder und brain, jeder in einer eigenen Session.
>
> **0:00** — `agent start brain` mit `--model brain`: zweites Modell-Profil, eigene Session.
> ⏸ **~0:16** — coder hat die Kontraste geprüft: alles schon AA-konform. Er committet bewusst nichts, statt einen Fix vorzutäuschen.
> ⏸ **~0:24** — Rechts brains Review des letzten Commits als nummerierte Liste; links prüft coder jeden Befund gegen den aktuellen Stand.
> **~0:32** — Vorschlag „Historie umschreiben“: abgelehnt, mit Begründung — drei Worktrees arbeiten parallel auf dem Repo.
> **~0:40** — Ein Teil war berechtigt: toter Code, ein Player, den nichts mehr lädt — gelöscht (Commit 19d9f11). Ein Teil war schon erledigt. So soll es laufen: nicht alles annehmen, nicht alles ablehnen.

## [SLIDE 19 — Stolpersteine] `#stolpersteine` (16:40)

> Was ich selbst habe schiefgehen lassen: Beim ersten Lauf habe ich sechs Agenten gestartet. Der sechste bekam ein 429 und existierte einfach nicht — zwanzig Minuten habe ich gesucht, bis ich das Limit verstanden hatte. Und ich habe drei Agenten-Berichte verloren, weil ich sie nur im Pane-Output hatte — seitdem schreibt jeder Agent in eine Datei.
>
> Ein Agent hat mir in die falsche Git-Historie committet — seitdem stehen Commit- und Deployment-Regeln in der AGENTS.md jedes Projekts, nicht im Prompt. Und ich habe zweimal denselben falschen Kontext an mehrere Agenten verteilt: Parallele Arbeit heißt auch paralleles Fehlverhalten. Der Kontext muss vor dem Start stimmen.

## [SLIDE 20 — Meine Quality Gates] `#quality-gates` (17:40)

> Weil parallele Agenten auch parallel fertig werden, brauche ich Quality Gates. Erstens Test-first, und zwar wörtlich: Jeder Bugfix beginnt mit dem Test, der den Bug reproduziert. Ich sehe ihn rot, erst dann fasse ich Produktionscode an. Der Test ist der Vertrag, der das Modell an die Realität bindet.
>
> Unit-Tests immer: Vitest und Jest für TypeScript, PHPUnit für PHP. Verändertes Verhalten ohne Test geht nicht raus, auch nicht aus einem Agenten. Fürs Frontend Playwright, mit einem Project pro Umgebung: lokal in ddev und auf jedem Zielserver. Smoke-Tests prüfen das Deployment, Task-Tests das Ergebnis redaktioneller Änderungen.
>
> Coverage ist dabei kein Maß: 98 Prozent sagen nichts über die Assertions. Und die Stop-Punkte bleiben bei mir: Push und Merge entscheide ich — eine frühere Freigabe gilt nicht für neue Commits. Mehr Prozess braucht eine Person mit neun Agenten nicht.

## [SLIDE 21 — Was in meiner AGENTS.md steht] `#agents-md` (19:10)

> Was ihr direkt mitnehmen könnt: was bei mir in der AGENTS.md jedes Projekts steht. Erstens die Commit-Identität pro Remote — GitHub und GitLab bekommen meine private Adresse, alles Neusta-interne die Firmenadresse. Per Repo-Config gesetzt, nie per `--author` überschrieben. Ohne diese Regel committet ein Agent mit der falschen Identität — das hatte ich.
>
> Zweitens: glab statt curl. Ein Werkzeug für MRs, Pipelines und API — dann erfindet der Agent keine Endpunkte. Drittens mein Worklog: eine Zeile pro Aufgabe in `~/worklog`, vom Agenten selbst gepflegt — die Basis meiner Zeiterfassung. Und viertens die herdr-Regeln: ein Agent pro Projekt, Pane-IDs aus der JSON-Antwort statt geraten, Batches von fünf.

## [SLIDE 22 — Drei Sätze] `#gelernt` (20:25)

> Drei Sätze zum Mitnehmen. Erstens: Ich orchestriere über Schnittstellen, nicht über Intelligenz — herdr gibt mir Zustand, Prompt und Ausgabe meiner Agenten als API.
>
> Zweitens: Worktrees bringen echtes Parallel-Arbeiten — ein Agent pro Branch, eine Codebasis.
>
> Drittens: Die Verträge halte ich selbst fest — AGENTS.md in jedem Projekt, fünf Prompts pro Batch, das Audit bei mir. Das Werkzeug liefert die Mechanik, die Disziplin bringe ich.

## [SLIDE 23 — Ausblick: Worklogs automatisch] `#ausblick` (21:10)

> Und das Ganze hört nicht beim Code auf. Mit herdr und einem selbst gebauten MCP-Server lasse ich meine Worklogs automatisch erzeugen. Die Quellen: das Worklog, das die Agenten ohnehin pro Aufgabe schreiben — ihr habt es auf der AGENTS.md-Folie gesehen. Dazu meine Termine aus dem Exchange-Kalender, den ich dafür synchronisiere. Und meine Chats, über Microsoft Copilot.
>
> Der Agent führt das zu einem Worklog zusammen — die Grundlage meiner Zeiterfassung. Dasselbe Muster wie im ganzen Talk: herdr orchestriert, das MCP macht den Agenten wirksam. Diesmal nicht für TYPO3, sondern für meinen Arbeitsalltag.

## [SLIDE 24 — Ausblick: Gleiches Muster für Ticketsysteme] `#ausblick-tickets` (21:55)

> Dasselbe gilt letztlich für jedes Ticketsystem — und zwar für den gesamten Workflow, vom Ticket bis zum MR. Der Zugriff läuft wie bei den CMS: über die API, wo es eine saubere gibt, über einen eigenen MCP-Server, wo nicht.
>
> Der Agent liest das Ticket als Kontext, bevor er startet. Und er schreibt zurück: Er kommentiert und pflegt das Ticket. herdr orchestriert, das MCP macht wirksam — egal, ob das Ziel ein CMS, mein Kalender oder ein Ticket ist.

## [SLIDE 25 — Ende: Fangt mit drei an] `#ende` (22:40)

> Neun sind ein Team — aber niemand muss mit neun anfangen. Fangt mit drei an. So habe ich auch angefangen.
>
> Erstens: herdr installieren. Zweitens: Nehmt euch drei separate Tickets — gern die, die seit Wochen liegen. Für jedes ein eigener Worktree mit `herdr worktree create`, und in jedem ein eigener Agent. Drei Branches, eine Codebasis, und keiner kommt dem anderen in die Quere. Drittens: Der Merge-Button bleibt eurer. Die Agenten liefern ihre Berichte ab, ihr lest und entscheidet. Drei Agenten sind ein Team — die Teamleitung seid ihr.
>
> Die Slides findet ihr unter talk.shinyhappypages.de. Danke — und jetzt gern eure Fragen.

---

## Timing

Gemessen am Sprechtext (~130 Wörter/Min) plus Video mit Pausen. Vor dem Camp einmal mit Stoppuhr durchsprechen und die Spalte anpassen.

| Abschnitt | Folien | Minuten | Kumulativ |
|---|---|---|---|
| Einstieg + Ausgangslage | 1–2 | 1,5 | 1,5 |
| herdr: Werkzeug, Zustände, API | 3–5 | 2,5 | 4 |
| Abgrenzung, Worktrees, Features | 6–9 | 4 | 8 |
| Video 1 | 10 | 1,5 | 9,5 |
| Landschaft + TYPO3-Sonderfall + Companion | 11–13 | 2 | 11,5 |
| Video 2 + Zahlen | 14–15 | 1,5 | 13 |
| Workflow + Review-Loop + Video 3 | 16–18 | 3,5 | 16,5 |
| Stolpersteine + Quality Gates + AGENTS.md | 19–21 | 4 | 20,5 |
| Drei Sätze | 22 | 0,5 | 21 |
| Ausblick: Worklogs + Ticketsysteme | 23–24 | 1,5 | 22,5 |
| Ende | 25 | 0,75 | 23,25 |
| **Puffer + Fragen** | | **6,75** | **30** |

## Fragen, die kommen werden

| Frage | Antwort |
|---|---|
| Was ist pi? | Ein schlanker Coding-Agent fürs Terminal; herdr erkennt ihn wie Claude Code oder Codex. |
| Warum nicht tmux? | tmux kennt Panes, aber keine Agenten — kein Zustand, kein `wait --until done`, kein Prompt per API. |
| Was sind coder und brain? | Zwei Modell-Profile: eines schreibt, eines prüft — in getrennten Sessions. |
| Woher kommt das 429-Limit? | *(eigene Antwort eintragen: Anbieter/Plan)* |
| Was kostet das an Tokens? | *(eigene Antwort eintragen)* |

## Checkliste (Camp-Morgen)

| # | Was | Stand |
|---|---|---|
| 1 | Alle drei Videos prüfen: `assets/videos/demo1-tui.mp4`, `demo2-tui.mp4`, `demo3-review-loop.mp4` | ☐ |
| 2 | Autoplay beim Folienwechsel testen — auch nach Reload direkt auf `#/video1` (VLC als Reserve) | ☐ |
| 3 | Lesbarkeit der Videos aus der letzten Reihe prüfen; Pausenpunkte einmal durchklicken | ☐ |
| 4 | Deck offline lokal starten (`npx serve`), Kopie auf USB-Stick, PDF-Export (`?print-pdf`) | ☐ |
| 5 | Schriften Faktum/Aptos auf dem Präsentationsrechner vorhanden — sonst eigenen Laptop nehmen | ☐ |
| 6 | Links auf der Endfolie aufrufen: herdr.dev, talk.shinyhappypages.de/t3camp2026 | ☐ |
| 7 | Beamer-HDMI-Adapter, zweiter Monitor für Speaker Notes | ☐ |
