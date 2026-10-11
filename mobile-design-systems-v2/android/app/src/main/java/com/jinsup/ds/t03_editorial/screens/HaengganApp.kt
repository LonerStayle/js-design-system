package com.jinsup.ds.t03_editorial.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.*
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.*
import com.jinsup.ds.t03_editorial.HaengganFacts
import com.jinsup.ds.t03_editorial.components.*
import com.jinsup.ds.t03_editorial.theme.*
import kotlinx.coroutines.launch

@Composable
fun HaengganApp(
    dark: Boolean,
    initialScreen: Int = 0,
    onBack: () -> Unit = {},
    onToggle: () -> Unit = {}
) =
    HaengganTheme(dark) {
      val c = LocalHaengganColors.current
      var screen by rememberSaveable { mutableIntStateOf(initialScreen) }
      var quantity by rememberSaveable { mutableIntStateOf(1) }
      var tab by rememberSaveable { mutableIntStateOf(0) }
      var archive by rememberSaveable { mutableIntStateOf(0) }
      var search by rememberSaveable { mutableStateOf("") }
      var letterSaved by rememberSaveable { mutableStateOf(false) }
      var newsletter by rememberSaveable { mutableStateOf(true) }
      var address by rememberSaveable { mutableStateOf(HaengganFacts.address) }
      var error by remember { mutableStateOf<String?>(null) }
      var sheet by remember { mutableStateOf<String?>(null) }
      var article by remember { mutableStateOf<List<String>?>(null) }
      var reader by remember { mutableStateOf<List<String>?>(null) }
      var savedReply by remember { mutableStateOf("") }
      var draft by remember { mutableStateOf("") }
      var invalid by remember { mutableStateOf(false) }
      val host = remember { SnackbarHostState() }
      val scope = rememberCoroutineScope()
      fun toast(s: String) {
        scope.launch { host.showSnackbar(s) }
      }
      Scaffold(
          containerColor = c.canvas,
          topBar = { HaengganTopAppBar(HaengganFacts.brand, dark, onBack, onToggle) },
          bottomBar = {
            HaengganNavigationBar(
                listOf("편집국", "단권", "편지", "구독"),
                listOf(
                    Icons.Outlined.ViewModule,
                    Icons.Outlined.MenuBook,
                    Icons.Outlined.MailOutline,
                    Icons.Outlined.PersonOutline),
                screen,
                { screen = it })
          },
          snackbarHost = { HaengganSnackbar(host) }) { padding ->
            key(screen) {
              Column(Modifier.padding(padding).verticalScroll(rememberScrollState())) {
                FolioSheet(listOf("p.096", "p.112", "p.104", "p.108")[screen]) {
                  when (screen) {
                    0 -> {
                      Heading("112쪽 가운데\n46쪽이 판에 올랐다", 30)
                      Gap()
                      Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            "D−4",
                            Modifier.weight(1f),
                            style =
                                HaengganType.display.copy(
                                    fontSize = with(LocalDensity.current) { 68.dp.toSp() },
                                    lineHeight = with(LocalDensity.current) { 80.dp.toSp() }))
                        Meta("원고 마감\n${HaengganFacts.deadline}", Modifier.weight(1f))
                      }
                      Gap()
                      OxfordRule()
                      Gap()
                      Meta("11월호 지면 배열표 · ${HaengganFacts.editor}")
                      Spacer(Modifier.height(12.dp))
                      Flatplan {
                        article = null
                        sheet = "articles"
                      }
                      Meta("■ 조판 46 · ▨ 교정 28 · □ 원고 30 · ▣ 광고 8")
                      Gap()
                      Text("인쇄본을 받는 독자", style = HaengganType.body)
                      Heading("6,214명", 48)
                      Meta("10월 순증 138명 · 디지털 아카이브 11,870명")
                      Gap()
                      OxfordRule()
                      Gap()
                      HaengganFacts.articles.forEach { row ->
                        LeaderRow(row[1], row[3]) {
                          article = row
                          sheet = "articles"
                        }
                        Meta("${row[2]} · ${row[4]}")
                        Spacer(Modifier.height(12.dp))
                      }
                    }
                    1 -> {
                      HaengganCover()
                      Gap()
                      OxfordRule()
                      Gap()
                      Heading(HaengganFacts.coverTitle)
                      Heading(HaengganFacts.priceLabel, 40)
                      Meta(HaengganFacts.spec)
                      Meta(HaengganFacts.appendix)
                      Meta(HaengganFacts.delivery)
                      Gap()
                      HaengganFacts.articles.take(9).forEach {
                        LeaderRow(it[1], it[3]) {
                          article = it
                          sheet = "articles"
                        }
                      }
                      Gap()
                      Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("수량", Modifier.weight(1f))
                        HaengganIconButton(Icons.Outlined.Remove, "수량 줄이기") {
                          if (quantity > 1) quantity--
                        }
                        Text("$quantity")
                        HaengganIconButton(Icons.Outlined.Add, "수량 늘리기") {
                          if (quantity < 10) quantity++
                        }
                      }
                      Meta(
                          if (quantity >= 2) "2권 이상 무료배송"
                          else "배송비 ${HaengganFacts.money(HaengganFacts.shipping.first())}")
                      Heading(
                          "합계 ${HaengganFacts.money(quantity*HaengganFacts.price.first()+(if(quantity>=2)0 else HaengganFacts.shipping.first()))}",
                          26)
                      HaengganButton("단권 주문 확인") { sheet = "order" }
                      Gap()
                      Heading("지난 호", 24)
                      LeaderRow(
                          HaengganFacts.archive[archive][1], HaengganFacts.archive[archive][0])
                      HaengganTabs(listOf("제86호", "제85호", "제84호", "제83호", "제82호"), archive) {
                        archive = it
                      }
                    }
                    2 -> {
                      Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            "47",
                            Modifier.weight(1f),
                            style =
                                HaengganType.number.copy(fontSize = 116.sp, lineHeight = 128.sp))
                        Box(
                            Modifier.size(104.dp).border(2.dp, c.ruleStrong, CircleShape),
                            contentAlignment = Alignment.Center) {
                              Text(
                                  "서울 종로\n26.10.10\n행간 편집국",
                                  textAlign = TextAlign.Center,
                                  style =
                                      HaengganType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp))
                            }
                      }
                      Meta("독자 편지 · ${HaengganFacts.letterEditor}")
                      Gap()
                      Heading("미답 ${if(letterSaved)8 else 9}통", 26)
                      Meta("지면 의견 21 · 구독·배송 14 · 기고·제보 9 · 정정 요청 3")
                      HaengganTextField("보낸 이 · 지역 찾기", search, { search = it })
                      Gap()
                      OxfordRule()
                      val readers =
                          HaengganFacts.readers.filter { it.joinToString().contains(search) }
                      if (readers.isEmpty()) HaengganEmptyState("조건에 맞는 독자가 없습니다") { search = "" }
                      readers.forEach { r ->
                        LeaderRow("${r[0]} · ${r[1]}", "p.104") {
                          reader = r
                          draft = savedReply
                          invalid = false
                          sheet = "reader"
                        }
                      }
                    }
                    else -> {
                      Column(
                          Modifier.fillMaxWidth()
                              .background(c.surface)
                              .border(1.dp, c.ruleStrong)
                              .padding(20.dp)) {
                            Meta("구독증 · ${HaengganFacts.subscriberId}")
                            Gap()
                            Heading(HaengganFacts.subscriber, 40)
                            Meta(HaengganFacts.period)
                            Gap()
                            OxfordRule()
                            Gap()
                            Heading("7권 받음 · 5권 남음", 23)
                            (80..91).chunked(6).forEach { values ->
                              Row(
                                  Modifier.fillMaxWidth(),
                                  horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                                    values.forEach { p ->
                                      Box(
                                          Modifier.weight(1f)
                                              .height(44.dp)
                                              .background(if (p <= 86) c.doneBg else c.canvas)
                                              .border(1.dp, if (p == 87) c.spot else c.ruleStrong),
                                          contentAlignment = Alignment.Center) {
                                            Text(
                                                "$p",
                                                style = HaengganType.code,
                                                color = if (p <= 86) c.doneFg else c.text)
                                          }
                                    }
                                  }
                              Spacer(Modifier.height(6.dp))
                            }
                          }
                      Gap()
                      HaengganTabs(listOf("배송지", "알림", "결제"), tab) { tab = it }
                      Gap()
                      when (tab) {
                        0 -> {
                          HaengganTextField("배송지", address, { address = it }, error = error)
                          Meta(HaengganFacts.addressDeadline)
                          Meta("${HaengganFacts.post} · ${HaengganFacts.phone}")
                          Gap()
                          HaengganButton("배송지 저장") {
                            error = if (address.isBlank()) "배송지를 입력해 주세요" else null
                            if (error == null) sheet = "address"
                          }
                        }
                        1 -> HaengganSwitch("행간 레터 수신", newsletter) { newsletter = it }
                        2 -> {
                          Heading("결제 수단", 24)
                          Text(HaengganFacts.card)
                          Meta("1년 정기구독 · ₩160,000")
                        }
                      }
                    }
                  }
                }
              }
            }
          }
      if (sheet == "address")
          HaengganDialog(
              "배송지 변경",
              address,
              { sheet = null },
              {
                sheet = null
                toast("배송지를 저장했습니다 · p.108")
              })
      else if (sheet != null)
          HaengganBottomSheet({ sheet = null }) {
            FolioSheet(
                if (sheet == "order") "p.112"
                else if (sheet == "reader") "p.104" else article?.get(3) ?: "p.096") {
                  when (sheet) {
                    "articles" -> {
                      Heading(article?.get(1) ?: "11월호 배열표", 24)
                      if (article == null)
                          HaengganFacts.articles.forEach { LeaderRow(it[1], it[3]) }
                      else
                          article?.let {
                            Text("${it[0]}\n${it[2]} · ${it[4]}", style = HaengganType.body)
                          }
                    }
                    "order" -> {
                      Heading("단권 주문", 24)
                      Text(
                          "${HaengganFacts.issue}\n${quantity}권 · ${HaengganFacts.money(quantity*HaengganFacts.price.first()+(if(quantity>=2)0 else HaengganFacts.shipping.first()))}")
                      Gap()
                      HaengganButton("선택 확인", kind = ButtonKind.Destructive) {
                        sheet = null
                        toast("단권 선택을 확인했습니다 · p.112")
                      }
                    }
                    "reader" -> {
                      if (reader?.get(0) == HaengganFacts.letterName) {
                        Heading("독자 엽서", 28)
                        Meta("${HaengganFacts.letterName} · ${HaengganFacts.letterArea}")
                        Gap()
                        Text(HaengganFacts.letterSubject, style = HaengganType.body)
                        HaengganTextField(
                            "답장",
                            draft,
                            { draft = it },
                            error = if (invalid) "답장을 입력해 주세요" else null)
                        HaengganButton("답장 작성 완료") {
                          if (draft.isBlank()) invalid = true
                          else {
                            letterSaved = true
                            savedReply = draft
                            sheet = null
                            toast("답장을 작성했습니다 · p.104")
                          }
                        }
                      } else {
                        Heading(reader?.get(0).orEmpty(), 24)
                        Text(reader?.get(1).orEmpty(), style = HaengganType.body)
                        Gap()
                        Meta("팩트 시트의 독자 정보입니다.")
                      }
                    }
                  }
                }
          }
    }

@Composable
private fun Heading(s: String, size: Int = 30) {
  Text(s, style = HaengganType.display.copy(fontSize = size.sp, lineHeight = (size * 1.2).sp))
}

@Composable
private fun Meta(s: String, modifier: Modifier = Modifier) {
  Text(
      s,
      modifier,
      color = LocalHaengganColors.current.text2,
      style = HaengganType.ui.copy(fontSize = 13.sp, lineHeight = 20.sp))
}

@Composable
private fun Gap() {
  Spacer(Modifier.height(24.dp))
}
