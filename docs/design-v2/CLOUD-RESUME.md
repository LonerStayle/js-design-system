# 웹 v2 클라우드 재개 가이드 (Claude Code on the web)

> ✅ 2026-10-24 로컬에서 30/30 완성 — 이 문서는 더 이상 필요 없음(기록용).

2026-10-13 기준 웹 v2는 30개 중 24개 완성(01–23, 30). 남은 6개를 클라우드 세션에서 마무리한다.
현황은 `docs/design-v2/STATUS.md`, 규칙은 `docs/design-v2/BRIEF.md`(3·7절 필독).

## 남은 작업 (`docs/design-v2/resume-args.json`)

| 테마 | 남은 단계 |
|---|---|
| 24 gothic-dark-academia | index.html만 → 리뷰·수정 |
| 25 maximalist-colorblock | DIRECTION 있음 → 시스템부터 |
| 26 gradient-mesh-modern | DIRECTION 있음 → 시스템부터 |
| 27 scifi-hud | 처음부터 |
| 28 newsprint | 처음부터 |
| 29 organic-warm-earth | 처음부터 |

완성된 01–23·30 폴더와 `mobile-design-systems*/`(Codex 담당)는 절대 수정하지 않는다.

## 클라우드 환경 준비 (세션 시작 직후 1회)

```bash
# 1) 스크린샷 엔진 (shot.sh 가 자동 사용)
(cd docs/design-v2 && npm i --no-save playwright@1.49.1 && npx playwright install --with-deps chromium)
bash docs/design-v2/shot.sh "$PWD/design-systems-v2/theme-01-neo-brutalism/index.html" /tmp/v2shots/_t.png 390 900 && echo 스크린샷OK

# 2) ui-ux-pro-max 검색 엔진 (MIT, 공개 저장소) — 레포에 넣지 말고 /tmp 에 받는다
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill /tmp/uiux
export UIUX_PY=$(find /tmp/uiux -path '*ui-ux-pro-max/scripts/search.py' | head -1)
python3 "$UIUX_PY" "neubrutalism" --domain style -n 1 | head -3
```

- 구글 폰트(fonts.googleapis.com)가 막혀 있으면 스크린샷의 한글이 fallback으로 보인다. 그 경우 폰트 판정은 건너뛰고 레이아웃·색만 검증하며, 보고에 그 사실을 남긴다.
- ui-ux-pro-max 저장소를 받을 수 없으면 27–29 DIRECTION은 브리프와 v1 감사 메모(`docs/fable-upgrade/briefs/`)만으로 작성하고, "데이터 매치 없음"을 DIRECTION.md에 명시한다.

## 실행

Workflow 도구를 쓸 수 있으면:
- script = `docs/design-v2/workflow-rollout.js` 파일 내용
- args = `docs/design-v2/resume-args.json` 내용에 `"root": "<레포 절대경로>"`, `"shotDir": "/tmp/v2shots"`를 추가
- 프롬프트 안의 `UIUX_PY`는 위에서 export 한 값으로 쓰도록 에이전트들에게 전달된다(BRIEF 1절).

Workflow 도구가 없으면 테마마다 직접 순서대로 진행: Direction → System → Scenes(index + pages 9) → 스크린샷 비평/QA → 수정(최대 2라운드). 각 단계 지시는 `workflow-rollout.js`의 해당 프롬프트를 그대로 따른다.

## 끝나면

- `STATUS.md`에 테마별 점수(비평/QA)와 완료를 기록.
- `design-systems-v2/`, `docs/design-v2/`만 스테이징해서 커밋하고 브랜치로 push.
- 모바일(Android/Flutter)은 착수하지 않는다(Codex 담당).

## 클라우드 시작 프롬프트

```
docs/design-v2/CLOUD-RESUME.md 를 읽고 그대로 진행해. 웹 디자인시스템 v2의 남은 6개 테마(24–29)를 끝까지 마무리하는 작업이야. 완성된 테마와 mobile 폴더는 건드리지 말고, 끝나면 STATUS.md 갱신 후 커밋·push 해줘. 보고는 한국어로.
```
