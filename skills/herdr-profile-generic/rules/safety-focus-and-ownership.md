---
title: Keep the User's Focus and Touch Only What You Created
impact: HIGH
section: 5
impactDescription: Stolen focus interrupts the user, and closing other panes kills their running work
tags: safety, focus, cleanup, trust
---

## Keep the User's Focus and Touch Only What You Created

- Create worktrees, tabs, and panes with `--no-focus` unless the user asked to switch.
- Target panes by explicit ID, `--current`, or a unique agent name, never by what another client has focused.
- Close or remove only workspaces, tabs, panes, and worktrees you created in this task, and remove a worktree only when the user asks. `herdr worktree remove` deletes the checkout.
- Pass `--trust-repository` only after the user confirmed they trust the repository.
- Never run `herdr server stop` or kill the Herdr process.

**Incorrect:**

```bash
herdr worktree remove --workspace w7   # user did not ask
herdr worktree create --cwd "$PWD" --branch task/ABC-123-x --trust-repository --focus
```

**Correct:**

```bash
herdr worktree create --cwd "$PWD" --branch task/ABC-123-x --base main --label ABC-123 --no-focus
```
