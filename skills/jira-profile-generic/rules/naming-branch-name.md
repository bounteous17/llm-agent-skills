---
title: Reuse the Ticket's Branch, Otherwise Use the Profile's Branch Format
impact: HIGH
section: 4
impactDescription: Jira links branches, commits, and pull requests to a ticket only when its key appears in the branch name, commit message, or pull request title
tags: branch, naming, development-panel
---

## Reuse the Ticket's Branch, Otherwise Use the Profile's Branch Format

Reuse an existing branch of this repository before building a name:

1. The current branch, if it contains the key.
2. A branch of this repository that Jira's development panel lists for the ticket. Ignore branches of other repositories.
3. A local or remote branch whose name contains the whole key, not as part of a longer key: `git branch --all --format='%(refname:short)' | grep -E '(^|[/_-])<KEY>($|[/_-])'`.

One match: reuse it. Several: ask which one.

Otherwise build `<type>/<KEY>-<slug>`, unless the repository defines another pattern (rule 1.1). This matches the branch names Jira's "Create branch" action commonly produces. Jira's own suggestion is configurable per user, so this format is the profile's convention, not a value read from Jira:

- `<type>`: the issue type in lowercase, spaces replaced by `-`: `Task` → `task`, `Bug` → `bug`, `Story` → `story`, `Sub-task` → `sub-task`.
- `<KEY>`: the key in its original uppercase.
- `<slug>`: the summary in lowercase, accents removed, every run of characters other than `a-z` and `0-9` replaced by a single `-`, with no leading or trailing `-`. Do not shorten or reword it.

**Incorrect (rewords the summary, lowercases the key, drops the type):**

```text
Summary: "Pin GitHub workflow runner images and action versions" (Task)
Branch:  abc-123-pin-runners
```

**Correct:**

```text
Summary: "Pin GitHub workflow runner images and action versions" (Task)
Branch:  task/ABC-123-pin-github-workflow-runner-images-and-action-versions
```
