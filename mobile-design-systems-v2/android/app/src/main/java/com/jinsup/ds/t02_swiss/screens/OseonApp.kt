package com.jinsup.ds.t02_swiss.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.*
import androidx.compose.ui.unit.*
import com.jinsup.ds.t02_swiss.OseonFacts
import com.jinsup.ds.t02_swiss.components.*
import com.jinsup.ds.t02_swiss.theme.*
import kotlinx.coroutines.launch

@Composable
fun OseonApp(
    dark: Boolean,
    initialScreen: Int = 0,
    onBack: () -> Unit = {},
    onToggle: () -> Unit = {}
) =
    OseonTheme(dark) {
      val c = LocalOseonColors.current
      var screen by rememberSaveable { mutableIntStateOf(initialScreen) }
      var grade by rememberSaveable { mutableIntStateOf(1) }
      var quantity by rememberSaveable { mutableIntStateOf(2) }
      var filter by rememberSaveable { mutableIntStateOf(0) }
      var search by rememberSaveable { mutableStateOf("") }
      var name by rememberSaveable { mutableStateOf(OseonFacts.member) }
      var error by remember { mutableStateOf<String?>(null) }
      var notify by rememberSaveable { mutableStateOf(true) }
      var access by rememberSaveable { mutableStateOf(false) }
      var cancelled by rememberSaveable { mutableStateOf(false) }
      var sheet by remember { mutableStateOf<String?>(null) }
      var selected by remember { mutableStateOf<List<String>?>(null) }
      val drafts = remember { mutableStateMapOf<String, String>() }
      var draft by remember { mutableStateOf("") }
      var draftError by remember { mutableStateOf<String?>(null) }
      var agree by remember { mutableStateOf(false) }
      val host = remember { SnackbarHostState() }
      val scope = rememberCoroutineScope()
      fun toast(s: String) {
        scope.launch { host.showSnackbar(s) }
      }
      Scaffold(
          containerColor = c.surface,
          topBar = { OseonTopAppBar(OseonFacts.brand, dark, onBack, onToggle) },
          bottomBar = {
            OseonNavigationBar(
                listOf("매표", "공연", "편지", "계정"),
                listOf(
                    Icons.Outlined.ConfirmationNumber,
                    Icons.Outlined.MusicNote,
                    Icons.Outlined.MailOutline,
                    Icons.Outlined.PersonOutline),
                screen,
                { screen = it })
          },
          snackbarHost = { OseonSnackbar(host) }) { padding ->
            key(screen) {
              Column(
                  Modifier.padding(padding).fillMaxSize().verticalScroll(rememberScrollState())) {
                    when (screen) {
                      0 -> {
                        GridPlate("매표 현황", "76", OseonFacts.basis)
                        Column(Modifier.padding(16.dp)) {
                          Meta(OseonFacts.concertId)
                          Heading("「선과 면」은 목표까지\n137석 남았습니다")
                          Text("1,127 / 1,486석 판매 · 잔여 359석\n목표 85% · 1,264석", style = OseonType.ui)
                          OseonFacts.rates.forEachIndexed { i, value ->
                            OseonBullet(OseonFacts.shows[listOf(0, 2, 3, 4)[i]][0], value)
                          }
                          Gap()
                          Meta("오늘 판매")
                          Text("214매", style = OseonType.number)
                          Text(
                              OseonFacts.money(13860000),
                              style = OseonType.display.copy(fontSize = 28.sp))
                          Gap()
                          OseonButton("오늘 마감 보고", kind = ButtonKind.Secondary) { sheet = "report" }
                          Gap()
                          Heading("구역별 잔여석")
                          OseonFacts.left.chunked(4).forEachIndexed { r, values ->
                            Row(
                                Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                  values.forEachIndexed { i, v ->
                                    OseonButton(
                                        "${('A'.code+r*4+i).toChar()} · $v",
                                        modifier = Modifier.weight(1f),
                                        kind = ButtonKind.Secondary) {
                                          sheet = "zone"
                                          selected =
                                              listOf("${('A'.code+r*4+i).toChar()}구역", "잔여 ${v}석")
                                        }
                                  }
                                }
                            Spacer(Modifier.height(8.dp))
                          }
                          Gap()
                          Meta(OseonFacts.opening)
                        }
                        OseonFacts.shows.forEachIndexed { i, row ->
                          OseonListItem(
                              row[1],
                              "${row[0]} · ${row[2]}",
                              onClick = {
                                if (i == 0) screen = 1
                                else {
                                  selected = row
                                  sheet = "show"
                                }
                              },
                              trailing = {
                                Text(row[3], style = OseonType.ui.copy(fontSize = 12.sp))
                              })
                        }
                      }
                      1 -> {
                        GridPlate("공연 상세", "41", OseonFacts.concertId, 152)
                        Column(Modifier.padding(16.dp)) {
                          GridPlate("선과 면", "41", OseonFacts.concertDate, 244, poster = true)
                          Gap()
                          Heading(OseonFacts.concert)
                          Text(OseonFacts.concertDate)
                          Meta(OseonFacts.artists)
                          Gap()
                          Text(OseonFacts.program, style = OseonType.ui.copy(lineHeight = 30.sp))
                          Gap()
                          OseonTabs(listOf("R석", "S석", "A석"), grade) { grade = it }
                          Gap()
                          Text(
                              OseonFacts.money(OseonFacts.prices[grade]),
                              style = OseonType.number.copy(fontSize = 42.sp))
                          Meta("오선 회원 10% 할인 · 예매 수수료 없음")
                          Row(
                              Modifier.fillMaxWidth(),
                              verticalAlignment = Alignment.CenterVertically) {
                                Text("수량", Modifier.weight(1f))
                                OseonIconButton(Icons.Outlined.Remove, "수량 줄이기") {
                                  if (quantity > 1) quantity--
                                }
                                Text("$quantity")
                                OseonIconButton(Icons.Outlined.Add, "수량 늘리기") {
                                  if (quantity < 4) quantity++
                                }
                              }
                          Heading("합계 ${OseonFacts.money(OseonFacts.prices[grade]*quantity*.9)}")
                          Gap()
                          OseonButton("예매 요약") {
                            agree = false
                            sheet = "booking"
                          }
                          Gap()
                          Heading("관람 안내")
                          Text(OseonFacts.cancel)
                          Meta("로비 60분 전 · 객석 30분 전 입장")
                        }
                      }
                      2 -> {
                        GridPlate("받은편지함", "12", "홍보디자인팀 · 남궁윤", 180, paper = true)
                        Column(Modifier.padding(16.dp)) {
                          OseonTabs(listOf("전체", "인쇄소", "매니지먼트", "관내"), filter) { filter = it }
                          OseonTextField("편지 검색", search, { search = it })
                          Meta("팩트 시트에 명시된 주요 편지 5통")
                        }
                        val visible =
                            OseonFacts.letters.filter {
                              (filter == 0 ||
                                  it[2] == listOf("전체", "인쇄소", "매니지먼트", "관내")[filter]) &&
                                  it.joinToString().contains(search)
                            }
                        if (visible.isEmpty())
                            OseonEmptyState("조건에 맞는 편지가 없습니다") {
                              search = ""
                              filter = 0
                            }
                        visible.forEach { row ->
                          OseonListItem(
                              row[1],
                              "${row[0]} · ${row[2]}",
                              onClick = {
                                selected = row
                                draft = drafts[row[0]].orEmpty()
                                draftError = null
                                sheet = "letter"
                              },
                              trailing = { Icon(Icons.Outlined.ChevronRight, null) })
                        }
                      }
                      else -> {
                        GridPlate(
                            "내 계정", "0712", "${OseonFacts.member} · ${OseonFacts.memberId}", 152)
                        Column(Modifier.padding(16.dp)) {
                          Heading("개인정보")
                          OseonTextField("이름", name, { name = it }, error = error)
                          Meta(OseonFacts.memberId)
                          Gap()
                          OseonSwitch("선예매 알림", notify) { notify = it }
                          OseonCheckbox("휠체어석 우선 안내", access) { access = it }
                          Gap()
                          Heading("등록 카드")
                          Text(OseonFacts.card)
                          Gap()
                          Heading("정기권")
                          Text(OseonFacts.subscription)
                          Text(OseonFacts.fixedSeat)
                          Gap()
                          OseonButton("변경 저장") {
                            error = if (name.isBlank()) "이름을 입력해 주세요" else null
                            if (error == null) toast("계정 변경을 저장했습니다")
                          }
                          Gap()
                          Heading("나의 예매")
                          Text(OseonFacts.ticketId)
                          Text(OseonFacts.seat)
                          Gap()
                          OseonButton(
                              if (cancelled) "부분 취소 확인 완료" else "12번 좌석 부분 취소",
                              kind = ButtonKind.Destructive,
                              enabled = !cancelled) {
                                sheet = "cancel"
                              }
                        }
                      }
                    }
                    Spacer(Modifier.height(24.dp))
                  }
            }
          }
      when (sheet) {
        "report" ->
            OseonDialog(
                "오늘 마감 보고",
                "214매 · ${OseonFacts.money(13860000)}",
                { sheet = null },
                {
                  sheet = null
                  toast("마감 보고를 확인했습니다")
                })
        "cancel" ->
            OseonDialog(
                "12번 1매 부분 취소",
                OseonFacts.refund,
                { sheet = null },
                {
                  sheet = null
                  cancelled = true
                  toast("환불액 ₩32,400을 확인했습니다")
                })
        null -> {}
        else ->
            OseonBottomSheet({ sheet = null }) {
              when (sheet) {
                "booking" -> {
                  Heading("예매 요약")
                  Text(OseonFacts.concert)
                  Text("${listOf("R","S","A")[grade]}석 · ${quantity}매")
                  Text("${OseonFacts.member} · ${OseonFacts.memberId}")
                  Heading(OseonFacts.money(OseonFacts.prices[grade] * quantity * .9))
                  OseonCheckbox(OseonFacts.cancel, agree) { agree = it }
                  OseonButton("선택 확인", enabled = agree) {
                    sheet = null
                    toast("예매 선택을 확인했습니다")
                  }
                }
                "letter" -> {
                  selected?.let { row ->
                    Heading(row[1])
                    Text(row[0])
                    Gap()
                    Text(row[3])
                    OseonTextField("답장 초안", draft, { draft = it }, error = draftError)
                    OseonButton("초안 저장") {
                      if (draft.isBlank()) draftError = "초안을 입력해 주세요"
                      else {
                        drafts[row[0]] = draft
                        sheet = null
                        toast("답장 초안을 저장했습니다")
                      }
                    }
                  }
                }
                "zone" -> {
                  Heading(selected?.get(0).orEmpty())
                  Text(selected?.get(1).orEmpty())
                  OseonButton("공연 보기") {
                    sheet = null
                    screen = 1
                  }
                }
                "show" -> {
                  selected?.let {
                    Heading(it[1])
                    Text("${it[0]}\n${it[2]}\n${it[3]}")
                  }
                }
              }
            }
      }
    }

@Composable
private fun Heading(s: String) {
  Text(s, style = OseonType.display.copy(fontSize = 24.sp, lineHeight = 32.sp))
  Spacer(Modifier.height(12.dp))
}

@Composable
private fun Meta(s: String) {
  Text(
      s,
      color = LocalOseonColors.current.text2,
      style = OseonType.ui.copy(fontSize = 13.sp, lineHeight = 20.sp))
}

@Composable
private fun Gap() {
  Spacer(Modifier.height(24.dp))
}
