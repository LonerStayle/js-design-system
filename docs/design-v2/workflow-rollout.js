export const meta = {
  name: 'design-v2-rollout-6',
  description: '디자인시스템 v2 — 한도 중단 후 남은 단계부터 재개 (10~14·16~29)',
  phases: [
    { title: 'Direction', detail: 'ui-ux-pro-max 근거 → DIRECTION.md' },
    { title: 'System', detail: '토큰·컴포넌트 32·app.js·COMPONENTS.md' },
    { title: 'Scenes', detail: 'index + 페이지 9개' },
    { title: 'Review', detail: '아트디렉션 비평 + QA' },
    { title: 'Fix', detail: 'must_fix 반영, 최대 2라운드' },
  ],
}

const ROOT = args.root || '/Users/seobi/jinsup_ralph_mobile/js_design_system'
const SHOTS = args.shotDir || '/private/tmp/claude-501/v2shots'
const BRIEF = `${ROOT}/docs/design-v2/BRIEF.md`
const THEMES = args.themes
const LANES = args.lanes || 4

const COMMON = (t) => `작업 대상 테마: ${t.id}
- 공통 브리프(반드시 먼저 끝까지 읽기, 특히 7절 파일럿 교훈): ${BRIEF}
- 이 테마의 index 원형(배정됨, 반드시 따를 것): ${t.archetype}
- v2 출력 폴더: ${ROOT}/design-systems-v2/${t.id}/
- v1(반면교사, 복사 금지): ${ROOT}/design-systems/${t.id}/
- v1 테마 DNA 감사 메모(참고): ${ROOT}/docs/fable-upgrade/briefs/${t.id}.md
- 스크린샷 저장: ${SHOTS}/${t.id}/
- 다른 테마 폴더(design-systems-v2/의 다른 theme-*)와 mobile-design-systems-v2/ 는 절대 수정하지 말 것(다른 작업자가 사용 중).
${t.note ? '- 특이사항: ' + t.note + '\n' : ''}모든 사용자 노출 텍스트는 한국어. 최종 응답은 사람용 설명이 아니라 요청된 데이터만.`

const PAGE_GROUPS = [
  ['dashboard', 'inbox', 'kanban'],
  ['product', 'pricing', 'onboarding'],
  ['profile', 'settings', '404'],
]

const DIR_SCHEMA = {
  type: 'object',
  properties: { client: { type: 'string' }, signature: { type: 'string' }, layout_grammar: { type: 'string' }, fonts: { type: 'string' } },
  required: ['client', 'signature', 'layout_grammar', 'fonts'],
}
const DONE_SCHEMA = {
  type: 'object',
  properties: { files: { type: 'array', items: { type: 'string' } }, shared_issues: { type: 'array', items: { type: 'string' } } },
  required: ['files', 'shared_issues'],
}
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    score: { type: 'number' },
    verdict: { type: 'string' },
    must_fix: {
      type: 'array',
      items: { type: 'object', properties: { file: { type: 'string' }, issue: { type: 'string' }, fix: { type: 'string' } }, required: ['file', 'issue', 'fix'] },
    },
  },
  required: ['score', 'verdict', 'must_fix'],
}

const direction = (t) => agent(`${COMMON(t)}

[1단계 · 아트 디렉션]
1) v1 index.html과 pages/dashboard.html을 스크린샷(1440, 390폭)으로 찍어 직접 보고, 브리프 3절 기준으로 v1의 AI티를 진단하라.
2) ui-ux-pro-max search.py로 근거 수집: 이 테마 스타일의 --domain style 행, --design-system (적절한 다이얼), --domain color / typography / google-fonts / landing 최소 각 1회. 필요하면 ux·chart·gsap.
3) ${ROOT}/design-systems-v2/${t.id}/DIRECTION.md 작성:
   - 클라이언트·세계관(이 스타일이 진짜 어울리는 한국 서비스/브랜드 하나, 스타일의 원래 맥락), 감정 톤 한 문장
   - ## 팩트 시트 (브리프 7-3: 기준 날짜·요일 정확히, 주소, 시간, 인물, ID 체계, 가격, 수치)
   - ui-ux-pro-max 근거: 채택/기각 항목과 이유
   - 팔레트: light/dark 각각 hex, 대비 확인 결과 (다크는 그 세계의 밤 장면)
   - 타이포: 라틴+한글 디스플레이/본문/모노 (Google Fonts), 스케일
   - 레이아웃 문법: 이 테마만의 그리드·정렬·여백 규칙
   - 시그니처 1~2개와 컴포넌트 전반 적용 방식
   - 모션 문법
   - 32개 컴포넌트 처리 원칙
   - index.html 구성안: 배정된 index 원형을 따라 섹션별 구도를 다르게
   - 9개 페이지 장면 시나리오 각 1~2줄
   - v1에서 버릴 것
구체적인 값(hex, px, 폰트명)으로 쓴다.`, { label: `direction:${t.id}`, phase: 'Direction', schema: DIR_SCHEMA })

