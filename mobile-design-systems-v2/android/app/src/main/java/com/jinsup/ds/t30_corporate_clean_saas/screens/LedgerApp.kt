package com.jinsup.ds.t30_corporate_clean_saas.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import com.jinsup.ds.t30_corporate_clean_saas.LedgerFacts as F
import com.jinsup.ds.t30_corporate_clean_saas.components.*
import com.jinsup.ds.t30_corporate_clean_saas.theme.*
import kotlinx.coroutines.launch

@Composable
fun LedgerApp(
    dark: Boolean = false,
    initialScreen: Int = 0,
    onBack: () -> Unit = {},
    onToggle: () -> Unit = {},
) =
    LedgerTheme(dark) {
        val c = LocalLedgerColors.current
        var screen by rememberSaveable { mutableIntStateOf(initialScreen) }
        var tab by rememberSaveable { mutableIntStateOf(0) }
        var approved by rememberSaveable { mutableStateOf(false) }
        var rejected by rememberSaveable { mutableStateOf(false) }
        var notification by rememberSaveable { mutableStateOf(true) }
        var receipt by rememberSaveable { mutableStateOf(true) }
        var search by rememberSaveable { mutableStateOf("") }
        var limit by rememberSaveable { mutableStateOf("500000") }
        var error by remember { mutableStateOf<String?>(null) }
        var appliedLimit by rememberSaveable { mutableStateOf("500,000") }
        var sheet by remember { mutableStateOf(false) }
        var dialog by remember { mutableStateOf(false) }
        val snackbar = remember { SnackbarHostState() }
        val scope = rememberCoroutineScope()
        fun toast(s: String) {
            scope.launch { snackbar.showSnackbar(s) }
        }
        Scaffold(
            containerColor = c.surface,
            topBar = { LedgerTopAppBar(F.brand, dark, onBack, onToggle) },
            bottomBar = {
                LedgerNavigationBar(
                    listOf("마감", "결재함", "규칙"),
                    listOf(Icons.Outlined.BarChart, Icons.Outlined.FactCheck, Icons.Outlined.Tune),
                    if (screen == 2) 1 else if (screen == 3) 2 else screen,
                ) {
                    screen = if (it == 2) 3 else it
                }
            },
            snackbarHost = { LedgerSnackbar(snackbar) },
        ) { padding ->
            key(screen) {
                Column(
                    Modifier.padding(padding)
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(horizontal = 20.dp, vertical = 24.dp)
                ) {
                    when (screen) {
                        0 -> {
                            Heading("10월 경비 마감", "${F.shortDate} · 마감 담당 ${F.owner}")
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("10월 승인 경비", fontWeight = FontWeight.SemiBold)
                                Spacer(Modifier.width(8.dp))
                                LedgerBadge("마감 D-3")
                            }
                            Spacer(Modifier.height(12.dp))
                            Text(F.total, style = LedgerType.number)
                            Spacer(Modifier.height(24.dp))
                            LedgerRule("미제출 영수증", "${F.missing}건")
                            LedgerRule("결재 대기", "${F.pending}건")
                            LedgerRule("법인카드", "${F.cards}장")
                            RuleHead("영업2팀 예산")
                            LedgerProgress(F.salesBudget, "예산 소진율 92%")
                            Spacer(Modifier.height(12.dp))
                            LedgerBadge("예산 소진 주의", alert = true)
                            RuleHead("검토할 결재")
                            DocumentRow(approved) { screen = 2 }
                            Spacer(Modifier.height(16.dp))
                            LedgerButton("결재함 열기") { screen = 1 }
                        }
                        1 -> {
                            Heading("결재함", "현재 검토자 ${F.reviewer} ${F.reviewerRole}")
                            LedgerTabs(listOf("받은 결재", "승인", "반려"), tab) { tab = it }
                            Spacer(Modifier.height(16.dp))
                            LedgerTextField("문서번호 또는 가맹점 검색", search, { search = it })
                            if (
                                (F.document + F.merchant).contains(search) &&
                                    (tab == 0 && !approved && !rejected ||
                                        tab == 1 && approved ||
                                        tab == 2 && rejected)
                            )
                                DocumentRow(approved) { screen = 2 }
                            else
                                LedgerEmptyState("해당 조건의 결재가 없습니다.") {
                                    tab = 0
                                    search = ""
                                }
                            Spacer(Modifier.height(24.dp))
                            Text("문서를 누르면 결재 내역을 확인할 수 있습니다.", color = c.text2, fontSize = 14.sp)
                        }
                        2 -> {
                            Heading("지출결의서", F.document)
                            Row(
                                Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                            ) {
                                Text(F.purpose, fontSize = 17.sp)
                                LedgerBadge(
                                    if (rejected) "반려" else if (approved) "승인 완료" else "결재 중"
                                )
                            }
                            Spacer(Modifier.height(12.dp))
                            Text(F.amount, style = LedgerType.number)
                            Spacer(Modifier.height(24.dp))
                            ApprovalLine(approved, rejected)
                            Spacer(Modifier.height(24.dp))
                            LedgerRule("가맹점", F.merchant)
                            LedgerRule("기안자", "${F.author} · 영업2팀장")
                            LedgerRule("계정과목", F.account)
                            LedgerRule("법인카드", F.card)
                            LedgerRule("합계", F.amount, total = true)
                            Spacer(Modifier.height(20.dp))
                            if (!approved && !rejected)
                                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                    LedgerButton("반려", kind = ButtonKind.Secondary) {
                                        dialog = true
                                    }
                                    LedgerButton("승인") {
                                        approved = true
                                        toast("박도윤 승인 완료 · 다음 결재 이서진")
                                    }
                                }
                            else LedgerButton("결재함으로") { screen = 1 }
                        }
                        3 -> {
                            Heading("결재 규칙", "저장 후 상신되는 문서부터 적용됩니다.")
                            Text("금액 구간별 결재선", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.height(16.dp))
                            F.rules.forEach {
                                LedgerRule(
                                    if (it == F.rules.first()) "₩$appliedLimit 이하" else it.first,
                                    it.second,
                                )
                            }
                            Spacer(Modifier.height(16.dp))
                            LedgerButton("팀장 전결 한도 편집", kind = ButtonKind.Secondary) {
                                sheet = true
                            }
                            RuleHead("알림")
                            LedgerSwitch("결재 대기 알림", notification, { notification = it })
                            LedgerCheckbox("영수증 누락 알림", receipt, { receipt = it })
                            Spacer(Modifier.height(24.dp))
                            LedgerButton("변경 저장") { toast("결재 규칙을 저장했습니다.") }
                            Spacer(Modifier.height(16.dp))
                            Text("현재 검토 중인 문서는 기존 결재선을 따릅니다.", fontSize = 14.sp, color = c.text2)
                        }
                    }
                    Spacer(Modifier.height(24.dp))
                }
            }
        }
        if (sheet)
            LedgerBottomSheet(onDismiss = { sheet = false }) {
                Text("팀장 전결 한도", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                LedgerTextField(
                    "금액 (원)",
                    limit,
                    { limit = it },
                    helper = "0보다 큰 금액을 입력하세요.",
                    error = error,
                )
                LedgerButton("적용") {
                    val n = limit.toLongOrNull()
                    if (n == null || n <= 0) error = "0보다 큰 정수 금액을 입력해 주세요."
                    else {
                        error = null
                        appliedLimit =
                            java.text.NumberFormat.getIntegerInstance(java.util.Locale.KOREA)
                                .format(n)
                        sheet = false
                        toast("전결 한도 초안을 적용했습니다.")
                    }
                }
            }
        if (dialog)
            LedgerDialog(
                "결재 반려",
                "${F.document}을 반려하시겠습니까?",
                { dialog = false },
                {
                    dialog = false
                    rejected = true
                    toast("결재가 반려되었습니다.")
                },
            )
    }

