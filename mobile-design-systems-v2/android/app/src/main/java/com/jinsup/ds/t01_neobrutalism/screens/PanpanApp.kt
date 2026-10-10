package com.jinsup.ds.t01_neobrutalism.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import com.jinsup.ds.t01_neobrutalism.PanpanFacts as F
import com.jinsup.ds.t01_neobrutalism.components.*
import com.jinsup.ds.t01_neobrutalism.theme.*
import kotlinx.coroutines.launch

@Composable
fun PanpanApp(
    dark: Boolean = false,
    initialScreen: Int = 0,
    onBack: () -> Unit = {},
    onToggle: () -> Unit = {},
) =
    PanpanTheme(dark) {
        val c = LocalPanpanColors.current
        var screen by rememberSaveable { mutableIntStateOf(initialScreen) }
        var filter by rememberSaveable { mutableIntStateOf(0) }
        var query by rememberSaveable { mutableStateOf("") }
        var used by rememberSaveable { mutableStateOf(false) }
        var pickup by rememberSaveable { mutableStateOf(true) }
        var notify by rememberSaveable { mutableStateOf(true) }
        var shop by rememberSaveable { mutableStateOf(F.brand) }
        var error by remember { mutableStateOf<String?>(null) }
        var sheet by remember { mutableStateOf<String?>(null) }
        var reply by rememberSaveable { mutableStateOf("") }
        var dialog by remember { mutableStateOf(false) }
        val snackbar = remember { SnackbarHostState() }
        val scope = rememberCoroutineScope()
        fun toast(text: String) {
            scope.launch { snackbar.showSnackbar(text) }
        }
        Scaffold(
            containerColor = c.surface,
            topBar = { PanpanTopAppBar(F.brand, dark, onBack, onToggle) },
            bottomBar = {
                PanpanNavigationBar(
                    listOf("운영", "음반", "문의", "매장"),
                    listOf(
                        Icons.Outlined.Dashboard,
                        Icons.Outlined.Album,
                        Icons.Outlined.Inbox,
                        Icons.Outlined.Storefront,
                    ),
                    screen,
                ) {
                    screen = it
                }
            },
            snackbarHost = { PanpanSnackbar(snackbar) },
        ) { padding ->
            key(screen) {
                Column(
                    Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState())
                ) {
                    when (screen) {
                        0 -> {
                            Section(c.accent) {
                                Row(
                                    Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                ) {
                                    Text(
                                        F.shortDate,
                                        color = c.onAccent,
                                        fontWeight = FontWeight.Bold,
                                    )
                                    Text("${F.owner} · 망원", color = c.onAccent, fontSize = 14.sp)
                                }
                            }
                            Heading("운영 보드")
                            Section {
                                Text("10월 매출", color = c.fgMuted, fontSize = 14.sp)
                                Text(F.revenue, style = PanpanType.number, color = c.fg)
                                Spacer(Modifier.height(12.dp))
                                PanpanProgress(F.progress, "목표 ${F.target}")
                                Spacer(Modifier.height(12.dp))
                                Box(
                                    Modifier.fillMaxWidth(),
                                    contentAlignment = Alignment.CenterEnd,
                                ) {
                                    PriceSticker("목표의 92%")
                                }
                            }
                            Section(c.highlight) {
                                Text(F.concert, color = c.onHighlight, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(8.dp))
                                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Bottom) {
                                    Text(
                                        F.artist,
                                        Modifier.weight(1f),
                                        style = PanpanType.display,
                                        color = c.onHighlight,
                                    )
                                    Text(
                                        "38",
                                        style = PanpanType.number.copy(fontSize = 48.sp),
                                        color = c.onHighlight,
                                    )
                                    Text("석", color = c.onHighlight)
                                }
                                Text(F.concertDate, color = c.onHighlight)
                                Spacer(Modifier.height(12.dp))
                                PanpanButton("공연 잔여석 보기", kind = ButtonKind.Secondary) {
                                    sheet = "concert"
                                }
                            }
                            Section {
                                Text("매입 검수 대기", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                                Spacer(Modifier.height(12.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    F.crates.forEach { PanpanBadge(it) }
                                }
                                Spacer(Modifier.height(8.dp))
                                Text("담당 한도윤 · ${F.intake}", color = c.fgMuted, fontSize = 14.sp)
                            }
                        }
                        1 -> {
                            Section { Text("${F.albumId} / ${F.format}", fontSize = 13.sp) }
                            AlbumArt()
                            Section {
                                Text(F.artist, fontWeight = FontWeight.Bold)
                                Text(
                                    F.album,
                                    style =
                                        PanpanType.display.copy(
                                            fontSize = 48.sp,
                                            lineHeight = 58.sp,
                                        ),
                                )
                                Spacer(Modifier.height(16.dp))
                                PriceSticker(F.price)
                            }
                            Box(Modifier.padding(horizontal = 16.dp)) {
                                PanpanTabs(listOf("재발매", "중고"), if (used) 1 else 0) {
                                    used = it == 1
                                }
                            }
                            Section {
                                Text(
                                    if (used) "${F.usedGrade} · ${F.usedPrice}" else F.format,
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                )
                                Spacer(Modifier.height(12.dp))
                                Text("매장 픽업 또는 택배로 받아보세요.")
                                Spacer(Modifier.height(20.dp))
                                PanpanButton("담을 판 고르기") { sheet = "product" }
                            }
                            Section(c.slabInk) {
                                Text(
                                    "셀렉터 ${F.owner}\n${F.artist} 〈${F.album}〉",
                                    color = c.onSlabInk,
                                )
                            }
                        }
                        2 -> {
                            Heading("문의함")
                            Box(Modifier.padding(16.dp)) {
                                PanpanTabs(listOf("전체", "매입", "예매", "주문"), filter) { filter = it }
                            }
                            Box(Modifier.padding(horizontal = 16.dp)) {
                                PanpanTextField("문의 검색", query, { query = it })
                            }
                            val rows =
                                F.inquiries.filter {
                                    (filter == 0 ||
                                        it.first == listOf("전체", "매입", "예매", "주문")[filter]) &&
                                        (it.second + it.third).contains(query)
                                }
                            rows.forEach { r ->
                                PanpanListItem(
                                    r.second,
                                    "${r.first} · ${r.third}",
                                    onClick = { sheet = r.second },
                                    trailing = { Icon(Icons.Outlined.ChevronRight, "문의 열기") },
                                )
                            }
                            if (rows.isEmpty())
                                PanpanEmptyState("조건에 맞는 문의가 없어요.") {
                                    filter = 0
                                    query = ""
                                }
                        }
                        3 -> {
                            Heading("매장 설정")
                            Section { Text("${F.operator} · 온라인 운영") }
                            Section {
                                PanpanBadge("${F.closure} 임시휴무")
                                Spacer(Modifier.height(16.dp))
                                PanpanTextField("매장 이름", shop, { shop = it }, error = error)
                                Text(F.address, color = c.fgMuted, fontSize = 14.sp)
                            }
                            F.hours.forEach { PanpanListItem(it.first, it.second) }
                            Section {
                                PanpanSwitch("입고 알림", notify, { notify = it })
                                PanpanButton("변경 저장") {
                                    error = if (shop.isBlank()) "매장 이름을 입력해 주세요." else null
                                    if (error == null) toast("매장 설정을 저장했어요")
                                }
                                Spacer(Modifier.height(20.dp))
                                PanpanButton("임시휴무 예약 확인", kind = ButtonKind.Destructive) {
                                    dialog = true
                                }
                            }
                        }
                    }
                    Spacer(Modifier.height(24.dp))
                }
            }
        }
        if (sheet != null)
            PanpanBottomSheet(onDismiss = { sheet = null }) {
                when (sheet) {
                    "concert" -> {
                        Text(F.concert, style = PanpanType.display.copy(fontSize = 32.sp))
                        Spacer(Modifier.height(16.dp))
                        Text("${F.artist}\n${F.concertDate}\n${F.seats} 남음")
                        Spacer(Modifier.height(24.dp))
                        PanpanButton("확인") { sheet = null }
                    }
                    "product" -> {
                        Text(F.album, style = PanpanType.display)
                        PanpanRadio("매장 픽업", pickup) { pickup = true }
                        PanpanRadio("택배", !pickup) { pickup = false }
                        PanpanButton("장바구니에 담기") {
                            sheet = null
                            toast("${F.album}을 장바구니에 담았어요")
                        }
                    }
                    else -> {
                        Text(sheet.orEmpty(), fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        PanpanTextField("답장 초안", reply, { reply = it }, helper = "이 기기에서만 저장됩니다.")
                        PanpanButton("초안 저장") {
                            sheet = null
                            toast(if (reply.isBlank()) "입력한 답장이 없습니다." else "답장 초안을 저장했어요")
                        }
                    }
                }
            }
        if (dialog)
            PanpanDialog(
                "임시휴무 예약",
                "${F.closure}은 재고 정리로 쉽니다.",
                { dialog = false },
                {
                    dialog = false
                    toast("임시휴무 예약을 확인했어요")
                },
            )
    }

@Composable
private fun Section(color: Color? = null, content: @Composable ColumnScope.() -> Unit) {
    val c = LocalPanpanColors.current
    Column(Modifier.fillMaxWidth().background(color ?: c.surface)) {
        Column(Modifier.padding(16.dp), content = content)
        HorizontalDivider(color = c.rule, thickness = 3.dp)
    }
}

@Composable private fun Heading(title: String) = Section { Text(title, style = PanpanType.display) }
