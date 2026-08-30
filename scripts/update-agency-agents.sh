#!/usr/bin/env bash
set -euo pipefail

# Refresh vendored Agency specialists from GitHub (MIT).
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/.cursor/agency-agents"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 https://github.com/msitarzewski/agency-agents.git "$TMP/agency-agents"
COMMIT="$(git -C "$TMP/agency-agents" rev-parse HEAD)"

DIVS=(
  academic design engineering finance game-development gis healthcare marketing
  paid-media product project-management research sales security spatial-computing
  specialized support testing strategy
)

rm -rf "$DEST"
mkdir -p "$DEST"
for d in "${DIVS[@]}"; do
  cp -a "$TMP/agency-agents/$d" "$DEST/$d"
done
cp "$TMP/agency-agents/LICENSE" "$DEST/LICENSE"
cp "$TMP/agency-agents/divisions.json" "$DEST/divisions.json"

python3 "$ROOT/scripts/generate-agency-roster.py"

cat > "$DEST/SOURCE.md" <<EOF
# Agency agents (vendored)

Upstream: https://github.com/msitarzewski/agency-agents
Commit: ${COMMIT}
License: MIT (see LICENSE in this directory)

Refresh with:

\`\`\`bash
./scripts/update-agency-agents.sh
\`\`\`

Full specialist briefs live in this folder. Cursor loads a short dispatcher
rule plus the \`using-agency-agents\` skill — not every agent on every turn.
EOF

echo "Updated agency-agents to ${COMMIT}"
