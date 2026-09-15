import os from 'node:os';
import { execSync } from 'node:child_process';

function getBatteryLevel() {
    try {
        if (process.platform === 'darwin') {
            const out = execSync('pmset -g batt', { stdio: ['pipe', 'pipe', 'ignore'], encoding: 'utf-8' });
            const match = out.match(/(\d+)%/);
            return match ? parseInt(match[1], 10) : null;
        }
    } catch {
        return null;
    }
    return null;
}

export function getSystemTelemetry() {
    const total = os.totalmem();
    const free = os.freemem();
    const memPercent = Math.round(((total - free) / total) * 100);
    const now = new Date();
    const batteryLevel = getBatteryLevel();

    return {
        memPercent,
        loadAvg: +os.loadavg()[0].toFixed(2),
        cpuCores: os.cpus().length,
        uptimeHours: +(os.uptime() / 3600).toFixed(1),
        batteryLevel,
        isLowBattery: batteryLevel !== null && batteryLevel <= 15,
        isFridayAfternoon: now.getDay() === 5 && now.getHours() >= 14,
        isMemoryChoked: memPercent >= 85
    };
}