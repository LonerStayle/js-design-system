package com.jinsup.ds.t02_swiss

// DIRECTION.md 팩트 시트 정본.
object OseonFacts {
  const val brand = "OSEON HALL"
  const val name = "오선음악당"
  const val basis = "10월 10일(토) 18:00 · 남궁윤"
  const val concert = "새음악 시리즈 1 「선과 면」"
  const val concertId = "OS26-041"
  const val concertDate = "10월 16일(금) 19:30 · 대극장"
  const val artists = "류세인 지휘 · 오선 필하모닉"
  const val program = "리게티 〈론타노〉\n윤이상 〈무악〉\n하지온 〈열두 칸〉 — 위촉 초연"
  const val member = "김도연"
  const val memberId = "M-204318"
  const val subscription = "SP26-0712 · 대극장 8"
  const val seat = "1층 C구역 7열 12·13번"
  const val fixedSeat = "1층 C구역 7열 12번"
  const val card = "신한 •••• 4021"
  const val ticketId = "T2610-084315"
  const val cancel = "공연 7일 전까지 무료 · 6–1일 전 10% · 당일 취소 불가"
  const val opening = "10월 13일(화) 10:00 · OS26-046 일반 예매"
  const val refund = "₩36,000 − 수수료 ₩3,600 = ₩32,400"
  const val phone = "02-6450-0410"
  const val address = "서울 중구 청계천로 248 오선음악당"
  val prices = listOf(60000, 40000, 20000)
  val rates = listOf(75.8, 87.6, 65.0, 40.6)
  val sold = listOf(1127, 1302, 268, 604)
  val capacity = listOf(1486, 1486, 412, 1486)
  val left = listOf(9, 15, 22, 23, 20, 8, 18, 21, 19, 16, 52, 61, 75)
  val saleDaily = listOf(188, 204, 276, 159, 96, 231, 248, 262, 337, 214)
  val poster = listOf(41, 42, 43, 44, 45, 46, 47, 48, 49, 50)
  val shows =
      listOf(
          listOf("OS26-041", "선과 면", "10.16 금 · 19:30", "판매 중"),
          listOf("OS26-042", "서윤재 「골드베르크」", "10.24 토 · 17:00", "매진"),
          listOf("OS26-043", "베토벤 4 · 7", "10.30 금 · 19:30", "판매 중"),
          listOf("OS26-044", "버르토크 · 쇼스타코비치", "11.07 토 · 17:00", "판매 중"),
          listOf("OS26-045", "새음악 2 「격자」", "11.13 금 · 19:30", "판매 중"),
          listOf("OS26-046", "브람스 교향곡 제1번", "11.21 토 · 19:30", "오픈 예정"),
          listOf("OS26-047", "슈베르트 〈겨울 나그네〉", "11.28 토 · 17:00", "오픈 예정"),
          listOf("OS26-048", "메시앙 〈투랑갈릴라〉", "12.05 토 · 19:30", "오픈 예정"),
          listOf("OS26-049", "오선 아카데미 수료 연주", "12.19 토 · 17:00", "신청 예정"),
          listOf("OS26-050", "제야 음악회", "12.31 목 · 22:00", "오픈 예정"))
  val letters =
      listOf(
          listOf("문태석", "PR-041-C 3교 교정지 회신", "인쇄소", "레드 85% 망점 확인 요청"),
          listOf("서윤재 매니지먼트", "프로필 사진 교체본", "매니지먼트", "서윤재 피아노 리사이틀"),
          listOf("하지온", "〈열두 칸〉 곡 해설 원고 최종", "매니지먼트", "OS26-041 위촉 초연"),
          listOf("차도희", "OS26-042 매진 공지 문구", "관내", "10월 24일(토) 17:00 · 실내악홀"),
          listOf("백승민", "외벽 게시대 조명 교체 10/12(월)", "관내", "No.41만 떼었다 16:00 재부착"))

  fun money(value: Number) = "₩%,d".format(value.toInt())
}
