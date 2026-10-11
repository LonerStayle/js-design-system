package com.jinsup.ds.t04_glass

// DIRECTION.md 팩트 시트 정본.
object YunseulFacts {
  const val brand = "윤슬홈"
  const val house = "주원네 집"
  const val homeAddress = "윤슬힐 104동 1802호"
  const val date = "10월 10일 토요일"
  const val lightClock = "17:42"
  const val darkClock = "22:40"
  const val basis = "데이터 17:42 기준"
  const val weather = "맑음 · 외부 17°C · 일몰 18:03"
  const val nightWeather = "맑음 · 외부 13°C · 일몰 18:03"
  const val hub = "윤슬 허브 H2"
  const val hubId = "H2-88213-KR"
  const val firmware = "4.2.1"
  const val updateVersion = "4.3.0"
  const val lamp = "윤슬 무드등 L2"
  const val lampId = "YS-LGT-102"
  const val lampPrice = "₩89,000"
  const val lampReview = "4.8 · 리뷰 1,284"
  const val lampSpec = "2,200–6,500K · 1,600만 색 · 배터리 12시간"
  const val delivery = "10월 13일(화) 도착 예정"
  const val order = "YS-2610-008413"
  const val existingOrder = "무드등 L2 심해 1개 + A3 필터 1개 · ₩121,000"
  const val user = "이주원"
  const val pet = "콩이 움직임 · 17:31"
  const val energy = "오늘 6.4kWh"
  const val energyForecast = "예상 ₩28,940 · 전월 대비 −8.4%"
  const val arrivalRule = "귀가 · 17:00–22:00\n거실 메인등 70% · 3,000K\n무드등 40% · 에어컨 24°C"
  const val doNotDisturb = "23:00–07:00"
  const val hubProgress = "62%"
  const val calendarEvent = "10월 14일(수) 10:00–12:00 · 승강기 점검"
  const val guest = "김순례 · 18:30 방문 예정"
  val lampPriceValue = listOf(89000)
  val brightness = listOf(70, 40, 55)
  val rooms =
      listOf(
          listOf("거실", "7"),
          listOf("주방", "3"),
          listOf("안방", "4"),
          listOf("도하 방", "3"),
          listOf("서재", "0"),
          listOf("현관", "3"),
          listOf("욕실", "1"),
          listOf("발코니", "2"))
  val devices =
      listOf(
          listOf("YS-LGT-101", "거실 메인등", "거실", "켜짐 · 밝기 70% · 3,000K"),
          listOf("YS-LGT-102", "무드등 L2 (호박)", "거실", "켜짐 · 40% · 2,200K"),
          listOf("YS-LGT-201", "주방 펜던트", "주방", "꺼짐"),
          listOf("YS-LGT-301", "안방 간접등", "안방", "꺼짐"),
          listOf("YS-LGT-401", "도하 방 스탠드", "도하 방", "켜짐 · 55% · 취침 타이머 21:30"),
          listOf("YS-CLM-101", "거실 에어컨", "거실", "송풍 · 목표 24°C"),
          listOf("YS-CLM-102", "공기청정기 A3", "거실", "오프라인 (15:12부터) · 필터 잔량 8%"),
          listOf("YS-CLM-001", "전열교환기", "집 전체", "자동 · 1단"),
          listOf("YS-CLM-301", "보일러 안방 존", "안방", "대기 · 예약 22:00 23°C"),
          listOf("YS-SEC-001", "현관 도어락 D7", "현관", "잠김 · 배터리 74%"),
          listOf("YS-SEC-002", "현관 카메라", "현관", "녹화 중"),
          listOf("YS-SEC-101", "펫캠", "거실", "녹화 중 · 콩이 움직임 17:31"),
          listOf("YS-APL-201", "식기세척기", "주방", "건조 중 · 남은 시간 24분"),
          listOf("YS-APL-801", "세탁기", "발코니", "완료 17:05"),
          listOf("YS-APL-802", "건조기", "발코니", "대기"),
          listOf("YS-SEN-501", "욕실 습도 센서", "욕실", "오프라인 · 배터리 0%"),
          listOf("YS-ENG-001", "스마트 분전반", "집 전체", "실시간 412W"))
  val members =
      listOf(listOf("이주원", "관리자"), listOf("한서연", "관리자"), listOf("이도하", "어린이"), listOf("김순례", "게스트"))
  val events =
      listOf(
          listOf("14:10", "승강기 점검 공지", "단지", "10월 14일(수) 10:00–12:00"),
          listOf("15:12", "공기청정기 A3 연결 끊김", "가전", "필터 잔량 8% · YS-CLM-102"),
          listOf("15:48", "도하 귀가", "보안", "지문"),
          listOf("16:20", "택배 도착", "생활", "무인택배함 B-12 · 늘봄마켓"),
          listOf("16:55", "방문 차량 등록 완료", "보안", "12가 3456 · 김순례 18:30–21:00"),
          listOf("17:02", "주원 귀가", "보안", "비밀번호"),
          listOf("17:05", "세탁 완료", "가전", "YS-APL-801"),
          listOf("17:18", "게스트 임시 비밀번호 발급", "보안", "유효 18:00–21:30"),
          listOf("17:31", "펫캠 움직임 감지", "보안", "콩이"),
          listOf("17:36", "욕실 센서 배터리 0%", "가전", "YS-SEN-501"),
          listOf("17:40", "허브 4.3.0 다운로드 중", "윤슬홈", "62%"),
          listOf("이번 주", "윤슬 스토어 주문 배송", "생활", "YS-2610-008413 · 10월 13일(화) 도착 예정"))

  fun money(value: Number) = "₩%,d".format(value.toInt())
}
