---
title: Never Invent Ticket Data
impact: CRITICAL
section: 2
impactDescription: A fabricated summary or type ends up in branch names and pull request titles that the team relies on
tags: hallucination, fallback, identification
---

## Never Invent Ticket Data

Fetch the ticket (section 3) before using any field in a name. When the fetch fails because the ticket does not exist, access is denied, or no Jira client is available, say so and ask the user for what is needed: the summary and issue type, or the exact branch name. Do not derive a summary from the user's wording, the code, or a similar ticket, and do not guess the issue type.

Values the user supplies are allowed; mark the context as user-confirmed. Fields that remain unknown are `null`, never guessed:

- The user confirms the key only: `key`, `label`, and `slug` are set; `summary`, `type`, `status`, `url`, and `branch` are `null` until the user gives them.
- The user gives a branch name: use it as `branch` exactly as given.

Consumers handle `null` fields: they ask for a missing branch instead of building one, and describe the change itself where a summary would have gone.

**Incorrect (fills the summary from the request):**

```text
Jira lookup failed: no client configured
Using branch task/ABC-123-fix-runner-images
```

**Correct (reports the failure and asks):**

```text
Could not fetch ABC-123: no Jira client is configured (no Atlassian MCP server, acli not installed).
Tell me the ticket's summary and issue type, or the branch name to use.
```
