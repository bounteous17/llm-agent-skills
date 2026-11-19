---
title: Detect the Repository's Ticket System from Its Agent Instructions
impact: CRITICAL
section: 1
impactDescription: Asking the wrong tracker returns no ticket or a ticket from another project, and every name derived from it is wrong
tags: ticket-context, ticket-system, agent-instructions, dependencies
---

## Detect the Repository's Ticket System from Its Agent Instructions

Before asking for a ticket context, find out at runtime which ticket system the current repository uses. Read the repository's agent instructions from the root of the checkout you work in: `AGENTS.md`, then the vendor files such as `CLAUDE.md` or `GEMINI.md`, and the files they point to (for example a `CLAUDE.md` that only says "Read AGENTS.md"). Do not rely on what another repository used earlier in the session.

Signals, strongest first:

1. A tracker named outright: "Jira", "Linear", "GitHub Issues", "Asana", "YouTrack", or a link to one.
2. A ticket key pattern in naming rules, such as `ABC-XXXX` in pull request titles or branches (Jira or Linear style), or `#123` (GitHub Issues).
3. An MCP server or CLI listed for tickets, such as an Atlassian server or `acli` for Jira.

Then choose the provider, a skill whose `metadata.provides` is `ticket-context`:

| Instructions say | Installed providers | Do |
|------------------|---------------------|----|
| One system | A provider for it, such as `jira-profile-*` for Jira | Use it |
| One system | None for it | Do not use a provider for another system. Ask the user for the key and branch, and name the profile to install |
| Several systems | Any | Ask the user which one this task uses |
| Nothing | Exactly one | Use it |
| Nothing | None or several | Ask the user for the key and branch, or treat the work as having no ticket (rule 2.3) |

Keep the key format and project keys the instructions give, such as `ABC-`. State the detected system in one line when it was not obvious.

**Incorrect:**

```text
Last repository used Jira, so I'll fetch ABC-123 from Jira for this one too.
```

**Correct:**

```bash
# Read the instructions of the repository being worked on, not another one
for f in AGENTS.md CLAUDE.md GEMINI.md; do [ -f "$f" ] && grep -niE 'jira|linear|github issues|asana|youtrack|[A-Z][A-Z0-9]+-X{2,}' "$f"; done
```

```text
AGENTS.md names Jira and ABC-XXXX keys, and jira-profile-generic is installed, so the ticket context comes from it.
```
