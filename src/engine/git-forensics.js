import { execSync } from 'node:child_process';

function sh(cmd) {
    try {
        return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf-8' }).trim();
    } catch {
        return null;
    }
}

export function analyzeGitForensics() {
    const isGit = sh('git rev-parse --is-inside-work-tree') === 'true';
    if (!isGit) return { isGit: false };

    const branch = sh('git rev-parse --abbrev-ref HEAD') || 'detached';
    const numstat = sh('git diff HEAD --numstat') || '';

    let linesAdded = 0;
    let linesDeleted = 0;
    numstat.split('\n').filter(Boolean).forEach((line) => {
        const [added, deleted] = line.split('\t');
        linesAdded += parseInt(added, 10) || 0;
        linesDeleted += parseInt(deleted, 10) || 0;
    });

    const churnRatio = linesDeleted === 0 ? linesAdded : +(linesAdded / linesDeleted).toFixed(2);

    // Commit dispersion & entropy in past 14 days
    const logStats = sh('git log --since="14 days ago" --format="%an|%ct"') || '';
    const commitRows = logStats.split('\n').filter(Boolean);
    const authors = new Set();
    commitRows.forEach((row) => {
        const [author] = row.split('|');
        if (author) authors.add(author);
    });

    // Calculate commit velocity (hours since last commit)
    const lastCommitEpoch = sh('git log -1 --format="%ct"');
    let hoursSinceLastCommit = 0;
    if (lastCommitEpoch) {
        const lastTimestamp = parseInt(lastCommitEpoch, 10) * 1000;
        hoursSinceLastCommit = +((Date.now() - lastTimestamp) / (1000 * 60 * 60)).toFixed(1);
    }

    // Conflict & changed files
    const conflictsRaw = sh('git diff --name-only --diff-filter=U') || '';
    const conflictFiles = conflictsRaw.split('\n').filter(Boolean);

    const changedFilesRaw = sh('git diff --name-only HEAD') || '';
    const changedFiles = changedFilesRaw.split('\n').filter(Boolean);

    let behindUpstream = 0;
    const upstream = sh(`git rev-list --count HEAD..origin/${branch}`);
    if (upstream) behindUpstream = parseInt(upstream, 10) || 0;

    return {
        isGit: true,
        branch,
        linesAdded,
        linesDeleted,
        churnRatio,
        totalCommits: commitRows.length,
        contributorCount: authors.size,
        hoursSinceLastCommit,
        changedFiles,
        hasConflicts: conflictFiles.length > 0,
        conflictFiles,
        behindUpstream
    };
}