# DIRECTION — theme-30 · Corporate Clean SaaS v2

> 이 문서는 theme-30 v2의 **유일한 기준**이다. 이후 단계(토큰·컴포넌트·index·pages)는 여기 적힌 값만 쓴다.
> v1(`design-systems/theme-30-corporate-clean-saas`, "Aperture")은 반면교사이며 코드·문구·레이아웃을 가져오지 않는다.

---

## 0. v1 진단 — 스크린샷으로 확인한 AI티 (1440 / 390, 다크로 렌더됨)

| # | 증상 (화면에서 본 것) | 브리프 3절 항목 |
|---|---|---|
| 1 | 첫 화면이 그대로 랜딩 공식: eyebrow "운영 분석 · B2B 워크스페이스" → 3줄 헤드라인 "흩어진 지표를 한 화면에 **또렷하게** 정렬합니다"(한 단어만 인디고→보라 그라디언트) → 부연 문단 → CTA 쌍 "무료로 시작하기 / 라이브 대시보드 보기" → 기능 칩 4개 | 구조: 랜딩 공식 전체, 카피: "한 화면에·또렷하게", CTA 쌍, 칩 나열 |
| 2 | 히어로 오른쪽에 ●●● 신호등 + URL바(`app.aperture.kr/overview`) 브라우저 목업 안에 미니 대시보드 | 구조: 브라우저 창 목업 히어로 |
| 3 | 히어로 우상단에 의미 없는 대형 원·사선 라인 장식(조리개 모티프 흉내) + 남색 radial 글로우 | 시각: 장식 SVG 곡선, radial 얼룩 배경 |
| 4 | "디자인 토큰 / 검증된 토큰 위에서 시작 / 부제", "컴포넌트 / 상태까지 설계된 컴포넌트 / 부제" — 가운데정렬 3단 섹션 헤더 반복 | 구조: 가운데 섹션 헤더 반복, 카피: 디자인 시스템 자기 홍보 |
| 5 | 컴포넌트를 둥근 카드(동일 radius·동일 그림자) 3×2 그리드에 하나씩 진열("버튼", "뱃지 & 태그", "폼 컨트롤"…) | 구조: 컴포넌트 카드 갤러리, 균질 리듬 |
| 6 | 색 토큰을 50~900 스와치 램프로만 진열 — 어디에 쓰는지·대비 수치 없음. 엘리베이션 데모 박스는 다크에서 거의 안 보임 | 토큰 진열 (용도 없는 견본) |
| 7 | 인디고 #4F46E5 + 그라디언트 텍스트, 모든 요소 같은 9px radius·같은 은은한 그림자 | 시각: DNA 무관 인디고/보라 |
| 8 | 대시보드: 아이콘 칩 달린 동일 KPI 카드 5개 + 범용 도넛 "트래픽 소스" + 사이드바 하단 "Pro 플랜 좌석" 업셀 카드 — 어떤 회사의 어떤 업무인지 없는 "분석 대시보드" | 실제 데이터/세계관 부재 |
| 9 | 모든 페이지에 "팁 · ⌘K" 토스트가 떠 있음 (자기 기능 홍보) | 카피: 시스템 자기 홍보 |
| 10 | **390px 가로 스크롤 발생**: 헤더 CTA·헤드라인·칩 줄이 화면 밖으로 잘림. 대시보드 390에서도 툴바 버튼·차트가 잘리고 KPI 카드는 거의 빈 상자(스파크바 대비 부족) | 품질 바 위반 |
| 11 | 폰트: Inter + Gothic A1(AI 기본값), 쓰지도 않는 Noto Serif KR import | 서재 관성 잔재 |

결론: v1은 "인디고 SaaS 랜딩 템플릿"이었다. v2는 **랜딩을 버리고 실제 B2B 제품의 문서·장부·결재 문화**에서 형태를 가져온다.

---

## 1. 클라이언트 · 세계관

**레저라인 (워드마크: `ledgerline`)** — 직원 50~500명 국내 중견·스타트업을 위한 **법인카드 경비 정산 + 전자결재 SaaS**.
재무·경영지원팀이 매달 말 "경비 마감"을 하며 쓰는 도구. 법인카드 승인 내역이 실시간으로 들어오고, 직원이 영수증을 붙이면 계정과목이 자동 매칭되고, 금액 구간별 결재선(담당 → 팀장 → 재무 → 대표)을 거쳐 지급된다.

- **스타일의 원래 맥락**: 2019~2025 미국 핀테크/개발자 B2B 제품 UI — Stripe(대시보드·API 레퍼런스), Ramp·Brex(경비 SaaS), Linear(밀도·키보드 우선). 공통점은 *장식이 아니라 정보 위계, 표·숫자·문서가 곧 미학*이라는 것.
- **한국화 지점**: 한국 회사의 **결재란(도장 칸)** 과 **장부(원장) 괘선**. 이 둘을 시그니처로 삼아 "한국 회사 재무팀이 매일 보는 화면"을 만든다.
- **세계 속 고유명사(모든 페이지 공용)**
  - 고객사(워크스페이스): **㈜한결물산** (임직원 214명, 법인카드 86장)
  - 주인공 사용자: **김하늘** 경영지원팀 매니저 / 결재자: **박도윤** 재무팀장, **이서진** 대표이사, **최민재** 영업2팀장
  - 부서: 경영지원팀, 재무팀, 영업1팀, 영업2팀, 제품개발팀, 마케팅팀, 물류운영팀
  - 문서번호 체계: `EXP-2610-0412`(경비), `APV-2610-0087`(결재), `CARD ****-4821`
  - 기준 시점: **2026년 10월 경비 마감 (마감일 10월 31일, D-3 = 10월 28일 수요일)**
  - 금액: 원화 ₩ 표기, 천 단위 콤마, 표에서는 우측 정렬 tabular
  - 계정과목: 복리후생비, 여비교통비, 접대비, 회의비, 소모품비, 도서인쇄비, 통신비, 차량유지비
  - 가맹점(전부 가상, 실존 브랜드명 금지): 카페 온새미 역삼점, 한빛택시, 도담한정식 광화문, 사무나라 강남점, 바른인쇄 을지로, 늘봄도시락 판교점. 교통은 "KTX 서울→부산" 같은 노선 표기만 허용
  - 고객사 외 가상 기업(도입 사례·거래처): ㈜새움테크, 누리바이오, 온결로지스

