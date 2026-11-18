import http from 'http';

const BASE = 'http://localhost:3002';

// Wait for server
async function waitForServer() {
  for (let i = 0; i < 20; i++) {
    try {
      await fetch(BASE);
      return true;
    } catch { await new Promise(r => setTimeout(r, 1000)); }
  }
  return false;
}

async function main() {
  console.log('Waiting for server...');
  const ok = await waitForServer();
  if (!ok) { console.error('Server not available'); process.exit(1); }
  console.log('Server ready. Opening sample pages...');

  // Open pages in browser with pre-filled data via URL
  const { exec } = await import('child_process');
  
  const pages = [
    '/tools/resume-builder',
    '/tools/receipt-generator', 
    '/tools/business-card-generator'
  ];

  for (const p of pages) {
    exec(`start ${BASE}${p}`);
  }

  console.log('\nOpened all 3 tools in browser.');
  console.log('The tools need manual interaction to export - they are client-side Canvas/Print tools.');
  console.log('\nTo export: Fill the form → Click "Download PDF" or "Download PNG"');
}

main();
