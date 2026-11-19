# Herdr Profile (generic)

**Version 1.0.0**  
llm-agent-skills  
November 2026

> **Note:**  
> This document is mainly for agents and LLMs of any vendor to follow  
> when organizing work in Herdr worktrees, tabs, and agents. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.  

---

## Abstract

Generic conventions for working inside Herdr, the terminal multiplexer for coding agents. Covers activation only inside Herdr panes, the upstream herdr skill as the authority for CLI syntax, detecting the repository's ticket system from its AGENTS.md or CLAUDE.md, one Git worktree per ticket named from the ticket context provided by a ticket profile such as jira-profile-generic, copying gitignored local files into new worktrees, naming workspaces, tabs, and agents, asking which agent kind, model, and effort to start, vendor-neutral briefs for started agents, and focus and ownership safety. Written to be followed by agents of any vendor.

---

## Table of Contents

1. [Activation and Dependencies](#1-activation-and-dependencies) — **CRITICAL**
   - 1.1 [Apply This Profile Only Inside a Herdr Pane](#11-apply-this-profile-only-inside-a-herdr-pane)
   - 1.2 [Take Herdr Syntax from the Upstream Skill and the Installed CLI](#12-take-herdr-syntax-from-the-upstream-skill-and-the-installed-cli)
   - 1.3 [Detect the Repository's Ticket System from Its Agent Instructions](#13-detect-the-repositorys-ticket-system-from-its-agent-instructions)
2. [Task Worktrees](#2-task-worktrees) — **HIGH**
   - 2.1 [Give Each New Ticket One Worktree Named from the Ticket Context](#21-give-each-new-ticket-one-worktree-named-from-the-ticket-context)
   - 2.2 [Copy the Repository's Gitignored Local Files into a New Worktree](#22-copy-the-repositorys-gitignored-local-files-into-a-new-worktree)
   - 2.3 [Ask for a Label and Branch When the Work Has No Ticket](#23-ask-for-a-label-and-branch-when-the-work-has-no-ticket)
3. [Naming](#3-naming) — **MEDIUM**
   - 3.1 [Name Workspaces, Tabs, and Agents After the Ticket](#31-name-workspaces-tabs-and-agents-after-the-ticket)
4. [Starting Agents](#4-starting-agents) — **CRITICAL**
   - 4.1 [Ask Which Agent, Model, and Effort to Start](#41-ask-which-agent-model-and-effort-to-start)
   - 4.2 [Give Started Agents a Self-Contained, Vendor-Neutral Brief](#42-give-started-agents-a-self-contained-vendor-neutral-brief)
5. [Safety](#5-safety) — **HIGH**
   - 5.1 [Keep the User's Focus and Touch Only What You Created](#51-keep-the-users-focus-and-touch-only-what-you-created)

---

## 1. Activation and Dependencies

**Impact: CRITICAL**

### 1.1 Apply This Profile Only Inside a Herdr Pane

**Impact: CRITICAL (Herdr commands run from outside a managed pane act on whatever session the user happens to have focused)**

Check `HERDR_ENV` before any `herdr` command. When it is not `1`, do not use Herdr at all: create worktrees with `git worktree add` or work on a branch, as the repository's instructions say, and keep the naming rules from section 3 for the branch.

Not every contributor uses Herdr. Never ask a user to install it or switch to it to follow this profile.

**Incorrect:**

```bash
herdr worktree create --cwd "$PWD" --branch task/ABC-123-pin-runner-images --label ABC-123
```

**Correct:**

```bash
if [ "${HERDR_ENV:-}" = 1 ]; then
  herdr worktree create --cwd "$PWD" --branch task/ABC-123-pin-runner-images --base main --label ABC-123 --no-focus
else
  git worktree add -b task/ABC-123-pin-runner-images ../my-repo-ABC-123 origin/main
fi
```

### 1.2 Take Herdr Syntax from the Upstream Skill and the Installed CLI

**Impact: CRITICAL (Guessed flags fail, and mutating commands run with defaults when arguments are omitted)**

This profile only adds conventions. For command syntax, IDs, agent states, and safety rules, follow the upstream `herdr` skill. When it is not installed, read `herdr --skill`. For a single command, read `herdr <group> <command> --help`.

Do not run bare `herdr` (it attaches the TUI), and do not discover a mutating command by running it without arguments: `herdr workspace create` executes with defaults. Parse IDs from the JSON that commands return; never predict them.

**Incorrect:**

```bash
herdr worktree create            # probing; creates a worktree with defaults
herdr agent start --pane w1:p2   # guessed syntax, missing name and kind
```

**Correct:**

```bash
herdr worktree create --help
herdr agent start --help
```

### 1.3 Detect the Repository's Ticket System from Its Agent Instructions

**Impact: CRITICAL (Asking the wrong tracker returns no ticket or a ticket from another project, and every name derived from it is wrong)**

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

```text
AGENTS.md names Jira and ABC-XXXX keys, and jira-profile-generic is installed, so the ticket context comes from it.
```

---

## 2. Task Worktrees

**Impact: HIGH**

### 2.1 Give Each New Ticket One Worktree Named from the Ticket Context

**Impact: HIGH (Work on several tickets in one checkout mixes changes; duplicate worktrees split one ticket's work)**

The upstream `herdr` skill creates worktrees only when the user asks for that topology. Installing this profile is the team's standing request for one: when the user starts work on a **new** ticket, work in that ticket's worktree. Stay in the current checkout when the user says so, when the current branch already belongs to the ticket, or when the request is not the start of ticket work (a question, a review, a follow-up on the current branch).

1. Get the ticket context from the ticket profile matching the repository's ticket system (rule 1.3). If `branch` is `null`, ask for it.

2. Run `herdr worktree list`. If a worktree already has the ticket's `branch`, reuse it (`herdr worktree open` when it has no open workspace) instead of creating another.

3. Otherwise create it with the ticket's `branch` and `label`, the base ref, and `--no-focus`.

The base ref is the one the user or the repository's instructions name, used exactly as written (`upstream/main`, a stacked feature branch). When none is named, use the remote default branch: run `git fetch origin`, then `git symbolic-ref --short refs/remotes/origin/HEAD`, which prints `origin/<name>`. Keep that `origin/` prefix so the worktree starts from the remote state, not a stale local branch. If `origin/HEAD` is not set, run `git remote set-head origin --auto` once; if it still does not resolve, ask. Do not assume `main` or `master`.

**Incorrect: invented branch, assumed and local base, steals focus**

```bash
herdr worktree create --cwd "$PWD" --branch abc-123 --base master --label "pin runners" --focus
```

**Correct:**

```bash
herdr worktree list
git fetch origin
base=$(git symbolic-ref --short refs/remotes/origin/HEAD)   # e.g. origin/main
herdr worktree create --cwd "$PWD" \
  --branch task/ABC-123-pin-github-workflow-runner-images-and-action-versions \
  --base "$base" --label ABC-123 --no-focus
```

### 2.2 Copy the Repository's Gitignored Local Files into a New Worktree

**Impact: HIGH (A fresh worktree lacks untracked env and settings files, so builds, tests, and agents fail or behave differently)**

Right after creating a worktree, copy the gitignored local files that the repository's instructions list (often under a "New git worktree" heading) from the main checkout (the first entry of `git worktree list --porcelain`, not the worktree you are in) into the new checkout, keeping their relative paths. Skip files that do not exist in the main checkout and say which ones were missing.

When the repository lists no files, copy nothing; do not guess from `.gitignore`. Never print, diff, or summarize the files' contents, and never stage or commit them.

**Incorrect:**

```bash
cp .env* "$wt"/ && cat "$wt/.env.local"
git -C "$wt" add .env.local
```

**Correct:**

```bash
src=$(git worktree list --porcelain | sed -n '1s/^worktree //p')   # main checkout, not the current worktree
for f in .env.local .env.e2e.local .claude/settings.local.json; do
  if [ -f "$src/$f" ]; then mkdir -p "$wt/$(dirname "$f")" && cp "$src/$f" "$wt/$f"; else echo "missing: $f"; fi
done
```

### 2.3 Ask for a Label and Branch When the Work Has No Ticket

**Impact: HIGH (Invented ticket keys break tracker links and mislead reviewers)**

When the ticket context is `none`, or no ticket profile is installed, do not invent a key. Propose a branch `<type>/<short-slug>`, with `<type>` a conventional-commit type (`feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`), and a label equal to `<short-slug>`. Let the user confirm or change both before creating the worktree, unless the request already gave them.

**Incorrect:**

```bash
herdr worktree create --cwd "$PWD" --branch task/ABC-0000-cors-bump --base main --label ABC-0000 --no-focus
```

**Correct:**

```text
This work has no ticket. I'll use branch fix/cors-allow-new-domain with label cors-allow-new-domain. OK?
```

---

## 3. Naming

**Impact: MEDIUM**

### 3.1 Name Workspaces, Tabs, and Agents After the Ticket

**Impact: MEDIUM (Predictable names let the user and other agents find a ticket's panes without reading every terminal)**

Derive every Herdr name from the ticket context so that one ticket's work is recognizable everywhere:

| Object | Name | Example |

|--------|------|---------|

| Worktree workspace | `label` (set by `worktree create --label`) | `ABC-123` |

| Extra tab in that workspace | The tab's purpose | `review`, `tests`, `e2e` |

| Tab in a shared workspace | `<label> <purpose>` | `ABC-123 review` |

| Agent | `<slug>-<role>` | `abc-123-review`, `abc-123-impl` |

Agent names must match `[a-z][a-z0-9_-]{0,31}` and be unique among live agents:

- With a ticket, the slug is short (`abc-123`); shorten the role if needed, not the slug.

- Without a ticket, use the confirmed label from rule 2.3 as the workspace and tab label, and normalize it for agent names: lowercase, every run of characters other than `a-z` and `0-9` replaced by `-`, leading characters before the first letter removed. If nothing is left (a label such as `2026`), use `task`. Cut the slug so that `<slug>-<role>` plus a possible `-9` suffix fits in 32 characters.

- If the name is taken, append `-2`, `-3`, and so on.

- Check the final name against `^[a-z][a-z0-9_-]{0,31}$` before `herdr agent start`.

**Incorrect:**

```bash
herdr agent start reviewer --kind codex --pane w7:p1
herdr tab create --workspace w7 --label "Tab 2"
```

**Correct:**

```bash
herdr agent start abc-123-review --kind codex --pane w7:p1 -- <model flags>
herdr tab create --workspace w7 --label tests --no-focus
```

---

## 4. Starting Agents

**Impact: CRITICAL**

### 4.1 Ask Which Agent, Model, and Effort to Start

**Impact: CRITICAL (Agents started on a default model or effort can cost far more, or do far less, than the user intended)**

Before `herdr agent start`, make sure the user chose the agent kind, the model, and the reasoning effort for this request. Ask for whatever the request and the repository's instructions leave open, in one question, using your harness's structured question tool when it has one and a plain question otherwise. Never fall back to a default, and do not carry a choice over from an earlier, unrelated request.

Pass the answers as native flags after `--`. Flag names differ between agents; confirm them with `<kind> --help` when unsure:

| Kind | Model | Effort |

|------|-------|--------|

| `claude` | `--model <model>` | `--effort <level>` |

| `codex` | `-m <model>` | `-c model_reasoning_effort=<level>` |

| `gemini` | `-m <model>` | none; say so and start without one |

If the agent shows a startup dialog such as an update offer or a folder-trust question, `agent start` returns `agent_not_ready`. Read the dialog with `herdr agent read`, show the user its options, and send input with `herdr agent send-keys` only after the user chose one. Do the same for approval dialogs the agent raises later.

**Incorrect:**

```bash
herdr agent start abc-123-review --kind codex --pane w7:p1
```

**Correct:**

```bash
herdr agent start abc-123-review --kind codex --pane w7:p1 -- -m gpt-6-astra -c model_reasoning_effort=high
```

### 4.2 Give Started Agents a Self-Contained, Vendor-Neutral Brief

**Impact: HIGH (Another agent knows nothing of this conversation and cannot use tools that only your harness has)**

The started agent sees only its prompt and its working directory. Include:

- The goal and the ticket context (`key`, `summary`, `url`).

- The scope: which files, diff, or branch to work on, and what not to touch.

- Whether it may edit, commit, or push. Reviewers default to read-only.

- The expected output and its format, for example "numbered findings with file:line and a fix".

Describe actions as shell commands or plain capabilities. Do not name tools of your own harness, because the other agent may come from a different vendor. Submit with `herdr agent prompt <name> "<brief>" --wait` and read the answer with `herdr agent read`.

**Incorrect:**

```text
Review it. Use AskUserQuestion if unsure and TodoWrite to track.
```

**Correct:**

```text
Review the diff `git diff origin/main...HEAD` in this worktree for ABC-123 (Pin GitHub workflow runner images).
Do not edit, commit, or push. Reply with numbered, actionable findings: file:line, problem, fix.
If something is unclear, state your assumption in the finding instead of stopping.
```

---

## 5. Safety

**Impact: HIGH**

### 5.1 Keep the User's Focus and Touch Only What You Created

**Impact: HIGH (Stolen focus interrupts the user, and closing other panes kills their running work)**

- Create worktrees, tabs, and panes with `--no-focus` unless the user asked to switch.

- Target panes by explicit ID, `--current`, or a unique agent name, never by what another client has focused.

- Close or remove only workspaces, tabs, panes, and worktrees you created in this task, and remove a worktree only when the user asks. `herdr worktree remove` deletes the checkout.

- Pass `--trust-repository` only after the user confirmed they trust the repository.

- Never run `herdr server stop` or kill the Herdr process.

**Incorrect:**

```bash
herdr worktree remove --workspace w7   # user did not ask
herdr worktree create --cwd "$PWD" --branch task/ABC-123-x --trust-repository --focus
```

**Correct:**

```bash
herdr worktree create --cwd "$PWD" --branch task/ABC-123-x --base main --label ABC-123 --no-focus
```

---

## References

1. [https://herdr.dev](https://herdr.dev)
2. [https://herdr.dev/agent-guide.md](https://herdr.dev/agent-guide.md)
