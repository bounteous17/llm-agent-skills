# llm-agent-skills

Personal collection of AI agent skills. Each skill is a set of rules that coding agents (Claude Code, Codex, Cursor, Gemini CLI, Kiro, …) follow to work consistently across repositories.

## Available skills

| Skill | Description |
|-------|-------------|
| [`gh-pr-profile-generic`](./skills/gh-pr-profile-generic/) | Conventions for opening and updating GitHub pull requests with `gh`: consent, ticket-prefixed titles from the `ticket-context`, summary-only descriptions, base, assignee, and CODEOWNERS reviewers |
| [`herdr-profile-generic`](./skills/herdr-profile-generic/) | Conventions for working inside Herdr: one worktree per ticket, names from the `ticket-context`, local file copies, and asking which agent, model, and effort to start; layered on the upstream `herdr` skill |
| [`jira-profile-generic`](./skills/jira-profile-generic/) | Resolves the Jira ticket of a task and exposes its key, summary, type, status, URL, and suggested branch name as a `ticket-context` for other profiles; read-only toward Jira by default |

`herdr-profile-generic` and `gh-pr-profile-generic` need a `ticket-context` provider such as `jira-profile-generic` installed in the same repository. Each skill's `README.md` lists its other prerequisites (CLIs, MCP servers, upstream skills).

## Setup with `npx skills`

The skills are installed with the [`skills`](https://www.npmjs.com/package/skills) CLI, which needs Node.js and runs through `npx`, so there is nothing to install beforehand.

List the skills in this repository without installing anything:

```bash
npx skills add bounteous17/llm-agent-skills --list
```

Install into the current project (run it from the repository root). The CLI asks which skills and which agents to install to:

```bash
npx skills add bounteous17/llm-agent-skills
```

Install specific skills, for example a profile together with the ticket profile it depends on:

```bash
npx skills add bounteous17/llm-agent-skills --skill jira-profile-generic
npx skills add bounteous17/llm-agent-skills --skill herdr-profile-generic --skill jira-profile-generic
npx skills add bounteous17/llm-agent-skills --skill gh-pr-profile-generic --skill jira-profile-generic
```

Useful options for `add`:

| Option | Effect |
|--------|--------|
| `-s, --skill <names>` | Install only these skills (`'*'` for all) |
| `-a, --agent <agents>` | Install for these agents, for example `claude-code` (`'*'` for all) |
| `-g, --global` | Install for your user instead of the current project |
| `-y, --yes` | Skip confirmation prompts |
| `--copy` | Copy files instead of symlinking them into the agent directories |
| `--all` | Shorthand for `--skill '*' --agent '*' -y` |

Manage installed skills:

```bash
npx skills list                          # show installed skills
npx skills update                        # update installed skills to the latest version
npx skills remove herdr-profile-generic  # remove a skill
```

## What's a skill?

A skill is a folder under `skills/` containing:

- `SKILL.md` — frontmatter (name, description, metadata) and a summary the agent loads first
- `AGENTS.md` — the full compiled ruleset, generated from `rules/`
- `README.md` — human-readable overview and prerequisites
- `rules/` — individual rule files, one concern per file
- `metadata.json` and `config/` — version, abstract, and references used to build `AGENTS.md`

## Naming convention

Skills that encode how a team operates a piece of software, such as a CLI, a ticket tracker, or a code host, are named `<software>-profile-<variant>`:

| Part | Meaning | Examples |
|------|---------|----------|
| `<software>` | The software the skill drives | `herdr`, `jira`, `gh-pr` (GitHub CLI pull requests) |
| `profile` | A set of conventions layered on the software's own documentation or upstream skill. A profile never duplicates CLI syntax; it says how a team uses it | — |
| `<variant>` | Whose conventions | `generic` for most repositories, a team or repository name when its conventions differ |

Rules:

- Start with `generic`. When a team's conventions differ, add a new variant (copy `generic` and change it) instead of adding team-specific branches to `generic`.
- A repository installs at most one variant per software, chosen at install time.
- Profiles refer to each other by family (`jira-profile-*`) or by capability, never by a fixed variant.
- A profile declares the contract it offers or needs in its `SKILL.md` frontmatter, `metadata.provides` and `metadata.requires`. For example, `jira-profile-*` provides `ticket-context`; a Linear or GitHub Issues profile can provide the same contract.
- Write for agents of every vendor. Describe actions as shell commands or generic capabilities ("ask the user", "the MCP server's get-issue tool"); never require a tool that only one agent has.
