---
title: Commit, Push, and Open Pull Requests Only When Asked
impact: CRITICAL
section: 1
impactDescription: Pushes and pull requests notify reviewers, trigger CI, and can deploy; they are hard to take back
tags: consent, push, commit, safety
---

## Commit, Push, and Open Pull Requests Only When Asked

Create commits, push, and open pull requests only when the user asks in the current conversation. A request to open a pull request includes pushing the current branch for it, and nothing more.

- Resolve the base branch (rule 4.2) before any push. Push the current branch to the branch of the same name on `origin` with an explicit destination, and refuse when the current branch or the base is empty, or when they are equal. A bare `git push` depends on `push.default`, `remote.origin.push`, and the branch's upstream; a branch created from `origin/<base>` may track the base branch.
- Never force-push, delete remote branches, merge, close, or mark ready for review unless the user asks for that action.
- If a sandbox blocks network or Git writes, request the narrowest permission your harness offers for that one command and say why.

**Incorrect (destination depends on local configuration):**

```bash
git checkout -b feat/x origin/main && git commit -am "feat: x" && git push
git push --force
```

**Correct:**

```bash
base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
branch=$(git branch --show-current)
if [ -n "$base" ] && [ -n "$branch" ] && [ "$branch" != "$base" ]; then
  git push -u origin "HEAD:refs/heads/$branch"
else
  echo "refusing to push: branch='$branch' base='$base'"
fi
```
