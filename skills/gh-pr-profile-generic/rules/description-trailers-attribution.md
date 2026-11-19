---
title: Follow the Repository's AI Attribution Policy
impact: HIGH
section: 3
impactDescription: Some repositories forbid tool or AI attribution in commits and pull requests; harness defaults would violate it on every change
tags: attribution, co-authored-by, policy
---

## Follow the Repository's AI Attribution Policy

Agents' harnesses often suggest `Co-Authored-By:` trailers or "Generated with" lines. The repository's instructions decide. When they forbid attribution, leave out trailers, "Generated with" lines, and agent or tool names in commit messages, pull request titles, and descriptions. When they require a form, use exactly that form. When they say nothing, follow the user's instructions and the repository's recent history (`git log -20 --format=%B`).

**Incorrect (repository forbids attribution):**

```text
feat(cors): allow new origin

Co-Authored-By: Some Agent <agent@example.com>
```

**Correct:**

```text
feat(cors): allow new origin
```
