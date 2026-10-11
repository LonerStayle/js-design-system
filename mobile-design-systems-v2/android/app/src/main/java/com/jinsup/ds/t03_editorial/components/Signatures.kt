package com.jinsup.ds.t03_editorial.components

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.*
import androidx.compose.ui.graphics.drawscope.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import com.jinsup.ds.t03_editorial.HaengganFacts
import com.jinsup.ds.t03_editorial.theme.*

@Composable
fun OxfordRule() {
  val c = LocalHaengganColors.current
  Column {
    Box(Modifier.fillMaxWidth().height(3.dp).background(c.ruleStrong))
    Spacer(Modifier.height(3.dp))
    Box(Modifier.fillMaxWidth().height(.5.dp).background(c.ruleStrong))
  }
}

@Composable
fun FolioSheet(folio: String, content: @Composable ColumnScope.() -> Unit) {
  val c = LocalHaengganColors.current
  Column(Modifier.fillMaxWidth().padding(20.dp)) {
    Text(
        "${HaengganFacts.brand} 2026.11",
        style = HaengganType.ui.copy(fontSize = 12.sp),
        color = c.text2)
    Spacer(Modifier.height(24.dp))
    content()
    Spacer(Modifier.height(32.dp))
    OxfordRule()
    Spacer(Modifier.height(12.dp))
    Text(folio, Modifier.align(Alignment.End), style = HaengganType.code)
  }
}

@Composable
fun HaengganCover() {
  val c = LocalHaengganColors.current
  Box(
      Modifier.fillMaxWidth()
          .aspectRatio(230f / 297)
          .background(c.coverBg)
          .border(1.5.dp, c.ruleStrong)
          .padding(16.dp)) {
        Column(Modifier.fillMaxSize()) {
          Text(
              HaengganFacts.issue,
              style = HaengganType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp),
              color = c.coverFg)
          Text(
              "행간",
              style = HaengganType.display.copy(fontSize = 100.sp, lineHeight = 118.sp),
              color = c.coverMast,
              maxLines = 1)
          Spacer(Modifier.weight(1f))
          Text(
              "활판의\n마지막 가을",
              style = HaengganType.display.copy(fontSize = 30.sp, lineHeight = 38.sp),
              color = c.coverFg)
          Spacer(Modifier.height(12.dp))
          Text(
              HaengganFacts.appendix,
              style = HaengganType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp),
              color = c.coverFg)
          Spacer(Modifier.weight(1f))
          Canvas(Modifier.width(140.dp).height(36.dp)) {
            repeat(35) {
              drawRect(
                  c.coverFg,
                  Offset(it * 4.dp.toPx(), 0f),
                  Size((if (it % 3 == 0) 3 else 1).dp.toPx(), size.height))
            }
          }
          Text(
              HaengganFacts.issn,
              style = HaengganType.code.copy(fontSize = 9.sp),
              color = c.coverFg)
        }
      }
}

fun pageStatus(p: Int): Int {
  if (p in listOf(2, 3, 22, 23, 62, 63, 70, 71)) return 3
  if (p in 24..41 || p in 90..95 || p in 104..107) return 1
  if (p in 42..53 || p in 72..77 || p in 96..103 || p in 108..111) return 2
  return 0
}

@Composable
fun Flatplan(onOpen: () -> Unit) {
  val c = LocalHaengganColors.current
  Column(
      Modifier.fillMaxWidth().clickable(onClick = onOpen).semantics {
        contentDescription = "112쪽 배열표: 조판 완료 46쪽, 교정 중 28쪽, 원고 대기 30쪽, 광고 8쪽. 상세 보기"
      }) {
        repeat(14) { r ->
          Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            repeat(8) { i ->
              val p = r * 8 + i + 1
              val status = pageStatus(p)
              Box(
                  Modifier.weight(1f)
                      .aspectRatio(.85f)
                      .background(if (status == 0) c.doneBg else c.canvas)
                      .border(
                          if (status == 3) 1.5.dp else .5.dp,
                          if (status == 3) c.spot else c.ruleStrong),
                  contentAlignment = Alignment.Center) {
                    if (status == 1)
                        Canvas(Modifier.fillMaxSize().clipToBounds()) {
                          var x = -size.height
                          while (x < size.width) {
                            drawLine(
                                c.rule,
                                Offset(x, 0f),
                                Offset(x + size.height, size.height),
                                .7.dp.toPx())
                            x += 5.dp.toPx()
                          }
                        }
                    Text(
                        "%03d".format(p),
                        style = HaengganType.code.copy(fontSize = 8.sp, lineHeight = 12.sp),
                        color = if (status == 0) c.doneFg else c.text)
                  }
            }
          }
          Spacer(Modifier.height(4.dp))
        }
      }
}

@Composable
fun LeaderRow(title: String, folio: String, onClick: () -> Unit = {}) {
  val c = LocalHaengganColors.current
  Row(
      Modifier.fillMaxWidth()
          .heightIn(min = 48.dp)
          .clickable(onClick = onClick)
          .padding(vertical = 12.dp),
      verticalAlignment = Alignment.CenterVertically) {
        Text(title, Modifier.weight(1f), style = HaengganType.body)
        Text(
            "····", Modifier.padding(horizontal = 8.dp), color = c.text2, style = HaengganType.code)
        Text(folio, style = HaengganType.code.copy(fontSize = 11.sp))
      }
}
