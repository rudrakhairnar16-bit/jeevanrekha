const https = require('https');

const BASE_URL = 'https://jeevanrekha-delta.vercel.app';
const routes = [
  '/',
  '/prototype',
  '/demo',
  '/demo?autoplay=1&clean=1',
  '/demo?mode=full',
  '/demo?mode=full&autoplay=1&clean=1',
  '/beastmode',
  '/architecture',
  '/status',
  '/story',
  '/walkthrough'
];

function fetchRoute(path) {
  return new Promise((resolve) => {
    const url = BASE_URL + path;
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          headers: res.headers,
          hasBeastMode: data.includes('Beast Mode') || data.includes('beastmode') || data.includes('JeevanRekha'),
          hasDemo: data.includes('Evidence-First Jury Demonstration') || data.includes('Evidence Demo') || data.includes('JeevanRekha Demo'),
          bodySnippet: data.slice(0, 300)
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path, status: 0, error: err.message });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ path, status: 408, error: 'Timeout' });
    });
  });
}

async function main() {
  console.log('Testing production routes on:', BASE_URL);
  const results = [];
  for (const r of routes) {
    const res = await fetchRoute(r);
    results.push(res);
    console.log(`[${res.status}] ${r}`);
  }
  const all200 = results.every(r => r.status === 200);
  console.log('All routes returned 200:', all200);
  return all200;
}

main();
