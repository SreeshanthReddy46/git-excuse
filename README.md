# ⚡ git-excuse

> Enterprise-grade AST forensics, git telemetry, and contextual standup excuse generator.

[![npm version](https://img.shields.io/npm/v/git-excuse.svg?style=flat-square)](https://www.npmjs.com/package/git-excuse)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

**`git-excuse`** analyzes uncommitted git diffs via Babel AST, samples operating system telemetry, calculates Git churn, and synthesizes **hyper-specific, corporate-grade standup excuses** with real identifier injection.

---

## 📸 Terminal Preview

```text
  ⠋ Parsing Babel AST across staged diffs...

  ◆ git-excuse v2.0
  ──────────────────────────────────────────────────────
  branch: main  •  diff: +142/-4  •  memory: 64%  •  lockfile: synced
  ▲  detected smells: ANY_ESCAPE_HATCH

  STANDUP
  "From an architectural boundary perspective, we are deferring static
  contract verification at `UserModel` in `src/auth.ts` to facilitate
  polymorphic payload elasticity. We must ensure zero downstream
  regressions before committing to this paradigm."

  REALITY
  You slapped `: any` across your code to bypass the TypeScript compiler.

  REMEDY
  Define explicit interfaces or use `unknown` with runtime typeguards.
  ──────────────────────────────────────────────────────
  ✓ Copied standup to clipboard.
```

---

## 🚀 Quick Execution

```bash
# Run immediately with terminal animation & auto-clipboard
npx git-excuse

# Register `git standup` global alias
npx git-excuse --install-alias
git standup

# Interactive mode with arrow keys
npx git-excuse -i

# Run with specific personas: architect, junior, burned_out, existential
npx git-excuse --persona burned_out

# Automatically run the remediation command
npx git-excuse --fix

# Output formatted Slack Block Kit JSON
npx git-excuse --slack

# Export raw JSON telemetry report for CI/CD
npx git-excuse --json
```

---

## 📄 License

MIT