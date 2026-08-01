const fs = require('fs');
const { chromium } = require('playwright');

async function generate() {
    const csvContent = fs.readFileSync('Import_AgentQ.csv', 'utf-8');
    const rows = csvContent.split('\n').filter(row => row.trim().length > 0);
    
    // Parse CSV handling quotes
    const parsedRows = rows.map(row => {
        const result = [];
        let inQuotes = false;
        let currentString = '';
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(currentString);
                currentString = '';
            } else {
                currentString += char;
            }
        }
        result.push(currentString);
        return result;
    });

    const headers = parsedRows[0];
    const data = parsedRows.slice(1);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; background-color: #f8f9fa; }
            .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; }
            h2 { color: #333; margin-top: 0; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background-color: #4f46e5; color: white; font-weight: 600; }
            tr:nth-child(even) { background-color: #f9fafb; }
            tr:hover { background-color: #f3f4f6; }
        </style>
    </head>
    <body>
        <div class="container" id="table-container">
            <h2>AgentQ Test Cases Import Data</h2>
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${data.map(row => `<tr>${row.map(cell => `<td>${cell.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </div>
    </body>
    </html>
    `;

    fs.writeFileSync('temp_table.html', htmlContent);

    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto('file://' + __dirname + '/temp_table.html');
    
    // Auto-resize viewport to fit the table
    const tableElement = await page.$('#table-container');
    const boundingBox = await tableElement.boundingBox();
    await page.setViewportSize({ width: Math.ceil(boundingBox.width + 40), height: Math.ceil(boundingBox.height + 40) });
    
    await tableElement.screenshot({ path: 'report-assets/import_agentq.png' });
    await browser.close();
    fs.unlinkSync('temp_table.html');
    console.log('Screenshot saved to report-assets/import_agentq.png');
}

generate().catch(console.error);
