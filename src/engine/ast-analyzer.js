import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { execSync } from 'node:child_process';

const traverse = traverseModule.default || traverseModule;

export function analyzeASTCodeSmells() {
    let diffContent = '';
    try {
        diffContent = execSync('git diff -U0 -- "*.js" "*.jsx" "*.ts" "*.tsx"', {
            stdio: ['pipe', 'pipe', 'ignore'],
            encoding: 'utf-8'
        });
    } catch {
        return { smells: [], smellCounts: {} };
    }

    const addedCodeLines = diffContent
        .split('\n')
        .filter(line => line.startsWith('+') && !line.startsWith('+++'))
        .map(line => line.slice(1));

    const smells = [];
    const rawChunk = addedCodeLines.join('\n');

    // Fast string regex scans for pre-parse heuristics
    if (/console\.(log|warn|debug|table)/.test(rawChunk)) {
        smells.push({
            type: 'LEAKED_CONSOLE_TELEMETRY',
            severity: 'Low',
            detail: 'Raw console statements left in active staging path'
        });
    }

    if (/\/\/\s*(TODO|FIXME|HACK|OPTIMIZE)/i.test(rawChunk)) {
        smells.push({
            type: 'INLINE_DEBT_ACCRUAL',
            severity: 'Medium',
            detail: 'TODO/FIXME comments left in diff as debt obligations'
        });
    }

    if (/:\s*any\b/.test(rawChunk)) {
        smells.push({
            type: 'TYPE_SOUNDNESS_BYPASS',
            severity: 'High',
            detail: 'Wildcard TypeScript `any` cast detected'
        });
    }

    // Deep AST Tree Analysis
    try {
        const ast = parse(rawChunk, {
            sourceType: 'unambiguous',
            errorRecovery: true,
            plugins: ['typescript', 'jsx']
        });

        traverse(ast, {
            CatchClause(path) {
                if (!path.node.body.body.length) {
                    smells.push({
                        type: 'SILENT_EXCEPTION_SINK',
                        severity: 'Critical',
                        detail: 'Empty catch block silently swallowing unhandled runtime faults'
                    });
                }
            },
            CallExpression(path) {
                if (path.node.callee.name === 'eval') {
                    smells.push({
                        type: 'DYNAMIC_CODE_EXECUTION',
                        severity: 'Critical',
                        detail: 'Use of eval() violating execution safety boundaries'
                    });
                }
            },
            DebuggerStatement() {
                smells.push({
                    type: 'TRAPPED_BREAKPOINT',
                    severity: 'High',
                    detail: 'Hardcoded debugger statement left in staged lines'
                });
            }
        });
    } catch {
        // AST recovery fails gracefully on incomplete syntax fragments
    }

    const smellCounts = smells.reduce((acc, smell) => {
        acc[smell.type] = (acc[smell.type] || 0) + 1;
        return acc;
    }, {});

    return { smells, smellCounts };
}