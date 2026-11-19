---
title: Read Tickets from the Right Site with the Client That Is Available
impact: HIGH
section: 3
impactDescription: Agents that assume one client fail where only another exists, and a client bound to another site returns an unrelated ticket with the same key
tags: mcp, acli, rest, client, site
---

## Read Tickets from the Right Site with the Client That Is Available

Determine the Jira site first: the host of a browse URL the user gave, otherwise the site the repository's instructions name, otherwise the only site the client can reach. When the client can reach several sites and nothing selects one, ask. Every client below must target that site; skip a client that is bound to another.

Then use the first client that works, request only the fields the ticket context needs, and do not install or configure a client without asking:

1. An Atlassian MCP server, whatever name it has in this agent. Look for a tool that gets an issue by key (commonly `getJiraIssue`). If it needs a site or cloud ID, list the accessible resources once, pick the one for the chosen site, and reuse it.
2. The Atlassian CLI, if `acli` is installed and authenticated against that site: `acli jira workitem view <KEY> --fields summary,issuetype,status --json`.
3. The Jira REST API on that site, only with credentials already present in the environment: `GET https://<site>/rest/api/3/issue/<KEY>?fields=summary,issuetype,status`.

Build `url` as `https://<site>/browse/<KEY>`. If no client works, apply rule 2.2.

**Incorrect (hard-codes one vendor's tool, ignores the site in the URL, fetches everything):**

```text
User: https://acme.atlassian.net/browse/ABC-123
Agent: call mcp__claude_ai_Atlassian__getJiraIssue on the first cloud ID with expand=renderedFields,changelog
```

**Correct (client-neutral, same site, minimal fields):**

```bash
# MCP server: call its get-issue tool on the acme.atlassian.net resource with key ABC-123, fields summary,issuetype,status
# Otherwise, with acli signed in to acme.atlassian.net:
acli jira workitem view ABC-123 --fields summary,issuetype,status --json
```
