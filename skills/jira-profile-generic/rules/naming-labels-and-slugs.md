---
title: Use the Key as Label and Its Lowercase Form as Slug
impact: MEDIUM
section: 4
impactDescription: Consistent labels let people find the worktree, tab, agent, and pull request of a ticket at a glance
tags: label, slug, naming
---

## Use the Key as Label and Its Lowercase Form as Slug

- `label` is the key exactly as Jira shows it (`ABC-123`). Consumers use it for worktree, workspace, and tab labels and as the prefix of pull request titles.
- `slug` is the key in lowercase (`abc-123`). Consumers use it where identifiers must be lowercase, such as agent names, and append a short role: `abc-123-review`.

Do not put the summary in labels; it is already in `branch`, and long labels are truncated in terminal UIs.

**Incorrect:**

```text
label: ABC-123 Pin GitHub workflow runner images and action versions
slug:  ABC123
```

**Correct:**

```text
label: ABC-123
slug:  abc-123
```