const system = (t) => agent(`${COMMON(t)}

[2단계 · 시스템 구축]
${ROOT}/design-systems-v2/${t.id}/DIRECTION.md 를 읽고 그대로 구현하라:
styles.css, tokens.css, semantic.css(light/dark), base.css, components/*.css (브리프의 32개 전부), app.js (브리프 2절 필수 동작 전부).
- 컴포넌트는 DIRECTION의 시그니처를 일관 적용. 모든 상태(hover/focus-visible/active/disabled/loading/error/selected) 포함.
- 검증용 임시 HTML을 스크린샷 폴더에 만들어 주요 컴포넌트를 light/dark로 찍어 직접 확인하고 다듬어라(레포에 남기지 말 것).
- index.html과 pages/는 만들지 마라. 대신 ${ROOT}/design-systems-v2/${t.id}/COMPONENTS.md 에 각 컴포넌트 마크업 사용법과 **복사해서 쓰는 공통 셸 스니펫(navbar/footer/사이드바, index·pages 경로 각각)** 을 적어라(브리프 7-4).`, { label: `system:${t.id}`, phase: 'System', schema: DONE_SCHEMA })

const indexScene = (t) => agent(`${COMMON(t)}

[3단계 · index.html]
DIRECTION.md, COMPONENTS.md, 기존 CSS를 읽고 index.html(+ index.css)을 만들어라.
- 배정된 index 원형 그대로. 랜딩 공식 금지(브리프 3절), 브리프 7-1·7-2·7-7 준수.
- 토큰과 32개 컴포넌트 전부를 클라이언트 세계의 실제 데이터(팩트 시트)로 시연. 진열대식 카드 갤러리 금지.
- 상단 내비에서 9개 pages/*.html 로 링크.
- tokens/semantic/base/components/app.js 는 수정하지 말고, 문제는 shared_issues 로 보고.
- 1440·390 × light/dark 스크린샷으로 직접 보고 다듬어라.`, { label: `index:${t.id}`, phase: 'Scenes', schema: DONE_SCHEMA })

const pageScene = (t, group) => agent(`${COMMON(t)}

[3단계 · 페이지: ${group.join(', ')}]
DIRECTION.md, COMPONENTS.md, 기존 CSS를 읽고 pages/${group.map(p => p + '.html').join(', pages/')} 를 만들어라(페이지 전용 레이아웃은 pages/<name>.css).
- DIRECTION의 장면 시나리오대로, 클라이언트 서비스의 실제 화면. 페이지마다 구도가 달라야 한다. 데이터는 팩트 시트 값만.
- 공통 셸은 COMPONENTS.md 스니펫을 그대로 복사.
- 다른 에이전트가 동시에 다른 페이지를 만들고 있다. 공유 파일(tokens/semantic/base/components/app.js/index.*)은 수정 금지, 문제는 shared_issues 로 보고.
- 각 페이지 1440·390 × light/dark 스크린샷으로 직접 보고 다듬어라.`, { label: `pages:${t.id}:${group[0]}`, phase: 'Scenes', schema: DONE_SCHEMA })

const critic = (t, round) => agent(`${COMMON(t)}

[리뷰 ${round} · 아트 디렉터 비평]
너는 까다로운 시니어 아트 디렉터다. ${ROOT}/design-systems-v2/${t.id}/ 의 index.html과 pages 9개를 1440·390 × light/dark 로 스크린샷 찍어 전부 직접 보라.
판정 기준: (1) 브리프 3절 AI티 잔존 (2) 이 스타일 장르의 전문 디자이너 작업처럼 보이는가 — 테마 정체성과 감정 톤이 첫 화면에서 즉시 읽히는가 (3) 배정된 index 원형을 따랐는가, 01·30의 문법(왼쪽 목차 사이드바 문서, 판권 정의 목록, § 섹션)을 흉내 내지 않았는가 (4) DIRECTION.md 충실도와 팩트 시트 일관성(페이지 간 날짜·요일·주소·인물·수치 불일치, 플레이스홀더) (5) 페이지 간 구도 변주 (6) 미감: 위계, 여백, 정렬, 타이포 디테일, 다크 모드 설계.
score 10점 만점(8 이상 = 포트폴리오급). must_fix 는 영향 큰 순으로 최대 12개, 파일·문제·구체적 수정 방법.`, { label: `critic${round}:${t.id}`, phase: 'Review', schema: REVIEW_SCHEMA, effort: 'high' })

const qa = (t, round) => agent(`${COMMON(t)}

[리뷰 ${round} · 프로덕션 QA]
${ROOT}/design-systems-v2/${t.id}/ 를 검사하라. 브리프 2·5·7절 계약 위반을 찾는다:
- 스크린샷(1440·390 × light/dark): 깨진 레이아웃, 360/390px 가로 스크롤(scrollWidth 판정)/잘림/겹침, 다크모드에서 안 보이는 요소, 폰트 미적용, 빈 영역.
- grep: SVG presentation attr의 var(), lang="ko" 누락, href="#", onclick=, 인라인 grid-template-columns, 컴포넌트 CSS raw hex, 미정의 var 참조, 32개 컴포넌트 파일, 9개 페이지 존재 및 상호 링크, 플레이스홀더/영문 잔재, 공통 셸 불일치.
- app.js: ?theme= 쿼리, 토글, Esc 닫기, 포커스 트랩.
score는 프로덕션 준비도 10점 만점. must_fix 는 실제 결함만.`, { label: `qa${round}:${t.id}`, phase: 'Review', schema: REVIEW_SCHEMA })

