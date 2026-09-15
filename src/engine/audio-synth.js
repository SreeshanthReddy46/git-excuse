import { exec } from 'node:child_process';

export function speakExcuse(text) {
    const sanitized = text.replace(/["`$\\]/g, '');
    const platform = process.platform;

    let cmd = '';
    if (platform === 'darwin') {
        // macOS: Use Siri/Fred deadpan voice
        cmd = `say -v "Fred" "${sanitized}" || say "${sanitized}"`;
    } else if (platform === 'win32') {
        // Windows: Use PowerShell SAPI voice
        cmd = `powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${sanitized}')"`;
    } else if (platform === 'linux') {
        // Linux: Use espeak or spd-say if available
        cmd = `spd-say "${sanitized}" || espeak "${sanitized}"`;
    }

    if (cmd) {
        exec(cmd, { stdio: 'ignore' });
    }
}