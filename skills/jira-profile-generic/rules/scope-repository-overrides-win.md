---
title: Let the Repository's Agent Instructions Override This Profile
impact: CRITICAL
section: 1
impactDescription: Generic defaults that contradict a repository's documented Jira rules produce wrong branch names and wrong ticket fields
tags: precedence, agents-md, configuration
---

## Let the Repository's Agent Instructions Override This Profile

Before resolving a ticket, read the repository's agent instructions file: `AGENTS.md`, or whichever file the repository uses (`CLAUDE.md`, `GEMINI.md`, `.cursor/rules`). Any Jira rule found there wins over this profile. Typical overrides:

- Accepted project keys (for example only `ABC-*`).
- A branch pattern different from rule 4.1.
- Defaults for new tickets, such as assignee, team, components, or labels.

Apply this profile only for what the repository leaves unspecified. When the repository's rules and this profile conflict, follow the repository and mention the conflict once.

**Incorrect (ignores the repository's branch rule):**

```text
AGENTS.md: "Branch names: <KEY>-<slug>, no type prefix"
Agent creates: task/ABC-123-pin-github-workflow-runner-images
```

**Correct (repository rule applied):**

```text
AGENTS.md: "Branch names: <KEY>-<slug>, no type prefix"
Agent creates: ABC-123-pin-github-workflow-runner-images-and-action-versions
```
