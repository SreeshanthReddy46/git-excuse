import fs from 'node:fs';
import path from 'node:path';

export function detectLockfileDrift() {
    const cwd = process.cwd();
    const pkg = path.join(cwd, 'package.json');
    const locks = [
        { type: 'pnpm', path: path.join(cwd, 'pnpm-lock.yaml') },
        { type: 'yarn', path: path.join(cwd, 'yarn.lock') },
        { type: 'npm', path: path.join(cwd, 'package-lock.json') }
    ];

    if (!fs.existsSync(pkg)) return { hasDrift: false };

    const activeLock = locks.find((l) => fs.existsSync(l.path));
    if (!activeLock) return { hasDrift: true, reason: 'NO_LOCKFILE' };

    const pkgTime = fs.statSync(pkg).mtimeMs;
    const lockTime = fs.statSync(activeLock.path).mtimeMs;

    return {
        hasDrift: pkgTime - lockTime > 4000,
        lockType: activeLock.type
    };
}