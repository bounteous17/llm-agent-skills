---
title: Give Started Agents a Self-Contained, Vendor-Neutral Brief
impact: HIGH
section: 4
impactDescription: Another agent knows nothing of this conversation and cannot use tools that only your harness has
tags: agent-prompt, delegation, vendor-neutral
---

## Give Started Agents a Self-Contained, Vendor-Neutral Brief

The started agent sees only its prompt and its working directory. Include:

- The goal and the ticket context (`key`, `summary`, `url`).
- The scope: which files, diff, or branch to work on, and what not to touch.
- Whether it may edit, commit, or push. Reviewers default to read-only.
- The expected output and its format, for example "numbered findings with file:line and a fix".

Describe actions as shell commands or plain capabilities. Do not name tools of your own harness, because the other agent may come from a different vendor. Submit with `herdr agent prompt <name> "<brief>" --wait` and read the answer with `herdr agent read`.

**Incorrect:**

```text
Review it. Use AskUserQuestion if unsure and TodoWrite to track.
```

**Correct:**

```text
Review the diff `git diff origin/main...HEAD` in this worktree for ABC-123 (Pin GitHub workflow runner images).
Do not edit, commit, or push. Reply with numbered, actionable findings: file:line, problem, fix.
If something is unclear, state your assumption in the finding instead of stopping.
```
