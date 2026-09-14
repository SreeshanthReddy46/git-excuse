import { execSync } from 'node:child_process';

function run(cmd) {
    try {
        return execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf-8' }).trim();
    } catch {
        return null;
    }
}

export function analyzeGitForensics() {
    const isInsideRepo = run('git rev-parse --is-inside-work-tree') === 'true';
    if (!isInsideRepo) {
        return { isGit: false };
    }

    const branch = run('git rev-parse --abbrev-ref HEAD') || 'detached';

    // 1. Churn Rate and Line Delta
    const numstat = run('git diff HEAD --numstat') || '';
    let linesAdded = 0;
    let linesDeleted = 0;
    let modifiedFiles = 0;

    numstat.split('\n').filter(Boolean).forEach((line) => {
        const [added, deleted] = line.split('\t');
        linesAdded += parseInt(added, 10) || 0;
        linesDeleted += parseInt(deleted, 10) || 0;
        modifiedFiles += 1;
    });

    const churnRatio = linesDeleted === 0 ? linesAdded : +(linesAdded / linesDeleted).toFixed(2);

    // 2. Commit Entropy (Author & Commit Dispersion in the last 14 days)
    const logStats = run('git log --since="14 days ago" --format="%an|%ct"') || '';
    const commitRows = logStats.split('\n').filter(Boolean);
    const totalCommits = commitRows.length;

    const authors = new Set();
    commitRows.forEach(row => {
        const [author] = row.split('|');
        if (author) authors.add(author);
    });

    // Calculate commit velocity (hours since last commit)
    const lastCommitEpoch = run('git log -1 --format="%ct"');
    let hoursSinceLastCommit = 0;
    if (lastCommitEpoch) {
        const lastTimestamp = parseInt(lastCommitEpoch, 10) * 1000;
        hoursSinceLastCommit = +((Date.now() - lastTimestamp) / (1000 * 60 * 60)).toFixed(1);
    }

    // 3. Conflict and Divergence Status
    const conflictOutput = run('git diff --name-only --diff-filter=U') || '';
    const conflictFiles = conflictOutput.split('\n').filter(Boolean);

    let behindUpstream = 0;
    let aheadUpstream = 0;
    const upstreamStatus = run(`git rev-list --left-right --count HEAD...origin/${branch}`);
    if (upstreamStatus) {
        const [ahead, behind] = upstreamStatus.split('\t');
        aheadUpstream = parseInt(ahead, 10) || 0;
        behindUpstream = parseInt(behind, 10) || 0;
    }

    return {
        isGit: true,
        branch,
        linesAdded,
        linesDeleted,
        churnRatio,
        modifiedFiles,
        totalCommits,
        contributorCount: authors.size,
        hoursSinceLastCommit,
        hasConflicts: conflictFiles.length > 0,
        conflictFiles,
        behindUpstream,
        aheadUpstream
    };
}