---
title: Resolve the Ticket Key from the Request or the Current Branch
impact: CRITICAL
section: 2
impactDescription: A wrong key links work, branches, and pull requests to an unrelated ticket
tags: ticket-key, branch, identification
---

## Resolve the Ticket Key from the Request or the Current Branch

If the user says the work has no ticket, return context `none` and stop, even when the current branch contains a key.

Otherwise collect candidate keys, then choose:

1. Collect every distinct key from the user's current request (a key such as `ABC-123`, or a browse URL such as `https://<site>.atlassian.net/browse/ABC-123`) and from the current branch name (`git branch --show-current`).
2. Only when both are empty, collect keys from commits on the current branch that are not on the base branch: `git log --format=%s <base>..HEAD`.
3. Drop keys from projects the repository does not accept (rule 1.1).
4. Exactly one candidate left: use it. Several, or the request and the branch disagree (the request names `ABC-12`, the branch is `task/ABC-34-...`): ask which one applies.
5. None left: return context `none` without asking when the repository's instructions allow this kind of change without a ticket. Otherwise ask once for the key, offering "no ticket" as an answer.

The size or kind of the change never overrides a key the user gave: "bump dependencies for ABC-123" belongs to `ABC-123`.

A key matches `[A-Z][A-Z0-9]+-[0-9]+` with no letter or digit directly before or after it, so `fix-ABC-123` yields `ABC-123`, `task/ABC-12-ABC-34-fix` yields both keys, and `ABC-123abc` yields none. Keep every distinct match.

**Incorrect (takes the first key seen anywhere in the log):**

```bash
git log --all --format=%s | grep -oE '[A-Z]+-[0-9]+' | head -1
```

**Correct (all distinct candidates from the branch; the request is checked the same way):**

```bash
git branch --show-current | perl -nle 'print for /(?<![A-Za-z0-9])[A-Z][A-Z0-9]+-[0-9]+(?![A-Za-z0-9])/g' | sort -u
```
