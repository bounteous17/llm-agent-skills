---
name: herdr-profile-generic
description: Team conventions for working inside Herdr, the terminal multiplexer for coding agents. Use when HERDR_ENV=1 and the user starts work on a ticket or task that needs its own Git worktree, asks to open a Herdr worktree, workspace, tab, or pane for a task, or asks to start another coding agent (for example a reviewer) in Herdr. Covers worktree, branch, workspace, tab, and agent naming from the ticket context, copying gitignored local files into new worktrees, and asking which agent, model, and effort to start. Layered on the upstream herdr skill, which remains the authority for CLI syntax.
license: MIT
metadata:
  author: Àlex Serra
  version: "1.0.0"
  requires: ticket-context
---

# Herdr Profile (generic)

Conventions for using [Herdr](https://herdr.dev) in a repository: one worktree per ticket, names derived from the ticket, local files copied into each new worktree, and agents started only with the kind, model, and effort the user chose. Written for agents of any vendor that can run shell commands.

## Naming

This skill follows the repository naming pattern `<software>-profile-<variant>`:

- `herdr`: the software the profile drives.
- `profile`: team conventions on top of Herdr. It does not repeat Herdr's CLI reference; the upstream `herdr` skill and `herdr --help` stay the authority for syntax.
- `generic`: the default variant for repositories without team-specific Herdr rules.

A team that wants Herdr to behave differently, for example other worktree layouts or a fixed reviewer agent, adds a sibling variant such as `herdr-profile-acme` instead of editing this one. A repository installs exactly one `herdr-profile-*` skill. This is why the skill is not named `herdr`: that name belongs to the upstream skill, and several profiles for the same software must be able to coexist in this collection.

## Prerequisites

Set up once per machine. Reference setup: Herdr 0.9.5 with the upstream skill installed globally.

| Requirement | Set up | Check |
|-------------|--------|-------|
| Herdr CLI | Install from [herdr.dev](https://herdr.dev) | `herdr --version` |
| Agent running inside a Herdr pane | Start the agent from a Herdr pane, for example `herdr claude`, or open any agent in a pane | `echo "$HERDR_ENV"` prints `1` |
| Upstream `herdr` skill, global | `npx skills add herdrdev/herdr --skill herdr -g` ([instructions](https://herdr.dev/tui/docs/agent-skill/#install-it)); for agents without a skill system, paste its `SKILL.md` into the agent's user instructions | The agent lists a skill named `herdr` |
| A `ticket-context` provider in the repository | `npx skills add bounteous17/llm-agent-skills --skill jira-profile-generic`, plus that skill's own prerequisites | The repository's installed skills include one whose `metadata.provides` is `ticket-context` |

Without the upstream skill, read `herdr --skill` for the session and tell the user the global install command; never install global skills on the user's behalf. Without a ticket provider, follow rule 2.3 in [AGENTS.md](AGENTS.md).

## Dependencies

| Needs | Provided by | Used for |
|-------|-------------|----------|
| Herdr CLI syntax | The upstream `herdr` skill, or `herdr --skill` when it is not installed | Every `herdr` command |
| `ticket-context` | The installed ticket profile, a skill whose `metadata.provides` is `ticket-context`, such as `jira-profile-generic` | Branch, worktree, workspace, tab, and agent names |

Which provider to use depends on the repository: read its `AGENTS.md` or `CLAUDE.md` at runtime to find the ticket system it uses, and pick the installed provider for that system (rule 1.3 in [AGENTS.md](AGENTS.md)). When none fits, ask the user for the ticket key and branch name or treat the work as having no ticket (rule 2.3).

## When to Apply

Only when `HERDR_ENV=1`. Outside Herdr, skip this skill and use plain `git worktree` or a branch as the repository's instructions say.

- Starting work on a new ticket or task that should not happen in the current checkout.
- Opening a worktree, workspace, tab, or pane for a task.
- Starting another coding agent in Herdr, such as an implementer or a reviewer.

## Workflow: Start Work on a New Ticket

Installing this profile is the team's standing request for one worktree per new ticket, which the upstream skill otherwise creates only on explicit request. Stay in the current checkout when the user says so or the work continues on the current branch.

1. Check `HERDR_ENV=1`. Read the repository's agent instructions for Herdr, base branch, and local-file overrides. The base ref is the one they name, otherwise `origin/<remote default branch>`.
2. Detect the repository's ticket system from those instructions and get the ticket context (`key`, `branch`, `label`, `slug`) from the matching ticket profile.
3. Reuse the ticket's worktree if `herdr worktree list` already shows its branch; otherwise create it:

   ```bash
   herdr worktree create --cwd "$PWD" --branch <branch> --base <base-ref> --label <label> --no-focus
   ```

4. Copy the gitignored local files the repository lists from the main checkout into the new one.
5. If an agent should work there, ask the user which agent kind, model, and effort to use, then start it in the returned root pane:

   ```bash
   herdr agent start <slug>-<role> --kind <kind> --pane <root-pane-id> -- <native model and effort flags>
   ```

## Non-Negotiables

- Never control Herdr when `HERDR_ENV` is not `1`.
- Never start an agent with a model or effort the user did not choose for this request, and never answer an agent's startup or approval dialog without the user's choice.
- Never close, remove, or refocus workspaces, tabs, panes, or worktrees you did not create, unless the user asks.
- Never print the contents of copied local files; they usually hold secrets.

The complete ruleset with correct and incorrect examples is in [AGENTS.md](AGENTS.md).
