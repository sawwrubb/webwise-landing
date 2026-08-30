# Webwise landing — agent instructions

## Superpowers

This repository vendors [obra/superpowers](https://github.com/obra/superpowers) in `.cursor/skills/`.

1. Read `.cursor/skills/using-superpowers/SKILL.md` before other work.
2. If a skill might apply, read that skill and follow it. Do not skip it.
3. Building new features or products: `brainstorming` first, then approval, then `writing-plans` for architectural work, then `subagent-driven-development` or `executing-plans`.
4. Implementation uses `test-driven-development` when tests are possible. Bugs use `systematic-debugging`. Finish with `verification-before-completion`.
5. User instructions in this file and Cursor rules override skill defaults (for example Cloud Agent branch naming).

Desktop Cursor: also install the marketplace plugin with `/add-plugin superpowers` for session-start hooks. Cloud Agents pick up the vendored skills from this repo.

## The Agency (specialists)

This repository vendors [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) in `.cursor/agency-agents/`.

1. Read `.cursor/skills/using-agency-agents/SKILL.md` when the work is agency delivery (sales, marketing, design, product, engineering roles, or a multi-agent pipeline).
2. Pick specialists from `.cursor/agency-agents/ROSTER.md` and **read only those files**.
3. For a full pipeline, use Agents Orchestrator plus `.cursor/agency-agents/strategy/QUICKSTART.md` (NEXUS Full / Sprint / Micro).
4. Superpowers stays the process layer. The Agency stays the role layer. Do not dump the whole roster into one prompt.

Refresh later with `./scripts/update-agency-agents.sh`.

Optional on a personal machine: clone upstream and run `./scripts/install.sh --tool cursor` if you want `@agent` rule files. This repo uses on-demand briefs instead so sessions stay small.

## Published site

Do not edit published marketing pages, CSS, JS, or sitemap unless the human explicitly confirms that change. See `.cursor/rules/live-site-lock.mdc`.
