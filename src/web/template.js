export function getDashboardHtml(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>⚡ git-excuse // Forensic Radar</title>
  <style>
    :root { --bg: #090a0f; --card: #12151f; --border: #222738; --text: #e2e8f0; --accent: #d946ef; --cyan: #06b6d4; }
    body { margin: 0; padding: 40px; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
    .container { max-width: 900px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
    h1 { margin: 0; font-size: 24px; color: var(--accent); }
    .badges { display: flex; gap: 10px; margin: 25px 0; }
    .badge { background: var(--card); border: 1px solid var(--border); padding: 6px 14px; border-radius: 20px; font-size: 13px; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 25px; margin-bottom: 20px; }
    .quote { font-size: 20px; line-height: 1.6; color: var(--cyan); font-style: italic; margin-bottom: 20px; }
    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
    .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .val { font-size: 14px; margin-top: 5px; }
    button { background: var(--accent); color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>⚡ git-excuse Radar Dashboard</h1>
      <button onclick="navigator.clipboard.writeText(document.getElementById('standup').innerText); alert('Copied to clipboard!')">Copy Standup Quote</button>
    </header>

    <div class="badges">
      <div class="badge">Branch: <b>${data.forensics.branch}</b></div>
      <div class="badge">Diff: <b style="color:#22c55e">+${data.forensics.linesAdded}</b> / <b style="color:#ef4444">-${data.forensics.linesDeleted}</b></div>
      <div class="badge">RAM Saturation: <b>${data.telemetry.memPercent}%</b></div>
      <div class="badge">Lockfile: <b>${data.drift.hasDrift ? 'DRIFT DETECTED' : 'SYNCED'}</b></div>
    </div>

    <div class="card">
      <div class="label">Synthesized Standup Briefing</div>
      <div class="quote" id="standup">"${data.excuse.standup}"</div>
      
      <div class="meta">
        <div>
          <div class="label">Forensic Reality</div>
          <div class="val" style="color: #f87171">${data.excuse.reality}</div>
        </div>
        <div>
          <div class="label">Actionable Remedy</div>
          <div class="val" style="color: #4ade80">${data.excuse.remediation}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}