export function generateSlackBlockKit(excuseData, forensics, telemetry) {
    const blocks = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: '⚡ Daily Standup Briefing',
                    emoji: true
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `> *Status Update:*\n> "${excuseData.standup}"`
                }
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `*Branch:* \`${forensics.branch || 'N/A'}\` | *Diff:* \`+${forensics.linesAdded}/-${forensics.linesDeleted}\` | *Memory Saturation:* \`${telemetry.memPercent}%\``
                    }
                ]
            }
        ]
    };

    return JSON.stringify(blocks, null, 2);
}