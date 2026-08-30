---
name: using-agency-agents
description: Use when building or running an AI agency — marketing, sales, design, product, engineering specialists, or a multi-agent pipeline. Maps the task to The Agency roster and loads one specialist brief before acting.
---

# Using The Agency (msitarzewski/agency-agents)

This repo vendors [The Agency](https://github.com/msitarzewski/agency-agents) under `.cursor/agency-agents/`.

Superpowers is the **process** (brainstorm → plan → TDD → verify). The Agency is the **role**: pick a specialist, read their brief, then work in that voice and workflow.

## Hard rules

1. Do **not** load the whole roster into context.
2. Look up the specialist in `.cursor/agency-agents/ROSTER.md`.
3. **Read the matching `.md` file** before answering or implementing as that role.
4. For a pipeline (discovery → build → launch → operate), also read:
   - `.cursor/agency-agents/specialized/agents-orchestrator.md`
   - `.cursor/agency-agents/strategy/QUICKSTART.md`
   - the relevant `strategy/playbooks/phase-*.md` and `strategy/runbooks/*.md`
5. Published Webwise marketing pages stay locked unless the human explicitly confirms edits (`.cursor/rules/live-site-lock.mdc`).
6. Cloud Agent git branch / PR rules override Agency merge instructions.

## How to pick a specialist

| Job | Start with |
|---|---|
| Run the whole agency pipeline | Agents Orchestrator + NEXUS Quickstart |
| Offer, funnel, WhatsApp conversion | Sales discovery/outbound + Growth Hacker |
| Landing page / UI | Frontend Developer, UI Designer, Brand Guardian |
| Positioning, content, SEO | Content Creator, SEO Specialist, Social Media Strategist |
| Product / MVP scope | Product Manager, Sprint Prioritizer, Rapid Prototyper |
| Architecture | Software Architect, Backend Architect, Multi-Agent Systems Architect |
| QA / "is this actually good" | Reality Checker, Evidence Collector |
| Support / ops | Support specialists in `support/` |

If two roles apply, read both briefs and say which one is leading.

## How to work

1. Name the specialist out loud: "Using Frontend Developer for the clinic landing UI."
2. Follow that file's mission, critical rules, and deliverables.
3. For parallel specialists, spawn subagents with the brief path and a tight task. Each subagent reads only its own file.
4. Handoffs: use `.cursor/agency-agents/strategy/coordination/handoff-templates.md`.

## Human activation (copy-paste)

NEXUS modes and per-agent prompts: `.cursor/agency-agents/strategy/coordination/agent-activation-prompts.md`

Example:

```
Activate Agents Orchestrator in NEXUS-Micro mode.
Job: improve Webwise's AI agency delivery system for [NICHE].
Lead with sales + marketing + frontend. Do not edit live marketing pages unless I confirm.
```
