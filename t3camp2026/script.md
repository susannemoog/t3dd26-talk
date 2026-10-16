# Script: Ein Agent ist nett. Neun sind ein Team.

**TYPO3camp Berlin 2026 · 30 Minuten · Video-Session**

Untertitel: *Entwicklerarbeit in mehreren Projekten — orchestriert mit herdr*

> Notation: **[SLIDE n]** = Folie · **[VIDEO]** = vorab gerendertes Video. Sprechtext ist Richtwert.

**Roter Faden:** herdr orchestriert die Agenten — MCP macht sie wirksam. Beispiele mit herdr-Bezug: Worktrees, Update-Runde über neun Repos, Agenten über SSH.

**Zusammenfassung in drei Sätzen:** Ich orchestriere mit herdr neun Coding-Agenten parallel — über Zustände, Prompts und Ausgaben, die ich als API lese. Git-Worktrees pro Agent geben mir echte Parallel-Arbeit: ein Agent pro Branch, eine Codebasis, null Konflikt. Die Verträge halte ich selbst fest — AGENTS.md pro Projekt, fünf Prompts pro Batch, das Audit bei mir.

---

## [SLIDE 1 — Titel] (0:00)

> Guten Morgen! Ich bin Susi, Entwicklerin bei neusta. Ich arbeite gleichzeitig in neun Repositories — eine Demo-Landschaft mit TYPO3, Strapi, Payload, Pimcore, Storyblok, Contentful, Magnolia. Neben der eigentlichen Arbeit stapeln sich dort Aufgaben, die in kein Sprint-Ticket passen: Scaffolds, MR-Reviews, Update-Tests, Seeder, CI. Ich habe mir dafür vor sechs Monaten herdr gebaut — und diese Session ist die Geschichte, wie ich damit diesen Teil meines Jobs parallelisiert habe.

## [SLIDE 2 — Neun Projekte, ein Backlog] (2:00)

> Meine Ausgangslage: neun Projekte, und neben meiner eigentlichen Arbeit ein Backlog. Am Montag stand bei mir konkret auf der Liste: drei offene MR-Reviews, vier Composer-Updates, die ich testen will, Projekt-Scaffolds mit CI, Content-Strukturen und Seeder für die Demos. Und freitags die Update-Runde über alle neun Repos — die ich sonst nach Feierabend in einer Stunde abgehakt habe.
>
> Das ist der Teil meines Jobs, der nie fertig wurde — weil ich ihn sequentiell abgearbeitet habe und mir die Zeit fehlte.

## [SLIDE 3 — herdr] (4:00)

> Ich habe für diesen Job herdr genommen: einen Terminal-Workspace-Manager. Terminals in einer Struktur — Workspaces, Tabs, Panes. Und der entscheidende Teil: herdr erkennt Coding-Agenten. Über zwanzig Typen — pi, claude, codex, gemini, cursor. Pro Pane ein anderer möglich — bei mir laufen pi, claude und codex im Wechsel.
>
> "Erkennt" heißt für mich: Der Agent ist kein anonymer Prozess in einem Terminal, sondern ein Objekt mit Namen, Zustand und Schnittstelle. Vorher habe ich Agenten-Ausgaben aus dem Terminal per Hand gelesen — das war genau das Screen-Scraping, das ich loswerden wollte.

## [SLIDE 4 — Vier Zustände] (6:00)

> Jeder Agent, den ich starte, bekommt einen Lebenszyklus, den ich als API-Ergebnis lese: working, idle, blocked, done.
>
> blocked ist der Zustand, auf den ich warte: Der Agent steht an einer Frage oder Freigabe — dann entscheide ich. In meiner letzten Update-Runde waren es vier blocked-Agenten gleichzeitig, alle vier in fünf Minuten abgehandelt. done heißt für mich: Der Auftrag ist abgeschlossen, das Ergebnis liegt in der Datei.

## [SLIDE 5 — Die API] (7:30)

