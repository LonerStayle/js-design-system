package com.jinsup.ds.t03_editorial

// DIRECTION.md 팩트 시트 정본.
object HaengganFacts {
  const val brand = "행간"
  const val issue = "2026년 11월호 · 제87호"
  const val deadline = "10월 14일(수) 18:00"
  const val coverTitle = "활판의 마지막 가을"
  const val appendix = "별책부록 「서촌 활자 지도」"
  const val spec = "230 × 297mm · 112쪽 · 무선철"
  const val delivery = "10월 23일(금) 배본"
  const val subscriber = "김하늘"
  const val subscriberId = "SUB-0048213"
  const val period = "제80호–제91호 · 2027년 3월호까지"
  const val address = "서울 마포구 성미산로17길 42, 2층 201호"
  const val post = "03980"
  const val phone = "010-4827-3091"
  const val email = "haneul.kim@naver.com"
  const val card = "신한카드 •••• 4821"
  const val addressDeadline = "11월호 주소 변경 마감 · 10월 21일(수)"
  const val letterName = "송지안"
  const val letterArea = "부산 수영"
  const val letterSubject = "10월호 「밤의 동네 빵집」에 대한 엽서"
  const val letterEditor = "박소율 · 독자관리"
  const val editor = "윤서경 · 편집장"
  const val priceLabel = "₩16,000"
  const val issn = "ISSN 2671-0487"
  val price = listOf(16000)
  val shipping = listOf(3000)
  val flatplan = listOf(46, 28, 30, 8)
  val letterCounts = listOf(21, 14, 9, 3)
  val monthlyPrint = listOf(5690, 5803, 5889, 5951, 6076, 6214)
  val articles =
      listOf(
          listOf("HG-2611-E01", "줄 사이에 남는 것", "윤서경", "p.006", "조판 완료"),
          listOf("HG-2611-F01", "활판의 마지막 가을", "한예린 · 사진 차도영", "p.024–041", "교정 중"),
          listOf("HG-2611-F02", "인쇄 골목 24시", "오준석", "p.042–053", "원고 대기"),
          listOf("HG-2611-F03", "밤의 식자공 — 김순례(73)", "한예린", "p.054–061", "조판 완료"),
          listOf("HG-2611-C01", "골목의 문장 제14회", "정은호", "p.064–069", "조판 완료"),
          listOf("HG-2611-R01", "이달의 책 다섯 권", "이도경", "p.072–077", "원고 대기"),
          listOf("HG-2611-D01", "옥인동 계단 지도", "오준석", "p.080–087", "조판 완료"),
          listOf("HG-2611-D02", "늦가을 국밥 순례", "한예린", "p.090–095", "교정 중"),
          listOf("HG-2611-L01", "독자 편지", "박소율 엮음", "p.104–107", "교정 중"),
          listOf("HG-2611-X01", "서촌 활자 지도", "민하은", "별책", "색 교정 대기"))
  val archive =
      listOf(
          listOf("제86호", "밤의 동네 빵집"),
          listOf("제85호", "일곱 개의 골목"),
          listOf("제84호", "여름, 수영장의 건축"),
          listOf("제83호", "장마와 우산 수리점"),
          listOf("제82호", "종로의 마지막 다방"))
  val readers =
      listOf(
          listOf("송지안", "부산 수영"),
          listOf("김하늘", "서울 마포"),
          listOf("배준영", "대전 유성"),
          listOf("최수민", "서울 성북"),
          listOf("임가온", "제주 애월"),
          listOf("노태윤", "광주 동구"),
          listOf("문서진", "경기 파주"),
          listOf("유한별", "서울 은평"),
          listOf("한지우", "강원 춘천"))

  fun money(value: Number) = "₩%,d".format(value.toInt())
}
