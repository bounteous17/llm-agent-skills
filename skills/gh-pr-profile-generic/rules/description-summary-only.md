---
title: Write a Summary-Only Description of the Whole Change
impact: HIGH
section: 3
impactDescription: Reviewers need what changed and why; process notes and checklists bury it
tags: description, body, summary
---

## Write a Summary-Only Description of the Whole Change

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
