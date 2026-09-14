#!/usr/bin/env node

import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import { analyzeGitForensics } from '../src/engine/git-forensics.js';
import { analyzeASTCodeSmells } from '../src/engine/ast-analyzer.js';
import { getSystemTelemetry } from '../src/engine/sys-telemetry.js';
import { detectLockfileDrift } from '../src/engine/lockfile-drift.js';
import { synthesizeCorporateExcuse } from '../src/generator/corporate-speak.js';
import { renderTerminalRadar } from '../src/ui/terminal-radar.js';
import { generateSlackBlockKit } from '../src/ui/export-slack.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const program = new Command();

program
    .name('git-excuse')
    .description('Deep AST & Git Forensics Standup Excuse Synthesizer')
    .version('2.0.0')
    .option('-p, --persona <type>', 'Persona tone: architect, junior, burned_out, existential', 'architect')
    .option('-s, --slack', 'Generate Slack Block Kit JSON format for integrations')
    .option('-j, --json', 'Output full diagnostic telemetry and excuse as JSON')
    .option('--no-copy', 'Do not copy the standup quote to system clipboard')
    .action(async (options) => {
        // Pipeline flags (json, slack) skip the animation for script piping
        if (options.json || options.slack) {
            const forensics = analyzeGitForensics();
            const ast = analyzeASTCodeSmells();
            const telemetry = getSystemTelemetry();
            const drift = detectLockfileDrift();
            const excuseData = synthesizeCorporateExcuse(forensics, ast, telemetry, drift, options.persona);

            if (options.json) {
                console.log(JSON.stringify({ forensics, ast, telemetry, drift, excuseData }, null, 2));
            } else {
                console.log(generateSlackBlockKit(excuseData, forensics, telemetry));
            }
            return;
        }

        // Minimal multi-step spinner animation
        const spinner = ora({
            text: chalk.dim('Scanning git working tree...'),
            color: 'magenta',
            spinner: 'dots'
        }).start();

        // 1. Gather git state & diff
        const forensics = analyzeGitForensics();
        await sleep(220);

        // 2. Run AST smell checks
        spinner.text = chalk.dim('Parsing Babel AST across staged diffs...');
        const ast = analyzeASTCodeSmells();
        await sleep(240);

        // 3. Inspect telemetry and lockfiles
        spinner.text = chalk.dim('Reading machine telemetry & lockfile parity...');
        const telemetry = getSystemTelemetry();
        const drift = detectLockfileDrift();
        await sleep(180);

        // 4. Synthesize excuse
        spinner.text = chalk.dim('Synthesizing corporate excuse...');
        const excuseData = synthesizeCorporateExcuse(forensics, ast, telemetry, drift, options.persona);
        await sleep(150);

        // Complete animation cleanly
        spinner.stop();

        // Render minimal dashboard
        console.log(renderTerminalRadar(forensics, ast, telemetry, drift, excuseData));

        // Copy to clipboard
        if (options.copy) {
            try {
                clipboardy.writeSync(excuseData.standup);
                console.log(`  ${chalk.green('✓')} ${chalk.dim('Copied standup to clipboard.')}\n`);
            } catch {
                // Silent fallback for headless/SSH sessions
            }
        }
    });

program.parse(process.argv);