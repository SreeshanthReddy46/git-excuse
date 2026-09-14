# ⚡ git-excuse

> Enterprise-grade AST forensics, git telemetry, and contextual standup excuse generator.

[![npm version](https://img.shields.io/npm/v/git-excuse.svg?style=flat-square)](https://www.npmjs.com/package/git-excuse)
[![npm downloads](https://img.shields.io/npm/dm/git-excuse.svg?style=flat-square)](https://www.npmjs.com/package/git-excuse)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

Ever arrived at morning standup with an uncommitted messy diff, unmerged conflicts, and zero commits over the last three days?

**`git-excuse`** is a high-performance CLI tool and programmatic engine that analyzes dirty git diffs via Babel AST, samples operating system telemetry, calculates Git churn, checks lockfile drift, and synthesizes **hyper-specific, technically sound, corporate-grade excuses**.

It doesn't just spew random developer jokes—it reads your actual local repository state and hands you the exact technical jargon required to sound like a 10x Staff Architect, alongside the exact commands to remediate the underlying issues.

---

## 📸 Terminal Preview

```text
  ⠋ Parsing Babel AST across staged diffs...

  ◆ git-excuse v2.0
  ──────────────────────────────────────────────────────
  branch: main  •  diff: +142/-4  •  memory: 64%  •  lockfile: synced
  ▲  detected smells: TYPE_SOUNDNESS_BYPASS

  STANDUP
  "From an architectural boundary perspective, we are deferring static
  contract verification at the interface boundary to facilitate
  polymorphic payload elasticity. We must ensure zero downstream
  regressions before committing to this paradigm."

  REALITY
  You bypassed TypeScript compilation errors with `any` instead of typing the object.

  REMEDY
  Define explicit interfaces or use `unknown` with runtime typeguards.
  ──────────────────────────────────────────────────────
  ✓ Copied standup to clipboard.
```

---

## 🚀 Quick Execution (Zero Install)

Run directly inside any repository without local installation:

```bash
npx git-excuse
```

*Note: The generated standup briefing is automatically copied to your system clipboard for instant pasting into Slack, Teams, or Discord.*

---

## 💻 Complete Command Reference

### 1. Global Installation Commands

Install globally via your package manager of choice:

```bash
# Using npm
npm install -g git-excuse

# Using pnpm
pnpm add -g git-excuse

# Using yarn
yarn global add git-excuse

# Using bun
bun add -g git-excuse
```

---



## 🧠 Diagnostic Vectors (How It Works)

`git-excuse` does not query generic web scrapers or static mock lists. It inspects four local diagnostic telemetry vectors:

### 1. AST Diff Forensics (`@babel/parser`, `@babel/traverse`)
Inspects unstaged and staged JavaScript/TypeScript diffs (`git diff -U0`) to isolate:
* **`SILENT_EXCEPTION_SINK`**: Detects empty `catch (e) {}` blocks that swallow exceptions.
* **`TYPE_SOUNDNESS_BYPASS`**: Finds wildcard `: any` type casts used to bypass the TypeScript compiler.
* **`DYNAMIC_CODE_EXECUTION`**: Flags arbitrary `eval()` invocations.
* **`LEAKED_CONSOLE_TELEMETRY`**: Catches lingering `console.log()` statements left in diffs.
* **`INLINE_DEBT_ACCRUAL`**: Scans for `// TODO`, `// FIXME`, and `// HACK` annotations.

### 2. Git Churn & Entropy Engine
Calculates repository velocity and author volatility:
* **Churn Ratio**: Measures line insertion vs. deletion ratios ($LinesAdded / LinesDeleted$).
* **Commit Dispersion**: Audits the author frequency and commit volume across the last 14 days.
* **Upstream Divergence**: Analyzes how far behind/ahead the local branch sits relative to `origin/HEAD`.
* **Conflict State**: Detects active 3-way merge conflicts (`diff-filter=U`).

### 3. Hardware & OS Telemetry
Extracts real machine load using Node.js native `node:os`:
* Memory saturation percentage (`freemem()` vs `totalmem()`).
* 1-minute load averages compared against available CPU cores.
* Time-of-week risk indexing (e.g., automatically flags Friday afternoon deployment hazards).

### 4. Lockfile Drift Detection
Checks synchronization between `package.json` and dependency manifests (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`). Flags non-deterministic resolution if manifests are uncommitted or older than `package.json`.

---

## 🎭 Persona Archetypes

| Persona | Voice Profile | Archetype Target |
| :--- | :--- | :--- |
| `architect` *(default)* | Heavy enterprise abstraction, boundary modeling, invariant propagation | Sounds like a L8 Principal Engineer from 2012 |
| `junior` | Reddit-informed, StackOverflow-driven, framework confusion | Believes restarting the bundler solves race conditions |
| `burned_out` | Cynical, boundary-setting, weary of sprint velocity inflation | Tells the truth wrapped in technical exhaustion |
| `existential` | Quantum decoherence, entropy limits, philosophical indeterminism | Treats runtime bugs as philosophical certainties |

---

## 💻 Programmatic Node.js API

Import `git-excuse` directly into custom Node.js scripts, bots, or CI runners:

```javascript
import { runForensics, analyzeGitForensics, analyzeASTCodeSmells } from 'git-excuse';

// Run full diagnostic pipeline
const report = runForensics({ persona: 'architect' });

console.log('Standup Quote:', report.excuse.standup);
console.log('Diagnostic Truth:', report.excuse.reality);
console.log('Remedy:', report.excuse.remediation);

// Export Slack-ready Block Kit JSON
const slackPayload = report.toSlackPayload();
console.log(slackPayload);
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.