> Über die Agenten legt herdr eine kleine API, die ich täglich benutze: `agent start` — Agent starten, Typ und Pane gewählt. `agent prompt` — Auftrag geben, mit `--wait` auf den Abschluss. `agent wait` — auf einen Zustand warten. `agent read` — die Ausgabe lesen.
>
> Weil es eine API ist, kann ein Agent sie selbst bedienen: Meine Steuer-Session startet und promptet die anderen neun Agenten. Das ist die Basis meiner ganzen Orchestrierung — ich tippe die Befehle nur noch einmal pro Runde.

## [SLIDE 6 — herdr-Agenten vs. Subagenten] (9:00)

> Diese Abgrenzung habe ich selbst teuer gelernt. Ich habe am Anfang Subagenten genommen — die Agent-Funktion im eigenen Tool. Ein Subagent läuft innerhalb meiner Session, sein Ergebnis fließt in meinen Kontext zurück, er erbt Modell und Regeln, und er stirbt mit meiner Session. Bei meiner ersten Update-Runde war mein Kontext nach dem dritten von neun Repos voll.
>
> Ein herdr-Agent ist dagegen eine eigene Session: eigenes Arbeitsverzeichnis, eigene Projekt-AGENTS.md, beliebiger Agent-Typ je Pane. Sein Zustand und seine Ausgabe sind API-Ergebnisse. Kurz: Subagenten sind Delegation innerhalb eines Agenten — herdr ist für mich Orchestrierung über mehrere.

## [SLIDE 7 — Git-Worktrees pro Agent] (11:00)

> Das Feature, das mir am meisten gebracht hat: herdr verwaltet Git-Worktrees. `herdr worktree create` legt einen Worktree an — eigenes Verzeichnis, eigener Branch, dieselbe Codebasis.
>
> So läuft es bei mir: Agent A baut im Worktree `wt-t3-seeder` das Content-Element mit Seeder — das TCA-Schema fragt er über den typo3-dev-companion ab. Agent B fixt im Worktree `wt-t3-viewhelper` einen ViewHelper, mit zwölf Unit-Tests, rot zuerst. Beide parallel an derselben Codebasis, ohne Konflikt — klassisches Git, das ich vorher nie so genutzt habe.

## [SLIDE 8 — Maschinen & Benachrichtigungen] (13:00)

> Zwei Features, die aus dem lokalen Werkzeug etwas Größeres machen:
>
> **Maschinen-Forwarding:** herdr steuert über SSH verbundene Maschinen — gleiche Befehle, entfernter Rechner. Ich leite so meine Befehle an meine zwei Demo-Maschinen weiter — der Agent arbeitet direkt dort, wo das jeweilige Projekt läuft.
>
> **Notifications:** `herdr notification show` benachrichtigt mich, wenn ein Agent fertig ist oder auf eine Freigabe wartet. Vorher habe ich zwanzig Minuten auf neun Terminals gestarrt und den einen Moment trotzdem verpasst — heute werde ich gerufen, wenn es etwas zu entscheiden gibt.

## [SLIDE 9 — VIDEO 1: Agenten auf Worktrees] (14:30)

Datei: `assets/videos/demo1-tui.mp4` (~52 Sek., echte herdr-TUI-Aufnahme, Light-Theme, loop-frei + Pause per Klick).

> Video 1: Agenten auf Worktrees. Die echte herdr-TUI: ein Controller-Agent startet zwei Worker-Agenten im neuen Tab, je 50 % Breite.
>
> 1. Der Controller-Agent tippt live `herdr agent start` × 2 — die Worker erscheinen mit π-Badges.
> 2. Tab-Wechsel auf den Agents-Tab: zwei Panes, je 50 %, daneben der Controller.
> 3. Agent A: Kontraste gegen WCAG 2.1 AA prüfen und fixen. Agent B: script.md enger auf mich anpassen. Parallel, live.
> 4. Am Ende: ✓✓ — beide done. Zwei Branches, eine Codebasis, null Konflikt.

