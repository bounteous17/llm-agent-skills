# GitHub PR Profile (generic)

**Version 1.0.0**  
llm-agent-skills  
November 2026

> **Note:**  
> This document is mainly for agents and LLMs of any vendor to follow  
> when creating and updating GitHub pull requests. Humans  
> may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.  

---

## Abstract

Generic conventions for creating and updating GitHub pull requests with the gh CLI. Covers consent before commits, pushes, and pull requests, precedence of repository rules and pull request templates, ticket-prefixed titles from the ticket context provided by a ticket profile such as jira-profile-generic with a conventional-commit fallback, summary-only descriptions, the repository's AI attribution policy, duplicate checks, base branch, assignee, and CODEOWNERS reviewers, and keeping title and description current after later pushes. Written to be followed by agents of any vendor.

---

## Table of Contents

1. [Scope and Precedence](#1-scope-and-precedence) — **CRITICAL**
   - 1.1 [Commit, Push, and Open Pull Requests Only When Asked](#11-commit-push-and-open-pull-requests-only-when-asked)
   - 1.2 [Let the Repository's Rules and Template Override This Profile](#12-let-the-repositorys-rules-and-template-override-this-profile)
2. [Title](#2-title) — **HIGH**
   - 2.1 [Prefix the Title with the Ticket Key, or Use a Conventional-Commit Type](#21-prefix-the-title-with-the-ticket-key-or-use-a-conventional-commit-type)
3. [Description](#3-description) — **HIGH**
   - 3.1 [Write a Summary-Only Description of the Whole Change](#31-write-a-summary-only-description-of-the-whole-change)
   - 3.2 [Follow the Repository's AI Attribution Policy](#32-follow-the-repositorys-ai-attribution-policy)
4. [Creating the Pull Request](#4-creating-the-pull-request) — **HIGH**
   - 4.1 [Check for an Existing Pull Request Before Creating One](#41-check-for-an-existing-pull-request-before-creating-one)
   - 4.2 [Target the Base Branch, Assign Yourself, and Let CODEOWNERS Pick Reviewers](#42-target-the-base-branch-assign-yourself-and-let-codeowners-pick-reviewers)
5. [Keeping the Pull Request Current](#5-keeping-the-pull-request-current) — **MEDIUM**
   - 5.1 [Update the Title and Description After Every Push to an Open Pull Request](#51-update-the-title-and-description-after-every-push-to-an-open-pull-request)

---

## 1. Scope and Precedence

**Impact: CRITICAL**

### 1.1 Commit, Push, and Open Pull Requests Only When Asked

**Impact: CRITICAL (Pushes and pull requests notify reviewers, trigger CI, and can deploy; they are hard to take back)**

Create commits, push, and open pull requests only when the user asks in the current conversation. A request to open a pull request includes pushing the current branch for it, and nothing more.

- Resolve the base branch (rule 4.2) before any push. Push the current branch to the branch of the same name on `origin` with an explicit destination, and refuse when the current branch or the base is empty, or when they are equal. A bare `git push` depends on `push.default`, `remote.origin.push`, and the branch's upstream; a branch created from `origin/<base>` may track the base branch.

- Never force-push, delete remote branches, merge, close, or mark ready for review unless the user asks for that action.

- If a sandbox blocks network or Git writes, request the narrowest permission your harness offers for that one command and say why.

**Incorrect: destination depends on local configuration**

```bash
git checkout -b feat/x origin/main && git commit -am "feat: x" && git push
git push --force
```

**Correct:**

```bash
base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
branch=$(git branch --show-current)
if [ -n "$base" ] && [ -n "$branch" ] && [ "$branch" != "$base" ]; then
  git push -u origin "HEAD:refs/heads/$branch"
else
  echo "refusing to push: branch='$branch' base='$base'"
fi
```

### 1.2 Let the Repository's Rules and Template Override This Profile

**Impact: CRITICAL (Repositories document their own title, description, reviewer, and base branch rules; generic defaults that contradict them get pull requests sent back)**

Before writing a pull request, read:

1. The repository's agent instructions: `AGENTS.md`, or the file it uses (`CLAUDE.md`, `GEMINI.md`, `.cursor/rules`).

2. A pull request template: `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/pull_request_template.md`, `pull_request_template.md`, or a file under `.github/PULL_REQUEST_TEMPLATE/`.

Rules in the instructions win over this profile. A template replaces the description format of section 3: fill its sections, keep its headings, and remove only instructional comments. Apply this profile for anything left unspecified.

**Incorrect: ignores the template**

```markdown
## Summary
- Pin runner images
```

**Correct: template with `## Changes` and `## Risk` filled in**

```markdown
## Changes
- Pin runner images and action versions in every workflow

## Risk
- Low: CI only
```

---

## 2. Title

**Impact: HIGH**

### 2.1 Prefix the Title with the Ticket Key, or Use a Conventional-Commit Type

**Impact: HIGH (The key in the title links the pull request to the ticket and lets people scan pull request lists by ticket)**

With a ticket: `<KEY>: <short description in sentence case>`, using `label` from the ticket context. The description states what the change does. It may start from the ticket summary but must match the actual diff.

Without a ticket: a conventional-commit title, `<type>: <description>` or `<type>(<scope>): <description>`, with `<type>` one of `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `ci`, `build`.

Either way: no trailing period, under 72 characters, no issue numbers or emojis besides the key. Never invent a key; when the ticket context is `none`, use the conventional-commit form.

**Incorrect:**

```text
abc-123 pin runners.
ABC-0000: Update CORS
[ABC-123] PIN GITHUB WORKFLOW RUNNER IMAGES AND ACTION VERSIONS IN ALL REPOSITORIES' WORKFLOWS
```

**Correct:**

```text
ABC-123: Pin GitHub workflow runner images and action versions
fix(cors): allow tvlandundluet.ch origin
```

---

## 3. Description

**Impact: HIGH**

### 3.1 Write a Summary-Only Description of the Whole Change

**Impact: HIGH (Reviewers need what changed and why; process notes and checklists bury it)**

Without a template, the description is a `## Summary` heading followed by bullets. Each bullet states what changed and, where it is not obvious, why. Cover every commit on the branch relative to the base, not only the latest one.

Leave out test plans, checklists, deployment notes, file-by-file listings, and commentary about how the change was produced. Link the ticket only when the tracker does not link it from the key in the title or branch.

Pass the body through a file or a quoted heredoc so that backticks and `$` stay literal.

**Incorrect:**

```markdown
## Summary
- Updated files

## Test plan
- [ ] Ran tests locally

I made these changes using an AI assistant.
```

**Correct:**

```markdown
## Summary

- Pin every workflow's runner image to `ubuntu-24.04` so upgrades no longer happen silently
- Pin third-party actions to commit SHAs, with the version in a trailing comment
```

### 3.2 Follow the Repository's AI Attribution Policy

**Impact: HIGH (Some repositories forbid tool or AI attribution in commits and pull requests; harness defaults would violate it on every change)**

Agents' harnesses often suggest `Co-Authored-By:` trailers or "Generated with" lines. The repository's instructions decide. When they forbid attribution, leave out trailers, "Generated with" lines, and agent or tool names in commit messages, pull request titles, and descriptions. When they require a form, use exactly that form. When they say nothing, follow the user's instructions and the repository's recent history (`git log -20 --format=%B`).

**Incorrect: repository forbids attribution**

```text
feat(cors): allow new origin

Co-Authored-By: Some Agent <agent@example.com>
```

**Correct:**

```text
feat(cors): allow new origin
```

---

## 4. Creating the Pull Request

**Impact: HIGH**

### 4.1 Check for an Existing Pull Request Before Creating One

**Impact: HIGH (Duplicate pull requests split review comments and CI results across two threads)**

Before `gh pr create`, look up the current branch's pull request with `gh pr view --json number,url,state,title` and act on the outcome:

| Outcome | Action |

|---------|--------|

| `state` is `OPEN` | Do not create one; update it (section 5) and report its URL |

| `state` is `CLOSED` or `MERGED` | Tell the user and ask before opening a new one |

| Error "no pull requests found" | None exists; create it |

| Any other error (authentication, network, permissions) | Stop and report the error; do not create |

**Incorrect: creates after any failure, including an expired login**

```bash
gh pr view --json number,url,state || gh pr create --base main --assignee @me --title "ABC-123: Pin runner images" --body-file body.md
```

**Correct:**

```bash
if out=$(gh pr view --json number,url,state 2>&1); then
  echo "$out"                                  # OPEN → update; CLOSED/MERGED → ask the user
elif printf '%s' "$out" | grep -q 'no pull requests found'; then
  gh pr create --base "$base" --assignee @me --title "$title" --body-file "$body"
else
  echo "Lookup failed: $out"                   # stop and report
fi
```

### 4.2 Target the Base Branch, Assign Yourself, and Let CODEOWNERS Pick Reviewers

**Impact: HIGH (A wrong base merges into the wrong branch; manual reviewers duplicate or override the team's ownership rules)**

- Base: the branch the repository's instructions name, otherwise the repository default: `gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`. For a branch stacked on another feature branch, use that branch as the base and say so in the report.

- Assignee: `@me`.

- Reviewers: GitHub requests code owners from the `CODEOWNERS` file on the **base** branch (`.github/`, root, or `docs/`), only for paths the change touches, and not while the pull request is a draft. When that file exists, add no reviewers yourself. After creating the pull request, check `gh pr view --json reviewRequests`; if it is empty, tell the user instead of adding reviewers. Without `CODEOWNERS`, add reviewers only when the user names them.

- Draft: only when the user asks or the repository requires it; mention that code owners are requested when it is marked ready.

**Incorrect:**

```bash
gh pr create --base master --reviewer someone --title "..." --body "..."
```

**Correct:**

```bash
base=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name)
git show "origin/$base:.github/CODEOWNERS" >/dev/null 2>&1 && echo "code owners on $base"
gh pr create --base "$base" --assignee @me \
  --title "ABC-123: Pin GitHub workflow runner images and action versions" \
  --body-file "$tmpdir/pr-body.md"
gh pr view --json reviewRequests --jq '.reviewRequests | length'
```

---

## 5. Keeping the Pull Request Current

**Impact: MEDIUM**

### 5.1 Update the Title and Description After Every Push to an Open Pull Request

**Impact: MEDIUM (Descriptions written for the first push misdescribe the change reviewers approve)**

When pushing commits to a branch with an open pull request, bring its title and description up to date in the same step so they describe the whole change against the base, following sections 2 and 3:

1. Read the current title and body: `gh pr view --json title,body`.

2. Rewrite only what the new commits made stale or incomplete, usually the summary bullets and possibly the title. Do not append "Update:" sections or a changelog of pushes.

3. Keep content that people maintain by hand, such as review notes, migration or rollout instructions, and template checklists with their checked state, unless it became wrong; then say what you changed.

4. Skip the edit when nothing is stale.

**Incorrect:**

```bash
git push
gh pr edit --body "## Summary
- Latest commit only"            # discards the reviewer's rollout notes
```

**Correct:**

```bash
# push with the guarded command from rule 1.1 (non-empty base and branch, branch != base)
gh pr view --json title,body > "$tmpdir/pr.json"
# edit the stale summary bullets, keep the rest
gh pr edit --title "ABC-123: Pin GitHub workflow runner images and action versions" --body-file "$tmpdir/pr-body.md"
```

---

## References

1. [https://cli.github.com/manual/gh_pr_create](https://cli.github.com/manual/gh_pr_create)
2. [https://cli.github.com/manual/gh_pr_edit](https://cli.github.com/manual/gh_pr_edit)
3. [https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
4. [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)
