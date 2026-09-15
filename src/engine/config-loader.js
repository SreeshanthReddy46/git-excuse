import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * Loads project-level or global user presets for custom jargon,
 * team inside jokes, and custom personas.
 */
export function loadUserConfig() {
    const localConfigPath = path.join(process.cwd(), '.gitexcuserc.json');
    const globalConfigPath = path.join(os.homedir(), '.gitexcuserc.json');

    let config = {
        customJargon: [],
        customExcuses: [],
        blockedPhrases: [],
        teamName: null,
        preferredPersona: null
    };

    const targetPath = fs.existsSync(localConfigPath)
        ? localConfigPath
        : (fs.existsSync(globalConfigPath) ? globalConfigPath : null);

    if (targetPath) {
        try {
            const raw = fs.readFileSync(targetPath, 'utf-8');
            const parsed = JSON.parse(raw);
            config = { ...config, ...parsed };
        } catch {
            // Graceful fallback if JSON is malformed
        }
    }

    return config;
}

/**
 * Initializes a starter .gitexcuserc.json in the current working directory
 */
export function initConfigFile() {
    const targetPath = path.join(process.cwd(), '.gitexcuserc.json');
    if (fs.existsSync(targetPath)) {
        return { success: false, message: 'Configuration file .gitexcuserc.json already exists.' };
    }

    const sampleConfig = {
        teamName: "Core Platform Team",
        preferredPersona: "architect",
        customJargon: [
            "waiting on Bazel cache synchronization",
            "gRPC contract negotiation latency",
            "K8s ingress pod eviction",
            "flaky integration fixtures in staging cluster"
        ],
        customExcuses: [
            "Our sprint velocity is constrained by cross-functional alignment overhead with SecOps."
        ]
    };

    fs.writeFileSync(targetPath, JSON.stringify(sampleConfig, null, 2), 'utf-8');
    return { success: true, message: 'Created .gitexcuserc.json with default company presets.' };
}