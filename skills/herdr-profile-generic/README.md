# Herdr Profile (generic)

Generic conventions for working inside [Herdr](https://herdr.dev), the terminal multiplexer for coding agents.

## Overview

The upstream `herdr` skill teaches an agent the Herdr CLI. This profile adds how a team uses it: one worktree per ticket, names derived from the ticket, local files copied into each new worktree, and agents started only with the kind, model, and effort the user chose. It applies only when `HERDR_ENV=1`; contributors who do not use Herdr are unaffected.

Ticket data comes from the installed ticket profile, any skill that provides `ticket-context`, such as [`jira-profile-generic`](../jira-profile-generic/). The skill reads the repository's `AGENTS.md` or `CLAUDE.md` at runtime to detect which ticket system the repository uses and picks the matching provider.

The rules are written for agents of any vendor (Claude Code, Codex, Cursor, Gemini CLI, Kiro), including the agents this profile starts.

### What it covers

| Section | Topics |
|---------|--------|
| **Activation and Dependencies** | `HERDR_ENV` check, upstream skill and CLI help as syntax authority |
| **Task Worktrees** | One worktree per ticket, base branch detection, local file copies, no-ticket fallback |
| **Naming** | Workspace, tab, and agent names from the ticket context |
| **Starting Agents** | Asking for kind, model, and effort; native flags; self-contained, vendor-neutral briefs |
| **Safety** | Focus, ownership, repository trust |

## Naming

The name follows the repository pattern `<software>-profile-<variant>`. It is not called `herdr` because that is the upstream skill's name and because several Herdr profiles must be able to coexist in this collection. `generic` is the default for most repositories. A team that wants Herdr to behave differently adds `herdr-profile-<team>` (for example `herdr-profile-acme`). Install one `herdr-profile-*` skill per repository. See [Naming convention](../../README.md#naming-convention).

## Prerequisites

Set up once per machine. Reference setup: Herdr 0.9.5 with the upstream skill installed globally.

| Requirement | Set up | Check |
|-------------|--------|-------|
| Herdr CLI | Install from [herdr.dev](https://herdr.dev) | `herdr --version` |
| Agent running inside a Herdr pane | Start the agent from a Herdr pane, for example `herdr claude`, or open any agent in a pane | `echo "$HERDR_ENV"` prints `1` |
| Upstream `herdr` skill, global | `npx skills add herdrdev/herdr --skill herdr -g` ([instructions](https://herdr.dev/tui/docs/agent-skill/#install-it)); for agents without a skill system, paste its `SKILL.md` into the agent's user instructions | The agent lists a skill named `herdr` |
| A `ticket-context` provider in the repository | `npx skills add bounteous17/llm-agent-skills --skill jira-profile-generic`, plus that skill's own prerequisites | The repository's installed skills include one whose `metadata.provides` is `ticket-context` |

Without the upstream skill, read `herdr --skill` for the session and tell the user the global install command; never install global skills on the user's behalf. Without a ticket provider, follow rule 2.3 in [AGENTS.md](AGENTS.md).

## Usage

```bash
npx skills add bounteous17/llm-agent-skills --skill herdr-profile-generic --skill jira-profile-generic
```

Repository-specific values go in the consuming repository's `AGENTS.md`: the base branch if it is not the remote default, and the gitignored local files to copy into new worktrees.

## Adding Rules

1. Copy `rules/_template.md` → `rules/<section>-<description>.md`
2. Fill in frontmatter (`title`, `impact`, `section`, `tags`)
3. Write explanation and `**Incorrect:**` / `**Correct:**` examples
4. Commit — lefthook auto-rebuilds `AGENTS.md`
