// shot.sh 보조: playwright 로 실제 뷰포트 폭 그대로 찍는다.
// node shot.cjs <url> <out.png> <width> <height>
// playwright 탐색 순서: PLAYWRIGHT_CORE 환경변수 → playwright → playwright-core (이 폴더 node_modules 포함)
// 브라우저: playwright 번들 chromium(클라우드) → 없으면 macOS Chrome
const fs = require('fs');
const path = require('path');
const [url, out, w, h] = process.argv.slice(2);

function loadPw() {
  const cands = [process.env.PLAYWRIGHT_CORE, 'playwright', 'playwright-core'].filter(Boolean);
  for (const c of cands) {
    try { return require(require.resolve(c, { paths: [__dirname, process.cwd()] })); } catch (e) {}
  }
  throw new Error('playwright not found');
}

(async () => {
  const { chromium } = loadPw();
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    if (!fs.existsSync(mac)) throw e;
    browser = await chromium.launch({ executablePath: mac });
  }
  const theme = /[?&]theme=dark/.test(url) ? 'dark' : 'light';
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, colorScheme: theme });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800); // 트랜지션이 끝난 뒤 찍는다
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
