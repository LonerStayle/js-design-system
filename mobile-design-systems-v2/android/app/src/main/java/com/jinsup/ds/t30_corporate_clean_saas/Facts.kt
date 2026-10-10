package com.jinsup.ds.t30_corporate_clean_saas
object LedgerFacts {
    const val brand = "ledgerline"
    const val company = "㈜한결물산"
    const val date = "2026년 10월 28일 수요일"
    const val shortDate = "10월 28일(수)"
    const val closing = "10월 31일"
    const val total = "₩184,320,500"
    const val owner = "김하늘"
    const val ownerRole = "경영지원팀 매니저"
    const val reviewer = "박도윤"
    const val reviewerRole = "재무팀장"
    const val director = "이서진"
    const val author = "최민재"
    const val document = "EXP-2610-0412"
    const val approval = "APV-2610-0087"
    const val merchant = "도담한정식 광화문"
    const val purpose = "거래처 접대"
    const val amount = "₩186,000"
    const val account = "접대비"
    const val card = "CARD ****-4821"
    const val pending = 12
    const val missing = 37
    const val employees = 214
    const val cards = 86
    const val salesBudget = .92f
    val rules =
        listOf(
            "₩500,000 이하" to "팀장 전결",
            "₩5,000,000 이하" to "팀장 → 재무팀장",
            "₩5,000,000 초과" to "팀장 → 재무팀장 → 대표이사",
        )
}
