---
title: Ask Which Agent, Model, and Effort to Start
impact: CRITICAL
section: 4
impactDescription: Agents started on a default model or effort can cost far more, or do far less, than the user intended
tags: agent-start, model, effort, consent
---

## Ask Which Agent, Model, and Effort to Start

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

```text
Which model and reasoning effort should the Codex reviewer use?
→ user: gpt-6-astra, high
```

```bash
herdr agent start abc-123-review --kind codex --pane w7:p1 -- -m gpt-6-astra -c model_reasoning_effort=high
```
