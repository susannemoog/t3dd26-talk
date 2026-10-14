#!/bin/bash
# Demo 1: Worktrees pro Agent — zwei Agenten, zwei Branches, eine Codebasis (talk repo)

TALK=/Volumes/cs/projects/dxp/demos/talk
WT_BASE=/Volumes/cs/worktrees/talk

echo ""
echo "  herdr — Demo 1: Worktrees pro Agent"
echo "  ─────────────────────────────────────"
echo ""
echo "  \$ herdr worktree list --cwd $TALK"
herdr worktree list --cwd "$TALK" | jq -r '.result.worktrees[] | "    " + .branch + "  " + .path'

echo ""
echo "  \$ herdr worktree create --branch wt-talk-a11y --label a11y"
R1=$(herdr worktree create --cwd "$TALK" --branch wt-talk-a11y --label a11y --no-focus)
P1=$(echo "$R1" | jq -r '.result.root_pane.pane_id')
echo "$R1" | jq -r '"    ✓ " + .result.worktree.branch + "  · " + .result.worktree.path'
sleep 6

echo ""
echo "  \$ herdr worktree create --branch wt-talk-script --label script"
R2=$(herdr worktree create --cwd "$TALK" --branch wt-talk-script --label script --no-focus)
P2=$(echo "$R2" | jq -r '.result.root_pane.pane_id')
echo "$R2" | jq -r '"    ✓ " + .result.worktree.branch + "  · " + .result.worktree.path'
sleep 6

echo ""
echo "  \$ herdr agent start a11y --kind pi --pane $P1"
herdr agent start a11y --kind pi --pane "$P1" --timeout 90000 | jq -r '"    ✓ " + .result.agent.name + "  " + .result.agent.agent_status'

echo ""
echo "  \$ herdr agent start scripter --kind pi --pane $P2"
herdr agent start scripter --kind pi --pane "$P2" --timeout 90000 | jq -r '"    ✓ " + .result.agent.name + "  " + .result.agent.agent_status'

echo ""
echo "  \$ herdr agent prompt a11y \"Prüfe die Kontraste in beiden Decks (WCAG AA) …\""
herdr agent prompt a11y "Prüfe die Farbkontraste in t3camp2026/index.html und t3dd2026/index.html gegen WCAG 2.1 AA (4,5:1 für Fließtext, 3:1 für große Headlines). Verbessere auffällige Kontraste direkt im CSS der Decks. Fasse am Ende in 3 Sätzen zusammen, was du geändert hast." --wait --timeout 900000 | jq -r '"    ↳ " + .result.agent.name + "  " + .result.agent.agent_status' &

echo ""
echo "  \$ herdr agent prompt scripter \"Passe script.md enger auf Susi an …\""
herdr agent prompt scripter "Passe t3camp2026/script.md enger auf Susi an: Sprechtext konsequent in der Ich-Form, konkrete Zahlen und Abläufe statt generischer Formulierungen, Stolpersteine als eigene Erfahrung erzählt. Gezielte Anpassungen, Struktur behalten. Fasse am Ende in 3 Sätzen zusammen, was du geändert hast." --wait --timeout 900000 | jq -r '"    ↳ " + .result.agent.name + "  " + .result.agent.agent_status' &

wait
echo ""
echo "  ✓ beide Agenten fertig"

echo ""
echo "  — Ergebnis Agent A (a11y): —"
herdr agent read a11y --source recent-unwrapped --lines 12 | sed -E '/↑[0-9.]+[kM]? /d; /KB verbunden/d; /brain •/d; /^─+ *$/d; /^[[:space:]]*$/d' | head -8

echo ""
echo "  — Ergebnis Agent B (scripter): —"
herdr agent read scripter --source recent-unwrapped --lines 12 | sed -E '/↑[0-9.]+[kM]? /d; /KB verbunden/d; /brain •/d; /^─+ *$/d; /^[[:space:]]*$/d' | head -8

echo ""
echo "  \$ git -C wt-talk-a11y status --short  ·  git -C wt-talk-script status --short"
echo "  a11y:"
git -C "$WT_BASE/wt-talk-a11y" status --short | sed 's/^/    /'
echo "  script:"
git -C "$WT_BASE/wt-talk-script" status --short | sed 's/^/    /'

echo ""
echo "  — Ende: zwei Worktrees, zwei Branches, eine Codebasis, null Konflikt —"
