import chalk from 'chalk';

export function renderTerminalRadar(forensics, ast, telemetry, drift, excuseData) {
    const dim = chalk.dim;
    const cyan = chalk.cyan;
    const gray = chalk.gray;

    // Format inline key-value tags
    const tags = [
        `${dim('branch:')} ${cyan(forensics.branch || 'detached')}`,
        `${dim('diff:')} ${chalk.green('+' + forensics.linesAdded)}${dim('/')}${chalk.red('-' + forensics.linesDeleted)}`,
        `${dim('memory:')} ${telemetry.memUsagePercent > 80 ? chalk.yellow(telemetry.memUsagePercent + '%') : chalk.white(telemetry.memUsagePercent + '%')}`,
        `${dim('lockfile:')} ${drift.hasDrift ? chalk.yellow('drifted') : chalk.green('synced')}`
    ].join(dim('  •  '));

    // Format AST summary line
    let alertLine = '';
    if (ast.smells.length > 0) {
        const smellKeys = Object.keys(ast.smellCounts).join(', ');
        alertLine = `\n  ${chalk.yellow('▲')}  ${dim('detected smells:')} ${chalk.yellow(smellKeys)}`;
    }

    return `
  ${chalk.bold.magenta('◆ git-excuse')} ${dim('v2.0')}
  ${dim('─'.repeat(54))}
  ${tags}${alertLine}

  ${chalk.bold.white('STANDUP')}
  ${chalk.italic.cyan(`"${excuseData.standup}"`)}

  ${chalk.bold.red('REALITY')}
  ${gray(excuseData.reality)}

  ${chalk.bold.green('REMEDY')}
  ${chalk.white(excuseData.remediation)}
  ${dim('─'.repeat(54))}
`;
}