---
title: Update the Title and Description After Every Push to an Open Pull Request
impact: MEDIUM
section: 5
impactDescription: Descriptions written for the first push misdescribe the change reviewers approve
tags: update, push, gh-pr-edit
---

## Update the Title and Description After Every Push to an Open Pull Request

When pushing commits to a branch with an open pull request, bring its title and description up to date in the same step so they describe the whole change against the base, following sections 2 and 3:

1. Read the current title and body: `gh pr view --json title,body`.
2. Rewrite only what the new commits made stale or incomplete, usually the summary bullets and possibly the title. Do not append "Update:" sections or a changelog of pushes.
3. Keep content that people maintain by hand, such as review notes, migration or rollout instructions, and template checklists with their checked state, unless it became wrong; then say what you changed.
4. Skip the edit when nothing is stale.

**Incorrect:**

```bash
git push
gh pr edit --body "## Summary
- Latest commit only"            # discards the reviewer's rollout notes
```

**Correct:**

```bash
# push with the guarded command from rule 1.1 (non-empty base and branch, branch != base)
gh pr view --json title,body > "$tmpdir/pr.json"
# edit the stale summary bullets, keep the rest
gh pr edit --title "ABC-123: Pin GitHub workflow runner images and action versions" --body-file "$tmpdir/pr-body.md"
```
