# DIRECTION — theme-07 사이버펑크 터미널 (v2)

> 이 문서가 theme-07 v2의 유일한 기준이다. 이후 단계(토큰·컴포넌트·index·pages)는 여기 적힌 값만 쓴다.
> v1(`design-systems/theme-07-cyberpunk-terminal/`)은 반면교사일 뿐이며 코드·문구·구도를 가져오지 않는다.
> 배정된 index 원형: **터미널 세션 + man page** — 프롬프트, 명령 출력, ASCII 표, 로그 스트림으로 이어지는 한 개의 셸 세션.

---

## 0. v1 진단 — 스크린샷으로 확인한 AI티 (1440 / 390, 2026-10-10 촬영 · 2026-10-11 재촬영 재확인)

촬영본: `/private/tmp/claude-501/v2shots/theme-07-cyberpunk-terminal/v1-*.png`, 재확인본 `v1r-*.png`(index 1440 다크·라이트 / 390 다크, dashboard 1440 다크 / 390 라이트).
390 샷은 playwright-core 실제 뷰포트(`shot-narrow.cjs`)로 찍은 것만 판정에 쓴다 — headless Chrome 폴백 샷은 최소 창 폭 때문에 오른쪽이 잘려 거짓 넘침으로 보인다(재촬영 때 실제로 겪음). 재확인 결과 아래 13개 증상은 그대로였다.

