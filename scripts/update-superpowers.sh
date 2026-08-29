#!/usr/bin/env bash
set -euo pipefail

# Refresh vendored Superpowers skills from GitHub (MIT).
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/.cursor/skills"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --depth 1 https://github.com/obra/superpowers.git "$TMP/superpowers"
COMMIT="$(git -C "$TMP/superpowers" rev-parse HEAD)"
VERSION="$(python3 -c "import json; print(json.load(open('$TMP/superpowers/.cursor-plugin/plugin.json'))['version'])")"

# Preserve SOURCE.md pattern; replace skill trees only.
find "$DEST" -mindepth 1 -maxdepth 1 ! -name SOURCE.md ! -name LICENSE -exec rm -rf {} +
mkdir -p "$DEST"
cp -a "$TMP/superpowers/skills/." "$DEST/"
cp "$TMP/superpowers/LICENSE" "$DEST/LICENSE"

cat > "$DEST/SOURCE.md" <<EOF
# Superpowers skills (vendored)

Upstream: https://github.com/obra/superpowers
Version: ${VERSION}
Commit: ${COMMIT}
License: MIT (see LICENSE in this directory)

Refresh with:

\`\`\`bash
./scripts/update-superpowers.sh
\`\`\`

These skills are copied so Cloud Agents and Cursor Agent sessions in this
repo can follow the Superpowers workflow without requiring the marketplace
plugin. On desktop Cursor you can still run \`/add-plugin superpowers\` for
hooks and marketplace updates.
EOF

echo "Updated Superpowers skills to v${VERSION} (${COMMIT})"
