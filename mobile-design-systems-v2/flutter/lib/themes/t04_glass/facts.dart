// DIRECTION.md 팩트 시트 정본.
class YunseulFacts {
  static const brand = "윤슬홈";
  static const house = "주원네 집";
  static const homeAddress = "윤슬힐 104동 1802호";
  static const date = "10월 10일 토요일";
  static const lightClock = "17:42";
  static const darkClock = "22:40";
  static const basis = "데이터 17:42 기준";
  static const weather = "맑음 · 외부 17°C · 일몰 18:03";
  static const nightWeather = "맑음 · 외부 13°C · 일몰 18:03";
  static const hub = "윤슬 허브 H2";
  static const hubId = "H2-88213-KR";
  static const firmware = "4.2.1";
  static const updateVersion = "4.3.0";
  static const lamp = "윤슬 무드등 L2";
  static const lampId = "YS-LGT-102";
  static const lampPrice = "₩89,000";
  static const lampReview = "4.8 · 리뷰 1,284";
  static const lampSpec = "2,200–6,500K · 1,600만 색 · 배터리 12시간";
  static const delivery = "10월 13일(화) 도착 예정";
  static const order = "YS-2610-008413";
  static const existingOrder = "무드등 L2 심해 1개 + A3 필터 1개 · ₩121,000";
  static const user = "이주원";
  static const pet = "콩이 움직임 · 17:31";
  static const energy = "오늘 6.4kWh";
  static const energyForecast = "예상 ₩28,940 · 전월 대비 −8.4%";
  static const arrivalRule =
      "귀가 · 17:00–22:00\n거실 메인등 70% · 3,000K\n무드등 40% · 에어컨 24°C";
  static const doNotDisturb = "23:00–07:00";
  static const hubProgress = "62%";
  static const calendarEvent = "10월 14일(수) 10:00–12:00 · 승강기 점검";
  static const guest = "김순례 · 18:30 방문 예정";
  static const lampPriceValue = [89000];
  static const brightness = [70, 40, 55];
  static const rooms = [
    ["거실", "7"],
    ["주방", "3"],
    ["안방", "4"],
    ["도하 방", "3"],
    ["서재", "0"],
    ["현관", "3"],
    ["욕실", "1"],
    ["발코니", "2"],
  ];
  static const devices = [
    ["YS-LGT-101", "거실 메인등", "거실", "켜짐 · 밝기 70% · 3,000K"],
    ["YS-LGT-102", "무드등 L2 (호박)", "거실", "켜짐 · 40% · 2,200K"],
    ["YS-LGT-201", "주방 펜던트", "주방", "꺼짐"],
    ["YS-LGT-301", "안방 간접등", "안방", "꺼짐"],
    ["YS-LGT-401", "도하 방 스탠드", "도하 방", "켜짐 · 55% · 취침 타이머 21:30"],
    ["YS-CLM-101", "거실 에어컨", "거실", "송풍 · 목표 24°C"],
    ["YS-CLM-102", "공기청정기 A3", "거실", "오프라인 (15:12부터) · 필터 잔량 8%"],
    ["YS-CLM-001", "전열교환기", "집 전체", "자동 · 1단"],
    ["YS-CLM-301", "보일러 안방 존", "안방", "대기 · 예약 22:00 23°C"],
    ["YS-SEC-001", "현관 도어락 D7", "현관", "잠김 · 배터리 74%"],
    ["YS-SEC-002", "현관 카메라", "현관", "녹화 중"],
    ["YS-SEC-101", "펫캠", "거실", "녹화 중 · 콩이 움직임 17:31"],
    ["YS-APL-201", "식기세척기", "주방", "건조 중 · 남은 시간 24분"],
    ["YS-APL-801", "세탁기", "발코니", "완료 17:05"],
    ["YS-APL-802", "건조기", "발코니", "대기"],
    ["YS-SEN-501", "욕실 습도 센서", "욕실", "오프라인 · 배터리 0%"],
    ["YS-ENG-001", "스마트 분전반", "집 전체", "실시간 412W"],
  ];
  static const members = [
    ["이주원", "관리자"],
    ["한서연", "관리자"],
    ["이도하", "어린이"],
    ["김순례", "게스트"],
  ];
  static const events = [
    ["14:10", "승강기 점검 공지", "단지", "10월 14일(수) 10:00–12:00"],
    ["15:12", "공기청정기 A3 연결 끊김", "가전", "필터 잔량 8% · YS-CLM-102"],
    ["15:48", "도하 귀가", "보안", "지문"],
    ["16:20", "택배 도착", "생활", "무인택배함 B-12 · 늘봄마켓"],
    ["16:55", "방문 차량 등록 완료", "보안", "12가 3456 · 김순례 18:30–21:00"],
    ["17:02", "주원 귀가", "보안", "비밀번호"],
    ["17:05", "세탁 완료", "가전", "YS-APL-801"],
    ["17:18", "게스트 임시 비밀번호 발급", "보안", "유효 18:00–21:30"],
    ["17:31", "펫캠 움직임 감지", "보안", "콩이"],
    ["17:36", "욕실 센서 배터리 0%", "가전", "YS-SEN-501"],
    ["17:40", "허브 4.3.0 다운로드 중", "윤슬홈", "62%"],
    ["이번 주", "윤슬 스토어 주문 배송", "생활", "YS-2610-008413 · 10월 13일(화) 도착 예정"],
  ];
  static String money(num value) =>
      "₩${value.round().toString().replaceAllMapped(RegExp(r"(\d)(?=(\d{3})+$)"), (m) => "${m[1]},")}";
}
