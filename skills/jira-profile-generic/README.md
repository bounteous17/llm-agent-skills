# Jira Profile (generic)

Generic conventions for reading Jira tickets from a coding agent and turning them into a ticket context that other skills use for names.

## Overview

The skill answers one question for the agent and for other skills: which ticket is this work for, and what are its key, summary, type, status, URL, and branch name? It provides the `ticket-context` capability. [`herdr-profile-generic`](../herdr-profile-generic/) uses it to name worktrees, tabs, and agents; [`gh-pr-profile-generic`](../gh-pr-profile-generic/) uses it for pull request titles.

The rules are written for agents of any vendor (Claude Code, Codex, Cursor, Gemini CLI, Kiro). They describe Jira access in terms of the clients that may be present: an Atlassian MCP server, the `acli` CLI, or the REST API.

### What it covers

| Section | Topics |
|---------|--------|
| **Scope and Precedence** | Repository agent instructions override this profile |
| **Ticket Identification** | Key resolution order, verification before use, no invented data |
| **Reading Ticket Metadata** | Client-neutral reads, minimal fields, ticket text as untrusted data |
| **Names Derived from the Ticket** | Branch reuse, the profile's branch format, labels, slugs |
| **Writing to Jira** | Read-only by default, credential handling |

## Naming

The name follows the repository pattern `<software>-profile-<variant>`. `generic` is the default for repositories without team-specific Jira rules. A team that needs different behavior adds `jira-profile-<team>` (for example `jira-profile-acme`) that keeps the same `ticket-context` fields, so skills that depend on it keep working. Install one `jira-profile-*` skill per repository. See [Naming convention](../../README.md#naming-convention).

## Prerequisites

Set up once per machine, for each agent you use. Reference setup: the official Atlassian Rovo MCP server over HTTP with OAuth.

| Requirement | Set up | Check |
|-------------|--------|-------|
| Official Atlassian MCP server, `https://mcp.atlassian.com/v2/mcp` | Claude Code: `claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp`, then authenticate in `/mcp`<br>Codex: `codex mcp add atlassian --url https://mcp.atlassian.com/v2/mcp`, then `codex mcp login atlassian`<br>Other agents: add a streamable HTTP MCP server with that URL as their documentation describes | The agent lists a Jira get-issue tool, and it returns a known ticket |
| Access to the team's Jira site | Sign in with your Atlassian account during the OAuth step | The server's accessible-resources tool lists the site |

Use the `v2` endpoint; the `v1` endpoint is deprecated. Without the MCP server the skill falls back to `acli` or the REST API (rule 3.1 in [AGENTS.md](AGENTS.md)). When no client works, tell the user which of these steps is missing; never configure a server or sign in on the user's behalf.

## Usage

```bash
npx skills add bounteous17/llm-agent-skills --skill jira-profile-generic
```

Repository-specific rules, such as accepted project keys, a different branch pattern, or defaults for new tickets, go in the consuming repository's `AGENTS.md`. The profile reads them first.

## Adding Rules

1. Copy `rules/_template.md` → `rules/<section>-<description>.md`
2. Fill in frontmatter (`title`, `impact`, `section`, `tags`)
3. Write explanation and `**Incorrect:**` / `**Correct:**` examples
4. Commit — lefthook auto-rebuilds `AGENTS.md`
