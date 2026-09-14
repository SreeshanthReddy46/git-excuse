#!/usr/bin/env node

import { Command } from 'commander';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { analyzeGitForensics } from '../src/engine/git-forensics.js';
import { analyzeASTCodeSmells } from '../src/engine/ast-analyzer.js';
import { getSystemTelemetry } from '../src/engine/sys-telemetry.js';
import { detectLockfileDrift } from '../src/engine/lockfile-drift.js';
import { synthesizeCorporateExcuse } from '../src/generator/corporate-speak.js';
import { renderTerminalRadar } from '../src/ui/terminal-radar.js';
import { generateSlackBlockKit } from '../src/ui/export-slack.js';

const program = new Command();

program
    .name('git-excuse')
    .description('Deep AST & Git Forensics Standup Excuse Synthesizer')
    .version('2.0.0')
    .option('-p, --persona <type>', 'Persona tone: architect, junior, burned_out, existential', 'architect')
    .option('-s, --slack', 'Generate Slack Block Kit JSON format for integrations')
    .option('-j, --json', 'Output full diagnostic telemetry and excuse as JSON')
    .option('--no-copy', 'Do not copy the standup quote to system clipboard')
    .action((options) => {
        // 1. Gather all system, AST, and Git vectors
        const forensics = analyzeGitForensics();
        const ast = analyzeASTCodeSmells();
        const telemetry = getSystemTelemetry();
        const drift = detectLockfileDrift();

        // 2. Synthesize contextual corporate briefing
        const excuseData = synthesizeCorporateExcuse(
            forensics,
            ast,
            telemetry,
            drift,
            options.persona
        );

        // 3. Handle JSON flags for pipeline consumption
        if (options.json) {
            console.log(JSON.stringify({ forensics, ast, telemetry, drift, excuseData }, null, 2));
            return;
        }

        if (options.slack) {
            console.log(generateSlackBlockKit(excuseData, forensics, telemetry));
            return;
        }

        // 4. Default Interactive Terminal Dashboard
        console.log(renderTerminalRadar(forensics, ast, telemetry, drift, excuseData));

        // 5. Automatic Clipboard copy for Slack/Teams
        if (options.copy) {
            try {
                clipboardy.writeSync(excuseData.standup);
                console.log(chalk.dim('  ⚡ Standup briefing copied to clipboard. Ready to paste.\n'));
            } catch {
                // Degrade silently in headless/SSH/CI environments
            }
        }
    });

program.parse(process.argv);