## [SLIDE 10 — Neun Projekte, neun Agenten] (17:00)

> Meine Landschaft: neun Projekte. Ich habe viele CMS-Demos aufgebaut — das geht über KI ganz gut. Sieben davon haben saubere REST- oder GraphQL-APIs — da ruft der Agent den Endpunkt direkt auf, MCP ist hier für mich Komfort. Die API-basierten Systeme haben meist auch eine sehr gut maschinenlesbare Doku dazu.
>
> Anders bei TYPO3 — dazu die nächsten beiden Folien.

## [SLIDE 10a — Warum TYPO3 anders ist] (17:45)

> Warum der Sonderfall — das habe ich teuer gelernt: Die Daten liegen nicht hinter einem JSON-Endpunkt, sondern hinter TCA-Definitionen. Der DataHandler validiert, was reingeht — Tabelle, PID, Sprache, Versionierung. Und die Konventionen stehen im Core: Translation-Domains, TCA-Formen, Changelog-Regeln.
>
> Meine ersten drei TYPO3-Agenten sind deshalb ins Leere gelaufen — beim dritten Repo meiner ersten Runde habe ich es gesehen. Ein reiner API-Agent weiß davon nichts. Er bräuchte Schemata, Datensätze, Regeln.

## [SLIDE 10b — Der Companion in Aktion] (18:30)

> Was der typo3-dev-companion meinen Agenten konkret gibt:
>
> *typo3_schema_lookup* listet die Spalten, die TYPO3 aus der TCA ableitet — das DDL-Schema hinter der Definition. *typo3_record_lookup* liest echte Datensätze meiner Demo-Landschaft. *typo3_translation_domain_lookup* berechnet die Label-Referenz, die das Core selbst anwendet. Der *Changelog-Lookup* sagt, was eine Version deprecated hat. Und *Forge und Gerrit* zeigen mir offene Issues und Patches, bevor ich einen Patch schreibe.
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

> Meine Zahlen: neun Repos parallel. Das Limit liegt bei fünf parallelen Prompts — ein API-Limit, nicht eines von herdr. Ich habe es beim ersten Lauf gemerkt: Der sechste Agent bekam ein 429 und lief einfach nicht.
>
> Elf Minuten Gesamtdauer, vier einhalb davon war ich aktiv. Vorher habe ich dieselbe Runde in einer Stunde sequentiell abgehakt — meistens freitags nach Feierabend.

## [SLIDE 13 — Ein Agent pro Aufgabe] (22:30)

> Mein Workflow darauf: Ein Agent pro Aufgabe — nicht ein Agent mit einer Liste. Review, Update, Scaffold, Seeder: je eine Sache, die ich zu Ende bringe.
>
> Ich beauftrage in Batches von maximal fünf, wegen des API-Limits. Jeder Agent schreibt sein Ergebnis in eine Datei und antwortet mir nur mit DONE — Pane-Output ist, wie ich schmerzlich gelernt habe, keine verlässliche Schnittstelle.
>
> Und das Audit behalte ich mir selbst vor: Ich lese die Berichte, prüfe die MRs und entscheide über jedes Merge.

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

> Was ich selbst schiefgehen lassen habe: Beim ersten Lauf habe ich sechs Agenten gestartet — der sechste bekam ein 429 und existierte einfach nicht, zwanzig Minuten habe ich gesucht, bis ich das Concurrency-Limit verstanden hatte. Und ich habe einmal drei Agenten-Berichte verloren, weil ich sie nicht aus dem Pane-Output eingesammelt habe — seitdem schreibt jeder Agent in eine Datei.
>
> Ein Agent hat mir einmal in die falsche Git-Historie committet — deshalb stehen meine Deployment- und Commit-Regeln heute in der AGENTS.md jedes Projekts, nicht im Prompt. Und ich habe zweimal denselben falschen Kontext an mehrere Agenten verteilt — zwei falsche Ergebnisse parallel. Der Kontext muss bei mir vor dem Start stimmen.

