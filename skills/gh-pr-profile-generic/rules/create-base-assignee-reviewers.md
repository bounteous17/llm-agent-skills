---
title: Target the Base Branch, Assign Yourself, and Let CODEOWNERS Pick Reviewers
impact: HIGH
section: 4
impactDescription: A wrong base merges into the wrong branch; manual reviewers duplicate or override the team's ownership rules
tags: base-branch, assignee, reviewers, codeowners
---

## Target the Base Branch, Assign Yourself, and Let CODEOWNERS Pick Reviewers

- Base: the branch the repository's instructions name, otherwise the repository default: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`. For a branch stacked on another feature branch, use that branch as the base and say so in the report.
- Assignee: `@me`.
- Reviewers: GitHub requests code owners from the `CODEOWNERS` file on the **base** branch (`.github/`, root, or `docs/`), only for paths the change touches, and not while the pull request is a draft. When that file exists, add no reviewers yourself. After creating the pull request, check `gh pr view --json reviewRequests`; if it is empty, tell the user instead of adding reviewers. Without `CODEOWNERS`, add reviewers only when the user names them.
- Draft: only when the user asks or the repository requires it; mention that code owners are requested when it is marked ready.

**Incorrect:**

```bash
gh pr create --base master --reviewer someone --title "..." --body "..."
```

**Correct:**

```bash
base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
git show "origin/$base:.github/CODEOWNERS" >/dev/null 2>&1 && echo "code owners on $base"
gh pr create --base "$base" --assignee @me \
  --title "ABC-123: Pin GitHub workflow runner images and action versions" \
  --body-file "$tmpdir/pr-body.md"
gh pr view --json reviewRequests --jq '.reviewRequests | length'
```
