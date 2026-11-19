---
title: Take Herdr Syntax from the Upstream Skill and the Installed CLI
impact: CRITICAL
section: 1
impactDescription: Guessed flags fail, and mutating commands run with defaults when arguments are omitted
tags: herdr-cli, upstream-skill, dependencies
---

## Take Herdr Syntax from the Upstream Skill and the Installed CLI

This profile only adds conventions. For command syntax, IDs, agent states, and safety rules, follow the upstream `herdr` skill. When it is not installed, read `herdr --skill`. For a single command, read `herdr <group> <command> --help`.

Do not run bare `herdr` (it attaches the TUI), and do not discover a mutating command by running it without arguments: `herdr workspace create` executes with defaults. Parse IDs from the JSON that commands return; never predict them.

**Incorrect:**

```bash
herdr worktree create            # probing; creates a worktree with defaults
herdr agent start --pane w1:p2   # guessed syntax, missing name and kind
```

**Correct:**

```bash
herdr worktree create --help
herdr agent start --help
```
