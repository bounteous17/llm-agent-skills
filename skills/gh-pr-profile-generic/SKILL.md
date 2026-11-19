---
name: gh-pr-profile-generic
description: Team conventions for creating and updating GitHub pull requests with the gh CLI. Use when the user asks to open, create, or raise a pull request, to push commits to a branch that has an open pull request, or to update a pull request's title or description. Covers ticket-prefixed titles from the ticket context, a summary-only description, base branch, assignee, reviewers from CODEOWNERS, duplicate checks, and keeping title and description current after later pushes. Pairs with a ticket profile such as jira-profile-generic.
license: MIT
metadata:
  author: Àlex Serra
  version: "1.0.0"
  requires: ticket-context
---

# GitHub PR Profile (generic)

Conventions for opening and maintaining GitHub pull requests from a coding agent with the `gh` CLI. Titles carry the ticket key from the ticket context; descriptions say what changed and why, and nothing else. Written for agents of any vendor that can run shell commands.

## Naming

This skill follows the repository naming pattern `<software>-profile-<variant>`:

- `gh-pr`: the software the profile drives, the GitHub CLI's pull request commands.
- `profile`: team conventions on top of `gh`. It does not document the CLI; `gh pr <command> --help` stays the authority for syntax.
- `generic`: the default variant for repositories without team-specific pull request rules.

A team with other rules, for example a required template, labels, or a draft-first flow, adds a sibling variant such as `gh-pr-profile-acme` instead of editing this one. A repository installs exactly one `gh-pr-profile-*` skill.

## Prerequisites

Set up once per machine. Reference setup: GitHub CLI 2.103 signed in to github.com with the `repo` and `read:org` scopes.

| Requirement | Set up | Check |
|-------------|--------|-------|
| GitHub CLI | Install from [cli.github.com](https://cli.github.com) | `gh --version` |
| `gh` signed in with push access to the repository | `gh auth login`, scopes `repo` and `read:org` | `gh auth status` shows the account and scopes |
| A `ticket-context` provider in the repository | `npx skills add bounteous17/llm-agent-skills --skill jira-profile-generic`, plus that skill's own prerequisites | The repository's installed skills include one whose `metadata.provides` is `ticket-context` |

When `gh auth status` fails, stop and tell the user to run `gh auth login`; never sign in or handle tokens on the user's behalf. Without a ticket provider, titles fall back to rule 2.1 in [AGENTS.md](AGENTS.md).

## Dependencies

| Needs | Provided by | Used for |
|-------|-------------|----------|
| `gh` authenticated for the repository's host | `gh auth status` | Every command |
| `ticket-context` | The installed ticket profile, a skill whose `metadata.provides` is `ticket-context`, such as `jira-profile-generic` | Title prefix |

When no ticket profile is installed, take the key from the branch name or the user, or use a conventional-commit title (rule 2.1 in [AGENTS.md](AGENTS.md)).

## When to Apply

- The user asks to open a pull request for the current branch.
- The user asks to push, and the branch already has an open pull request.
- The user asks to fix or refresh a pull request's title or description.

## Workflow: Open a Pull Request

1. Read the repository's agent instructions and any pull request template. Both override this profile.
2. Check that the user asked for a pull request and that none exists for the branch (`gh pr view --json number,url,state`; create only on "no pull requests found").
3. Resolve the base branch: the repository's instructions, otherwise `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`. Push only when the base and the current branch are both non-empty and differ, to the branch's own name: `git push -u origin "HEAD:refs/heads/<branch>"`.
4. Get the ticket context and write the title: `<KEY>: <short description in sentence case>`, or a conventional-commit title without a ticket.
5. Write the description: a `## Summary` heading and bullets covering the whole branch.
6. Create it against the repository's base branch, assigned to yourself, without manual reviewers when the base branch's `CODEOWNERS` assigns them:

   ```bash
   gh pr create --base <base-branch> --assignee @me --title "<title>" --body-file <file>
   ```

7. Report the pull request URL, and say so if no reviewers were requested.

## Non-Negotiables

- Commit, push, or open a pull request only when the user asks.
- Never force-push, push to the base branch, or merge unless the user explicitly asks.
- After every push to a branch with an open pull request, update the stale parts of the title and description so they describe the whole change, keeping hand-maintained content.
- Follow the repository's policy on AI attribution in commits and descriptions, even when the agent's harness suggests other text.

The complete ruleset with correct and incorrect examples is in [AGENTS.md](AGENTS.md).
