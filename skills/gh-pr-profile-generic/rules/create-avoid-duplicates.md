---
title: Check for an Existing Pull Request Before Creating One
impact: HIGH
section: 4
impactDescription: Duplicate pull requests split review comments and CI results across two threads
tags: duplicate, create, gh-pr-view
---

## Check for an Existing Pull Request Before Creating One

Before `gh pr create`, look up the current branch's pull request with `gh pr view --json number,url,state,title` and act on the outcome:

| Outcome | Action |
|---------|--------|
| `state` is `OPEN` | Do not create one; update it (section 5) and report its URL |
| `state` is `CLOSED` or `MERGED` | Tell the user and ask before opening a new one |
| Error "no pull requests found" | None exists; create it |
| Any other error (authentication, network, permissions) | Stop and report the error; do not create |

**Incorrect (creates after any failure, including an expired login):**

```bash
gh pr view --json number,url,state || gh pr create --base main --assignee @me --title "ABC-123: Pin runner images" --body-file body.md
```

**Correct:**

```bash
if out=$(gh pr view --json number,url,state 2>&1); then
  echo "$out"                                  # OPEN → update; CLOSED/MERGED → ask the user
elif printf '%s' "$out" | grep -q 'no pull requests found'; then
  gh pr create --base "$base" --assignee @me --title "$title" --body-file "$body"
else
  echo "Lookup failed: $out"                   # stop and report
fi
```
