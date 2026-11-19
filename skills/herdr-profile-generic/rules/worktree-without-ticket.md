---
title: Ask for a Label and Branch When the Work Has No Ticket
impact: HIGH
section: 2
impactDescription: Invented ticket keys break tracker links and mislead reviewers
tags: worktree, no-ticket, fallback
---

## Ask for a Label and Branch When the Work Has No Ticket

When the ticket context is `none`, or no ticket profile is installed, do not invent a key. Propose a branch `<type>/<short-slug>`, with `<type>` a conventional-commit type (`feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`), and a label equal to `<short-slug>`. Let the user confirm or change both before creating the worktree, unless the request already gave them.

**Incorrect:**

```bash
herdr worktree create --cwd "$PWD" --branch task/ABC-0000-cors-bump --base main --label ABC-0000 --no-focus
```

**Correct:**

```text
This work has no ticket. I'll use branch fix/cors-allow-new-domain with label cors-allow-new-domain. OK?
```