## [SLIDE 16 — Quality Gates, die bei mir laufen] (29:00)

> Und weil parallele Agenten auch parallel fertig werden: Meine Quality Gates. Die erste Regel ist Test-first — und ich meine es wörtlich: Jeder Bugfix beginnt bei mir mit dem Test, der den Bug reproduziert. Ich sehe ihn rot, und erst dann fasse ich Produktionscode an.
>
> Unit-Tests immer: Vitest und Jest für TypeScript, PHPUnit für PHP — verändertes Verhalten ohne Test schicke ich nicht raus, auch nicht aus einem Agenten. Und für das Frontend: Playwright mit einem Project pro Umgebung — ddev, sparkles, onotheooy. Smoke-Tests prüfen bei mir das Deployment, Task-Tests das Ergebnis editoraler Änderungen. Bevor ich etwas als erledigt verbuche, ist die Zielumgebung am Start und die Tests sind gelaufen.

## [SLIDE 17 — Was in meiner AGENTS.md steht] (30:00)

> Der andere Teil, den ihr mitnehmen könnt: Was bei mir in der AGENTS.md jedes Projekts steht. Erstens Commit-Identitäten pro Remote — GitHub und GitLab bekommen look@susi.dev, alles Neusta-interne s.moog@neusta.de. Per Repo-Config gesetzt, nie per --author überschrieben. Ohne diese Regel committet ein Agent mit der falschen Identität — das hatte ich.
>
> Zweitens: glab statt roher curl-Aufrufe für GitLab — MRs, Pipelines, API über ein Werkzeug. Weniger Spielraum für Agenten-Fantasie-Endpoints. Drittens mein Worklog: Eine Zeile pro Aufgabe in ~/worklog — die Basis für meine Zeiterfassung, vom Agenten selbst gepflegt. Und viertens die herdr-Regeln: Ein Agent pro Projekt, IDs aus JSON-Antworten geparst, Batches von fünf. Der Kontext stimmt vor dem Start — nicht im Prompt danach.

## [SLIDE 18 — Drei Sätze] (31:00)

> Meine drei Sätze zum Mitnehmen: Ich orchestriere über Schnittstellen, nicht über Intelligenz — herdr gibt mir Zustand, Prompt und Ausgabe von neun Agenten in einer API, die ich selbst aufrufe.
>
> Worktrees haben mir echtes Parallel-Arbeiten gebracht: bei mir läuft ein Agent pro Branch an einer Codebasis — null Konflikt in sechs Monaten.
>
> Und die Verträge halte ich selbst fest — AGENTS.md in jedem meiner neun Projekte, fünf Prompts pro Batch, das Audit bei mir. Das Werkzeug liefert mir die Mechanik, die Disziplin bringe ich.

## [SLIDE 19 — Ende] (32:30)

> Zusammengefasst: herdr orchestriert — Agenten mit Zustand, Schnittstelle und Worktrees. MCP macht die Agenten wirksam — bei meinem TYPO3 konkret der dev-companion. Und die Entscheidung bleibt bei euch.
>
> Wenn ihr ausprobieren wollt: Genau so habe ich angefangen — herdr installieren, drei Tabs, drei Agenten, und jedem die eine Aufgabe geben, die ihr am längsten vor euch herschiebt. Danke!

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
| Stolpersteine | 1 | 28 |
| Quality Gates + AGENTS.md | 3 | 31 |
| Drei Sätze + Ende | 2,5 | 33 |

## Checkliste (Camp-Morgen)

| # | Was | Stand |
|---|---|---|
| 1 | Beide Videos prüfen: `assets/videos/demo1-tui.mp4`, `assets/videos/demo2-tui.mp4`, `assets/videos/demo3-review-loop.mp4` | ☐ |
| 2 | Video-Abspielen im Browser testen (VLC als Reserve) | ☐ |
| 3 | Beamer-HDMI-Adapter, zweiter Monitor für Speaker Notes | ☐ |
