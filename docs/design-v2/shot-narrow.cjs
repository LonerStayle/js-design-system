// shot.sh 보조: 좁은 폭(<500)에서 실제 뷰포트 폭으로 찍는다 (headless Chrome 최소 창 폭 회피).
// node shot-narrow.cjs <url> <out.png> <width> <height> <playwright-core 경로>
const [url, out, w, h, pw] = process.argv.slice(2);
const { chromium } = require(pw);
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  const theme = /[?&]theme=dark/.test(url) ? 'dark' : 'light';
  const p = await b.newPage({ viewport: { width: +w, height: +h }, colorScheme: theme });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800); // 트랜지션이 끝난 뒤 찍는다
  await p.screenshot({ path: out });
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
