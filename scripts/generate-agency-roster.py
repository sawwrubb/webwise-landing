#!/usr/bin/env python3
"""Build ROSTER.md from vendored Agency agent frontmatter."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENCY = ROOT / ".cursor" / "agency-agents"
DIVISIONS_FILE = AGENCY / "divisions.json"
ROSTER = AGENCY / "ROSTER.md"


def parse_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    data: dict[str, str] = {}
    for line in parts[1].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip("'\"")
    return data


def slugify(name: str) -> str:
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def main() -> None:
    divisions = json.loads(DIVISIONS_FILE.read_text(encoding="utf-8"))["divisions"]
    rows: list[tuple[str, str, str, str, str]] = []
    for div_id, meta in sorted(divisions.items(), key=lambda item: item[1]["label"]):
        folder = AGENCY / div_id
        if not folder.is_dir():
            continue
        for path in sorted(folder.glob("*.md")):
            fm = parse_frontmatter(path)
            if "name" not in fm:
                continue
            rel = path.relative_to(AGENCY).as_posix()
            rows.append(
                (
                    meta["label"],
                    fm["name"],
                    slugify(fm["name"]),
                    fm.get("description", "").strip(),
                    rel,
                )
            )

    lines = [
        "# The Agency roster (vendored)",
        "",
        f"Source: https://github.com/msitarzewski/agency-agents",
        f"Agents indexed: {len(rows)}",
        "",
        "When a specialist is needed, **read the matching file** under this directory",
        "and work in that role. Do not paste every agent into context.",
        "",
        "| Division | Agent | Slug | Description | File |",
        "|---|---|---|---|---|",
    ]
    for label, name, slug, desc, rel in rows:
        desc = desc.replace("|", "\\|")
        lines.append(f"| {label} | {name} | `{slug}` | {desc} | `{rel}` |")
    lines.append("")
    ROSTER.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {ROSTER} ({len(rows)} agents)")


if __name__ == "__main__":
    main()
