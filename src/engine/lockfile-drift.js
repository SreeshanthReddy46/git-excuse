import fs from 'node:fs';
import path from 'node:path';

export function detectLockfileDrift() {
    const cwd = process.cwd();
    const pkgPath = path.join(cwd, 'package.json');
    const npmLockPath = path.join(cwd, 'package-lock.json');
    const yarnLockPath = path.join(cwd, 'yarn.lock');
    const pnpmLockPath = path.join(cwd, 'pnpm-lock.yaml');

    if (!fs.existsSync(pkgPath)) {
        return { hasDrift: false, exists: false };
    }

    let lockType = null;
    let lockPath = null;

    if (fs.existsSync(pnpmLockPath)) {
        lockType = 'pnpm';
        lockPath = pnpmLockPath;
    } else if (fs.existsSync(yarnLockPath)) {
        lockType = 'yarn';
        lockPath = yarnLockPath;
    } else if (fs.existsSync(npmLockPath)) {
        lockType = 'npm';
        lockPath = npmLockPath;
    }

    if (!lockPath) {
        return {
            hasDrift: true,
            exists: true,
            reason: 'MISSING_LOCKFILE',
            detail: 'No lockfile present. Dependency resolution is non-deterministic.'
        };
    }

    const pkgStat = fs.statSync(pkgPath);
    const lockStat = fs.statSync(lockPath);

    // If package.json was modified after the lockfile by more than 5 seconds
    const isDrifting = pkgStat.mtimeMs - lockStat.mtimeMs > 5000;

    return {
        hasDrift: isDrifting,
        exists: true,
        lockType,
        timeDeltaSec: Math.round(Math.abs(pkgStat.mtimeMs - lockStat.mtimeMs) / 1000),
        reason: isDrifting ? 'UNSYNCHRONIZED_LOCKFILE' : 'ALIGNED',
        detail: isDrifting
            ? `package.json is newer than ${path.basename(lockPath)}. Lockfile was not refreshed.`
            : 'Lockfile and manifest timestamps are aligned.'
    };
}