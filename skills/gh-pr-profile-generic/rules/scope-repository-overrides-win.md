---
title: Let the Repository's Rules and Template Override This Profile
impact: CRITICAL
section: 1
impactDescription: Repositories document their own title, description, reviewer, and base branch rules; generic defaults that contradict them get pull requests sent back
tags: precedence, agents-md, template
---

## Let the Repository's Rules and Template Override This Profile

Before writing a pull request, read:

1. The repository's agent instructions: `AGENTS.md`, or the file it uses (`CLAUDE.md`, `GEMINI.md`, `.cursor/rules`).
2. A pull request template: `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/pull_request_template.md`, `pull_request_template.md`, or a file under `.github/PULL_REQUEST_TEMPLATE/`.

Rules in the instructions win over this profile. A template replaces the description format of section 3: fill its sections, keep its headings, and remove only instructional comments. Apply this profile for anything left unspecified.

**Incorrect (ignores the template):**

```markdown
## Summary
- Pin runner images
```

**Correct (template with `## Changes` and `## Risk` filled in):**

```markdown
## Changes
- Pin runner images and action versions in every workflow

## Risk
- Low: CI only
```