@Composable
private fun Heading(title: String, sub: String) {
    val c = LocalLedgerColors.current
    Text(F.company, style = LedgerType.ui.copy(fontSize = 13.sp), color = c.text2)
    Spacer(Modifier.height(8.dp))
    Text(title, style = LedgerType.display)
    Spacer(Modifier.height(8.dp))
    Text(sub, style = LedgerType.ui.copy(fontSize = 13.sp), color = c.text2)
    Spacer(Modifier.height(24.dp))
}

@Composable
private fun RuleHead(text: String) {
    val c = LocalLedgerColors.current
    Spacer(Modifier.height(24.dp))
    HorizontalDivider(color = c.ruleHead, thickness = 2.dp)
    Text(text, Modifier.padding(vertical = 16.dp), fontSize = 18.sp, fontWeight = FontWeight.Bold)
}

@Composable
private fun DocumentRow(approved: Boolean, onClick: () -> Unit) {
    val c = LocalLedgerColors.current
    Column(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 16.dp)) {
        Text(F.document, style = LedgerType.code, color = c.text2)
        Spacer(Modifier.height(8.dp))
        Text(F.merchant, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(4.dp))
        Text("${F.author} · ${F.purpose}", color = c.text2, fontSize = 13.sp)
        Spacer(Modifier.height(12.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            ApprovalProgress(if (approved) 2 else 1)
            Text(F.amount, fontSize = 20.sp, fontWeight = FontWeight.Bold)
        }
    }
    HorizontalDivider(color = c.line)
}
