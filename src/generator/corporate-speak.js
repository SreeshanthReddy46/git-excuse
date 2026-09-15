import { PERSONAS } from './personas.js';

const VERBS = ['decoupling', 'reconciling', 'stabilizing', 'isolating', 'refactoring', 'orchestrating'];
const ADJECTIVES = ['transient', 'non-deterministic', 'covariant', 'asynchronous', 'distributed'];
const NOUNS = ['boundary invariants', 'event pipelines', 'subtyping topologies', 'state machines'];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function synthesizeCorporateExcuse(forensics, ast, telemetry, drift, personaName = 'architect') {
    const persona = PERSONAS[personaName] || PERSONAS.architect;
    const targetId = ast.identifiers[0] ? `\`${ast.identifiers[0]}\`` : 'the subsystem';
    const targetFile = forensics.changedFiles[0] ? `in \`${forensics.changedFiles[0]}\`` : 'locally';

    // 1. Conflict Invariant
    if (forensics.hasConflicts) {
        return {
            standup: `${persona.prefix} branch '${forensics.branch}' has encountered high-dimensional tree divergence during upstream trunk synchronization. ${persona.closing}`,
            reality: `You have active merge conflicts across ${forensics.conflictFiles.length} file(s).`,
            remediation: 'git rebase --abort || git status --short | grep "^UU"'
        };
    }

    // 2. Lockfile Drift
    if (drift.hasDrift) {
        return {
            standup: `${persona.prefix} local dependency resolution is exhibiting non-deterministic behavior against our locked topology. ${persona.closing}`,
            reality: 'package.json was modified without synchronizing the lockfile.',
            remediation: drift.lockType === 'pnpm' ? 'pnpm install' : 'npm install'
        };
    }

    // 3. Critical AST Smells
    if (ast.smells.some((s) => s.type === 'SWALLOWED_EXCEPTION')) {
        return {
            standup: `${persona.prefix} we have isolated an asynchronous fault-propagation vector that is intentionally sinking exceptions surrounding ${targetId} ${targetFile}. ${persona.closing}`,
            reality: 'You left an empty catch block that silently buries runtime errors.',
            remediation: 'Add structured logger telemetry or rethrow caught exceptions.'
        };
    }

    if (ast.smells.some((s) => s.type === 'ANY_ESCAPE_HATCH')) {
        return {
            standup: `${persona.prefix} we are deferring static contract verification at ${targetId} to facilitate polymorphic payload elasticity. ${persona.closing}`,
            reality: 'You bypassed TypeScript type checking using wildcard `any`.',
            remediation: 'Define explicit interfaces or use `unknown` with runtime typeguards.'
        };
    }

    // 4. Telemetry: Low Battery or Heavy RAM
    if (telemetry.isLowBattery) {
        return {
            standup: `${persona.prefix} local compute cycles are throttled to preserve execution state under hardware power-envelope constraints (${telemetry.batteryLevel}% reserve). ${persona.closing}`,
            reality: `Your laptop battery is down to ${telemetry.batteryLevel}%.`,
            remediation: 'Connect your laptop to power before running heavy builds.'
        };
    }

    if (telemetry.isMemoryChoked) {
        return {
            standup: `${persona.prefix} computation throughput is degraded due to memory bus contention (${telemetry.memPercent}% utilization). ${persona.closing}`,
            reality: 'System is running out of free RAM. Node/Docker workers are choking.',
            remediation: 'docker system prune -f'
        };
    }

    // 5. Friday Afternoon Deploy Risk
    if (telemetry.isFridayAfternoon) {
        return {
            standup: `${persona.prefix} our deployment cadence is respecting the risk-mitigation protocol governing late-cycle weekend stability. ${persona.closing}`,
            reality: 'It is Friday afternoon. Pushing to staging or production now risks weekend downtime.',
            remediation: 'Step away from deployments. Resume on Monday morning.'
        };
    }

    // Dynamic Generative Fallback
    return {
        standup: `${persona.prefix} we are actively ${pick(VERBS)} ${pick(ADJECTIVES)} ${pick(NOUNS)} around ${targetId} ${targetFile} to guarantee backward parity. ${persona.closing}`,
        reality: 'No critical errors detected. You simply have uncommitted local changes.',
        remediation: 'git commit -m "chore: incremental updates"'
    };
}