---

## 2. ui-ux-pro-max 근거 — 채택 / 기각

실행한 쿼리
1. `--domain style "enterprise saas clean corporate"` → Flat Design / Minimalism & Swiss Style / Bento Box Grid
2. styles.csv 직접 조회 → **Enterprise SaaS (Mobile)** (#83, supplemental, parent: soft-ui-evolution), **Fluent 2** (#86)
3. `--domain style "data-dense dashboard analytics"` → **Data-Dense Dashboard**
4. `--design-system "b2b saas expense settlement fintech" -p "Corporate Clean SaaS" --variance 4 --motion 3 --density 8`
5. `--domain color "b2b saas fintech expense"` → B2B Service(navy+blue), Fintech/Crypto, Expense Splitter
6. `--domain typography "saas dashboard technical precise"` → Dashboard Data(Fira), Developer Mono(JetBrains+IBM Plex Sans), Friendly SaaS(Plus Jakarta)
7. `--domain google-fonts` "sans grotesk technical tabular"(엉뚱한 모노 결과) → 좁혀 재시도 "Inter Geist variable sans" / "korean sans-serif"
8. `--domain landing "saas documentation product reference"` → FAQ/Documentation Landing, Product Demo + Features
9. `--domain ux "data table density keyboard"`, `--domain chart "time series trend comparison budget"`

### 채택
| 출처 | 항목 | 반영 방식 |
|---|---|---|
| Enterprise SaaS 행 | 배경 Slate 50 계열 + 흰 표면, Slate 900 텍스트, Slate 200 보더, Emerald 성공 | 쿨그레이 캔버스 `#F5F6F8` / 표면 `#FFFFFF` / 텍스트 `#0E1116` / 헤어라인 `#DDE1E7` / 성공 `#0F7A45`(대비 맞춰 진하게) |
| Enterprise SaaS 행 | Do Not Use For "ultra-minimal editorial" | 크림·세리프·에디토리얼 여백 금지 근거 |
| Enterprise SaaS 행 | input radius 8, skeletal loading, reduced motion fallback | 컨트롤 반경 6px(조정), 스켈레톤은 "원장 줄" 모양, 감속 모션 대체 |
| Minimalism & Swiss | "Grid-based 12-16 columns", "accent-color: single primary only", "no box-shadow unless necessary" | 12단 그리드, 강조색 1개(코발트), 그림자는 오버레이에만 |
| Data-Dense Dashboard | table-row-height 36px, sidebar 240px, header 56px, 12-col, sticky headers, 12~14px 데이터 글자 | 행 높이 기본 40 / 컴팩트 32, 사이드바 232px, 상단바 56px, 표 헤더 sticky, 데이터 13px |
| design-system 출력 | Muted Foreground `#475569`, Ring = Primary, 경고: "Excessive animation + Dark mode by default" 회피 | 보조 텍스트 `#475162`, 포커스 링 = 코발트, **라이트가 정본**, 모션 최소 |
| color: B2B Service | "Professional navy + blue CTA", Primary navy `#0F172A` | 주요 버튼은 잉크(거의 검정) `#0E1116`, 링크·선택·포커스는 코발트 — 파란 버튼 범벅 회피 |
| typography: Developer Mono | IBM Plex Sans (기업 UI 계보) | 한글은 **IBM Plex Sans KR** (IBM 기업 서체의 한글판 — 코퍼레이트 DNA 정합) |
| google-fonts | Geist (rank 109, wght 100–900 가변) | 라틴 디스플레이·본문 **Geist**, 숫자/코드 **Geist Mono** |
| landing: Documentation | "Hero with search bar > categories" | index 첫 화면을 랜딩이 아닌 **문서 헤더 + 검색(⌘K)** 로 |
| ux: Bulk Actions, Keyboard Navigation, Table Handling | 체크박스 열 + 액션바, 완전한 키보드, 모바일 표는 카드형 전환 | 표 일괄 선택 시 하단 고정 액션바, 칸반 키보드 이동, 390px에서 표 → 원장 카드 행 |
| chart: Trend Over Time | 실선·점선 등 선 스타일 + 직접 라벨, 색만으로 구분 금지, 데이터 표 대체 | 예산선은 점선, 실적은 실선, 끝점 직접 라벨, 차트 아래 `<details>` 데이터 표 |

### 기각
| 출처 | 항목 | 기각 이유 |
|---|---|---|
| Enterprise SaaS 행 | Indigo `#4F46E5` → Violet `#7C3AED` 그라디언트 CTA, 컬러 카드 그림자 rgba(79,70,229,.08), pill 버튼 | v1의 AI티 정체 그 자체. 브리프 3절 "인디고/보라 그라디언트" 위반. 그라디언트 0개. |
| Enterprise SaaS 행 | Plus Jakarta Sans | 둥글고 친근 — 재무 도구의 단정함과 어긋남, 또한 "Inter 대안" 범용 기본값 |
| design-system 출력 | Style: **Glassmorphism** (backdrop blur 10–20px) | 경비·결재 도구에 반투명 유리는 판독성 저하. theme-04와도 겹침. 블러는 모달 배경 딤에도 쓰지 않음 |
| design-system 출력 | 패턴 "Hero + Features + CTA", 오렌지 CTA `#EA580C` | 브리프가 금지한 랜딩 공식. 오렌지 CTA는 정산 도구에서 경고색과 충돌 |
| design-system 출력 | GSAP ScrollTrigger 스크롤 리빌 | 외부 라이브러리 금지 + 문서/도구 UI에 스크롤 연출 불필요 |
| Bento Box Grid | radius 24px, hover scale 1.02 | 애플 마케팅 문법. 데이터 도구에선 흔들림. 대시보드는 벤토 대신 "원장 밴드"(4절) |
| Flat Design | 고채도 4~6색 | 재무 도구는 중립 + 1 강조 + 상태색만 |
| typography: Dashboard Data | Fira Code 헤딩 | 헤딩이 모노면 개발자 도구 톤 — 사용자는 재무팀 |
| Fluent 2 | 전체 채택 | Microsoft 플랫폼 관습 상속 불필요. 단 "semantic token + focus ring + density" 원칙만 참고 |

---

## 3. 팔레트

원칙: **중립 90% · 잉크 버튼 · 코발트 1색 강조 · 인주색은 도장에만.** 그라디언트 0, 배경 장식 0.

### Light (정본)
| 토큰 | hex | 용도 | 대비 (vs 표면 #FFFFFF / 캔버스 #F5F6F8) |
|---|---|---|---|
| `--canvas` | `#F5F6F8` | 페이지 바탕(앱 셸 외곽, index 좌측 목차) | — |
| `--surface` | `#FFFFFF` | 본문 면, 표, 문서 | — |
| `--surface-sunken` | `#ECEEF2` | 표 헤더, 코드 인라인, 입력 비활성, 스켈레톤 | — |
| `--surface-ink` | `#0E1116` | 다크 코드 패널, 툴팁, 토스트 | — |
| `--line` | `#DDE1E7` | 헤어라인(원장 괘선) 1px | 1.31 (장식선, 텍스트 아님) |
| `--line-strong` | `#B9C0CB` | 표 상단 2px 굵은 괘선, 결재란 칸 | 1.83 |
| `--line-control` | `#8A93A2` | 입력·체크박스·라디오 테두리 | **3.10** (WCAG 1.4.11 ≥3:1 충족) |
| `--text` | `#0E1116` | 본문·제목·금액 | **18.91 / 17.49** |
| `--text-2` | `#475162` | 보조 문장, 라벨, 표 헤더 | **8.01 / 7.41** |
| `--text-3` | `#5F6878` | 캡션, 메타, 날짜 (실텍스트 허용 최저선) | **5.62 / 5.20** |
| `--placeholder` | `#8A93A2` | 플레이스홀더 전용 | 3.10 (플레이스홀더 한정) |
| `--primary` | `#1D44D8` | 코발트 — 링크, 선택, 포커스 링, 활성 탭, 차트 실적선 | **7.32 / 6.77** |
| `--primary-hover` | `#1636B0` | 링크 hover, 선택 강조 | 9.59 |
| `--primary-tint` | `#EBF0FF` | 선택 행 배경, 활성 사이드바 항목 | primary 텍스트 on tint **6.42** |
| `--ink` | `#0E1116` | **주요 버튼 채움** | 흰 글자 on ink **18.91** |
| `--ink-hover` | `#262B35` | 주요 버튼 hover | — |
| `--stamp` | `#C2391A` | 인주색 — **결재 도장 전용** | **5.39 / 4.99**, on `#FFF3EF` 4.96 |
| `--success` | `#0F7A45` / tint `#E6F4EC` | 승인완료·지급완료 | 5.40 / on tint **4.76** · 흰 글자 on success 5.40 |
| `--warning` | `#9A5300` / tint `#FDF1DC` | 영수증 누락·한도 임박 | 5.82 / on tint **5.20** |
| `--danger` | `#B8122F` / tint `#FDE8EC` | 반려·한도 초과·삭제 | 6.63 / on tint **5.66** · 흰 글자 on danger 6.63 |
| `--info` | = primary | 안내 | — |
| 차트 | 실적 `#1D44D8`(실선), 예산 `#0E1116`(1px 점선), 전년 `#8A93A2`(점선 4 3), 보조 계열 `#0F7A45`, `#9A5300` | 시리즈는 색 + 선 스타일 + 직접 라벨 |

### Dark (동일 위계, 순수 검정 아님)
| 토큰 | hex | 대비 (vs 표면 #11141A / 캔버스 #0A0C10) |
|---|---|---|
| `--canvas` | `#0A0C10` | — |
| `--surface` | `#11141A` | — |
| `--surface-raised` | `#181C24` (모달·팝오버) | — |
| `--surface-sunken` | `#0D1015` | — |
| `--surface-ink` | `#E7EAF0` (툴팁·토스트를 반전) | — |
| `--line` | `#262B35` | 1.30 |
| `--line-strong` | `#3A414E` | 1.80 |
| `--line-control` | `#5E6776` | **3.23** |
| `--text` | `#E7EAF0` | **15.30 / 16.24** |
| `--text-2` | `#A0A9B8` | **7.78 / 8.26** |
| `--text-3` | `#8A94A4` | **6.02 / 6.39** (raised 5.57) |
| `--primary` | `#7C95FF` (텍스트·링·선) | **6.67 / 7.08**, raised 6.18 |
| `--primary-tint` | `#18213F` | primary on tint **5.72** |
| `--primary-fill` | `#3B5BF0` (선택된 세그먼트 등 채움) | 흰 글자 **5.33** |
| `--ink` (주요 버튼) | `#E7EAF0` 채움 + `#0A0C10` 글자 | **16.24** |
| `--stamp` | `#FF7452` / tint `#2A1510` | **6.91**, on tint 6.49 |
| `--success` | `#45C58C` / tint `#0F2A1E` | 8.45 / on tint 7.02 |
| `--warning` | `#EBA53F` / tint `#2D2110` | 8.77 / on tint 7.47 |
| `--danger` | `#FF7A8E` / tint `#33141B` | 7.40 / on tint 6.71 |

다크에서 그림자는 쓰지 않고 `--surface-raised` + `--line-strong` 1px 테두리로 층을 표현.

---

## 4. 타이포그래피

Google Fonts 단일 `<link>` (모든 HTML 동일, tokens.css @import 금지):
```
https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap
```

| 역할 | 라틴 | 한글 | 스택 |
|---|---|---|---|
| 디스플레이·제목 | Geist 600/700 | IBM Plex Sans KR 600/700 | `--font-sans: "Geist", "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif` |
| 본문·UI | Geist 400/500 | IBM Plex Sans KR 400/500 | 동일 |
| 숫자·금액 | Geist + `font-variant-numeric: tabular-nums` | — | 금액은 모노 아님(가독성), 정렬은 tnum |
| 코드·문서번호·카드번호·토큰명 | Geist Mono 400/500 | (한글 섞이면 Plex KR 폴백) | `--font-mono: "Geist Mono", "IBM Plex Sans KR", ui-monospace, monospace` |

근거: Geist는 Vercel 계보의 정밀한 그로테스크(가변 100–900, tnum 지원) → "개발자 도구급 정밀함". IBM Plex Sans KR은 IBM 기업 서체의 한글판으로 획이 단정하고 숫자·라틴과 폭이 잘 맞음 → "회사 문서" 무드. Inter/Gothic A1(v1)·Pretendard(구글폰트 아님)·세리프 전부 배제.

### 스케일 (px / line-height / weight / letter-spacing)
| 토큰 | 크기 | LH | 굵기 | 자간 | 용도 |
|---|---|---|---|---|---|
| `--fs-display` | 56 | 1.08 | 600 | -0.035em | index 문서 제목 1회, 대시보드 마감 핵심 금액 |
| `--fs-h1` | 36 | 1.15 | 600 | -0.025em | 페이지 제목 |
| `--fs-h2` | 24 | 1.25 | 600 | -0.02em | 섹션 제목 (좌측 정렬, 번호 동반) |
| `--fs-h3` | 17 | 1.35 | 600 | -0.01em | 컴포넌트 엔트리 제목, 패널 제목 |
| `--fs-body-lg` | 15 | 1.7 | 400 | 0 | 문서 설명 문단 (한글 본문) |
| `--fs-body` | 14 | 1.6 | 400 | 0 | UI 기본 |
| `--fs-data` | 13 | 1.45 | 400/500 | 0 | 표 셀, 리스트 메타 |
| `--fs-caption` | 12 | 1.4 | 500 | 0.01em | 캡션, 표 헤더(대문자 변환 없음) |
| `--fs-micro` | 11 | 1.3 | 600 | 0.02em | 결재란 칸 머리(담당/팀장/재무/대표), 도장 글자 |
| `--fs-kpi` | 40 | 1.1 | 600 | -0.03em | 보조 KPI 금액 |

규칙: 스케일 대비는 **56 ↔ 13** (4.3배)로 크게. 한 화면에 56px은 1개만. 섹션 번호(`§2.4`, `4.12`)는 Geist Mono 12px `--text-3`로 제목 왼쪽 행잉. 전 HTML `word-break: keep-all; overflow-wrap: anywhere;`.

---

## 5. 레이아웃 문법 — "문서 3단 + 원장 행"

v1은 `중앙 max-width 컨테이너 + 가운데 섹션 헤더 + 둥근 카드 그리드`의 반복이었다. v2는 **Stripe API 레퍼런스식 문서 구조**와 **회계 장부의 괘선 행**으로 짠다.

1. **카드 금지, 괘선 우선.** 정보 묶음은 박스가 아니라 위 1px `--line` 괘선 + 아래 여백으로 구분. 표·리스트는 좌우 테두리 없이 컨테이너 끝까지(full-bleed) 달린다. 테두리 박스는 ①결재 문서, ②오버레이, ③입력 컨트롤에만.
2. **12단 그리드, 거터 24px(데스크톱) / 16px(≤768).** 콘텐츠는 대칭이 아니라 **4 : 8** (설명 : 표본) 또는 **3 : 9** (메타 : 본문) 분할. 6:6 금지.
3. **행 단위 리듬 = 40px "원장 행"**. 표 행 40px(기본) / 32px(컴팩트) / 48px(여유), 리스트·사이드바 항목·탭 높이도 40px 배수로 맞춘다. 수직 간격 스케일: 4, 8, 12, 16, 24, 40, 64, 96.
4. **행잉 번호 거터**: index 본문 왼쪽에 64px 거터를 두고 섹션 번호를 내어 단다(문서 조항식). 제목은 항상 **좌측 정렬**, 가운데 정렬 섹션 헤더 0개.
5. **숫자는 오른쪽, 글자는 왼쪽.** 금액·건수·비율 열은 우측 정렬 tnum, 합계 행은 위 2px `--line-strong` 이중 괘선(장부 합계선).
6. **index 데스크톱 골격**: `232px 좌측 목차(고정, --canvas) | 본문(--surface)`. 본문 내부 컴포넌트 장에서는 `설명 5단 | 표본 7단`, **설명 열과 표본 열 모두** `position: sticky; top: 72px`(짧은 쪽이 긴 쪽을 따라와 빈 칸이 생기지 않게). 6:6 쌍(스트립)은 장당 최대 1개.
7. **앱 페이지 골격**: 상단바 56px + 사이드바 232px + 콘텐츠 12단. 페이지 머리말은 `제목(좌) ↔ 메타·액션(우)` 한 줄, 그 아래 1px 괘선. 첫 화면에 "히어로" 없음.
8. **섹션마다 밀도가 다르다**: 색 장은 촘촘한 표(행 40), 타이포 장은 넓은 기준선 자(행 간 96), 컴포넌트 장은 엔트리당 위아래 64, 페이지 목록은 문서함 표. 같은 max-width·같은 패딩 반복 금지 — 본문 폭도 장마다 720 / 1040 / 전폭을 오간다.
9. **모바일(≤640)**: 행잉 번호 해제 — § 번호는 제목 앞 8px 인라인. 차트는 고정폭 가로 스크롤 대신 viewBox 축소 + 눈금 3개 + 선 끝 라벨은 범례 줄로. **(360~390)**: 좌측 목차 → 상단 고정 "목차" 셀렉트 + 드로어. 4:8 분할 → 세로 스택(설명 위, 표본 아래). 표 → "원장 카드 행"(각 행이 2줄: 좌 거래처/계정, 우 금액; 괘선 유지). 가로 스크롤 0, 탭 타깃 44px.

---

## 6. 시그니처 (2개, 끝까지)

### 시그니처 A — 결재란 (Approval Line Grid)
한국 회사 문서 우측 상단의 **도장 칸**을 UI 언어로 만든다.
- 형태: 칸 너비 64px(모바일 52px), 머리 행 22px(`--fs-micro`, `--surface-sunken`, 글자 "담당/팀장/재무/대표"), 도장 행 56px. 칸 사이·외곽 1px `--line-strong`, radius 0.
- 상태: 승인 = 지름 40px 원형 도장(2px `--stamp` 테두리, 안쪽 이름 2자 `--stamp` 600, -8° 회전) + 칸 아래 `10.27 14:02` Geist Mono 11px / 대기 = 빈 칸 + 점선 원(1px dashed `--line-control`) / 현재 차례 = 칸 배경 `--primary-tint` + 2px `--primary` 하단선 / 반려 = 도장 대신 `반려` 사각 인(2px `--danger`, 회전 없음) + 사유 툴팁 / 전결 = 대각선 1px `--line-strong` 사선.
- 시스템 전반 적용:
  - **steps** = 결재란 가로 진행 (번호 원 대신 칸)
  - **badge**의 결재 상태형 = 미니 결재란(칸 4개 8×8px, 채워진 칸 수로 진행도) + 텍스트 "2/4 승인"
  - **timeline** = 결재 이력: 좌측 축에 미니 도장 아이콘
  - **progress**의 결재형 = 칸 분절 바(연속 바가 아니라 n칸)
  - **toast** "승인 완료" = 좌측에 24px 도장
  - **empty** = 빈 결재란 일러스트(CSS로 그림)
  - **404** = 반려 도장 찍힌 문서
  - index 문서 머리 = 이 디자인 레퍼런스 릴리스 자체의 결재란(작성 김하늘 · 검토 박도윤 · 승인 이서진)
- 인주색 `--stamp`는 **원형 도장 외 사용 금지**. 미니 결재란(배지·칸반 카드·표)의 완료 칸은 `--text`(잉크)로 채우고, 반려 칸·반려 사각 인만 `--danger`. 8px 칸에서 인주색과 위험색은 구분되지 않으므로, 진행 상태는 칸 옆 글자("3/3", "전결", "반려 1/3")로도 반드시 쓴다.

### 시그니처 B — 원장 괘선 + 탭룰러 숫자 (Ledger Rules)
- 모든 데이터 묶음의 머리에 **2px `--text` 상단 괘선**(장부 머리줄), 행 사이 1px `--line`, 합계 행 위 **1px + 2px 간격 이중선**(`border-top: 3px double var(--line-strong)`).
- 숫자 열 우측 정렬 tnum, 통화 기호 `₩`는 숫자 앞 붙임, 음수(환급·취소)는 `−₩12,000` 형태로 `--danger`가 아니라 `--text-2` + 괄호 없이.
- 적용: table, list, card(결재 문서), pricing 비교, kanban 카드 금액 줄, calendar(날짜 셀 괘선 격자), skeleton(괘선 행 모양 그대로 회색 막대), sidebar(섹션 사이 괘선), accordion(괘선 행 펼침), pagination(“1–40 / 1,284건” tnum).
- 포커스·선택은 괘선 위에서: 선택 행 = 좌측 2px `--primary` 바 + `--primary-tint` 배경.

---

## 7. 모션 문법

- 토큰: `--dur-1: 90ms`(hover·press), `--dur-2: 160ms`(드롭다운·툴팁·탭 인디케이터), `--dur-3: 240ms`(모달·드로어·토스트), `--ease-out: cubic-bezier(.2,0,0,1)`, `--ease-in: cubic-bezier(.4,0,1,1)`.
- 원칙: **움직임은 상태 변화의 증거로만.** 스크롤 리빌·패럴랙스·무한 루프 장식 0개 (marquee 제외, 아래 참조).
- 시그니처 모션 = **도장 찍힘**: 승인 시 도장 `scale(1.25) rotate(-14deg) opacity 0 → scale(1) rotate(-8deg) opacity 1`, 200ms `cubic-bezier(.3,1.4,.5,1)`(살짝 눌림), 동시에 칸 배경 `--primary-tint` → 투명 240ms. 한 번만.
- 표 행 추가: 새 행 배경 `--primary-tint` → 투명 1200ms 페이드(“방금 들어온 카드 승인 내역”).
- 숫자 변경: 카운트업 없음. 바뀐 숫자 아래 1px `--primary` 밑줄 600ms 후 사라짐.
- 모달: opacity 0→1 + translateY(8px→0) 240ms. 드로어: translateX(100%→0) 240ms. 버튼 press: translateY(1px), scale 없음.
- `prefers-reduced-motion: reduce` → 모든 duration 0.01ms, 도장은 최종 상태로 즉시 표시, marquee 정지 + 정적 목록.

---

## 8. 32개 컴포넌트 처리 원칙

공통: radius 컨트롤 6px / 패널·오버레이 8px / 표·괘선·결재란 0 / 배지 4px. 그림자는 오버레이에만 `0 1px 0 var(--line), 0 12px 32px -12px rgb(14 17 22 / .22)`. 포커스 = `outline: 2px solid var(--primary); outline-offset: 2px`. 상태는 항상 색 + 텍스트(+아이콘) 병행. 컨트롤 높이 32 / 40(기본) / 48, 모바일 최소 44.

| 컴포넌트 | 형태 | 상태 표현 |
|---|---|---|
| accordion | 괘선 행(40px), 우측 `+`/`−` 12px, 박스 없음 — "계정과목별 규정" | 열림: 제목 600 + 좌측 2px ink 바, 내용 들여쓰기 24px |
| alert | 전폭 띠, 좌측 3px 상태색 바 + 상태 tint 배경, radius 0 | info/success/warning/danger, 닫기 가능형, 액션 링크 1개 |
| badge | 4px radius, 높이 22px, 12px 500, tint 배경 + 상태색 글자 / 결재 진행형(미니 결재란) | 제출됨·결재중·승인·반려·지급완료·영수증누락 |
| breadcrumb | `/` 구분자 Geist Mono `--text-3`, 마지막 항목 `--text` 500 | 현재 `aria-current="page"` |
| button | 주요 = ink 채움 / 보조 = surface + `--line-control` 1px / 고스트 / 위험 = danger 채움 / 링크형 코발트. 키보드 힌트 `⌘↵` 박스 내장 가능 | hover 배경 한 단계, press 1px 내려감, disabled 40% 아님 → `--surface-sunken` + `--text-3`, loading = 좌측 12px 스피너 + 라벨 유지 |
| calendar | 7열 괘선 격자, 셀 72px(데스크톱)/44px(모바일), 날짜 Geist Mono 우상단, 셀 안 경비 건수·금액 tnum — "10월 마감 달력" | 오늘 = 2px primary 테두리, 마감일 31일 = `--danger` 텍스트 "마감", 선택 = primary-tint |
| card | **결재 문서 카드**만 박스: 8px radius, 1px `--line`, 머리에 문서번호(mono)·우측 미니 결재란, 본문 괘선 행, 바닥 합계 이중선 | hover = 테두리 `--line-strong`, 선택 = 2px primary 테두리 |
| carousel | 영수증 이미지(CSS로 그린 감열지 영수증) 가로 스냅, 하단 `2 / 5` tnum + 화살표 버튼 | 스와이프·키보드 ←→, 현재 슬라이드 aria-live |
| code | `--surface-ink` 다크 패널(라이트에서도 다크), Geist Mono 13/1.6, 상단 파일명 탭 + 복사 버튼 — "웹훅 페이로드 `expense.approved`" | 복사됨: 버튼 라벨 "복사됨" 1.5초 |
| command | ⌘K 팔레트 640px, 입력 48px, 그룹 머리(최근 문서/명령/직원), 행 40px, 우측 단축키. `role="combobox"` + listbox + `aria-activedescendant` | 활성 행 primary-tint + 좌 2px 바, 결과 없음 문구 |
| drawer | 우측 480px, 상단 문서번호 + 닫기, 본문 괘선 행, 하단 고정 액션바(반려 / 승인) | 열림 시 포커스 트랩, Esc 닫기 |
| empty | 빈 결재란 CSS 그림 + 한 줄 설명 + 행동 1개 — "이번 달 제출한 경비가 없습니다" | 검색 결과 없음 / 권한 없음 변형 |
| form | 라벨 위 13px 500, 입력 40px, 1px `--line-control`, 금액 입력은 우측 정렬 tnum + `₩` 접두, 사업자번호 마스크 `000-00-00000`, 체크/라디오/토글/셀렉트/파일(영수증 업로드 영역) | focus 2px primary 링, invalid = danger 테두리 + 아이콘 + 메시지, 도움말 `--text-3` |
| kanban | 열 = 정산 단계, 열 머리 2px ink 괘선 + 건수·합계 tnum, 카드 = 괘선 미니 문서(문서번호·직원·금액·미니 결재란) | 드래그 중 = 점선 자리표시 + 그림자, 키보드: Space 집기 → ←→ 이동 → Space 놓기, aria-live 안내 |
| list | 괘선 행 리스트, 좌 아바타(이니셜 사각 24px, radius 4) / 중 제목+메타 / 우 금액 | hover 배경 `--surface-sunken`, 선택 좌 2px 바 |
| marquee | 상단바 아래 32px 실시간 "카드 승인 티커" — `14:02 · 영업2팀 최민재 · 도담한정식 광화문 · ₩186,000` 괘선 구분 | hover/focus 시 정지, 일시정지 버튼 필수, reduced-motion 정지 |
| menu | 행 36px, 그룹 사이 괘선, 위험 항목 하단 분리(danger 글자), 우측 단축키 | 화살표 키 이동, Esc 닫기, `role="menu"` |
| modal | 560px, 8px radius, 머리 제목 + 닫기, 하단 액션 우측 정렬(취소 / 주요). 딤 `rgb(14 17 22 / .48)`, 블러 없음 | 확인형·폼형·위험확인형(문서번호 입력해야 삭제 활성) |
| motion | 도장 찍힘·행 하이라이트·밑줄 표식 시연 패널 + 재생 버튼 | reduced-motion 시 최종 상태 + 안내 문구 |
| navbar | 56px, 좌 워드마크 + 워크스페이스 전환("㈜한결물산 ▾"), 중앙 없음, 우 ⌘K 검색·알림·테마·아바타. 하단 1px 괘선 | 알림 숫자 배지 tnum |
| pagination | `1–40 / 1,284건` + 페이지 크기 셀렉트 + 이전/다음 + 번호(현재 = ink 채움 6px radius) | 모바일은 "이전 / 3 / 33 / 다음" 축약 |
| popover | 320px, 8px radius, 오버레이 그림자, 화살표 없음 — "가맹점 정보" | 바깥 클릭·Esc 닫기, 포커스 복귀 |
| progress | 선형 4px 바(radius 0) + 우측 % tnum / 예산 소진형(80% 지점 수직 틱) / 결재 분절형(n칸) | 80%↑ warning, 100%↑ danger + "초과" 텍스트 |
| sidebar | 232px, `--canvas` 배경, 섹션 머리 12px `--text-3`, 항목 36px, 섹션 사이 괘선, 카운트 우측 tnum | 활성 = surface 배경 + 좌 2px ink 바 + 600 |
| skeleton | 괘선 행 모양 그대로(행 40px, 막대 높이 10px, `--surface-sunken`), 시머 대신 1.2s 불투명도 펄스 | reduced-motion 정적 |
| spinner | 16px 원호(1.5px stroke, currentColor) — 장식 조리개 없음 | 버튼 내장 / 단독 + 라벨 "불러오는 중" |
| steps | **결재란 가로형**(시그니처 A) / 온보딩용 숫자형(1 회사 정보 · 2 카드 연동 · 3 결재선 · 4 회계 연동) 좌 정렬 | 완료·현재·대기·오류 |
| table | 머리 2px ink 괘선, 헤더 12px `--text-2` sunken 배경 sticky, 행 40/32/48, 숫자 우측 tnum, 합계 이중선, 체크박스 열 + 일괄 액션바 | 정렬 화살표, 선택 행, hover, 빈 결과 행, 밀도 토글 |
| tabs | 밑줄형: 텍스트 + 활성 2px ink 하단 바(160ms 슬라이드), 카운트 tnum / 세그먼트형(기간 7일·30일·분기) | 화살표 키, `aria-selected` |
| timeline | 좌 축 1px 괘선, 마디 = 미니 도장(승인)·빈 원(대기)·사각(반려), 우측 시각 mono | 최신이 위 |
| toast | 하단 좌측(우측 아님) 360px, `--surface-ink` 반전 면, 좌 24px 아이콘/도장, "실행 취소" 링크, 5초 진행선 | 호버 시 일시정지, aria-live polite. **자기 홍보 토스트 금지** |
| tooltip | `--surface-ink` 반전, 12px, 6px radius, 지연 300ms | hover·focus 표시, Esc 해제(WCAG 1.4.13) |

---

## 9. index.html 구성안 — "레저라인 UI 레퍼런스 2.4" (Stripe API 문서 장르)

골격: 좌측 232px 고정 목차(`--canvas`, 장 번호 + 32개 엔트리 링크, 현재 위치 하이라이트) | 우측 본문. 상단바 56px(워드마크 · "UI 레퍼런스" · 버전 셀렉트 `2.4.0 ▾` · ⌘K 검색 · 테마 토글 · "제품 화면" 링크).

| 장 | 구도 (서로 다름) | 내용 |
|---|---|---|
| **문서 머리** | 3 : 9가 아니라 **8 : 4 비대칭** — 좌: 문서번호 `DS-2610-024` mono, 제목 56px "레저라인 UI 레퍼런스", 메타 줄(갱신 2026.10.08 · 담당 디자인시스템팀 · 적용 제품 웹 7.12) / 우: 이 릴리스의 **결재란**(작성·검토·승인 도장 시연, 진입 시 도장 찍힘 모션 1회). 아래 1px 괘선 후 "이번 개정 사항" 4행 원장 표(변경 유형 배지 · 항목 · 영향 범위). 히어로·CTA·칩 없음 |
| **1 원칙** | 전폭 **3열 조항 텍스트**(박스 없음, 번호 행잉) — 1.1 숫자는 오른쪽에 / 1.2 상태는 글자로도 말한다 / 1.3 도장은 결재에만. 각 조항 2~3줄 + 실제 화면 예 링크 | 디자인 시스템 자랑 문구 금지, 규칙 문장만 |
| **2 색** | **원장 표**(전폭 1040px): 토큰명 mono · 24px 견본 · 라이트 hex · 다크 hex · 표면 대비(예 18.91:1, 통과 배지) · 쓰임. 아래 "인주색 사용 제한" 경고 alert | 스와치 램프 진열 금지 |
| **3 타이포** | **기준선 자**: 넓은 행(96px) 안에 각 크기 표본 한 줄, 좌측 64px 거터에 `56/60 · 600` mono. 한글은 라틴 baseline이 아니라 글자 몸(em 상자)에 앉으므로 선은 글자 뒤 층에 35% 코발트로 — 바닥선(글리프 아래 2px) + 제목급 줄만 가운데 점선. 글자를 관통하는 선 금지. 한글 표본 문장은 실제 화면 문구("10월 경비 마감까지 3일 남았습니다") | 숫자 tnum vs 비례 숫자 비교 1행 |
| **4 간격·밀도** | **같은 표 3개를 나란히**(컴팩트 32 / 기본 40 / 여유 48) — 각 5행 경비 데이터, 위에 밀도 세그먼트 토글로 전체 문서 밀도 전환 | 모바일은 세그먼트로 하나씩 |
| **5 시그니처** | **좌 4단 설명 / 우 8단 대형 결재란 해부도** — 칸 치수 redline(64 / 22 / 56px 치수선, 1px primary 점선 + mono 라벨), 상태 5종(승인·대기·현재·반려·전결) 나란히 | 도장 찍힘 재생 버튼 |
| **6~11 컴포넌트** | **Stripe API 레퍼런스식 2열**: 좌 5단 = 엔트리 번호·제목·설명 2줄·**속성 표(속성 / 설명 / 기본, 엔트리 안에 펼쳐 둠 — 장 끝 접힘 일람 없음)** · 상태 목록 / 우 7단 = sticky 표본 패널(1px 괘선 프레임, 상단에 "미리보기 / 코드" 탭). **장마다 구도를 하나씩 깬다**: 6 = 쌍 1 + 5:7 / 7 = 5:7 둘 + 3단 스트립 + 쌍 1 / 8 = **전폭 회색 무대 하나에 모달·드로어·팝오버·툴팁·토스트를 겹쳐 펼친 그림(층마다 `8.n` 꼬리표) + 아래 3단 조항 표(이름 3 · 설명 4 · 속성 5)** / 9 = **3단 조항 스트립 둘**(설명 · 표본 · 속성 3행 subgrid) / 10 = 전폭 표 · 쌍 1 · 5:7 · 뒤집힌 7:5 · 전폭 칸반 · 5:7 · 뒤집힌 7:5 / 11 = 쌍 1 + 전폭. 장 구분: 6 입력(button, form, command), 7 탐색(navbar, sidebar, breadcrumb, tabs, pagination, menu, steps), 8 오버레이(modal, drawer, popover, tooltip, toast), 9 피드백(alert, badge, progress, spinner, skeleton, empty), 10 데이터(table, list, card, calendar, timeline, kanban, carousel, code), 11 레이아웃·모션(accordion, marquee, motion) | 엔트리마다 표본 크기가 다름(table은 우측 패널 대신 전폭으로 깨고 나옴 — 리듬 변화) |
| **12 제품 화면** | **문서함 표**: 문서번호 · 화면명 · 장면 설명 · 담당 · 상태 배지(배포됨/검토중) · 링크 → 9개 pages | 카드 썸네일 그리드 금지 |
| **꼬리** | 개정 이력 원장(2.4.0 / 2.3.2 / 2.3.0 …) + 작성 정보 한 줄 | 푸터 마케팅 링크 없음 |

모바일: 목차는 상단 "목차 ▾" 버튼 → 좌측 드로어. 컴포넌트 2열 → 설명 위/표본 아래. 결재란은 52px 칸으로 축소해 4칸이 358px 안에 들어감.

---

## 10. 9개 페이지 장면 시나리오 (㈜한결물산 워크스페이스, 2026년 10월 28일)

1. **dashboard — "10월 경비 마감 현황"**: 머리말에 `마감 D-3` + 핵심 숫자 하나(10월 승인 경비 **₩184,320,500**, 56px)와 미제출 영수증 37건·결재 대기 12건을 원장 밴드로. 부서별 예산 소진율 막대(예산선 점선, 영업2팀 92% warning), 일별 카드 사용 추이(실적 실선 vs 9월 점선), 하단 "결재 대기" 원장 표 12행 + 일괄 승인 액션바. 상단 카드 승인 marquee.
2. **inbox — "결재함"**: 3패널 — 좌 폴더(받은 결재 12 / 상신함 / 참조 / 반려됨), 중 결재 문서 리스트(문서번호·기안자·금액·미니 결재란), 우 문서 본문: 지출결의서 `EXP-2610-0412`(영업2팀 최민재, 거래처 접대 ₩186,000) + 결재란(현재 차례: 재무 박도윤) + CSS 영수증 캐러셀 + 의견 스레드 + 하단 반려/승인 버튼(승인 시 도장 모션).
3. **kanban — "정산 파이프라인"**: 열 = 영수증 접수 → 증빙 확인 → 결재 중 → 지급 예정(11월 5일) → 지급 완료, 열 머리에 건수·합계 tnum. 카드 = 경비 건(직원·계정과목·금액·미니 결재란·영수증 누락 경고 배지). 키보드 이동 지원.
4. **onboarding — "워크스페이스 개설"**: 좌 3단 고정 숫자 steps(회사 정보 · 법인카드 연동 · 결재선 설정 · 회계 ERP 연동) / 우 9단 폼. 3단계에서 금액 구간별 결재선을 결재란으로 직접 조립(칸 추가·순서 변경)하는 장면이 핵심.
5. **pricing — "요금 안내"**: 카드 3단 트리오 대신 **좌 견적 계산기**(임직원 수 슬라이더 214명 → 월 ₩1,177,000, 연간 결제 시 할인 원장) + **우 플랜 비교 원장 표**(스타터 / 비즈니스 / 엔터프라이즈 열, 기능 행 괘선, 합계 행 이중선). 하단 결제 FAQ 아코디언.
6. **product — "법인카드 자동 대사"**: 제품 기능 문서 페이지. 좌 목차 + 본문: 카드 승인 → 영수증 매칭 → 계정과목 추천 → 결재 상신 4단계를 괘선 다이어그램(CSS)으로, 실제 매칭 예시 표(승인 내역 vs 영수증, 일치/불일치 배지), 웹훅 코드 블록 `expense.matched`, 도입사 수치 원장(가상 고객사 3곳).
7. **profile — "김하늘 · 경영지원팀 매니저"**: 좌 4단 인적 정보 원장(사번 HG-2019-0412, 소속, 결재 권한 ₩500,000 이하 전결) / 우 8단: 보유 법인카드 2장(CSS 카드 면, 한도 소진 progress), 최근 정산 내역 표, 결재 위임 설정(휴가 기간 10.30~11.03 → 박도윤).
8. **settings — "결재 규칙"**: 좌 서브내비(일반 · 결재 규칙 · 계정과목 · 카드 · 알림 · 보안 · 감사 로그) / 본문: 금액 구간별 결재선 표(₩500,000 이하 팀장 전결 / ₩5,000,000 이하 팀장→재무팀장 / 초과 →대표이사) 각 행에 결재란, 계정과목 매핑 표, 알림 토글 원장, 위험 영역(워크스페이스 해지 — 문서번호 입력 확인 모달).
9. **404 — "문서를 찾을 수 없습니다"**: 화면 중앙이 아닌 좌측 정렬 결재 문서 형식. 문서번호 `ERR-404`, 결재란 마지막 칸에 **반려** 인, 반려 사유 "요청한 주소의 문서가 없거나 보관 기간이 지났습니다", 액션: 결재함으로 / ⌘K 문서번호 검색, 최근 본 문서 5행 리스트.

---

## 11. v1에서 버릴 것

- 랜딩 공식 전체: eyebrow, 3줄 헤드라인, 한 단어 그라디언트 강조(`.grad-text`), CTA 쌍, 기능 칩
- ●●● 신호등 + URL바 브라우저 목업, 히어로 미니 대시보드 프리뷰
- 인디고 #4F46E5 / 보라 / 블루 3색 그라디언트, 남색 radial 글로우, `bg-grid` 도트 배경
- 대형 조리개 장식 라인 SVG, 조리개 로고 모티프 ("Aperture" 브랜드 자체 폐기)
- 가운데정렬 "라벨 → 제목 → 부제" 섹션 헤더, "검증된 토큰…", "상태까지 설계된 컴포넌트" 등 자기 홍보 카피
- 둥근 카드에 컴포넌트를 하나씩 담은 갤러리, 50~900 스와치 램프 진열, 엘리베이션 박스 데모
- 모든 요소 동일 9px radius + 소프트 그림자
- 아이콘 칩 달린 동일 KPI 카드 그리드, 범용 "트래픽 소스" 도넛, 사이드바 "Pro 플랜 좌석" 업셀 카드
- 전 페이지 "팁 · ⌘K" 홍보 토스트
- Inter + Gothic A1, Noto Serif KR/Noto Sans KR 유령 import, tokens.css @import 폰트 로드
- 범용 "분석 대시보드 / 매출·이탈률·트래픽" 세계관 (→ 경비 정산·결재 세계로 교체)
- 인라인 `grid-template-columns`, 390px 가로 넘침, SVG 속성 `var()`, `href="#"`
- 중앙정렬 404 + 나침반 일러스트
