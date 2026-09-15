#!/usr/bin/env node

import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import { select } from '@inquirer/prompts';
import { execSync } from 'node:child_process';

import { analyzeGitForensics } from '../src/engine/git-forensics.js';
import { analyzeCodeSmells } from '../src/engine/ast-analyzer.js';
import { getSystemTelemetry } from '../src/engine/sys-telemetry.js';
import { detectLockfileDrift } from '../src/engine/lockfile-drift.js';
import { loadUserConfig, initConfigFile } from '../src/engine/config-loader.js';
import { speakExcuse } from '../src/engine/audio-synth.js';
import { startDashboard } from '../src/web/server.js';
import { synthesizeCorporateExcuse } from '../src/generator/corporate-speak.js';
import { renderTerminalRadar } from '../src/ui/terminal-radar.js';
import { generateSlackBlockKit } from '../src/ui/export-slack.js';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const program = new Command();

program
    .name('git-excuse')
    .description('Titanium AST & Git Forensics Standup Excuse Synthesizer Platform')
    .version('4.0.0')
    .option('-p, --persona <type>', 'Persona tone: architect, junior, burned_out, existential', 'architect')
    .option('-w, --web', 'Open interactive Web Radar Dashboard in your default browser')
    .option('-v, --voice', 'Read out the generated excuse using deadpan system text-to-speech')
    .option('-i, --interactive', 'Interactively pick from multiple excuse styles')
    .option('-f, --fix', 'Automatically run the recommended remediation command')
    .option('--init', 'Create a .gitexcuserc.json config file for team jargon')
    .option('--install-alias', 'Install `git standup` global alias into your Git config')
    .option('-s, --slack', 'Generate Slack Block Kit JSON format for webhooks')
    .option('-j, --json', 'Output full diagnostic telemetry and excuse as JSON')
    .option('--no-copy', 'Do not copy the standup quote to system clipboard')
    .action(async (options) => {
        // 1. Team Config Init
        if (options.init) {
            const res = initConfigFile();
            console.log(chalk.green(`✔ ${res.message}`));
            return;
        }

        // 2. Global Alias Registration
        if (options.installAlias) {
            try {
                execSync('git config --global alias.standup "!npx git-excuse"', { stdio: 'inherit' });
                console.log(chalk.green('✔ Registered alias! You can now run `git standup` anywhere.\n'));
            } catch (err) {
                console.log(chalk.red(`Failed to register alias: ${err.message}`));
            }
            return;
        }

        // 3. Gather Engine Data
        const forensics = analyzeGitForensics();
        const ast = analyzeCodeSmells();
        const telemetry = getSystemTelemetry();
        const drift = detectLockfileDrift();
        const config = loadUserConfig();

        const excuseData = synthesizeCorporateExcuse(forensics, ast, telemetry, drift, options.persona, config);
        const fullReport = { forensics, ast, telemetry, drift, excuse: excuseData };

        // 4. Web Dashboard Mode
        if (options.web) {
            startDashboard(fullReport);
            return;
        }

        // 5. Headless JSON / Slack Modes
        if (options.json) {
            console.log(JSON.stringify(fullReport, null, 2));
            return;
        }
        if (options.slack) {
            console.log(generateSlackBlockKit(excuseData, forensics, telemetry));
            return;
        }

        // 6. Interactive Terminal Spinner
        const spinner = ora({ text: chalk.dim('Running Titanium Forensics scan...'), color: 'magenta' }).start();
        await sleep(250);
        spinner.stop();

        // 7. Interactive Persona Selection
        let chosenExcuse = excuseData;
        if (options.interactive) {
            const choices = ['architect', 'junior', 'burned_out', 'existential'].map((p) => {
                const item = synthesizeCorporateExcuse(forensics, ast, telemetry, drift, p, config);
                return {
                    name: `${chalk.bold(p.toUpperCase())}: "${chalk.dim(item.standup.slice(0, 72))}..."`,
                    value: item
                };
            });

            chosenExcuse = await select({
                message: 'Select your preferred standup briefing profile:',
                choices
            });
        }

        // 8. Output Minimalist Terminal Radar
        console.log(renderTerminalRadar(forensics, ast, telemetry, drift, chosenExcuse));

        // 9. Audio Speech Synthesis
        if (options.voice) {
            speakExcuse(chosenExcuse.standup);
        }

        // 10. System Clipboard Copy
        if (options.copy) {
            try {
                clipboardy.writeSync(chosenExcuse.standup);
                console.log(`  ${chalk.green('✓')} ${chalk.dim('Copied standup to clipboard.')}\n`);
            } catch {}
        }

        // 11. Auto-Fix Remediation
        if (options.fix && chosenExcuse.remediation) {
            const cmd = chosenExcuse.remediation;
            if (!cmd.includes('rm -rf') && !cmd.includes('echo')) {
                try {
                    console.log(chalk.dim(`Executing: ${cmd}...`));
                    execSync(cmd, { stdio: 'inherit' });
                    console.log(chalk.green('✔ Successfully executed remediation.\n'));
                } catch (err) {
                    console.log(chalk.red(`✖ Remediation failed: ${err.message}`));
                }
            }
        }
    });

program.parse(process.argv);