const fix = (t, round, items, shared) => agent(`${COMMON(t)}

[수정 ${round}]
아래 리뷰 must_fix 와 이전 단계 shared_issues 를 전부 반영하라. 이 테마 폴더 안의 어떤 파일이든 수정 가능. DIRECTION.md 방향은 유지하되 비평이 방향 자체를 문제 삼으면 DIRECTION.md 도 갱신. 수정 후 해당 화면을 다시 스크린샷으로 확인하라.

must_fix:
${JSON.stringify(items, null, 1)}

shared_issues:
${JSON.stringify(shared, null, 1)}`, { label: `fix${round}:${t.id}`, phase: 'Fix', schema: DONE_SCHEMA })

async function runTheme(t) {
  let shared = []
  let client = null
  let startRound = t.mode === 'review2' ? 2 : 1
  if (t.mode === 'finalfix') {
    const f = await agent(`${COMMON(t)}

[최종 수정 (2라운드)]
2차 리뷰(아트 디렉터 + QA)의 must_fix 목록이 JSON 파일 ${t.fixFile} 에 있다. 읽고 전부 반영하라. 이전 수정 에이전트가 중간까지 반영했을 수 있으니 현재 파일 상태를 확인하고 남은 것만 고쳐라. 이 테마 폴더 안의 어떤 파일이든 수정 가능. 수정 후 해당 화면을 다시 스크린샷으로 확인하라.`, { label: `fix2:${t.id}`, phase: 'Fix', schema: DONE_SCHEMA })
    if (!f) { log(`${t.id}: 최종 수정 실패`); return { theme: t.id, failed: 'fix2' } }
    log(`✅ ${t.id} 완료`)
    return { theme: t.id, final: true }
  }
  if (t.mode === 'fix') {
    const f = await agent(`${COMMON(t)}

[수정 1]
1차 리뷰(아트 디렉터 + QA)의 must_fix 목록이 JSON 파일 ${t.fixFile} 에 있다. 읽고 전부 반영하라. 이전 수정 에이전트가 중간까지 반영했을 수 있으니 현재 파일 상태를 확인하고 남은 것만 고쳐라. 이 테마 폴더 안의 어떤 파일이든 수정 가능. 수정 후 해당 화면을 다시 스크린샷으로 확인하라.`, { label: `fix1:${t.id}`, phase: 'Fix', schema: DONE_SCHEMA })
    if (!f) { log(`${t.id}: 수정1 실패`); return { theme: t.id, failed: 'fix1' } }
    startRound = 2
  }
  if (t.mode === 'full' || t.mode === 'from-system' || t.mode === 'from-scenes') {
    if (t.mode === 'full') {
      const dir = await direction(t)
      if (!dir) { log(`${t.id}: direction 실패`); return { theme: t.id, failed: 'direction' } }
      client = dir.client
    }
    const sys = t.mode === 'from-scenes' ? { shared_issues: [] } : await system(t)
    if (!sys) { log(`${t.id}: system 실패`); return { theme: t.id, failed: 'system' } }
    const sceneJobs = [
      ...(t.skipIndex ? [] : [() => indexScene(t)]),
      ...PAGE_GROUPS.filter(g => !t.groups || t.groups.includes(g[0])).map(g => () => pageScene(t, g)),
    ]
    const scenes = await parallel(sceneJobs)
    if (scenes.filter(Boolean).length < sceneJobs.length) { log(`${t.id}: 장면 일부 실패`); return { theme: t.id, failed: 'scenes' } }
    shared = [...(sys.shared_issues || []), ...scenes.flatMap(s => s.shared_issues || [])]
  }
  const rounds = []
  for (let round = startRound; round <= 2; round++) {
    const [c, q] = await parallel([() => critic(t, round), () => qa(t, round)])
    if (!c || !q) { log(`${t.id}: 리뷰${round} 실패`); return { theme: t.id, client, rounds, failed: `review${round}` } }
    rounds.push({ round, critic: c.score, qa: q.score, verdict: c.verdict })
    const items = [...(c.must_fix || []), ...(q.must_fix || [])]
    log(`${t.id} 리뷰${round}: 비평 ${c.score} / QA ${q.score}, must_fix ${items.length}`)
    if (c.score >= 8 && (q.must_fix || []).length === 0 && shared.length === 0) break
    const f = await fix(t, round, items, shared)
    if (!f) { log(`${t.id}: 수정${round} 실패`); return { theme: t.id, client, rounds, failed: `fix${round}` } }
    shared = []
  }
  log(`✅ ${t.id} 완료`)
  return { theme: t.id, client, rounds }
}

const queue = THEMES.slice()
const done = []
await parallel(Array.from({ length: LANES }, () => async () => {
  while (queue.length) {
    const t = queue.shift()
    done.push(await runTheme(t))
  }
}))
return done