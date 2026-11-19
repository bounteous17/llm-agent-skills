---
title: Never Expose Jira Credentials
impact: CRITICAL
section: 5
impactDescription: A leaked API token grants the user's full Jira and Confluence access
tags: secrets, security, credentials
---

## Never Expose Jira Credentials

Never print, log, commit, or paste Jira API tokens, OAuth tokens, or cookies, and never ask the user to paste one into the conversation. Use only credentials already configured for the MCP server, `acli`, or the environment. When authentication is missing, tell the user which client to sign in with, for example `acli jira auth login`, and let them do it.

**Incorrect:**

```bash
echo "Using token $JIRA_API_TOKEN"
curl -u "me@example.com:$JIRA_API_TOKEN" -v "https://<site>/rest/api/3/issue/ABC-123"
```

**Correct:**

```bash
curl -s -u "$JIRA_USER:$JIRA_API_TOKEN" "https://<site>/rest/api/3/issue/ABC-123?fields=summary,issuetype,status"
```
