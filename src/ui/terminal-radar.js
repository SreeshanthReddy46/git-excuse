import boxen from 'boxen';
import chalk from 'chalk';

export function renderTerminalRadar(forensics, ast, telemetry, drift, excuseData) {
    const divider = chalk.dim('─'.repeat(58));

    // Build telemetry radar line
    const memBadge = telemetry.memUsagePercent > 80
        ? chalk.bgRed.black(` RAM: ${telemetry.memUsagePercent}% `)
        : chalk.bgCyan.black(` RAM: ${telemetry.memUsagePercent}% `);

    const gitBadge = chalk.bgBlue.black(` Branch: ${forensics.branch || 'detached'} `);
    const diffBadge = chalk.bgGray.white(` Diff: +${forensics.linesAdded}/-${forensics.linesDeleted} `);
    const driftBadge = drift.hasDrift
        ? chalk.bgYellow.black(' Lockfile: DRIFT ')
        : chalk.bgGreen.black(' Lockfile: OK ');

    const telemetryHeader = `${memBadge} ${gitBadge} ${diffBadge} ${driftBadge}`;

    // AST Smells Line
    let smellsLine = chalk.green('✓ AST Diff Clean: No critical smells detected.');
    if (ast.smells.length > 0) {
        const list = Object.entries(ast.smellCounts)
            .map(([k, v]) => `${k} (x${v})`)
            .join(', ');
        smellsLine = chalk.red(`⚠ AST Alerts: ${list}`);
    }

    const body = [
        telemetryHeader,
        smellsLine,
        divider,
        chalk.bold.yellow('STANDUP BRIEFING:'),
        chalk.white.italic(`"${excuseData.standup}"`),
        '',
        `${chalk.bold.red('FORENSIC TRUTH:')} ${chalk.gray(excuseData.reality)}`,
        `${chalk.bold.cyan('ACTIONABLE REMEDY:')} ${chalk.white(excuseData.remediation)}`
    ].join('\n');

    return boxen(body, {
        padding: 1,
        margin: 1,
        borderColor: excuseData.severity === 'Critical' ? 'red' : 'magenta',
        borderStyle: 'double',
        title: chalk.bold.cyan(' ⚡ GIT-EXCUSE ENGINE v2.0 '),
        titleAlignment: 'center'
    });
}