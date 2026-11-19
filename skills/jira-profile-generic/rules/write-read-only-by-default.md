---
title: Stay Read-Only Unless the User Asks for a Jira Change
impact: CRITICAL
section: 5
impactDescription: Unrequested transitions, comments, or assignments notify people and change team boards
tags: writes, transition, create, consent
---

## Stay Read-Only Unless the User Asks for a Jira Change

Transitioning, commenting, assigning, editing, linking, logging work, and creating tickets are visible to the team and notify people. Do them only when the user explicitly asks in the current conversation. Approval for one write does not cover the next one.

When creating a ticket, apply the repository's defaults (rule 1.1), such as assignee or team. When the repository defines none and a required field has no obvious value, ask instead of guessing. Report the new key and URL afterwards.

**Incorrect (transitions the ticket because work started):**

```text
Created worktree for ABC-123 and moved ABC-123 to In Progress.
```

**Correct:**

```text
Created worktree for ABC-123. The ticket is still in To Do; should I move it to In Progress?
```
