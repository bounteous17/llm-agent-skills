---
title: Give Each New Ticket One Worktree Named from the Ticket Context
impact: HIGH
section: 2
impactDescription: Work on several tickets in one checkout mixes changes; duplicate worktrees split one ticket's work
tags: worktree, ticket-context, base-branch
---

## Give Each New Ticket One Worktree Named from the Ticket Context

The upstream `herdr` skill creates worktrees only when the user asks for that topology. Installing this profile is the team's standing request for one: when the user starts work on a **new** ticket, work in that ticket's worktree. Stay in the current checkout when the user says so, when the current branch already belongs to the ticket, or when the request is not the start of ticket work (a question, a review, a follow-up on the current branch).

1. Get the ticket context from the ticket profile matching the repository's ticket system (rule 1.3). If `branch` is `null`, ask for it.
2. Run `herdr worktree list`. If a worktree already has the ticket's `branch`, reuse it (`herdr worktree open` when it has no open workspace) instead of creating another.
3. Otherwise create it with the ticket's `branch` and `label`, the base ref, and `--no-focus`.

The base ref is the one the user or the repository's instructions name, used exactly as written (`upstream/main`, a stacked feature branch). When none is named, use the remote default branch: run `git fetch origin`, then `git symbolic-ref --short refs/remotes/origin/HEAD`, which prints `origin/<name>`. Keep that `origin/` prefix so the worktree starts from the remote state, not a stale local branch. If `origin/HEAD` is not set, run `git remote set-head origin --auto` once; if it still does not resolve, ask. Do not assume `main` or `master`.

**Incorrect (invented branch, assumed and local base, steals focus):**

```bash
herdr worktree create --cwd "$PWD" --branch abc-123 --base master --label "pin runners" --focus
```

**Correct:**

```bash
herdr worktree list
git fetch origin
base=$(git symbolic-ref --short refs/remotes/origin/HEAD)   # e.g. origin/main
herdr worktree create --cwd "$PWD" \
  --branch task/ABC-123-pin-github-workflow-runner-images-and-action-versions \
  --base "$base" --label ABC-123 --no-focus
```
