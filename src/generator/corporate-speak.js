import { PERSONAS } from './personas.js';

export function synthesizeCorporateExcuse(forensics, ast, telemetry, drift, personaName = 'architect') {
    const persona = PERSONAS[personaName] || PERSONAS.architect;

    // Rule 1: Lockfile Drift
    if (drift.hasDrift) {
        return {
            standup: `${persona.prefix} our build pipeline is experiencing non-deterministic transitive dependency resolution across the local lockfile boundary. ${persona.closing}`,
            reality: `package.json was edited without running install. Lockfile is out of sync.`,
            severity: "High",
            remediation: "Execute `npm install` or `pnpm install` to synchronize your lockfile."
        };
    }

    // Rule 2: Swallowed Exceptions (Empty Catch)
    if (ast.smellCounts['SILENT_EXCEPTION_SINK']) {
        return {
            standup: `${persona.prefix} we have isolated an asynchronous fault-propagation vector that is intentionally sinking exceptions to prevent cascading micro-outages. ${persona.closing}`,
            reality: "You wrote `catch (err) {}` with nothing inside, completely burying runtime crashes.",
            severity: "Critical",
            remediation: "Add structured logger telemetry or rethrow caught exceptions."
        };
    }

    // Rule 3: TypeScript Any Escape
    if (ast.smellCounts['TYPE_SOUNDNESS_BYPASS']) {
        return {
            standup: `${persona.prefix} we are deferring static contract verification at the interface boundary to facilitate polymorphic payload elasticity. ${persona.closing}`,
            reality: "You bypassed TypeScript compilation errors with `any` instead of typing the object.",
            severity: "High",
            remediation: "Define explicit interfaces or use `unknown` with runtime typeguards."
        };
    }

    // Rule 4: System Overload
    if (telemetry.isMemoryChoked || telemetry.isCpuSaturated) {
        return {
            standup: `${persona.prefix} local computation throughput is degraded due to excessive memory bus contention (${telemetry.memUsagePercent}% utilization across ${telemetry.cpuCoreCount} execution units). ${persona.closing}`,
            reality: "Your laptop is running out of memory. Node, Docker, and IDE workers are choking the OS.",
            severity: "Medium",
            remediation: "Kill orphaned node processes and run `docker system prune`."
        };
    }

    // Rule 5: Friday Afternoon Safety Interceptor
    if (telemetry.isFridayAfternoon) {
        return {
            standup: `${persona.prefix} our deployment cadence is respecting the risk-mitigation protocol governing late-cycle weekend invariant stability. ${persona.closing}`,
            reality: "It is Friday afternoon. Deploying now is a direct invitation for an on-call emergency.",
            severity: "Low",
            remediation: "Step away from production. Resume deployment on Monday morning."
        };
    }

    // Rule 6: Merge Conflicts
    if (forensics.hasConflicts) {
        return {
            standup: `${persona.prefix} branch '${forensics.branch}' has encountered high-dimensional tree divergence during upstream trunk synchronization. ${persona.closing}`,
            reality: `You have unresolved merge conflicts across ${forensics.conflictFiles.length} file(s).`,
            severity: "Critical",
            remediation: `Inspect conflicts with: git status --short | grep '^UU'`
        };
    }

    // Rule 7: Excessive Uncommitted Churn (>250 lines with 0 tests)
    if (forensics.linesAdded > 250 && forensics.linesDeleted < 20) {
        return {
            standup: `${persona.prefix} we are completing the structural scaffolding layer before instrumenting end-to-end regression fixtures. ${persona.closing}`,
            reality: `You wrote ${forensics.linesAdded} lines of code without a single test or atomic commit.`,
            severity: "Medium",
            remediation: "Stage smaller logical hunks (`git add -p`) and draft unit tests."
        };
    }

    // Default Fallback
    return {
        standup: `${persona.prefix} we are validating transient state-transitions against our local execution container to guarantee backward parity. ${persona.closing}`,
        reality: "No critical faults detected. You simply haven't pushed changes recently.",
        severity: "Low",
        remediation: "Commit your working tree: `git commit -m 'chore: incremental updates'`"
    };
}