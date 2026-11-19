---
title: Prefix the Title with the Ticket Key, or Use a Conventional-Commit Type
impact: HIGH
section: 2
impactDescription: The key in the title links the pull request to the ticket and lets people scan pull request lists by ticket
tags: title, ticket-context, conventional-commits
---

## Prefix the Title with the Ticket Key, or Use a Conventional-Commit Type

With a ticket: `<KEY>: <short description in sentence case>`, using `label` from the ticket context. The description states what the change does. It may start from the ticket summary but must match the actual diff.

Without a ticket: a conventional-commit title, `<type>: <description>` or `<type>(<scope>): <description>`, with `<type>` one of `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `ci`, `build`.

Either way: no trailing period, under 72 characters, no issue numbers or emojis besides the key. Never invent a key; when the ticket context is `none`, use the conventional-commit form.

**Incorrect:**

```text
abc-123 pin runners.
ABC-0000: Update CORS
[ABC-123] PIN GITHUB WORKFLOW RUNNER IMAGES AND ACTION VERSIONS IN ALL REPOSITORIES' WORKFLOWS
```

**Correct:**

```text
ABC-123: Pin GitHub workflow runner images and action versions
fix(cors): allow tvlandundluet.ch origin
```
