package com.jinsup.ds.t15_hygge.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.*
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import com.jinsup.ds.t15_hygge.ModakFacts
import com.jinsup.ds.t15_hygge.components.*
import com.jinsup.ds.t15_hygge.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ModakApp(dark: Boolean, initialScreen: Int = 0, onBack: () -> Unit, onToggle: () -> Unit) {
  ModakTheme(dark) {
    val c = LocalModakColors.current
    var screen by rememberSaveable { mutableIntStateOf(initialScreen) }
    var color by rememberSaveable { mutableIntStateOf(0) }
    var qty by rememberSaveable { mutableIntStateOf(1) }
    var tab by rememberSaveable { mutableIntStateOf(0) }
    var filter by rememberSaveable { mutableIntStateOf(0) }
    var added by rememberSaveable { mutableIntStateOf(0) }
    var lights by remember { mutableStateOf(setOf(0, 1, 3, 5)) }
    var visited by remember { mutableStateOf(setOf<Int>()) }
    var replied by remember { mutableStateOf(setOf<Int>()) }
    var selectedOrders by remember { mutableStateOf(setOf<Int>()) }
    val replyText = remember { mutableStateMapOf<Int, String>() }
    var query by rememberSaveable { mutableStateOf("") }
    var name by rememberSaveable { mutableStateOf(ModakFacts.user) }
    var phone by rememberSaveable { mutableStateOf(ModakFacts.phoneExample) }
    var email by rememberSaveable { mutableStateOf(ModakFacts.email) }
    var note by rememberSaveable { mutableStateOf(ModakFacts.note) }
    var phoneError by remember { mutableStateOf(true) }
    var nameError by remember { mutableStateOf(false) }
    var addressRemoved by remember { mutableStateOf(false) }
    var addresses by remember { mutableStateOf(ModakFacts.addresses) }
    var notifications by remember {
      mutableStateOf(ModakFacts.notifications.map { it[2] == "true" })
    }
    var channels by remember { mutableStateOf(ModakFacts.channels.map { it[1] == "true" }) }
    var sheet by remember { mutableStateOf<String?>(null) }
    var index by remember { mutableIntStateOf(0) }
    var draft by remember { mutableStateOf("") }
    var invalid by remember { mutableStateOf(false) }
    var confirm by remember { mutableStateOf(false) }
    val host = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    fun toast(text: String) {
      scope.launch { host.showSnackbar(text) }
    }
    Scaffold(
        containerColor = c.paper,
        snackbarHost = { ModakSnackbar(host) },
        topBar = {
          TopAppBar(
              title = {
                Text(
                    ModakFacts.wordmark,
                    style = ModakType.number.copy(fontSize = 24.sp, lineHeight = 30.sp))
              },
              navigationIcon = {
                ModakIconButton(Icons.AutoMirrored.Outlined.ArrowBack, "테마 목록", onBack)
              },
              actions = {
                Box(
                    Modifier.size(56.dp).clickable(onClick = onToggle).semantics {
                      contentDescription = "줄 스위치로 낮과 밤 전환"
                    }) {
                      Canvas(Modifier.fillMaxSize()) {
                        drawLine(
                            c.objInk,
                            Offset(size.width / 2, 0f),
                            Offset(size.width / 2, 27.dp.toPx()),
                            1.5.dp.toPx())
                        drawRoundRect(
                            if (dark) c.lamp else c.objWood,
                            Offset(size.width / 2 - 6.dp.toPx(), 26.dp.toPx()),
                            Size(12.dp.toPx(), 18.dp.toPx()),
                            androidx.compose.ui.geometry.CornerRadius(6.dp.toPx()))
                      }
                    }
              },
              colors = TopAppBarDefaults.topAppBarColors(containerColor = c.paper))
        },
        bottomBar = {
          Row(Modifier.fillMaxWidth().background(c.paperRaised).navigationBarsPadding()) {
            listOf("쇼룸", "담요", "상담", "내 계정").forEachIndexed { i, label ->
              Column(
                  Modifier.weight(1f)
                      .heightIn(min = 64.dp)
                      .clickable { screen = i }
                      .semantics { selected = screen == i }
                      .padding(vertical = 8.dp),
                  horizontalAlignment = Alignment.CenterHorizontally) {
                    Canvas(Modifier.fillMaxWidth().height(4.dp)) {
                      drawRect(if (screen == i) c.brand else c.line)
                    }
                    Spacer(Modifier.height(5.dp))
                    Icon(
                        listOf(
                            Icons.Outlined.Home,
                            Icons.Outlined.ShoppingBag,
                            Icons.Outlined.MailOutline,
                            Icons.Outlined.PersonOutline)[i],
                        label,
                        tint = if (screen == i) c.brandText else c.text2)
                    Text(label, style = ModakType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp))
                  }
            }
          }
        }) { padding ->
          key(screen) {
            Column(Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState())) {
              when (screen) {
                0 -> {
                  Room(c.roomFjord) {
                    Meta(ModakFacts.date)
                    Gap()
                    Heading("하늘 님, 램프 타임까지")
                    Row(verticalAlignment = Alignment.Bottom) {
                      Text("2", style = ModakType.number.copy(fontSize = 48.sp, lineHeight = 56.sp))
                      Text("시간 ", style = ModakType.ui)
                      Text(
                          "50", style = ModakType.number.copy(fontSize = 48.sp, lineHeight = 56.sp))
                      Text("분", style = ModakType.ui)
                    }
                    Meta(ModakFacts.tourHours)
                    Gap()
                    RoomScene(lights = lights)
                    Gap(8)
                    Text("불 켜진 방 ${lights.size}개 · 꺼진 방 ${7-lights.size}개")
                    Gap(8)
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)) {
                          ModakFacts.rooms.forEachIndexed { i, row ->
                            ModakButton(row[0], kind = ButtonKind.Secondary) {
                              lights = if (i in lights) lights - i else lights + i
                            }
                          }
                        }
                    Gap()
                    PencilMemo("해가 지면 램프만 켜 두어요")
                    Gap()
                    Room(c.paperRaised) {
                      Heading("남은 투어 ${5-visited.size}팀", 22)
                      Meta("다녀간 팀 ${9+visited.size} · 오늘 14팀")
                      Gap()
                      (9..13)
                          .filter { it !in visited }
                          .forEach { i ->
                            val row = ModakFacts.tours[i]
                            ListItem(
                                headlineContent = { Text(row[1], style = ModakType.label) },
                                supportingContent = {
                                  Text(
                                      "${row[2]} · ${row[0]}",
                                      style = ModakType.ui.copy(fontSize = 13.sp))
                                },
                                trailingContent = { Icon(Icons.Outlined.ChevronRight, null) },
                                modifier =
                                    Modifier.clickable {
                                      index = i
                                      sheet = "tour"
                                    },
                                colors = ListItemDefaults.colors(containerColor = c.paperRaised))
                          }
                    }
                    Gap()
                    Meta(ModakFacts.sun)
                    Meta(ModakFacts.weather)
                  }
                  Room(c.roomOak) {
                    Heading("12월의 쇼룸 장부")
                    Gap()
                    Text(
                        ModakFacts.monthlySales,
                        style = ModakType.number.copy(fontSize = 36.sp, lineHeight = 44.sp))
                    Meta(ModakFacts.monthlyMetrics)
                    Gap()
                    ModakFacts.orders.forEachIndexed { i, row ->
                      Row(
                          Modifier.fillMaxWidth()
                              .clickable {
                                selectedOrders =
                                    if (i in selectedOrders) selectedOrders - i
                                    else selectedOrders + i
                              }
                              .padding(vertical = 12.dp),
                          verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                i in selectedOrders,
                                { v ->
                                  selectedOrders = if (v) selectedOrders + i else selectedOrders - i
                                })
                            Column(Modifier.weight(1f)) {
                              Text("${row[2]} · ${row[4]}", style = ModakType.ui)
                              Meta(row[3])
                              Meta("${row[0]} · ${row[5]}")
                            }
                          }
                      HorizontalDivider(color = c.line)
                    }
                    ModakButton(
                        "선택 주문 ${selectedOrders.size}건 확인", enabled = selectedOrders.isNotEmpty()) {
                          sheet = "orders"
                        }
                    Gap()
                    Meta(ModakFacts.showroomReview)
                  }
                }
                1 -> {
                  val bg = listOf(c.roomButter, c.roomAttic, c.roomRose, c.roomEmber)[color]
                  val fg = if (color == 1) c.onAttic else c.text
                  CompositionLocalProvider(LocalContentColor provides fg) {
                    Room(bg) {
                      Text(
                          ModakFacts.colors[color][0],
                          style = ModakType.display.copy(fontSize = 44.sp, lineHeight = 54.sp))
                      Text(
                          "${ModakFacts.productId}-${ModakFacts.colors[color][1]}",
                          style = ModakType.code)
                      Gap()
                      RoomScene(1, color)
                      listOf("도톰한 뜨개코 · 띠 줄무늬", "양 끝 술 장식", "라벨 · 뉴질랜드 양모").forEachIndexed { i, s ->
                        CatalogCallout(i + 1, s)
                      }
                      Gap()
                      if (color == 1)
                          Text("무릎 위에 덮어 보세요", style = ModakType.hand, color = c.onAttic)
                      else PencilMemo("무릎 위에 덮어 보세요")
                    }
                  }
                  Room(c.paper) {
                    Heading(ModakFacts.product, 32)
                    Gap()
                    Text(
                        ModakFacts.money(ModakFacts.price),
                        style = ModakType.number.copy(fontSize = 38.sp, lineHeight = 46.sp))
                    Meta(ModakFacts.review)
                    Meta(ModakFacts.spec)
                    Gap()
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)) {
                          ModakFacts.colors.forEachIndexed { i, row ->
                            ModakButton(
                                "${row[0]} · ${row[2]}장",
                                kind =
                                    if (color == i) ButtonKind.Primary else ButtonKind.Secondary) {
                                  color = i
                                }
                          }
                        }
                    Gap()
                    Row(verticalAlignment = Alignment.CenterVertically) {
                      ModakIconButton(Icons.Outlined.Remove, "수량 줄이기") { if (qty > 1) qty-- }
                      Text(
                          "${qty}장",
                          Modifier.weight(1f),
                          style = ModakType.label,
                          textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                      ModakIconButton(Icons.Outlined.Add, "수량 늘리기") { if (qty < 4) qty++ }
                    }
                    Gap()
                    Text("선택 합계 ${ModakFacts.money(ModakFacts.price*qty)}", style = ModakType.label)
                    Meta(ModakFacts.delivery)
                    Gap()
                    ModakButton("장바구니에 담기") {
                      added += qty
                      sheet = "cart"
                    }
                    Gap()
                    Meta(ModakFacts.cutoff)
                    Gap()
                    ModakTabs(listOf("소재", "세탁", "배송"), tab) { tab = it }
                    Gap()
                    Text(
                        listOf(ModakFacts.spec, ModakFacts.washing, ModakFacts.delivery)[tab],
                        style = ModakType.body)
                    Gap()
                    Heading("함께 놓인 물건", 22)
                    CatalogCallout(1, "밤불 밀랍초 3개입 · ₩19,000")
                    CatalogCallout(2, "도톰 머그 · ₩26,000")
                  }
                }
                2 -> {
                  Room(c.roomOak) {
                    Heading("상담함", 32)
                    Meta("백하늘 · 한채원 / 미답 ${6-replied.size}건 · 평균 첫 답장 38분")
                    RoomScene(2)
                    PencilMemo("손으로 만져 보고 골라요")
                  }
                  Room(c.paper) {
                    ModakTextField("이름·내용 찾기", query, { query = it })
                    Gap()
                    ModakTabs(listOf("모두 12", "미답 ${6-replied.size}"), filter) { filter = it }
                    Gap()
                    val rows =
                        (0..11).filter {
                          (filter == 0 || it < 6 && it !in replied) &&
                              ("${ModakFacts.conversations[it][0]} ${ModakFacts.conversations[it][2]}")
                                  .contains(query)
                        }
                    if (rows.isEmpty())
                        ModakEmptyState("찾는 상담이 없어요") {
                          query = ""
                          filter = 0
                        }
                    rows.forEach { i ->
                      val row = ModakFacts.conversations[i]
                      ListItem(
                          headlineContent = { Text(row[0], style = ModakType.ui) },
                          supportingContent = {
                            Text(
                                replyText[i] ?: row[2],
                                style = ModakType.ui.copy(fontSize = 14.sp, lineHeight = 22.sp),
                                maxLines = 2,
                                overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis)
                          },
                          leadingContent = {
                            Box(
                                Modifier.size(40.dp)
                                    .background(
                                        modakRoom(c, listOf(0, 4, 0, 0, 2, 1, 4, 3, 2, 3, 0, 3)[i]),
                                        androidx.compose.foundation.shape.CircleShape),
                                contentAlignment = Alignment.Center) {
                                  Text(row[0].substring(1), style = ModakType.label)
                                }
                          },
                          trailingContent = { Meta(if (i in replied) "답장 완료" else row[1]) },
                          modifier =
                              Modifier.clickable {
                                index = i
                                draft = replyText[i] ?: ""
                                invalid = false
                                sheet = "conversation"
                              },
                          colors = ListItemDefaults.colors(containerColor = c.paper))
                      HorizontalDivider(color = c.line)
                    }
                  }
                }
                3 -> {
                  Room(c.roomFjord) {
                    RoomScene(3)
                    Heading("${ModakFacts.user} 님의 계정", 32)
                    Meta("성북구 정릉동 · ${ModakFacts.member}")
                    Gap()
                    PencilMemo("우리 집에 둘 물건을 골라요")
                  }
                  Room(c.paperRaised) {
                    Heading("내 정보")
                    Gap()
                    ModakTextField(
                        "이름", name, { name = it }, error = if (nameError) "이름을 적어 주세요." else null)
                    Gap()
                    ModakTextField(
                        "휴대폰",
                        phone,
                        { phone = it },
                        error = if (phoneError) "한 자리가 모자라요. 010-1234-5678로 적어 주세요." else null)
                    Gap()
                    ModakTextField("이메일", email, { email = it })
                    Gap()
                    ModakTextField("현관 앞 메모", note, { note = it })
                    Gap()
                    ModakButton("내 정보 저장") {
                      nameError = name.isBlank()
                      phoneError = !Regex("^010-\\d{4}-\\d{4}$").matches(phone)
                      if (!nameError && !phoneError) toast("내 정보를 저장했어요.")
                    }
                    Gap(32)
                    Heading("배송지")
                    Gap()
                    addresses.forEachIndexed { i, row ->
                      if (!(i == 1 && addressRemoved)) {
                        Heading(row[0], 22)
                        Text(row[1])
                        Meta("${row[2]} · ${row[3]} · ${row[4]}")
                        Gap()
                        ModakButton("주소 편집", kind = ButtonKind.Secondary) {
                          index = i
                          draft = row[1]
                          invalid = false
                          sheet = "address"
                        }
                        if (i == 1)
                            ModakButton("부모님 주소 삭제", kind = ButtonKind.Destructive) {
                              confirm = true
                            }
                        Gap()
                      }
                    }
                    Heading("알림")
                    Gap()
                    notifications.forEachIndexed { i, v ->
                      Switch(
                          checked = v,
                          onCheckedChange =
                              if (i == 4) null
                              else
                                  { next: Boolean ->
                                    notifications =
                                        notifications.mapIndexed { j, current ->
                                          if (i == j) next else current
                                        }
                                  })
                      Text(ModakFacts.notifications[i][0])
                      Meta(ModakFacts.notifications[i][1])
                      Gap()
                    }
                    Meta(ModakFacts.quiet)
                    Gap()
                    Heading("받는 곳", 22)
                    channels.forEachIndexed { i, v ->
                      ModakCheckbox(ModakFacts.channels[i][0], v) { next ->
                        channels =
                            channels.mapIndexed { j, current -> if (j == i) next else current }
                      }
                    }
                    Gap()
                    Heading("화면", 22)
                    ModakButton(
                        if (dark) "밤 · 램프 타임 → 낮으로" else "낮 · 오후 네 시 → 밤으로",
                        kind = ButtonKind.Secondary,
                        onClick = onToggle)
                    Gap(32)
                    Heading("우리 집 취향")
                    Text(ModakFacts.taste)
                    Gap()
                    ModakProgress(.75f, "취향 찾기 75%")
                    Gap(32)
                    Heading("결제")
                    Text(ModakFacts.card)
                    Meta("카카오페이")
                    Gap()
                    Heading("진행 중인 스타일링", 22)
                    Text(ModakFacts.styling)
                    Gap(24)
                  }
                }
              }
            }
          }
        }
    if (confirm)
        ModakDialog("배송지 삭제", "애월 부모님 배송지를 삭제할까요?", { confirm = false }) {
          addressRemoved = true
          confirm = false
        }
    if (sheet != null)
        ModakBottomSheet({ sheet = null }) {
          when (sheet) {
            "tour" -> {
              val row = ModakFacts.tours[index]
              Heading(row[2])
              Meta(row[0])
              Text(row[1])
              Gap()
              ModakButton("방문 완료 표시") {
                visited = visited + index
                sheet = null
                toast("방문 완료를 표시했어요.")
              }
            }
            "orders" -> {
              Heading("선택한 주문")
              selectedOrders.forEach { i ->
                Text(
                    "${ModakFacts.orders[i][0]}\n${ModakFacts.orders[i][3]} · ${ModakFacts.orders[i][4]}")
              }
              Gap()
              ModakButton("송장 준비 표시") {
                selectedOrders = emptySet()
                sheet = null
                toast("선택 주문의 송장 준비를 표시했어요.")
              }
            }
            "cart" -> {
              Heading("장바구니에 담았어요")
              Text("${ModakFacts.product} · ${ModakFacts.colors[color][0]} ${qty}장")
              Meta(ModakFacts.cart)
              Text("기존 장바구니 ${ModakFacts.money(ModakFacts.cartTotal)}")
              Text(
                  "담요 추가 ${added}장 · 합계 ${ModakFacts.money(ModakFacts.cartTotal+ModakFacts.price*added)}",
                  style = ModakType.label)
            }
            "conversation" -> {
              val row = ModakFacts.conversations[index]
              Heading(row[0])
              Meta(row[1])
              Gap()
              Text(row[2], style = ModakType.body)
              if (index == 2) {
                Gap()
                Meta("CS-31207 · 류다온 · 서교동")
                RoomScene(2)
                Text(ModakFacts.sample)
              }
              Gap()
              ModakTextField(
                  "답장",
                  draft,
                  { draft = it },
                  helper = "이 앱 안의 상담 기록에 저장합니다.",
                  error = if (invalid) "답장 내용을 적어 주세요." else null)
              Gap()
              ModakButton("샘플 안내", kind = ButtonKind.Secondary) {
                draft = "패브릭 샘플 4종을 준비해 두었어요. 모닥의 집에서 확인해 주세요."
              }
              Gap()
              ModakButton("투어 안내", kind = ButtonKind.Secondary) {
                draft = "금·토 램프 타임은 19:00–21:00입니다."
              }
              Gap()
              ModakButton("답장 저장") {
                invalid = draft.isBlank()
                if (!invalid) {
                  replyText[index] = draft.trim()
                  if (index < 6) replied = replied + index
                  sheet = null
                  toast("답장을 상담 기록에 저장했어요.")
                }
              }
            }
            "address" -> {
              Heading(addresses[index][0])
              Gap()
              ModakTextField(
                  "주소", draft, { draft = it }, error = if (invalid) "주소를 적어 주세요." else null)
              Gap()
              ModakButton("배송지 저장") {
                invalid = draft.isBlank()
                if (!invalid) {
                  addresses =
                      addresses.mapIndexed { i, row ->
                        if (i == index) row.mapIndexed { j, v -> if (j == 1) draft.trim() else v }
                        else row
                      }
                  sheet = null
                  toast("배송지를 저장했어요.")
                }
              }
            }
          }
          Gap()
          ModakButton("닫기", kind = ButtonKind.Secondary) { sheet = null }
        }
  }
}

@Composable
private fun Gap(h: Int = 16) {
  Spacer(Modifier.height(h.dp))
}

@Composable
private fun Heading(text: String, size: Int = 26) {
  Text(text, style = ModakType.display.copy(fontSize = size.sp, lineHeight = (size * 1.25).sp))
}

@Composable
private fun Meta(text: String) {
  Text(
      text,
      style = ModakType.ui.copy(fontSize = 13.sp, lineHeight = 21.sp),
      color = LocalModakSecondary.current ?: LocalModakColors.current.text2)
}

private val LocalModakSecondary = staticCompositionLocalOf<Color?> { null }

@Composable
private fun Room(color: Color, content: @Composable ColumnScope.() -> Unit) {
  val c = LocalModakColors.current
  val secondary =
      if (color in
          listOf(c.roomButter, c.roomSage, c.roomFjord, c.roomOak, c.roomRose, c.roomEmber))
          c.inkOnRoom
      else c.text2
  CompositionLocalProvider(LocalModakSecondary provides secondary) {
    Column(Modifier.fillMaxWidth().background(color).padding(16.dp), content = content)
  }
}
