---
title: Apply This Profile Only Inside a Herdr Pane
impact: CRITICAL
section: 1
impactDescription: Herdr commands run from outside a managed pane act on whatever session the user happens to have focused
tags: activation, herdr-env, scope
---

## Apply This Profile Only Inside a Herdr Pane

Check `HERDR_ENV` before any `herdr` command. When it is not `1`, do not use Herdr at all: create worktrees with `git worktree add` or work on a branch, as the repository's instructions say, and keep the naming rules from section 3 for the branch.

Not every contributor uses Herdr. Never ask a user to install it or switch to it to follow this profile.

**Incorrect:**

```bash
herdr worktree create --cwd "$PWD" --branch task/ABC-123-pin-runner-images --label ABC-123
```

**Correct:**

```bash
if [ "${HERDR_ENV:-}" = 1 ]; then
  herdr worktree create --cwd "$PWD" --branch task/ABC-123-pin-runner-images --base main --label ABC-123 --no-focus
else
  git worktree add -b task/ABC-123-pin-runner-images ../my-repo-ABC-123 origin/main
fi
```
