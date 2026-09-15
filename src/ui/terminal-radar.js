import chalk from 'chalk';

export function renderTerminalRadar(forensics, ast, telemetry, drift, excuseData) {
    const dim = chalk.dim;
    const tags = [
        `${dim('branch:')} ${chalk.cyan(forensics.branch || 'detached')}`,
        `${dim('diff:')} ${chalk.green('+' + forensics.linesAdded)}${dim('/')}${chalk.red('-' + forensics.linesDeleted)}`,
        `${dim('memory:')} ${telemetry.memPercent > 80 ? chalk.yellow(telemetry.memPercent + '%') : chalk.white(telemetry.memPercent + '%')}`,
        `${dim('lockfile:')} ${drift.hasDrift ? chalk.yellow('drifted') : chalk.green('synced')}`
    ].join(dim('  •  '));

    let alertLine = '';
    if (ast.smells.length > 0) {
        const names = ast.smells.map((s) => s.type).join(', ');
        alertLine = `\n  ${chalk.yellow('▲')}  ${dim('detected smells:')} ${chalk.yellow(names)}`;
    }

    return `
  ${chalk.bold.magenta('◆ git-excuse')} ${dim('v2.0')}
  ${dim('─'.repeat(54))}
  ${tags}${alertLine}

  ${chalk.bold.white('STANDUP')}
  ${chalk.italic.cyan(`"${excuseData.standup}"`)}

  ${chalk.bold.red('REALITY')}
  ${chalk.gray(excuseData.reality)}

  ${chalk.bold.green('REMEDY')}
  ${chalk.white(excuseData.remediation)}
  ${dim('─'.repeat(54))}
`;
}