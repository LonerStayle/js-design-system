package com.jinsup.ds.t01_neobrutalism
// DIRECTION.md 세계관과 장면 시나리오 정본.
object PanpanFacts {
    const val brand = "판판레코드"
    const val date = "2026년 10월 10일 토요일"
    const val shortDate = "10.10 토"
    const val owner = "오세진"
    const val operator = "문지호"
    const val address = "서울 마포구 망원로7길 41, 지하 1층"
    const val revenue = "₩18,420,000"
    const val target = "₩20,000,000"
    const val progress = .921f
    const val concert = "판판 라이브 #118"
    const val concertDate = "10월 24일(토) 20:00"
    const val seats = "38 / 40석"
    const val artist = "흑백전화"
    const val album = "지하 3층"
    const val albumId = "PP-0412"
    const val price = "₩38,000"
    const val format = "12인치 180g 재발매"
    const val usedPrice = "₩32,000"
    const val usedGrade = "NM"
    const val secondAlbum = "모래사장 〈썰물〉"
    const val secondId = "PP-0398"
    val hours =
        listOf(
            "화–목" to "13:00–21:00",
            "금" to "13:00–23:00",
            "토" to "12:00–21:00",
            "일" to "12:00–20:00",
            "월" to "정기 휴무",
        )
    val staff = listOf("오세진" to "사장 · 셀렉터", "한도윤" to "매입 검수", "배수아" to "공연 기획", "문지호" to "온라인 운영")
    val crates = listOf("C-03", "C-04", "C-05", "C-06", "C-07")
    val inquiries =
        listOf(
            Triple("매입", "중고 LP 42장 매입 견적 요청", "재즈 위주"),
            Triple("예매", "#118 단체 예매 6석 가능할까요", "판판 라이브"),
            Triple("주문", "모래사장 7인치 재입고 언제?", "PP-0398 · 썰물"),
        )
    const val closure = "10월 15일(목)"
    const val intake = "화·목 13:00–19:00"
}
