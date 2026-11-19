---
title: Copy the Repository's Gitignored Local Files into a New Worktree
impact: HIGH
section: 2
impactDescription: A fresh worktree lacks untracked env and settings files, so builds, tests, and agents fail or behave differently
tags: worktree, env-files, secrets
---

## Copy the Repository's Gitignored Local Files into a New Worktree

Right after creating a worktree, copy the gitignored local files that the repository's instructions list (often under a "New git worktree" heading) from the main checkout (the first entry of `git worktree list --porcelain`, not the worktree you are in) into the new checkout, keeping their relative paths. Skip files that do not exist in the main checkout and say which ones were missing.

When the repository lists no files, copy nothing; do not guess from `.gitignore`. Never print, diff, or summarize the files' contents, and never stage or commit them.

**Incorrect:**

```bash
cp .env* "$wt"/ && cat "$wt/.env.local"
git -C "$wt" add .env.local
```

**Correct:**

```bash
src=$(git worktree list --porcelain | sed -n '1s/^worktree //p')   # main checkout, not the current worktree
for f in .env.local .env.e2e.local .claude/settings.local.json; do
  if [ -f "$src/$f" ]; then mkdir -p "$wt/$(dirname "$f")" && cp "$src/$f" "$wt/$f"; else echo "missing: $f"; fi
done
```
