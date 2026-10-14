#!/bin/bash
# Demo 2: Update-Runde — Repos parallel prüfen, Berichte in Dateien

echo ""
echo "  herdr — Demo 2: Update-Runde über die Repos"
echo "  ────────────────────────────────────────────"
echo ""
echo "  \$ herdr agent rename demo-seeder t3  ·  herdr agent rename demo-fixer strapi"
herdr agent rename demo-seeder t3 | jq -r '"    ✓ " + .result.agent.name'
herdr agent rename demo-fixer strapi | jq -r '"    ✓ " + .result.agent.name'

echo ""
echo "  \$ herdr agent prompt t3 \"Prüfe git-Stand, offene MRs, Prod-URL …\""
herdr agent prompt t3 "Prüfe in diesem Repo: git fetch --all und Stand gegenüber origin/develop, offene Merge Requests mit glab mr list, Prod-URL per curl (HTTP-Status). Schreibe das Ergebnis als kurzen Bericht nach /tmp/herdr-talk/t3.md und antworte nur mit DONE." --wait --timeout 900000 | jq -r '"    ↳ " + .result.agent.name + "  " + .result.agent.agent_status' &

echo ""
echo "  \$ herdr agent prompt strapi \"Prüfe git-Stand, offene MRs, Prod-URL …\""
herdr agent prompt strapi "Prüfe in diesem Repo: git fetch --all und Stand gegenüber origin/develop, offene Merge Requests mit glab mr list, Prod-URL per curl (HTTP-Status). Schreibe das Ergebnis als kurzen Bericht nach /tmp/herdr-talk/strapi.md und antworte nur mit DONE." --wait --timeout 900000 | jq -r '"    ↳ " + .result.agent.name + "  " + .result.agent.agent_status' &

wait
echo ""
echo "  ✓ beide Agenten fertig — Berichte liegen in /tmp/herdr-talk/"

echo ""
echo "  \$ cat /tmp/herdr-talk/t3.md"
sed 's/^/    /' /tmp/herdr-talk/t3.md

echo ""
echo "  \$ cat /tmp/herdr-talk/strapi.md"
sed 's/^/    /' /tmp/herdr-talk/strapi.md

echo ""
echo "  — Ende: zwei Repos parallel, Audit bei mir —"
