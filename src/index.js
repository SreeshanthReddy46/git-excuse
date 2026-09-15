import { analyzeGitForensics } from './engine/git-forensics.js';
import { analyzeCodeSmells } from './engine/ast-analyzer.js';
import { getSystemTelemetry } from './engine/sys-telemetry.js';
import { detectLockfileDrift } from './engine/lockfile-drift.js';
import { synthesizeCorporateExcuse } from './generator/corporate-speak.js';
import { generateSlackBlockKit } from './ui/export-slack.js';

export function runExcuseEngine(options = {}) {
    const forensics = analyzeGitForensics();
    const ast = analyzeCodeSmells();
    const telemetry = getSystemTelemetry();
    const drift = detectLockfileDrift();

    const excuse = synthesizeCorporateExcuse(
        forensics,
        ast,
        telemetry,
        drift,
        options.persona || 'architect'
    );

    return {
        forensics,
        ast,
        telemetry,
        drift,
        excuse,
        toSlackPayload: () => generateSlackBlockKit(excuse, forensics, telemetry)
    };
}

export { analyzeGitForensics, analyzeCodeSmells, getSystemTelemetry, detectLockfileDrift };