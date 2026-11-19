# GitHub PR Profile (generic)

Generic conventions for creating and updating GitHub pull requests with the `gh` CLI.

## Overview

The profile tells an agent when it may push and open a pull request, how to title it from the ticket, what goes in the description, which base, assignee, and reviewers to use, and how to keep the pull request current after later pushes. Ticket data comes from the installed ticket profile, any skill that provides `ticket-context`, such as [`jira-profile-generic`](../jira-profile-generic/). Other trackers can provide the same contract with their own profile.

The rules are written for agents of any vendor (Claude Code, Codex, Cursor, Gemini CLI, Kiro).

### What it covers

| Section | Topics |
|---------|--------|
| **Scope and Precedence** | Consent for commits, pushes, and pull requests; repository rules and templates first |
| **Title** | `<KEY>: <description>` from the ticket context, conventional-commit fallback |
| **Description** | Summary-only body for the whole branch, AI attribution policy |
| **Creating the Pull Request** | Duplicate check, base branch, assignee, CODEOWNERS reviewers, drafts |
| **Keeping the Pull Request Current** | Title and description refreshed after every push |

## Naming

The name follows the repository pattern `<software>-profile-<variant>`, with `gh-pr` for the GitHub CLI's pull request commands. `generic` is the default for most repositories. A team with other pull request rules adds `gh-pr-profile-<team>` (for example `gh-pr-profile-acme`). Install one `gh-pr-profile-*` skill per repository. See [Naming convention](../../README.md#naming-convention).

## Prerequisites

Set up once per machine. Reference setup: GitHub CLI 2.103 signed in to github.com with the `repo` and `read:org` scopes.

| Requirement | Set up | Check |
|-------------|--------|-------|
| GitHub CLI | Install from [cli.github.com](https://cli.github.com) | `gh --version` |
| `gh` signed in with push access to the repository | `gh auth login`, scopes `repo` and `read:org` | `gh auth status` shows the account and scopes |
| A `ticket-context` provider in the repository | `npx skills add bounteous17/llm-agent-skills --skill jira-profile-generic`, plus that skill's own prerequisites | The repository's installed skills include one whose `metadata.provides` is `ticket-context` |

When `gh auth status` fails, stop and tell the user to run `gh auth login`; never sign in or handle tokens on the user's behalf. Without a ticket provider, titles fall back to rule 2.1 in [AGENTS.md](AGENTS.md).

## Usage

```bash
npx skills add bounteous17/llm-agent-skills --skill gh-pr-profile-generic --skill jira-profile-generic
```

Repository-specific rules, such as a different base branch, a required template, or an attribution policy, go in the consuming repository's `AGENTS.md` or its pull request template. The profile reads them first.

## Adding Rules

1. Copy `rules/_template.md` → `rules/<section>-<description>.md`
2. Fill in frontmatter (`title`, `impact`, `section`, `tags`)
3. Write explanation and `**Incorrect:**` / `**Correct:**` examples
4. Commit — lefthook auto-rebuilds `AGENTS.md`
