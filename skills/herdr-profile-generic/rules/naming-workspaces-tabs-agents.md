---
title: Name Workspaces, Tabs, and Agents After the Ticket
impact: MEDIUM
section: 3
impactDescription: Predictable names let the user and other agents find a ticket's panes without reading every terminal
tags: naming, workspace, tab, agent
---

## Name Workspaces, Tabs, and Agents After the Ticket

Derive every Herdr name from the ticket context so that one ticket's work is recognizable everywhere:

| Object | Name | Example |
|--------|------|---------|
| Worktree workspace | `label` (set by `worktree create --label`) | `ABC-123` |
| Extra tab in that workspace | The tab's purpose | `review`, `tests`, `e2e` |
| Tab in a shared workspace | `<label> <purpose>` | `ABC-123 review` |
| Agent | `<slug>-<role>` | `abc-123-review`, `abc-123-impl` |

Agent names must match `[a-z][a-z0-9_-]{0,31}` and be unique among live agents:

- With a ticket, the slug is short (`abc-123`); shorten the role if needed, not the slug.
- Without a ticket, use the confirmed label from rule 2.3 as the workspace and tab label, and normalize it for agent names: lowercase, every run of characters other than `a-z` and `0-9` replaced by `-`, leading characters before the first letter removed. If nothing is left (a label such as `2026`), use `task`. Cut the slug so that `<slug>-<role>` plus a possible `-9` suffix fits in 32 characters.
- If the name is taken, append `-2`, `-3`, and so on.
- Check the final name against `^[a-z][a-z0-9_-]{0,31}$` before `herdr agent start`.

**Incorrect:**

```bash
herdr agent start reviewer --kind codex --pane w7:p1
herdr tab create --workspace w7 --label "Tab 2"
```

**Correct:**

```bash
herdr agent start abc-123-review --kind codex --pane w7:p1 -- <model flags>
herdr tab create --workspace w7 --label tests --no-focus
```
