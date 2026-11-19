import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { SkillConfig } from '../../../build-tools/src/types.js'

const SKILL_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

export default {
  name: 'herdr-profile-generic',
  displayName: 'Herdr Profile (generic)',
  note: 'This document is mainly for agents and LLMs of any vendor to follow\nwhen organizing work in Herdr worktrees, tabs, and agents. Humans\nmay also find it useful, but guidance here is optimized for automation\nand consistency by AI-assisted workflows.',
  rulesDir: join(SKILL_DIR, 'rules'),
  outputFile: join(SKILL_DIR, 'AGENTS.md'),
  metadataFile: join(SKILL_DIR, 'metadata.json'),
  defaultMetadata: {
    version: '1.0.0',
    organization: 'llm-agent-skills',
    date: 'November 2026',
    abstract: 'Generic conventions for working inside Herdr: one worktree per ticket, names from the ticket context, local file copies, and agent start rules.',
  },
} satisfies SkillConfig
