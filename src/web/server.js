import http from 'node:http';
import { exec } from 'node:child_process';
import { getDashboardHtml } from './template.js';

export function startDashboard(reportData, port = 4321) {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(getDashboardHtml(reportData));
    });

    server.listen(port, () => {
        const url = `http://localhost:${port}`;
        console.log(`\n  ⚡ Local Radar Dashboard active at: ${url}`);

        // Auto-open browser across OS
        const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${openCmd} ${url}`, { stdio: 'ignore' });
    });
}