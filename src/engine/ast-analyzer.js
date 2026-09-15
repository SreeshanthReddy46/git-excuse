import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { execSync } from 'node:child_process';

const traverse = traverseModule.default || traverseModule;

function run(cmd) {
    try {
        return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf-8' });
    } catch {
        return '';
    }
}

export function analyzeCodeSmells() {
    const diff = run('git diff -U0 -- "*.js" "*.jsx" "*.ts" "*.tsx"');
    if (!diff) return { smells: [], identifiers: [] };

    const addedLines = diff
        .split('\n')
        .filter((l) => l.startsWith('+') && !l.startsWith('+++'))
        .map((l) => l.slice(1));

    const rawChunk = addedLines.join('\n');
    const smells = [];
    const identifiers = new Set();

    // Fast string regex heuristics
    if (/console\.(log|warn|debug|table)/.test(rawChunk)) {
        smells.push({ type: 'CONSOLE_TELEMETRY', detail: 'Found raw console telemetry in diff' });
    }
    if (/\/\/\s*(TODO|FIXME|HACK|OPTIMIZE)/i.test(rawChunk)) {
        smells.push({ type: 'INLINE_DEBT_MARKER', detail: 'Inline technical debt markers detected' });
    }
    if (/:\s*any\b/.test(rawChunk)) {
        smells.push({ type: 'ANY_ESCAPE_HATCH', detail: 'TypeScript soundness bypassed via wildcard `any`' });
    }

    // Safe AST parsing with synthetic wrapper to prevent partial-line crash
    const wrappedCode = `async function __synthetic_diff_scope__() {\n${rawChunk}\n}`;

    try {
        const ast = parse(wrappedCode, {
            sourceType: 'unambiguous',
            errorRecovery: true,
            plugins: ['typescript', 'jsx']
        });

        traverse(ast, {
            CatchClause(path) {
                if (!path.node.body.body.length) {
                    smells.push({ type: 'SWALLOWED_EXCEPTION', detail: 'Empty catch block swallowing runtime errors' });
                }
            },
            CallExpression(path) {
                if (path.node.callee.name === 'eval') {
                    smells.push({ type: 'DYNAMIC_CODE_EXECUTION', detail: 'Dynamic eval() execution detected' });
                }
            },
            Identifier(path) {
                const name = path.node.name;
                if (name.length > 3 && !['const', 'let', 'return', 'async', 'function'].includes(name)) {
                    identifiers.add(name);
                }
            }
        });
    } catch {
        // AST recovery fails safely on non-recoverable fragments
    }

    return {
        smells,
        identifiers: Array.from(identifiers).slice(0, 4)
    };
}