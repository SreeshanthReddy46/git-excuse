import os from 'node:os';

export function getSystemTelemetry() {
    const totalBytes = os.totalmem();
    const freeBytes = os.freemem();
    const usedBytes = totalBytes - freeBytes;

    const totalMemGB = +(totalBytes / (1024 ** 3)).toFixed(2);
    const freeMemGB = +(freeBytes / (1024 ** 3)).toFixed(2);
    const memUsagePercent = Math.round((usedBytes / totalBytes) * 100);

    const loadAvg = os.loadavg()[0]; // 1-minute load average
    const cpus = os.cpus();
    const cpuCoreCount = cpus.length;
    const cpuModel = cpus[0]?.model || 'Standard CPU';

    const uptimeHours = +(os.uptime() / 3600).toFixed(1);

    // Time & Day constraints
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 5 = Fri
    const hour = now.getHours();

    return {
        totalMemGB,
        freeMemGB,
        memUsagePercent,
        loadAvg: +loadAvg.toFixed(2),
        cpuCoreCount,
        cpuModel,
        uptimeHours,
        isFridayAfternoon: day === 5 && hour >= 14,
        isMidnightBurn: hour >= 0 && hour < 5,
        isMemoryChoked: memUsagePercent >= 88,
        isCpuSaturated: loadAvg > cpuCoreCount * 0.9
    };
}