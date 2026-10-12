#!/bin/bash
# usage: shot.sh <html-file-abs-path> <out.png> [width=1440] [height=2400] [query e.g. theme=dark]
# 스크린샷. 병렬 실행 안전. macOS(로컬)와 Linux(클라우드) 모두 지원.
# - query 에 theme= 가 없으면 theme=light 를 붙인다(시스템 다크 설정을 따라가는 문제 방지).
# - 엔진 선택:
#   1) playwright(또는 playwright-core)를 node 가 찾을 수 있으면 shot.cjs 로 실제 뷰포트 폭 그대로 찍는다(권장, 클라우드 기본).
#      클라우드 준비: (cd docs/design-v2 && npm i --no-save playwright@1.49.1 && npx playwright install --with-deps chromium)
#   2) 없으면 macOS Chrome headless CLI. 단 폭 < 500 은 최소 창 폭 때문에 잘려 보일 수 있다.
# - 트랜지션이 0프레임에 멈춘 채 찍힐 수 있으니 열린 오버레이 상태는 실제 브라우저로 다시 확인할 것.
F="$1"; OUT="$2"; W="${3:-1440}"; H="${4:-2400}"; Q="${5:-}"
case "$Q" in *theme=*) ;; "") Q="theme=light" ;; *) Q="$Q&theme=light" ;; esac
URL="file://$F?$Q"
DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$(dirname "$OUT")"

if command -v node >/dev/null 2>&1; then
  timeout 120 node "$DIR/shot.cjs" "$URL" "$OUT" "$W" "$H" >/dev/null 2>&1
  [ -s "$OUT" ] && { echo "ok $OUT"; exit 0; }
fi

CHROME=""
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "$(command -v google-chrome 2>/dev/null)" "$(command -v chromium 2>/dev/null)" "$(command -v chromium-browser 2>/dev/null)"; do
  [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
done
if [ -z "$CHROME" ]; then echo "FAIL $OUT (playwright/chrome 없음 — 위 '클라우드 준비' 명령 실행)"; exit 1; fi
[ "$W" -lt 500 ] && echo "warn: 폭 $W 은 Chrome CLI 최소 창 폭보다 좁아 잘려 보일 수 있음 (playwright 권장)" >&2
PROF=$(mktemp -d)
timeout 90 "$CHROME" --headless=new --disable-gpu --no-sandbox \
  --hide-scrollbars --no-first-run --user-data-dir="$PROF" --virtual-time-budget=5000 \
  --window-size="$W,$H" --screenshot="$OUT" "$URL" >/dev/null 2>&1
rm -rf "$PROF"
[ -s "$OUT" ] && echo "ok $OUT" || echo "FAIL $OUT"