| # | 증상 (어디서 보였나) | 브리프 3절 해당 항목 |
|---|---|---|
| 1 | index 첫 화면 = `// GRID-07 :: 디자인 시스템 콘솔 · 신호 수신됨` eyebrow → 2줄 거대 헤드라인 `CYBERPUNK / TERMINAL`(둘째 줄만 마젠타) → 부연 문단 → CTA 2개(`컴포넌트 스캔` / `프로세스 목록`) + `⌘K 콘솔` → 오른쪽에 `BOOT.SH` 창. 0절 랜딩 공식 그대로이고 터미널은 오른쪽 장식 창에만 갇혀 있다 | 구조: 랜딩 공식 |
| 2 | "네온 시안과 마젠타, 전면 모노스페이스, 직각의 규율. 스캔라인 아래 모든 컴포넌트가 60Hz로 응답합니다" — 첫 화면 카피가 디자인 시스템 자기소개 | 카피: 시스템 자기 홍보 |
| 3 | 섹션 헤더 `01// 토큰`, `02// 컴포넌트` + 우측 배경의 거대 고스트 숫자 `01` `02` + 우측 메타 `TOKENS.CSS · SEMANTIC.CSS` 반복 | 구조: 섹션 헤더 반복, 의미 없는 장식 |
| 4 | 색 램프 5줄 × 10칸 스와치 띠, 이어서 글로우/타입/간격 **같은 크기 카드 3개**, 컴포넌트는 `pane 0:0` `pane 0:1` 같은 카드에 하나씩 진열 | 구조: 균질 리듬, 카드 진열 갤러리 |
| 5 | 히어로 좌상단 시안·우상단 마젠타 radial 얼룩, 대시보드 배경도 radial 2개 | 시각: radial-gradient 얼룩 |
| 6 | 카드마다 맥 신호등 같은 ●●●(시안·앰버·마젠타) 창 크롬 + `BOOT.SH` `TRAFFIC.LIVE` 타이틀. 터미널이 아니라 "창 목업" 문법 | 구조: 창 목업 |
| 7 | 히어로 아래 상태 띠 `NODE SEOUL-2 · UPLINK 99.98% · LATENCY 42MS · PANES 13` — 통계 가로줄 변형. 대시보드도 KPI 5칸(1.24M / 99.98% / 0.12% / 42 / 14) | 구조: 통계 숫자 가로줄 |
| 8 | dashboard가 범용 SaaS 운영 화면(REQUESTS·UPTIME·ERROR RATE, `/api/v2/auth`). 누구의 서버인지 세계가 없다. 사이드바 `Dashboard/Analytics/Nodes/Logs/Billing`, `Last 24h`, `EXPORT` `NEW QUERY` 등 보이는 UI가 영어 | 카피·데이터: 세계 없는 필러, 한국어 아님 |
| 9 | 한글 라벨에 넓은 자간: "토 큰", "네 온 램 프", "입 력 필 드", "타 입 스 케 일"이 한 글자씩 떨어져 보임 | 7-5: 한글+모노+자간 |
| 10 | 라이트 모드 = 같은 레이아웃을 옅은 하늘색(#DDE7EC)에 깔고 글로우만 남긴 반전. 라이트 대시보드의 녹색 숫자에 text-shadow 번짐이 남아 흐릿함 | 7-6: 다크/라이트가 장면이 아님 |
| 11 | 390폭: index navbar 오른쪽 햄버거가 잘림, 상태 띠 잘림. dashboard 상단 탭 줄 `Dashboard · Analytics · Nodes`가 페이드 힌트 없이 잘리고 navbar 우측이 넘침 | 품질: 반응형, 7-9 |
| 12 | 1440 dashboard: REQUESTS 카드 안 차트가 아래로 처져 빈 면이 크고, SYSTEM.LOAD 아래 큰 공백. 우하단 고정 라벨 `TERM-07 // FEED LIVE · 60HZ`가 표 내용 위에 겹침 | 7-8: 벽보형 빈 칸, 겹침 |
| 13 | 서체: Share Tech Mono(디스플레이) + JetBrains Mono + 나눔고딕코딩, 사용처 0인 Noto Serif KR import. JetBrains(0.6em)와 한글(1em)이 섞여 열이 안 맞음 | 서재 관성 화석, 셀 정렬 붕괴 |

결론: v1은 터미널을 **장식 소품**(창 크롬, 부팅 로그, 글로우)으로 SaaS 랜딩 위에 얹었다. v2는 화면 자체가 **한 사람의 셸 세션**이다. 섹션은 명령이고, 컴포넌트는 그 명령의 출력이다.

---

## 1. 클라이언트와 세계관

### 세운 터미널 클럽 (워드마크 `SEWOON.SH`, 한글 표기 "세운 터미널")
- **무엇**: 서울 세운상가 가동 5층의 회원제 **야간 해커스페이스**. 오프라인으로는 납땜 벤치 8석·사물함 48칸·SDR 장비를 빌려주고, 온라인으로는 회원 전용 SSH 서버 `sewoon.sh`에서 워게임 64레벨과 격월 CTF **"야간수리반"** 을 연다. 직접 설계한 USB 시리얼 디버거 **SW-07**을 소량 생산해 판다. 회원은 웹사이트가 아니라 터미널로 들어온다 — 그래서 이 클럽의 모든 화면은 셸이다.
- **이름의 근거**: 세운상가는 1970–90년대 "미사일도 만들 수 있다"던 전자부품·수리 골목이자, 한국 PC 통신·해커 1세대가 부품을 사러 오던 곳이다. 지금도 3층 수리점 장인들과 메이커들이 섞여 있다. 사이버펑크의 "하이테크, 로우라이프"가 서울에서 가장 정확히 성립하는 장소.
- **고유 데이터 어휘**: 프롬프트 `d0kkaebi@sewoon:~$`, 호스트 `bench03.sewoon.sh`, 문제 ID `NR31-pwn-03`, 사물함 `L-512-07`, 벤치 `B-03`, uid `1047(d0kkaebi)`, 커밋 해시 7자리 `a3f9c21`, 점수 `500점`, 금액 `₩39,000`, 시각 `03:12:07`, 날짜 `10-24(토)`.

### 스타일의 원래 맥락 → 왜 이 클라이언트인가
사이버펑크 터미널의 시각 재료는 1980년대 **VT100/VT220 인광 CRT**(초록 P1·호박 P3 인광, 80열 × 24행, 커서 블록), 깁슨 『뉴로맨서』(1984)의 "콘솔 카우보이", 그리고 그 후손인 리눅스 콘솔 문화 — `man` 페이지, `tmux` 분할 창, `htop` 미터, `tail -f` 로그, ncurses 대화상자, ANSI 16색 — 에서 왔다. 이 재료가 장식이 아니라 **매일 쓰는 도구**인 곳이 해커스페이스다. v2는 "사이버펑크풍 SaaS"가 아니라 "새벽 세운상가에서 실제로 열려 있는 터미널 하나"를 화면으로 옮긴다.

### 감정 톤 (한 문장)
**새벽 3시, 불 꺼진 상가 복도 끝에 한 칸만 켜진 초록 인광 화면 — 깨어 있는 사람들끼리만 아는 은밀한 짜릿함과 긴장.**
첫 화면 1초 안에: 칠흑 같은 녹흑 배경, 화면을 가로지르는 거대한 인광 워드마크, 깜빡이는 블록 커서, 접속 중인 동료 5명의 tty. 차가운 사양서가 아니라 "누군가 지금 여기서 작업 중"인 온도.

---

## 팩트 시트

모든 장면 에이전트는 **이 값만** 쓴다. 여기 없는 고유명사·숫자가 필요하면 이 표의 체계를 따라 만든다(플레이스홀더 `○○`, `XXX` 금지).

### 기준 시각·달력 (2026년 실제 달력으로 검산 완료)
| 항목 | 값 |
|---|---|
| 세션 기준 시각 | **2026-10-10(토) 03:12:07 KST** — 금요일 야간 영업(10-09 19:00 개장) 마감 48분 전 |
| 마지막 로그인 | `Fri Oct 9 23:47:12 2026 from 121.134.88.20` (한국어 표기: 10-09(금) 23:47:12) |
| 이번 주 | ISO 41주차 = 10-05(월) ~ 10-11(일) |
| 공휴일 | 10-03(토) 개천절, 10-09(금) 한글날 — 한글날은 정상 영업(야간) |
| 정기 휴무 | 매주 월요일(서버 점검일): 10-05 · 10-12 · 10-19 · 10-26 |
| 야간수리반 #31 (CTF) | **10-24(토) 22:00 ~ 10-25(일) 10:00**, 12시간, 온라인 + 512호 현장 |
| #31 출제 마감 / 검수 마감 | 10-17(토) 23:59 / 10-21(수) 23:59 |
| 야간수리반 #30 (지난 회) | 08-29(토) 22:00 ~ 08-30(일) 10:00, 참가 87팀 |
| 오늘까지 남은 날 | #31 시작까지 14일(D-14), 출제 마감까지 7일 |
| 10월 달력 | 1일 = 목. 일요일 시작 표기(`cal` 한국어 로캘): 일 4·11·18·25 / 토 3·10·17·24·31 |

### 장소·시간·연락
| 항목 | 값 |
|---|---|
| 주소 | 서울 중구 청계천로 159, 세운상가 가동 5층 512호 (클럽 호실은 가상) |
| 영업(오프라인) | 화–금 19:00–04:00(익일) · 토 14:00–05:00(익일) · 일 14:00–24:00 · 월 휴무 |
| 서버 | `sewoon.sh` 24시간, 월요일 06:00–09:00 점검 |
| 접속 | `ssh d0kkaebi@sewoon.sh -p 2222` |
| 메일 | `ops@sewoon.sh` (운영), `nr@sewoon.sh` (야간수리반) |
| 가까운 역 | 을지로3가역 / 을지로4가역 |

### 인물 (핸들은 라틴 소문자, 화면엔 "이름(핸들)")
| 이름 | 핸들 / uid | 역할 |
|---|---|---|
| 문태성 | `moon` / 1001 | 클럽 운영자(방장), 서버·계정 관리, `wall` 방송 담당 |
| 한서린 | `seorin` / 1002 | 야간수리반 출제 총괄, 분야 pwn |
| 고은재 | `ej0` / 1009 | 하드웨어 랩장, SW-07 설계자 |
| 윤하진 | `hajin` / 1023 | 크립토 출제자 |
| **백도윤** | **`d0kkaebi` / 1047** | **현재 세션 사용자.** 상주 회원(2024-03 가입), 웹·리버싱, 시즌 랭킹 7위 · 8,450점, 사물함 L-512-07, 벤치 B-03 |
| 장미래 | `mirae` / 1413 | 오늘 가입 진행 중인 신규 회원 (onboarding 주인공) |
| 오필승 | `pilseung` / 외부 | 세운상가 다동 3층 "필승전자" 사장, 부품 납품 |

### ID 체계
| 대상 | 형식 | 예 |
|---|---|---|
| 회원 | uid 4자리 + 핸들 | `1047(d0kkaebi)` |
| 문제 | `NR<회차>-<분야>-<번호2>` (분야: pwn web rev crypto hw misc) | `NR31-pwn-03`, `NR31-hw-01` |
| 워게임 레벨 | `lv00`–`lv63` | `lv41` |
| 서버 | `bench01`–`bench08`, `ctf`, `git`, `mail` + `.sewoon.sh` | `bench03.sewoon.sh` |
| 사물함 / 벤치 | `L-512-01`–`L-512-48` / `B-01`–`B-08` | `L-512-07`, `B-03` |
| 운영 티켓 | `#SEW-` + 4자리 | `#SEW-2231` |
| 주문 | `ORD-YYMMDD-NNNN` | `ORD-261010-0042` |
| 커밋 | 7자리 16진수 | `a3f9c21` |
| tty | `pts/0`–`pts/9` | `pts/3` |

### 가격 (₩, 부가세 포함)
| 상품 | 월간 | 연간 |
|---|---|---|
| `guest` 게스트 1일권 | ₩9,000 / 1회 | — |
| `night` 야간 회원 (영업시간 출입 + 서버 + 워게임) | ₩39,000 | ₩390,000 (2개월분 할인) |
| `resident` 상주 회원 (24시간 출입 + 벤치 우선 + 사물함 1칸) | ₩79,000 | ₩790,000 |
| 세운 디버거 SW-07 (완제품) | ₩68,000 | — |
| SW-07 납땜 키트 (부품 + 기판) | ₩42,000 | — |
| 야간수리반 현장 참가비 | ₩15,000 / 팀(4인 이하), 온라인 무료 | — |

### 수치
| 항목 | 값 |
|---|---|
| 활성 회원 | 254명 (상주 36 · 야간 218), 이번 달 게스트 방문 163회 |
| 지금 접속 중 | 5명: `d0kkaebi`(pts/3) `seorin`(pts/1) `ej0`(pts/4) `hajin`(pts/6) `moon`(pts/0) |
| 벤치 | 8석 중 5석 사용 중 (오늘 밤 3석 남음) |
| 사물함 | 48칸 중 41칸 사용 |
| 서버 가동 | `sewoon.sh` up 41일 6시간, load average 0.42 0.38 0.35 |
| NR31 문제 | 18문제 (pwn 4 · web 5 · rev 4 · crypto 3 · hw 2), 현재 상태: 배포 준비 6 · 검수 5 · 출제 중 4 · 아이디어 3 |
| NR31 사전 등록 | 64팀 / 정원 120팀 |
| SW-07 재고 | 완제품 23개, 키트 11개, 누적 판매 418개 |
| d0kkaebi 해결 수 | 워게임 52/64, CTF 누적 37문제 |

### 벤치 좌석 ↔ 벤치 서버
납땜 벤치 `B-0n` 자리 옆에 서버 `bench0n` 이 놓여 있다(1:1). 화면에서 "자리"는 좌석 ID(`B-0n`), "서버"는 호스트명(`bench0n`)으로 쓴다.

| 좌석 / 서버 | 오늘 밤 (10-10 03:12) | 비고 |
|---|---|---|
| B-01 / bench01 | **빈 자리** | 유휴 |
| B-02 / bench02 | moon (pts/0) | `tail -f auth.log` |
| B-03 / bench03 | d0kkaebi (pts/3) | 지금 이 세션, 인두 켜짐 |
| B-04 / bench04 | ej0 (pts/4) | `make fw.bin` 오류 2, CPU 87% |
| B-05 / bench05 | seorin (pts/1) | `gdb ./heap_repair` |
| B-06 / bench06 | **빈 자리** | 서버는 `sdr-record` 녹음 중, 디스크 91%. SDR 예약 03:30–04:00 = **ej0** |
| B-07 / bench07 | hajin (pts/6) | `sage crypto-02.sage`, 인두 대기 전원 40분 |
| B-08 / bench08 | **빈 자리** | 서버 점검 중 |

→ 사용 5석, 남은 자리 **B-01 · B-06 · B-08**. `/var/lib/sdr` 412G.

### NR31 문제표 (18문제 · 6,000점 — kanban 보드가 원본)
| ID | 제목 | 분야 | 출제 | 점수 | 상태 | 리허설 풀이 (20팀 중) |
|---|---|---|---|---|---|---|
| NR31-pwn-01 | 야간 자판기 | pwn | seorin | 200 | 배포 준비 | 14 |
| NR31-pwn-02 | 세운 전광판 | pwn | seorin | 300 | 검수 (검수 d0kkaebi) | 6 |
| NR31-pwn-03 | 힙 레이아웃 수리 | pwn | seorin | 400 | 출제 중 (03:02 커밋) | — |
| NR31-pwn-04 | 커널 납땜 | pwn | seorin | 500 | 아이디어 | — |
| NR31-web-01 | 을지로 주문서 | web | d0kkaebi | 100 | 배포 준비 | 19 |
| NR31-web-02 | 부품 시세표 | web | d0kkaebi | 200 | 배포 준비 (03:11:58 검수 통과, hajin) | 11 |
| NR31-web-03 | 청계천 방명록 | web | d0kkaebi | 300 | 검수 (검수 hajin) | 7 |
| NR31-web-04 | SSR 수리 접수 | web | moon | 400 | 출제 중 (01:58 병합) | — |
| NR31-web-05 | 야간 출입 게이트 | web | moon | 500 | 아이디어 | — |
| NR31-rev-01 | SW-07 부트로더 | rev | ej0 | 200 | 배포 준비 | 9 |
| NR31-rev-02 | 필승전자 계산기 | rev | d0kkaebi | 300 | 검수 (검수 ej0) | 3 |
| NR31-rev-03 | 삐삐 암호기 | rev | ej0 | 400 | 출제 중 | — |
| NR31-rev-04 | 브라운관 드라이버 | rev | d0kkaebi | 500 | 아이디어 (부품 대기) | — |
| NR31-crypto-01 | PC통신 비밀번호 | crypto | hajin | 200 | 배포 준비 | 13 |
| NR31-crypto-02 | 전광판 난수 | crypto | hajin | 300 | 검수 (검수 seorin) | 2 |
| NR31-crypto-03 | 타자기 다중치환 | crypto | hajin | 400 | 배포 준비 | 4 |
| NR31-hw-01 | SW-07 펌웨어 덤프 | hw | ej0 | 500 | 출제 중 (빌드 실패) | 빌드 실패 |
| NR31-hw-02 | UART 도청 | hw | ej0 | 300 | 검수 | 1 |

- 분야 합계: pwn 4 · 1,400점 / web 5 · 1,500점 / rev 4 · 1,400점 / crypto 3 · 900점 / hw 2 · 800점.
- 출제자 합계: seorin 4 · 1,400 / d0kkaebi 5 · 1,400 (web 3 · rev 2) / ej0 4 · 1,400 / hajin 3 · 900 / moon 2 · 900.
- 리허설 서버(`ctf.sewoon.sh`)에는 배포 준비 6 + 검수 5 = **11문제**만 올라가 있다. 출제 중·아이디어 문제는 리허설 제출 로그·채점에 나오지 않는다.

### 커밋 해시 (7자리, 저장소별)
`git.sewoon.sh/nr31` (`git log --graph --oneline -7`, 최신순):

| 해시 | 메시지 | 작성 | 시각 |
|---|---|---|---|
| `a3f9c21` | (HEAD → main) pwn-03 힙 레이아웃 수정 | seorin | 03:02 |
| `7c1e0b4` | hw-01 fw.bin 빌드 타깃 추가 — make 오류 2 | ej0 | 02:47 |
| `5d2a9e8` | Merge branch 'web-04' | moon | 01:58 |
| `e91f3a7` | web-04 수리 접수 폼 초안 | moon | 01:40 |
| `0b47c6d` | web-03 방명록 필터 우회 막음 | d0kkaebi | 00:31 |
| `2f8d915` | (tag: crypto-03) crypto-03 배포 태그 | hajin | 10-08 23:02 |
| `9a6e2c0` | NR31 문제 목록 18개 확정 | seorin | 10-08 22:04 |

`git.sewoon.sh/ej0/sw07` (SW-07 펌웨어, `apt changelog sw07`): `e2b7d14`(1.3-2) · `7c01e5b`(1.3-1) · `5b20c47` · `1d6f8aa` · `e94b2d0` — nr31 저장소 해시와 겹치지 않는다.

### 서버별 가동·부하 (10-10 03:12 기준)
| 서버 | up | load average | 비고 |
|---|---|---|---|
| `sewoon.sh` (본서버) | 41일 6시간 | 0.42 0.38 0.35 | MOTD·dashboard 머리 |
| `ctf.sewoon.sh` (리허설) | 12일 03:41:09 | 2.14 1.87 1.62 | index htop. CPU 4코어, Mem 2.4G/7.7G, Swp 1.9G/2.0G |
| `bench01`–`bench08` | 4일 18시간 | bench03 0.18 0.22 0.20 | 10-05(월) 09:00 점검 때 함께 재부팅. bench03 팝오버 값 |

### nr31.log 원본 (`/var/log/sewoon/nr31.log`, 03:09–03:12:07)
index `tail -f`(마지막 10줄 = 03:11:41부터)와 dashboard `tail -f`(마지막 16줄 = 03:10:14부터)는 **이 원본에서 잘라 쓰기만** 한다. 시각·문구를 바꾸지 않는다. 같은 사건을 다른 화면(alert, wall, 타입 견본, 상태 바 tail)에 쓸 때도 이 시각을 쓴다.
리허설 제출 줄은 `team-NN → 문제ID 정답 +점수 | 오답`. 03:12:07 이후 줄은 `<template data-stream-src>`가 흘려보내는 가상의 미래 줄이라 이 표에 없다.
```
03:09:12  정보  team-19 → NR31-crypto-03 오답
03:09:30  통과  team-07 → NR31-rev-01 정답 +200점
03:09:58  정보  team-15 → NR31-pwn-02 오답
03:10:14  통과  team-02 → NR31-web-01 정답 +100점
03:10:27  정보  team-04 → NR31-hw-02 오답 (5회째)
03:10:41  정보  team-08 → NR31-web-03 오답 (3회째)
03:10:55  통과  team-03 → NR31-crypto-01 정답 +200점
03:11:09  정보  team-11 → NR31-rev-02 오답
03:11:34  통과  team-14 → NR31-pwn-02 정답 +300점
03:11:41  경고  bench06 디스크 91% — /var/lib/sdr
03:11:44  통과  team-03 → NR31-web-02 정답 +200점
03:11:47  정보  team-22 → NR31-crypto-02 오답
03:11:50  오류  NR31-hw-01 make: *** [fw.bin] 오류 2 — bench04
03:11:52  통과  team-05 → NR31-web-01 정답 +100점
03:11:55  정보  seorin push → a3f9c21 pwn-03 힙 레이아웃 수정
03:11:58  통과  NR31-web-02 검수 통과 — hajin
03:12:01  방송  moon: 04:00 마감, 인두 전원 확인
03:12:03  대기  bench06 SDR 예약 03:30 — ej0
03:12:07  정보  ej0 님이 B-04 납땜 벤치 점유
```

### d0kkaebi 의 `~/.sewoonrc` (10-09 23:47 저장본 = `.sewoonrc.old`)
```
[session]
host         = "bench03"
port         = 2222
idle_timeout = 60
motd         = true
[notify]
wall         = true
nr           = true
board_watch  = false
bench_free   = false
[ui]
theme        = "밤"          # 밤 | 낮
scanline     = true
reduce_motion = false
[privacy]
plan         = true
realname     = false
[bench]
seat         = "B-03"
locker       = "L-512-07"
legacy_rsa   = true          # galaxy-tab RSA 키, 10-26 이후 거부됨 (menuconfig 밖 값)
```
settings 화면은 이 파일에서 `idle_timeout 60→120`, `tmux_restore +true`, `board_watch false→true` 3개를 바꾼 **저장 전** 상태다. index `cat -n ~/.sewoonrc` 는 저장본(위 값)을 보여 준다.

### 가입 중인 mirae
`sewoon join --plan=resident` — 상주 회원 ₩79,000/월(사물함 1칸 포함이라 3단계에서 사물함을 고른다). 가입 대화상자의 회원권 기본값도 상주.

---

## 2. ui-ux-pro-max 근거 (채택 / 기각)

실행한 쿼리:
`--domain style "cyberpunk terminal neon CRT"`(Retro-Futurism · Cyberpunk UI · Y2K), `--domain style "hacker terminal CLI command line"`(Cyberpunk UI 재확인 + styles.csv의 Do Not Use For 열 직접 확인),
`--design-system "cyberpunk terminal security CTF developer" -p "CYBER.TERM" --variance 8 --motion 6 --density 8`,
`--domain color "cybersecurity hacker terminal dark"`, `--domain typography "terminal monospace hacker"`,
`--domain google-fonts "monospace korean coding"`, `"pixel bitmap display monospace"`, 패밀리 직접 조회 `"VT323" "Sixtyfour" "Martian Mono" "Fira Code" "Workbench"`,
`--domain landing "developer documentation CLI tool"`(**0건**) → 재시도 `"documentation"`,
`--domain ux "flashing animation seizure reduced motion"`, `--domain chart "real-time streaming log monitoring"`, `--domain gsap "typewriter text scramble"`.
2026-10-11 재실행(결론 동일, 세부 근거 보강): `--domain style "cyberpunk terminal neon CRT"` + styles.csv `Do Not Use For` 열 직접 확인(Retro-Futurism: "Conservative industries, critical accessibility, professional/corporate, elderly, legal/finance"), `--design-system "cyberpunk terminal hacker CTF developer" -p "SEWOON.SH" --variance 8 --motion 5 --density 8`(STYLE은 또 Brutalism 오매칭, PATTERN FAQ/Documentation, AVOID "Light mode default"), `--domain color "cybersecurity hacker terminal dark"`, `--domain typography "terminal monospace hacker"`, `--domain google-fonts "monospace korean coding"` · `"Sixtyfour"`(BLED 0..100, SCAN -53..100) · `"Inconsolata"`(wdth 50..200, wght 200..900), `--domain landing "developer documentation CLI tool"`(**0건 — 데이터 매치 없음**) → `"documentation search"`, `--domain chart "real-time streaming log"`, `--domain ux "flashing seizure reduced motion"`.

### 채택
| 출처 | 항목 | 반영 |
|---|---|---|
| style: Cyberpunk UI | Keywords "terminal, HUD, tech noir", monospace, angular shapes, scanlines `::before` overlay, Implementation Checklist "Scanlines optional", `--scanline-opacity: 0.1` | 전면 모노, radius 0, 스캔라인은 **다크 전용 전역 레이어**. 데이터 기본값 0.1 에서 **0.07** 로 한 단계 낮춤(16px 한글 본문 획이 줄무늬에 먹히지 않게) |
| style: Cyberpunk UI | Best For "developer tools, gaming, sci-fi" / **Do Not Use For "corporate enterprise, healthcare, family apps, conservative brands, elderly"** | 클라이언트를 회원제 해커스페이스+CTF로 확정. 기업 보안 SaaS로 가지 않음 |
| style: Cyberpunk UI | Light Mode **not-recommended** | 라이트를 "반전"으로 만들지 않고 별개 장면(계측기 LCD)으로 설계. 라이트엔 글로우·스캔라인 0 (3절) |
| style: Cyberpunk UI | `--glitch-duration: 0.3s`, "Glitch effect subtle" | 글리치는 404 제목·에러 토스트에서 **1회 160ms**만. 반복 금지 |
| style: Retro-Futurism | "neon glow (text-shadow+box-shadow)", CRT scanlines | 인광 블룸은 다크 모드에서 녹색·핑크 글자(20px 이상)에만. 가독성은 솔리드 색이 단독으로 충족 |
| color: Cybersecurity Platform | Primary `#00FF41` matrix green + Accent `#FF3333` alert red, 배경 `#000000` | 구조 채택(녹색 주색 + 적색 경보). 값은 조정: 녹색 `#3DFF7F`(살짝 차가운 P1 인광, 영화 매트릭스 클리셰 회피), 배경 `#050A07`(순흑은 인광 번짐이 거칠고 녹흑이 CRT 유리에 가까움) |
| color: RPA / Automation Dashboard | "running green + failed red + queued amber" | 상태 의미 고정: 진행·해결 = 녹색, 실패 = 적색, 대기 = 호박색 |
| typography: Terminal CLI Monospace | "Single monospace system", "Weight 400 normal (bold ruins mono)", "strict sizes" | 단일 모노 시스템 + 기본 400, 700은 man 페이지식 굵은 제목에만. UI 글자 크기는 13/14/16 세 단계로 잠금 |
| google-fonts | **Nanum Gothic Coding** (korean+latin. 데이터 카테고리는 "Handwriting"으로 잘못 분류돼 있으나 실제는 고정폭 코딩 서체) | 한글 목소리. 실측: 한글 자폭 **1.000em** — 아래 Inconsolata(0.500em)와 정확히 2:1 |
| design-system DIALS | Variance 8 Bold/Asymmetric, Density 8 Dense | tmux 분할 62/38·40/30/30, 균등 3분할 카드 금지, 정보 밀도 높은 세션 |
| design-system PATTERN | Real-Time/Operations: "Label telemetry as live only when backed by a current source, with update time and stale state. Provide pause/hide… render a static final snapshot under reduced motion" | `tail -f` 로그·대시보드 스트림에 `갱신 03:12:07` 표기 + `[p] 일시정지` 버튼 + 화면 밖이면 정지 + 동작 줄이기 시 정지 상태로 시작 |
| design-system KEY EFFECTS | "No smooth transitions (instant), sharp corners (0px), visible grid" | 호버·선택 = **반전(reverse video) 0ms**. 문자 셀 그리드를 레이아웃에 노출 |
| design-system AVOID | "Light mode default" | 첫 화면 정서는 다크 "밤 장면"이 기준. 테마 결정 순서는 브리프대로 `?theme=` → localStorage → 시스템 설정, 시스템이 라이트면 라이트 LCD 장면으로 정상 표시(라이트도 완성 장면이라 강제 다크는 하지 않음) |
| chart: Real-Time Streaming | "Show the current value and status text… do not rely on color alone", Pause/Resume | 대시보드 스파크라인은 점자 문자(⣀⣤⣶⣿) + 현재값 숫자 + 상태 텍스트. 이상치는 `▲` 모양 + 주석 |
| ux: Excessive Motion | "Animate 1-2 key elements per view maximum" | 화면당 움직이는 것: 커서 1개 + 스트림 1개 |
| ux: Reduced Motion | `prefers-reduced-motion` 필수 | 7절 축소 규칙 |
| landing: FAQ/Documentation (재시도 결과) | "Hero with search bar" | 부분 채택: 프롬프트가 곧 검색창. `/` 또는 `⌘K`로 fzf 팔레트 |

### 기각
| 출처 | 항목 | 이유 |
|---|---|---|
| design-system STYLE | Brutalism (default fonts, anti-design) | 키워드 매칭 오류. 브루탈리즘은 theme-01 몫이고 터미널 DNA와 무관 |
| design-system MOTION | Stagger List `back.out(1.4)`, opacity 0→1, scale .92 | 터미널 출력은 튀거나 페이드되지 않는다. 줄 단위로 "찍힌다"(7절) |
| design-system CHECKLIST | "Hover states with smooth transitions (150-300ms)", "SVG icons Heroicons/Lucide" | 터미널 선택은 트윈 없음 → 반전 0ms. 아이콘은 문자(`▸ ✕ ⏎ ↑↓ ●`)나 currentColor 인라인 SVG — 아이콘 라이브러리 금지 |
| style: Retro-Futurism | Purple `#5D34D0`, Hot Pink `#FF006E`, Neon Blue `#0080FF`, 80s geometric patterns, `hue-rotate` | 보라 = 블랙리스트. 80s 기하 패턴·신스웨이브는 theme-08 베이퍼웨이브 영역 |
| style: Cyberpunk UI | `#FF00FF` 순수 마젠타를 공동 주색으로 | v1의 시안+마젠타 2주색 반복 금지. 핑크는 `#FF5CAB` "청계천 간판" 한 가지, 워드마크·브랜드 표식·퍼지 매치 강조에만 |
| style: Cyberpunk UI | "Dark background only" | 브리프 계약상 라이트 필수 → 별개 장면으로 해결 |
| style: Retro-Futurism | `--scanline-opacity: 0.3`, Implementation Checklist "80s patterns present", "Glitch animations active" | 본문 대비를 깎는다. 0.07로 낮추고 라이트에선 0. 상시 글리치는 광과민·가독성 위험 → 1회성만 |
| color: Coding Bootcamp / RPA | 배경 `#020617`, 보더 `#334155` (Tailwind slate) | 범용 SaaS 다크. 녹흑 계열로 교체 |
| typography: Terminal CLI | JetBrains Mono 단일 시스템, line-height 1.2 | JetBrains는 theme-02가 사용 + 자폭 0.6em이라 한글(1em)과 열이 어긋남. 1.2 행간은 한글 본문 1.6 계약 위반(로그·표에만 1.4) |
| typography: Developer Mono | JetBrains Mono + IBM Plex Sans | 비모노 UI 서체는 셀 그리드를 깬다. Plex는 theme-01 |
| typography: Brutalist Raw | Space Mono | 자폭 0.6em(2:1 불가), theme-01 감성 |
| google-fonts pixel | Geist Pixel, Datatype, Major Mono Display | Geist는 theme-30 계열, Major Mono는 소문자 장식형이라 판독성 낮음. 대신 **Sixtyfour**(SCAN 축 = 글자 안의 스캔라인) 직접 조회로 채택 |
| google-fonts | Share Tech Mono, VT323 | Share Tech Mono는 v1 + theme-05 사용. VT323은 비트맵 계단이 16px 이하 한글 혼식에서 지저분하고 디스플레이로는 Sixtyfour가 더 강함 |
| landing: FAQ/Documentation | Section order "FAQ accordion > Contact/support CTA" | 랜딩 순서 자체를 쓰지 않음. 순서는 셸 세션이 정한다(8절) |
| gsap | SplitText 글자별 opacity/rotateX 스태거 | 범용 AI 모션. 타이핑은 글자 **추가**이지 페이드가 아니다 |

---

## 3. 팔레트 — "이 클럽 터미널의 ANSI 16색"

원칙: 팔레트 = `sewoon.itermcolors`. 시맨틱 토큰은 ANSI 슬롯에서 나온다(green = 프롬프트·성공, red = 에러, yellow = 경고·대기, cyan = 경로·링크·정보, magenta = 간판 네온·브랜드, blue = 선택 보조, bright black = 보조 글자). 색은 **글자와 1px 선**으로 쓰고, 면은 "반전(reverse video)" 한 가지 방식으로만 칠한다. 그라데이션·radial 얼룩·반투명 유리 금지.

### 원시 토큰 (tokens.css)
| 토큰 | hex | 역할 |
|---|---|---|
| `--phos-950` | `#050A07` | 다크 배경 — CRT 유리 녹흑 |
| `--phos-900` | `#0A140E` | 다크 pane 면 |
| `--phos-850` | `#11221A` | 다크 pane 2 / 행 호버 직전 면 |
| `--phos-700` | `#2F6E47` | 다크 pane 테두리(박스 선) |
| `--phos-600` | `#4A9A66` | 다크 입력·컨트롤 테두리 |
| `--phos-400` | `#86B593` | 다크 보조 글자 (bright black) |
| `--phos-100` | `#D2F5DA` | 다크 본문 — 백록 인광 |
| `--green-400` | `#3DFF7F` | 다크 주색: 프롬프트·커서·성공·주 버튼 반전 면 |
| `--green-800` | `#0A6630` | 라이트 주색 |
| `--sign-400` | `#FF5CAB` | 다크 간판 핑크 (청계천 네온) |
| `--sign-800` | `#A8125C` | 라이트 간판 핑크 |
| `--amber-400` | `#FFB627` | 다크 경고·대기 (P3 호박 인광) |
| `--amber-800` | `#7A4A00` | 라이트 경고 |
| `--red-400` | `#FF6B5E` | 다크 에러 |
| `--red-800` | `#AD2318` | 라이트 에러 |
| `--cyan-400` | `#56E4F0` | 다크 경로·링크·정보 |
| `--cyan-800` | `#00626F` | 라이트 경로·링크 |
| `--blue-400` | `#7FB0FF` | 다크 보조 강조(커밋 해시 외 메타) |
| `--blue-800` | `#1E4DB8` | 라이트 보조 강조 |
| `--lcd-200` | `#D7E4D3` | 라이트 배경 — 계측기 LCD 녹회색 |
| `--lcd-100` | `#E8F0E5` | 라이트 pane 면 |
| `--lcd-300` | `#C9D8C4` | 라이트 pane 2 |
| `--lcd-600` | `#557A5F` | 라이트 pane 테두리 |
| `--lcd-700` | `#4F7259` | 라이트 입력 테두리 |
| `--lcd-800` | `#36533F` | 라이트 보조 글자 |
| `--lcd-950` | `#07170D` | 라이트 본문 — LCD 세그먼트 먹색 |

### 시맨틱 — dark (`[data-theme="dark"]`, 기본) "새벽 3시 512호, 한 칸만 켜진 CRT"
| 토큰 | 값 |
|---|---|
| `--bg` | `#050A07` |
| `--pane` / `--pane-2` | `#0A140E` / `#11221A` |
| `--fg` / `--fg-muted` | `#D2F5DA` / `#86B593` |
| `--rule` (박스 선) / `--rule-strong` (컨트롤·활성) | `#2F6E47` / `#4A9A66` |
| `--prompt` (user@host) / `--path` | `#3DFF7F` / `#56E4F0` |
| `--accent` / `--on-accent` (주 버튼 반전 면) | `#3DFF7F` / `#050A07` |
| `--sign` (브랜드 네온) | `#FF5CAB` |
| `--select-bg` / `--select-fg` (반전) | `#D2F5DA` / `#050A07` |
| `--ok` / `--warn` / `--err` / `--info` | `#3DFF7F` / `#FFB627` / `#FF6B5E` / `#56E4F0` |
| `--link` / `--focus` | `#56E4F0` / `#3DFF7F` |
| `--glow-green` / `--glow-sign` | `0 0 6px rgb(61 255 127 / .45)` / `0 0 8px rgb(255 92 171 / .5)` (장식 전용) |
| `--scanline` | `repeating-linear-gradient(to bottom, transparent 0 2px, rgb(0 0 0 / .07) 2px 3px)` |
| `--cursor` | `#3DFF7F` |

### 시맨틱 — light (`[data-theme="light"]`) "오후 2시, 3층 수리점 계측기 LCD"
다크의 반전이 아니다. 낮의 세운상가, 형광등 아래 오실로스코프·멀티미터의 **반사형 LCD** — 녹회색 바탕에 먹색 세그먼트. 그래서 **글로우 0, 스캔라인 0**, 대신 LCD 특유의 "꺼진 세그먼트" 잔상 하나: 대시보드 `D-14` 뒤에만 `8-88` 잔상을 아주 옅은 `--ghost`(3.5%)로 깐다. Sixtyfour 의 8 은 7세그먼트 모양이 아니라서 진하게 겹치면 숫자를 가린다 — 404·점수 같은 핵심 숫자에는 깔지 않는다(1차 리뷰 반영).
| 토큰 | 값 |
|---|---|
| `--bg` | `#D7E4D3` |
| `--pane` / `--pane-2` | `#E8F0E5` / `#C9D8C4` |
| `--fg` / `--fg-muted` | `#07170D` / `#36533F` |
| `--rule` / `--rule-strong` | `#557A5F` / `#4F7259` |
| `--prompt` / `--path` | `#0A6630` / `#00626F` |
| `--accent` / `--on-accent` | `#0A6630` / `#E8F0E5` |
| `--sign` | `#A8125C` |
| `--select-bg` / `--select-fg` | `#07170D` / `#E8F0E5` |
| `--ok` / `--warn` / `--err` / `--info` | `#0A6630` / `#7A4A00` / `#AD2318` / `#00626F` |
| `--link` / `--focus` | `#00626F` / `#0A6630` |
| `--glow-*` / `--scanline` | `none` / `none` |
| `--ghost` (LCD 꺼진 세그먼트) | `rgb(7 23 13 / .035)` — dashboard D-14 전용 |
| `--cursor` | `#07170D` |

### 대비 검산 (WCAG, 계산값 — scratchpad `cr.py`)
| 쌍 | 비 | 판정 |
|---|---|---|
| 다크 `#D2F5DA` / `#050A07` · `#0A140E` · `#11221A` | 16.92 · 15.91 · 14.05 | 본문 OK |
| 다크 보조 `#86B593` / bg · pane · pane-2 | 8.59 · 8.08 · 7.14 | OK |
| 다크 녹 `#3DFF7F` / bg · pane-2 | 15.01 · 12.47 | OK |
| 다크 핑크 `#FF5CAB` / bg · pane-2 | 7.00 · 5.82 | OK |
| 다크 호박 `#FFB627` / bg | 11.37 | OK |
| 다크 적 `#FF6B5E` / bg · pane-2 | 7.14 · 5.93 | OK |
| 다크 시안 `#56E4F0` / bg | 13.06 | OK |
| 다크 청 `#7FB0FF` / bg | 9.08 | OK |
| 다크 반전: `#050A07` on `#3DFF7F` / on `#D2F5DA` | 15.01 / 16.92 | 주 버튼·선택 OK |
| 다크 반전 경고·에러 면: `#050A07` on `#FFB627` / `#FF6B5E` / `#FF5CAB` | 11.37 / 7.14 / 7.00 | OK |
| 다크 박스 선 `#2F6E47` / bg | 3.27 | 비텍스트 3:1 OK |
| 다크 컨트롤 선 `#4A9A66` / pane | 5.45 | OK |
| 라이트 `#07170D` / `#D7E4D3` · `#E8F0E5` · `#C9D8C4` | 14.00 · 15.85 · 12.40 | 본문 OK |
| 라이트 보조 `#36533F` / bg · pane · pane-2 | 6.46 · 7.31 · 5.72 | OK |
| 라이트 녹 `#0A6630` / bg · pane · pane-2 | 5.39 · 6.10 · 4.77 | OK |
| 라이트 핑크 `#A8125C` / bg · pane | 5.48 · 6.20 | OK |
| 라이트 호박 `#7A4A00` / bg · pane | 5.67 · 6.42 | OK |
| 라이트 적 `#AD2318` / bg · pane | 5.26 · 5.95 | OK |
| 라이트 시안 `#00626F` / bg | 5.35 | OK |
| 라이트 청 `#1E4DB8` / bg | 5.67 | OK |
| 라이트 반전: `#E8F0E5` on `#07170D` / on `#0A6630` / on `#A8125C` / on `#AD2318` | 15.85 / 6.10 / 6.20 / 5.95 | OK |
| 라이트 박스 선 `#557A5F` / bg · pane | 3.67 · 4.16 | 비텍스트 OK |
| **탈락** `#07170D` on `#0A6630` | 2.60 | 라이트 녹색 면 위 먹색 글자 금지 → 녹색 면 글자는 `--on-accent #E8F0E5` |

---

## 4. 타이포그래피 — "1셀 = 0.5em, 한글 = 2셀"

### 패밀리 (Google Fonts `<link>` 1개, tokens.css @import 금지 · URL 200 확인)
```
https://fonts.googleapis.com/css2?family=Inconsolata:wdth,wght@100,400;100,500;100,700;100,800&family=Nanum+Gothic+Coding:wght@400;700&family=Sixtyfour:BLED,SCAN@0..100,-53..100&display=swap
```

| 역할 | 라틴·숫자 | 한글 | 스택 |
|---|---|---|---|
| 본문·UI·표·로그 (전부) | **Inconsolata** 400/500/700 (wdth 100) | **Nanum Gothic Coding** 400/700 | `--font-term: "Inconsolata", "Nanum Gothic Coding", ui-monospace, monospace` |
| 디스플레이 (32px 이상, 라틴·숫자만) | **Sixtyfour** (SCAN·BLED 축) | — (한글 디스플레이는 NGC 700) | `--font-crt: "Sixtyfour", "Inconsolata", monospace` |
| 한글 큰 제목 (24px 이상) | Inconsolata 800 | Nanum Gothic Coding 700 | `--font-term` + `font-weight:700` |

**근거 (실측, headless Chrome 100px)**: Inconsolata 라틴 자폭 **0.500em**, 나눔고딕코딩 한글 자폭 **1.000em**, 혼식 "ab세운cd" 평균 0.667em = 정확히 4×0.5 + 2×1. 즉 진짜 터미널의 East Asian Wide 규칙(한글 = 2셀)이 웹에서 그대로 성립한다. 한글이 섞인 ASCII 표·`ls` 열·man 페이지 들여쓰기가 `<pre>` 안에서 칸이 맞는다. 이것이 v1(JetBrains 0.6em) 대비 결정적 개선이고, 나눔고딕코딩은 Google Fonts 유일의 한글 고정폭이라 유지(v1과 같은 서체지만 역할·짝이 다르다).
Sixtyfour(Jens Kutílek, Commodore 64 계열 1em 정사각 셀)는 **SCAN 축으로 글자 자체에 스캔라인이 들어간다** — 오버레이가 아니라 글자에 박힌 CRT. 워드마크·404 숫자·대시보드 대형 수치에만.

규칙:
- **자간 0 고정**(전 요소). 셀 그리드가 정체성이라 넓은 자간·음수 자간 모두 금지. 7-5 문제(한글 자간 벌어짐)를 원천 차단. 유일 예외: 한글 큰 제목(`--fs-d1`) `-0.01em`.
- 대문자 라틴 라벨도 자간 0 — 터미널엔 트래킹이 없다.
- Sixtyfour는 단일 웨이트 → `font-synthesis: none`. 다크 `font-variation-settings: "SCAN" 20, "BLED" 10`, 라이트 `"SCAN" 10, "BLED" 0` — 이 폰트는 SCAN 이 낮을수록 글자 안 가로 틈이 커진다. 1차안(다크 40·20 / 라이트 80·0)은 120px 이상에서 도트가 서로 붙어 라이트는 둥근 풍선 글자, 다크는 덩어리가 됐다(2026-10-11 리뷰, 실측 비교 후 교체). 지금 값은 도트 줄 사이 틈이 남아 각진 세그먼트로 읽힌다. 404 다크만 SCAN 0(주사선 띠로 갈라진 신호 끊김).
- Sixtyfour 32px 미만 금지, 한글 금지(글리프 없음).
- 본문 `word-break: keep-all; overflow-wrap: anywhere;` — 단 `<pre>`·로그·표 셀은 `white-space: pre` + pane 내부 가로 스크롤.
- 굵기: 기본 400. 700은 man 섹션 제목(NAME, 설명 등), 표 헤더, 강조 1단계에만. 500은 Inconsolata 라틴 메타.

### 스케일 (px — 데스크톱 → 390)
| 토큰 | 값 | 서체 | 용도 |
|---|---|---|---|
| `--fs-mega` | `clamp(36px, 8.6vw, 120px)` | Sixtyfour | MOTD 워드마크 `SEWOON.SH`(9셀 → 1440에서 1080px, 390에서 324px), 404 |
| `--fs-num` | `clamp(32px, 4vw, 56px)` | Sixtyfour | 대시보드·프로필 큰 수치 (`D-14`, `8,450`) |
| `--fs-d1` | `clamp(28px, 3.6vw, 48px)` | NGC 700 | 페이지 장면 제목 (한글) |
| `--fs-d2` | `clamp(22px, 2.2vw, 30px)` | NGC 700 | man 페이지 제목 줄 확대, pane 큰 제목 |
| `--fs-h` | `18px` | NGC 700 | man 섹션 헤더(설명, 옵션…) |
| `--fs-body` | `16px` → 15px | Inconsolata/NGC 400 | 본문·명령·출력 |
| `--fs-data` | `14px` | 〃 | 표·로그·리스트 |
| `--fs-meta` | `13px` | 〃 500 | 상태 바, 타임스탬프, 키 힌트 (하한) |

| 행간 | 값 |
|---|---|
| `--lh-body` | `1.625` (16px → **26px = 1행**) |
| `--lh-data` | `1.4` (표·로그·`<pre>`) |
| `--lh-display` | `1.1` |

---

## 5. 레이아웃 문법 — "문자 셀 그리드 위의 한 줄기 세션"

1. **단위는 셀과 행.** `--cell: 0.5em`(본문 16px에서 8px), `--row: 1.625em`(26px). 가로 간격은 셀 배수(1·2·4·7·14셀), 세로 간격은 행 배수(0.5·1·2·3행). px 임의값 금지.
2. **세션은 왼쪽 정렬, 가운데 정렬 없음.** 콘텐츠 왼쪽 시작 = `--gutter` 4셀(32px), 모바일 2셀(16px). `margin: 0 auto` 중앙 컨테이너 금지. 유일한 가운데 정렬 = ncurses 대화상자(modal·onboarding 위저드) — 장르 관습.
3. **출력 폭은 명령이 정한다.** 섹션마다 폭이 다르다(균질 max-width 금지):
   - `man` 본문 = **72열**(576px) 고정, 섹션 헤더는 0열, 본문은 **7셀 들여쓰기**, 옵션 설명은 14셀(man의 tagged paragraph). 모바일은 들여쓰기 3셀 / 6셀.
   - 프롬프트 + 짧은 출력 = 내용 폭.
   - `ls -l`·ASCII 표 = 최대 120열.
   - `htop`·`tmux` 분할·`colortest` = **풀블리드**(뷰포트 전체, gutter만 남김).
   - `tail -f` 로그 = 100열, 왼쪽 타임스탬프 열 9셀 고정 + 레벨 열 6셀.
4. **틈 없는 분할(tmux 규칙).** 나란히 놓인 pane 사이 `gap: 0`, 인접 pane은 **1px 경계선을 공유**한다(카드 사이 여백 + 각자 테두리 = 카드 그리드 문법 금지). 분할 비율은 62/38, 38/62, 40/30/30, 20/30/50(ranger 밀러 열) — **균등 3분할·4분할 카드 그리드 금지**(kanban 4열은 예외: 장르상 열 = 상태).
5. **세로 리듬 = 명령 간격.** 프롬프트 → 출력 간격 0, 출력 블록 사이 1행, 명령과 다음 명령 사이 2행, tmux 창 전환(장면이 바뀜) = 상태 줄 하나(`─── 1:로그 ─────`)로 끊는다. 섹션 헤더용 큰 여백·고스트 숫자 없음.
6. **radius 0, 그림자 0.** 깊이는 세 가지로만: 반전(선택·활성), 이중선(포커스된 pane), 디더 배경(`░` 패턴, 모달 뒤).
7. **반응형**: ≥1200 pane 2–3개 나란히 / 768–1199 2개 / <768 세로 스택(tmux `even-vertical`), pane 내부의 `<pre>`·표만 가로 스크롤(오른쪽 끝 4셀 페이드 힌트). 페이지 가로 스크롤 0. 상태 바 창 목록은 가로 스크롤 + 페이드 힌트.
8. **셸(공통 골격)**: 위 = tmux 상태 바(sticky, 44px 이상) = navbar. 아래 = 마지막 프롬프트와 `logout` 줄 = footer. 좌측 고정 목차 사이드바 없음(theme-30 전용).

---

## 6. 시그니처 (2개, 끝까지)

### 시그니처 1 — 프롬프트 → 출력
모든 블록은 **그것을 만든 명령**으로 시작한다: `d0kkaebi@sewoon:~/ctf/nr31$ ls -l 문제/`. 사용자@호스트는 `--prompt`, 경로는 `--path`, `$` 와 명령은 `--fg`. 명령은 라틴(코드), 출력은 한국어.
- 적용: index 섹션 = 명령. 페이지는 명령 1줄(`$ mutt -f ~/메일/운영`) 다음에 **그 명령의 출력 자체가 머리**가 된다 — 장면 제목 블록(명령 → 48px 한글 제목 → 2줄 부연 → 선)은 9개 중 최대 3개(dashboard·onboarding·pricing)에만. inbox = mutt 도움말 줄 오른쪽에 메일함 이름, kanban = 출제 마감 카운트다운(Sixtyfour mega), profile = finger 의 로그인/이름 줄 + 8,450, settings = menuconfig backtitle + 테두리 가운데 제목, product = `SW-07` Sixtyfour mega(1차 리뷰: 같은 머리 뼈대 반복 지적 반영). pane 제목 = 명령 이름. 빈 상태 = `$ ls ~/알림` → `합계 0`. 에러 = stderr 줄(`!` 접두, `--err`). 토스트 = `wall` 방송. 버튼 = 실행 키 힌트 `[⏎]`.
- 활성 프롬프트 끝에만 꽉 찬 깜빡이는 블록 커서 `█` 1개(화면당 1개). 푸터 로컬 셸 `~ %`·모션 견본처럼 비활성 프롬프트는 깜빡이지 않는 빈 상자 `cursor--hollow`.
- 마크업: `<p class="sh-cmd"><span class="sh-ps1" aria-hidden="true">d0kkaebi@sewoon:~$</span> <code>man 7 sewoon</code></p>` + `<div class="sh-out">`.

### 시그니처 2 — TUI 박스 창 (제목이 테두리에 박힌다) + 반전 선택
pane은 1px 박스 선이고, **제목·메타·키 힌트가 테두리 선 위에 박힌다**(htop·mc·ncdu처럼): 위 테두리 왼쪽 `┤ 출제 보드 ├`, 오른쪽 `┤ 03:12 ├`, 아래 테두리 `[q] 닫기  [/] 검색`. (CSS: 테두리 + 제목 `span`에 `--pane` 배경, 위로 `-0.7em` 이동.)
- **포커스·활성 pane = 이중선**(`border: 3px double var(--rule-strong)`) + 제목 반전. Midnight Commander의 활성 패널 규칙.
- **선택·호버·활성 탭·현재 날짜·주 버튼 = 반전**(`--select-bg/fg` 또는 `--accent/on-accent`), 0ms.
- 적용: card, modal, drawer, popover, menu, command, toast, calendar, code, table 래퍼, kanban 열, form 대화상자, sidebar. ●●● 창 크롬은 영구 금지.

### 공통 재료 (시그니처 아님)
- 다크 전역 스캔라인 `body::after`(pointer-events none, z-index는 토스트 아래), 녹·핑크 20px 이상 글자에 `--glow-*`. 비네팅·radial·노이즈 없음.
- 라이트 LCD `--ghost` 잔상은 dashboard `D-14` 한 곳에만, 3.5% 로 옅게.

---

## 7. 모션 문법 — "찍히고, 깜빡이고, 다시 그린다"

| 토큰 | 값 | 쓰임 |
|---|---|---|
| `--dur-0` | `0ms` | 호버·선택 반전, 탭 전환 |
| `--type-char` | `22ms`/글자, 명령당 최대 `900ms` | 명령 타이핑(40자 이하 명령만) |
| `--line-out` | `14ms`/줄, 40줄 넘으면 나머지 즉시 | 출력이 줄 단위로 **찍힌다**(opacity 페이드 없음, `visibility` 토글) |
| `--blink` | `1060ms steps(1,end)` 무한 | 블록 커서 ≈0.94Hz |
| `--redraw` | `96ms steps(4)` | pane·오버레이 열기: `clip-path: inset(0 0 100% 0) → inset(0)` 위→아래 다시 그리기 |
| `--glitch` | `160ms` 1회 | 404 제목, 에러 토스트 진입 — RGB 분리 2px, 반복 금지 |
| `--stream` | `1400ms` 간격 | `tail -f`·대시보드 로그 한 줄 추가, `[p]` 일시정지, 화면 밖·탭 숨김 시 정지 |
| `--power-on` | `280ms` | index 첫 진입만(sessionStorage 1회): 화면 `scaleY(.01)→1` + 밝기 3→1 |
| `--spin` | `100ms`/프레임 | 점자 스피너 `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` |

- 이징 곡선 없음. 모든 전환은 0ms 또는 `steps()` — CRT는 보간하지 않는다.
- 광과민: 3Hz 초과 밝기 점멸 금지(커서 0.94Hz, 스피너는 작은 문자 교체라 면 점멸 아님).
- `prefers-reduced-motion: reduce`: 타이핑·줄 출력·전원 켜짐·redraw·글리치 = 최종 상태 즉시, 커서 정지(블록 표시 유지), 스트림은 **일시정지 상태로 시작** + "동작 줄이기 설정으로 정지됨" 표기, 스피너는 `…` 정지.

---

## 8. 32개 컴포넌트 처리 원칙

공통: 컴포넌트 CSS는 시맨틱 토큰만, radius 0, 그림자 0, 터치 타깃 44px, 포커스 = `outline: 2px solid var(--focus); outline-offset: 2px` + pane이면 이중선.

| 컴포넌트 | 터미널 원형 | 처리 |
|---|---|---|
| accordion | `tree` | `▸ 문제/` ↔ `▾ 문제/`, 펼친 내용은 4셀 들여쓰기 + `│ ├─ └─` 안내선(`--rule`). 헤더 행 전체가 버튼, 반전 호버 |
| alert | syslog / stderr 블록 | 위아래 1px 전폭 선 사이, 왼쪽 레벨 태그 반전 `[경고]`(warn 면) + 메시지 + 시각. 정보·성공·경고·에러 4종. 상자 없음 |
| badge | `[ 해결 ]` | 대괄호 토큰, 기본은 색 글자, 강조는 반전 면. 알약 모양 금지. 숫자 배지 `(12)` |
| breadcrumb | `pwd` | `~/ctf/nr31/pwn-03` 각 세그먼트 링크(`--path`), 구분자 `/` 는 `--fg-muted`. 현재 세그먼트는 링크 아님 + 굵게 |
| button | `[ 실행 ⏎ ]` | 주 = 반전 녹 면 `[ 제출 ]`, 보조 = 1px 박스, 고스트 = 밑줄 글자, 위험 = 반전 적 면. 오른쪽 키 힌트(`⏎`, `y`). 호버 = 반전 0ms, 로딩 = 점자 스피너가 라벨 앞에 |
| calendar | `cal 10 2026` | 7열 × 6행 2셀 숫자, 일요일 시작, 오늘(10) 반전, 일정 날짜(17·21·24)는 아래 `•`(warn). 제목 줄 `   10월 2026`. 날짜 선택은 셀 버튼 44px |
| card | pane | 시그니처 2. 위 테두리 제목 = 명령, 아래 테두리 = 키 힌트 |
| carousel | `feh` 슬라이드 | SW-07 기판 SVG 라인아트(currentColor) 4장, 상단 `[2/4] sw07-back.svg`, 하단 표시 `□ ■ □ □`(각 44px 버튼), ←→ 키 |
| code | `cat -n ~/.sewoonrc` | 왼쪽 4셀 줄번호(`--fg-muted`) + 1px 선, ANSI 색 구문 강조(키 = cyan, 문자열 = green, 숫자 = amber, 주석 = muted), `[y] 복사` 버튼 |
| command | `fzf` | ⌘K / `/`. 박스 pane 하단에 입력 `> ` + 커서, 위로 결과 목록, 매치 글자 `--sign`, 카운터 `12/48`, 선택 행 반전 |
| drawer | `tmux split-window -h` | 오른쪽에서 38% 폭, 전체 높이, 이중선, `--redraw`. 모바일은 아래에서 `split -v` 70% 높이 |
| empty | `ls` → `합계 0` | 명령 + `합계 0` + 한 줄 안내 + 다음 명령 제안 `$ sewoon new 문제` 버튼 |
| form | `dialog`/`whiptail` | 라벨 위, 입력은 1px 박스, 포커스 이중선 + 녹 블록 caret(`caret-color`). 체크박스 `[x]`/`[ ]`, 라디오 `(*)`/`( )`, 토글 menuconfig `<켜짐>`/`<꺼짐>`, select `< 선택 ▾ >`, 오류 stderr 줄 `! 키 형식이 올바르지 않습니다 (ssh-ed25519로 시작)` |
| kanban | tmux 4분할 | 열 사이 gap 0·공유 선, 열 제목 `출제 중 (4)`, 카드 = 박스 행(ID amber · 분야 · 출제자 · 점수), 드래그 중 카드 반전 + 점선 자리표시 |
| list | `ls -l` | 열 정렬(상태·소유자·날짜·이름), 행 높이 1.4 데이터 행간 + 44px 터치, 선택 행 반전 |
| marquee | 상태 바 `tail` 티커 | 상태 바 오른쪽 로그 한 줄이 흐른다, `[p]` 정지, 호버 정지, reduced = 최신 1줄 고정 |
| menu | ncurses 드롭다운 | 1px 박스, 단축키는 한국어 라벨 뒤 괄호 `새 창(N)`(N 밑줄 · 라틴 라벨은 `CPU%`처럼 첫 글자 밑줄), 구분선 `├──┤`, 선택 반전, ↑↓ Esc |
| modal | `dialog --yesno` | 화면 중앙(유일한 중앙), 이중선, 제목 테두리 박힘, 뒤 디더 `░` 배경(bg 85%), 버튼 `< 예 >  < 아니요 >`, 포커스 트랩 |
| navbar | tmux 상태 바 | `[sewoon] 0:세션* 1:대시보드 2:메일 3:출제보드 …` 활성 창 반전, 오른쪽 `03:12 10-10(토)` + 테마 토글 `[☾]` + ⌘K. 모바일: 창 목록 가로 스크롤 + 페이드 |
| pagination | `less` | `-- 더 보기 -- (2/7)` + `[b] 이전` `[space] 다음` + 페이지 번호 `:1 :2 :3`, 현재 반전 |
| popover | `tmux display-popup` | 작은 박스 pane, 앵커 쪽 테두리에 `┬` 꺾쇠 문자, 제목 박힘, Esc |
| progress | `wget` / htop 미터 | `52% [=========>        ] 1.2MB/s 남은 00:14` 와 `CPU [||||||||    62%]` 두 형태, 값 텍스트 항상 표시 |
| sidebar | `ranger` 왼쪽 열 | 디렉터리 목록, 현재 항목 반전, 접힘 시 2셀 폭 `»`. 모바일은 drawer로 |
| skeleton | 디더 | `░░░░░░░░░░` 행(폭 다양), reduced 정지, 아니면 `▒` 한 칸이 1.2s에 한 번 지나감 |
| spinner | 점자 | `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` + 라벨 `채점 중`, `aria-live="polite"` |
| steps | `make` 진행 | `[1/4] 키 생성 ✓ ── [2/4] 규약 ▸ ── [3/4] 사물함 · ── [4/4] 첫 접속 ·`, 완료 = ok, 현재 = 반전, 대기 = muted. 모바일 세로 |
| table | `column -t` / psql | 실제 `<table>`, 1px 박스 선, 헤더 아래 이중선, 숫자 오른쪽 정렬, 정렬 열 `▲▼` + `aria-sort`, 행 호버 반전 |
| tabs | tmux 창 목록 | `0:개요*  1:로그  2:설정` 활성 = 반전 + `*`, ←→ 키, 모바일 가로 스크롤 + 페이드 |
| timeline | `git log --graph` | `*` 노드, `│` 선, 해시 amber, 시각 muted, 메시지 fg, 분기 `├─╮` |
| toast | `wall` | 오른쪽 아래 박스: `moon@sewoon 님의 방송 (pts/0, 03:12)` + 본문, 5초 후 닫힘, `[x]` aria-label "알림 닫기", 에러는 글리치 1회 |
| tooltip | `--help` 한 줄 | 반전 작은 상자 13px, 앵커 아래, 지연 400ms, 포커스로도 열림 |
| motion | `sewoon motion --demo` | 위 7절 토큰 시연(타이핑·줄 출력·커서·redraw·글리치) + `[r] 다시 재생` 버튼 |

---

## 9. index.html 구성안 — 셸 세션 하나 (`ssh d0kkaebi@sewoon.sh`)

전체가 위에서 아래로 이어지는 한 세션. 섹션은 명령이고, **명령마다 출력 구도가 다르다**. 상단은 tmux 상태 바(0:세션* 활성).

| # | 명령 | 구도 | 담는 것 |
|---|---|---|---|
| ① 로그인 / MOTD (첫 화면) | `ssh d0kkaebi@sewoon.sh -p 2222` | 왼쪽 정렬 풀폭. `Last login…` 1줄 → **Sixtyfour `SEWOON.SH` 초대형**(녹 + 블룸, SCAN 20) → 그 아래 간판 핑크 한 줄 "세운 터미널 클럽 · 세운상가 가동 5층 512호" → MOTD 3줄(오늘 밤 벤치 3석 남음 / 야간수리반 #31 D-14 / 월요일 정기 점검) → 오른쪽 아래 `who` 출력(접속 5명 tty 표, 38% 폭, MOTD 목록 끝줄에 바닥 맞춤) → MOTD 2행 아래 프롬프트가 `man 7 sewoon`을 타이핑하고 커서 깜빡임(100svh 로 늘이지 않는다 — 빈 띠 금지). 전원 켜짐 모션 | 감정 톤, 워드마크, Sixtyfour·스캔라인 |
| ② man 페이지 | `man 7 sewoon` | 머리줄 3열 `SEWOON(7)   세운 터미널 인터페이스 규약   SEWOON(7)`, 0열 굵은 섹션 헤더 **이름 / 사용법 / 설명 / 참고**, 본문 72열·7셀 들여쓰기. **오른쪽 여백에 `cal 10 2026` 블록**(calendar 시연, 오늘 반전, 17·21·24 표시)이 man 본문 옆에 붙는 비대칭. "참고" 절이 9개 페이지 링크 `dashboard(1) inbox(1) …` | 세계관 소개(클럽 회원이 만드는 도구가 지켜야 할 화면 규약 — 시스템 홍보 문구 아님), calendar |
| ③ 색 | `colortest -16` → `diff -y theme.dark theme.light` | 풀블리드. 위: ANSI 16색 8열 × 2행 블록(이름·hex·역할·대비) 촘촘한 격자. 아래: 시맨틱 토큰을 **diff 좌우 출력**으로(왼쪽 다크 값, 가운데 `|`, 오른쪽 라이트 값) | 팔레트, 두 모드 |
| ④ 글자 | `sewoon-type --ruler` | 위에 셀 눈금자 `0123456789…`(0.5em 단위) → 그 아래 라틴·한글 혼식 줄이 눈금에 딱 맞는 것을 노출 → 크기별 줄 쌓기(mega → meta), 각 줄 끝에 `16/26` 같은 값 | 타이포 스케일, 2:1 셀 규칙 |
| ⑤ 시스템 모니터 | `htop` | 풀블리드 상하 분할: 위 미터 2열(CPU 코어 4개 progress 막대 + Mem·Swp + 오른쪽 Tasks/Load/Uptime 텍스트), 아래 프로세스 표(정렬 가능, 행 반전) + spinner·skeleton 행 + 하단 F키 바(`F1도움 F3검색 F6정렬 F10종료` = pagination·button 시연) | progress, spinner, skeleton, table, badge, button, pagination |
| ⑥ 가입 대화상자 | `sewoon join --dialog` | 디더 배경 위 **가운데 dialog 박스**(유일한 중앙 구도), 안에 steps(make 진행) + form 전 종류 + 버튼 `< 다음 >  < 취소 >` | form, steps, button |
| ⑦ 오버레이 | `tmux new -s overlays` (4분할 62/38 · 38/62) | 4 pane 각각에 **열린 상태 정적 견본**: dialog(modal) / 오른쪽 split(drawer) / ncurses 메뉴(menu) + popover·tooltip / fzf(command). 각 pane 아래 테두리에 실제 트리거 버튼 `[⏎] 열기` | modal, drawer, menu, popover, tooltip, command |
| ⑧ 로그 | `tail -f /var/log/sewoon/nr31.log` | 100열 좁은 스트림(왼쪽 시각 9셀 + 레벨 6셀) + 오른쪽에 `git log --graph --oneline` 38% pane. `[p] 일시정지`·`갱신 03:12:07`. 스트림 중간에 alert 블록, 아래에 `wall` 토스트 트리거, 상태 바 marquee 설명 | timeline, alert, toast, marquee |
| ⑨ 파일 탐색 | `ranger ~/` | 3열 밀러 칸 20/30/50: 왼쪽 `~` 디렉터리(sidebar), 가운데 `pages/` 목록(list — **9개 페이지로 가는 실제 링크**), 오른쪽 미리보기(선택 파일의 tree accordion / breadcrumb `pwd` / tabs / 빈 디렉터리 empty) | sidebar, list, breadcrumb, tabs, accordion, empty, 내비게이션 |
| ⑩ 작업물 | `ls ~/lab` 후 3개 명령 연속 | 짧은 명령 3개가 각기 다른 폭으로: `sewoon board --compact`(kanban 4열 미니 62% + 옆에 `--by author` 출제자 표 38%, 값은 팩트 시트 NR31 문제표 그대로), `feh ~/lab/sw07/*.svg`(carousel, 62% 폭), `cat -n ~/.sewoonrc`(code, 72열). card = 이 pane들 자체 | kanban, carousel, code, card |
| ⑪ 모션 | `sewoon motion --demo` | 한 줄짜리 출력들 + `[r]` 재생 버튼, 7절 토큰 표 | motion |
| ⑫ 종료 | `exit` | `logout` / `Connection to sewoon.sh closed.` 2줄 + 로컬 프롬프트 `~ %` 커서 = footer(연락처·주소·영업시간 man 형식 1단) | footer 셸 |

모바일(390): 모든 풀블리드·분할은 세로 스택, `<pre>`·표는 pane 내부 가로 스크롤 + 페이드, MOTD 워드마크 36px(324px 폭), `who` 표는 MOTD 아래로.

---

## 10. 9개 페이지 장면 (모두 세운 터미널 클럽 안, 2026-10-10(토) 03:12 기준)

| 페이지 | 명령 · 장면 |
|---|---|
| dashboard | `btop -p nr31` — 야간수리반 #31 리허설 운영 콘솔(D-14). 왼쪽 62%: bench01–08 서버 미터·점자 스파크라인, 오른쪽 38%: Sixtyfour `D-14` 큰 수치·사전 등록 64/120팀, 아래 전폭: 리허설 제출 로그 스트림(일시정지 가능) + 문제별 풀이 수 표. KPI 카드 줄 없음 |
| inbox | `mutt -f ~/메일/운영` — 운영 메일함. 위(데스크톱 왼쪽 40%) 인덱스 12통(필승전자 부품 견적, `#SEW-2231` 사물함 문의, NR31-web-02 검수 의견, 신규 가입 알림…), 아래(오른쪽 60%) pager로 선택 메일 본문, 하단 키 바 `r 답장 d 삭제 / 검색` |
| kanban | `sewoon board nr31` — 출제 보드 4열(아이디어 3 · 출제 중 4 · 검수 5 · 배포 준비 6), 카드 = `NR31-pwn-03` · 분야 · 출제자 · 점수, 상단에 출제 마감 10-17(토) 23:59 카운트 텍스트 |
| onboarding | `d0kkaebi@sewoon:~$ sewoon join --attach mirae` — 백도윤이 bench03에서 입구 단말(gate)의 가입 화면에 붙어 같이 본다. 출력 = `guest@gate:~$ sewoon join …` 한 줄 + 장미래(mirae)의 가입 위저드 dialog 4단계: SSH 공개키 등록 → 클럽 규약 동의(야간 출입·장비 사용) → 사물함 선택(빈칸 7개 중) → 첫 레벨 `lv00` 접속 안내. 아래는 `journalctl -f -t sewoon-join` + `finger moon`. **프롬프트 주인은 화면 전체가 d0kkaebi 하나**(상태 바·푸터와 같음) |
| pricing | `man sewoon-membership` + `sewoon plans --compare` — man 형식 설명 위에 ASCII 비교표 3등급(게스트·야간·상주), `--billing=월|연` 토글이 탭, 상주 열은 이중선 활성 pane |
| product | `apt show sw07` — 세운 디버거 SW-07 상세: feh 캐러셀(정면·후면·핀아웃·납땜 키트 SVG 라인아트), 핀아웃 ASCII 도해, 스펙 표, 구매 `[ 장바구니 담기 ⏎ ]`(완제품/키트 라디오), 리뷰 = 메일링리스트 스레드 4통 |
| profile | `finger d0kkaebi` — 백도윤 프로필: finger 출력(로그인·tty·plan 파일), 활동 히트맵 `░▒▓█` 52주, 해결 문제 목록, 시즌 랭킹 7위 · 8,450점(Sixtyfour), 사물함·벤치 |
| settings | `make menuconfig` — `~/.sewoonrc` 설정을 menuconfig 트리로: `[*] 방송 알림 받기`, `(2222) SSH 포트`, `<다크>` 테마, SSH 키 목록, 세션 시간 제한. 하단 `< 저장 >  < 나가기 >` |
| 404 | `cd ~/pages/없는곳` → `bash: cd: 그런 파일이나 디렉터리가 없습니다` + `Segmentation fault (core dumped)` + Sixtyfour `404` 글리치 1회 + `혹시 이것?` 비슷한 경로 제안 3개(실제 링크) |

모든 페이지 공통: tmux 상태 바(현재 창 반전), 맨 위 명령 1줄, 맨 아래 `logout` footer(참고 링크 줄 끝 `404(3)` 포함) — COMPONENTS.md에 스니펫으로 고정. 명령 바로 아래는 그 명령의 출력이 머리다(장면 제목 블록은 dashboard·onboarding·pricing 3곳만).

---

## 11. v1에서 버릴 것

- eyebrow `// GRID-07 :: …` → 거대 2줄 헤드라인(한 줄만 마젠타) → 문단 → CTA 2개 첫 화면 전부.
- 시안 `#00F0FF` + 마젠타 `#FF2BD6` 2주색 체계, 바탕 `#070A0F`, 색 램프 50–900 스와치 띠.
- ●●● 신호등 창 크롬(`BOOT.SH`, `TRAFFIC.LIVE`) — 창 목업 문법.
- 히어로·대시보드·404의 radial-gradient 얼룩, 비네팅, `.hero__glow`.
- `01//` `02//` 섹션 헤더 + 고스트 숫자 + 우측 파일명 메타.
- 통계 띠 `NODE SEOUL-2 · UPLINK 99.98% · LATENCY 42MS · PANES 13`, KPI 5칸 카드.
- `auto-fill minmax(320px,1fr)` 균질 카드 그리드, 카드마다 같은 패딩·같은 보더.
- clip-path 모서리 노치(`--corner-cut`), 카드 모서리 L자 브래킷 장식.
- 영어 UI 라벨(`Dashboard`, `Analytics`, `Last 24h`, `EXPORT`, `NEW QUERY`, `COLLAPSE`) — 명령·경로·핸들 외 보이는 텍스트는 한국어.
- 한글 라벨의 넓은 자간(`.08em` 이상) — 자간 0 고정.
- Share Tech Mono, JetBrains Mono, Noto Serif KR import.
- 범용 API 운영 데이터(`/api/v2/auth`, `edge-ap2-07`) — 세운 터미널 클럽의 서버·문제·회원으로 교체.
- 라이트 = 하늘색 반전 + 글로우 잔존. 라이트는 LCD 장면, 글로우 0.
- 화면 고정 장식 라벨 `TERM-07 // P31 · 60HZ · SIGNAL OK`(내용 위에 겹침).
- 영어 aria-label(`Dismiss notification`, `Previous month`) — 전부 한국어.
