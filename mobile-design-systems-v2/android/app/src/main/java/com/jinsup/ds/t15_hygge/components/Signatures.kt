package com.jinsup.ds.t15_hygge.components

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.*
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import androidx.core.content.res.ResourcesCompat
import com.jinsup.ds.R
import com.jinsup.ds.t15_hygge.theme.*

fun modakRoom(c: ModakColors, i: Int) =
    listOf(c.roomButter, c.roomSage, c.roomFjord, c.roomOak, c.roomRose, c.roomEmber, c.roomAttic)[
        i]

@Composable
fun PencilMemo(text: String) {
  Text(
      text, Modifier.rotate(-2.5f), style = ModakType.hand, color = LocalModakColors.current.pencil)
}

@Composable
fun RoomScene(scene: Int = 0, color: Int = 0, lights: Set<Int> = setOf(0, 1, 3, 5)) {
  val c = LocalModakColors.current
  val typeface = ResourcesCompat.getFont(LocalContext.current, R.font.b15_bricolagegrotesque_800)
  val height =
      when (scene) {
        1 -> 310
        2 -> 156
        3 -> 200
        else -> 230
      }
  Canvas(
      Modifier.fillMaxWidth().height(height.dp).semantics {
        contentDescription =
            listOf(
                "모닥의 집, 일곱 방의 단면", "의자 팔걸이 위 양모 담요, 뜨개코와 술 장식", "네 종류의 패브릭 샘플", "현관 문과 신발장, 배송 상자")[
                scene]
      }) {
        withTransform({ scale(size.width / 358f, size.height / height, Offset.Zero) }) {
          fun rect(x: Float, y: Float, w: Float, h: Float, col: Color, r: Float = 0f) {
            drawRoundRect(col, Offset(x, y), Size(w, h), CornerRadius(r))
          }
          fun line(x: Float, y: Float, xx: Float, yy: Float, col: Color, w: Float = 2f) {
            drawLine(col, Offset(x, y), Offset(xx, yy), w)
          }
          fun dot(x: Float, y: Float, r: Float, col: Color) {
            drawCircle(col, r, Offset(x, y))
          }
          fun glow(x: Float, y: Float, w: Float, h: Float) {
            if (!c.dark) return
            val p =
                Path().apply {
                  moveTo(x, y)
                  lineTo(x + w / 2, y + h)
                  lineTo(x - w / 2, y + h)
                  close()
                }
            drawPath(
                p,
                Brush.verticalGradient(
                    listOf(c.lamp.copy(alpha = .55f), c.lamp.copy(alpha = 0f)),
                    startY = y,
                    endY = y + h * .92f))
            drawOval(c.lamp.copy(alpha = .2f), Offset(x - w / 2, y + h - 6), Size(w, 12f))
          }
          when (scene) {
            0 -> {
              rect(6f, 202f, 346f, 28f, c.floorFjord)
              line(6f, 202f, 352f, 202f, c.objInk.copy(alpha = .14f), 3f)
              drawPath(
                  Path().apply {
                    moveTo(22f, 68f)
                    lineTo(177f, 4f)
                    lineTo(334f, 68f)
                    close()
                  },
                  c.objWoodD)
              rect(20f, 65f, 316f, 138f, c.objWood, 4f)
              repeat(6) { i ->
                val x = 26 + i % 3 * 103f
                val y = 71 + i / 3 * 63f
                val index = listOf(2, 4, 6, 0, 1, 3)[i]
                rect(x, y, 95f, 56f, modakRoom(c, index))
                if (i < 3) {
                  rect(x + 9, y + 10, 20f, 29f, c.objSky, 1f)
                  line(x + 19, y + 10, x + 19, y + 39, c.objFrame)
                }
                when (i) {
                  0 -> {
                    rect(x + 44, y + 13, 30f, 34f, c.objWoodD)
                    repeat(3) { k -> rect(x + 46, y + 16 + k * 9, 26f, 3f, c.objLinen) }
                  }
                  1 -> {
                    rect(x + 38, y + 30, 48f, 18f, c.objLinen, 3f)
                    rect(x + 41, y + 24, 13f, 8f, c.objWool, 2f)
                  }
                  2 -> rect(x + 49, y + 31, 22f, 13f, c.objWoodD)
                  3 -> {
                    rect(x + 8, y + 29, 48f, 20f, c.objChair, 6f)
                    rect(x + 68, y + 9, 4f, 37f, c.objWoodD)
                    dot(x + 70, y + 12, 12f, c.lamp)
                  }
                  4 -> {
                    rect(x + 9, y + 27, 70f, 20f, c.objLinen)
                    rect(x + 15, y + 15, 18f, 12f, c.objCeramic)
                  }
                  else -> {
                    rect(x + 18, y + 24, 60f, 6f, c.objWoodD)
                    rect(x + 23, y + 30, 4f, 18f, c.objWoodD)
                    rect(x + 67, y + 30, 4f, 18f, c.objWoodD)
                  }
                }
                if (index in lights) {
                  dot(x + 81, y + 9, 4f, c.lamp)
                  glow(x + 47, y + 8, 55f, 40f)
                }
              }
              rect(240f, 173f, 79f, 29f, c.roomEmber)
              rect(250f, 179f, 55f, 4f, c.objWoodD)
              rect(254f, 183f, 3f, 15f, c.objWoodD)
              rect(298f, 183f, 3f, 15f, c.objWoodD)
              if (5 in lights) glow(279f, 176f, 54f, 25f)
            }
            1 -> {
              val fabric =
                  listOf(
                      c.swatchButter,
                      c.swatchPine,
                      if (c.dark) c.objWool else c.swatchSnow,
                      c.swatchTangerine)[color]
              val floor = listOf(c.floorButter, c.floorAttic, c.floorRose, c.floorEmber)[color]
              rect(0f, 254f, 358f, 56f, floor)
              line(0f, 254f, 358f, 254f, c.objInk.copy(alpha = .14f), 3f)
              drawOval(c.objShadow, Offset(63f, 284f), Size(242f, 12f))
              rect(40f, 47f, 159f, 108f, c.objChair, 24f)
              rect(48f, 62f, 141f, 93f, c.objShade, 18f)
              rect(41f, 176f, 243f, 77f, c.objChair, 18f)
              rect(164f, 104f, 128f, 64f, c.objShade, 28f)
              rect(86f, 244f, 8f, 39f, c.objWoodD, 2f)
              rect(264f, 245f, 8f, 38f, c.objWoodD, 2f)
              drawPath(
                  Path().apply {
                    moveTo(180f, 107f)
                    quadraticBezierTo(216f, 83f, 255f, 120f)
                    lineTo(262f, 259f)
                    quadraticBezierTo(227f, 273f, 161f, 253f)
                    lineTo(172f, 135f)
                    close()
                  },
                  fabric)
              var y = 137f
              while (y < 247) {
                var x = 180f
                while (x < 245) {
                  line(x, y, x + 6, y + 5, c.objInk.copy(alpha = .25f))
                  line(x + 6, y + 5, x + 12, y, c.objInk.copy(alpha = .25f))
                  x += 12
                }
                y += 11
              }
              line(178f, 153f, 249f, 153f, c.objInk.copy(alpha = .15f), 5f)
              line(169f, 218f, 255f, 218f, c.objInk.copy(alpha = .15f), 5f)
              var x = 165f
              while (x < 260) {
                line(x, 255f, x, 277f, c.objWood, 3f)
                x += 8
              }
              rect(229f, 161f, 24f, 15f, c.paperRaised, 1f)
              line(234f, 166f, 247f, 166f, c.objInk)
              line(234f, 170f, 242f, 170f, c.objInk)
              listOf(
                      listOf(126f, 207f, 193f, 194f),
                      listOf(298f, 270f, 251f, 259f),
                      listOf(310f, 137f, 244f, 168f))
                  .forEachIndexed { index, p ->
                    line(p[0], p[1], p[2], p[3], c.objInk.copy(alpha = .6f), 1.5f)
                    dot(p[2], p[3], 3f, c.objInk)
                    dot(p[0], p[1], 13f, c.objInk)
                    val paint =
                        android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply {
                          this.typeface = typeface
                          this.textSize = 14f
                          this.color = c.paper.toArgb()
                          this.textAlign = android.graphics.Paint.Align.CENTER
                        }
                    drawContext.canvas.nativeCanvas.drawText(
                        "${index+1}", p[0], p[1] - (paint.ascent() + paint.descent()) / 2, paint)
                  }
            }
            2 -> {
              repeat(4) { i ->
                val x = 8 + i * 88f
                val col = listOf(c.swatchSage, c.swatchFirewood, c.objLinen, c.swatchButter)[i]
                rect(x, 20f, 76f, 111f, col, 3f)
                drawOval(c.objShadow, Offset(x + 8, 132f), Size(60f, 5f))
                var y = 28f
                while (y < 125) {
                  var xx = x + 7
                  while (xx < x + 70) {
                    when (i) {
                      0 -> dot(xx, y, 1.6f, c.objInk.copy(alpha = .18f))
                      1 -> line(xx, y, xx + 5, y + 3, c.objInk.copy(alpha = .14f), 1f)
                      2 -> {
                        line(xx, y, xx, y + 6, c.objInk.copy(alpha = .16f), 1f)
                        line(xx, y, xx + 6, y, c.objInk.copy(alpha = .12f), 1f)
                      }
                      else -> {
                        line(xx, y, xx + 3, y + 3, c.objInk.copy(alpha = .18f), 1.5f)
                        line(xx + 3, y + 3, xx + 6, y, c.objInk.copy(alpha = .18f), 1.5f)
                      }
                    }
                    xx += 9
                  }
                  y += 9
                }
              }
            }
            else -> {
              rect(0f, 153f, 358f, 47f, c.floorFjord)
              line(0f, 153f, 358f, 153f, c.objInk.copy(alpha = .14f), 3f)
              rect(17f, 25f, 20f, 125f, c.objFrame)
              rect(21f, 30f, 12f, 116f, c.objSky)
              var y = 47f
              while (y < 140) {
                dot(25f, y, 1.5f, c.objSnow)
                y += 16
              }
              rect(43f, 19f, 79f, 135f, c.objLinen)
              rect(50f, 26f, 64f, 126f, c.objWood)
              rect(57f, 34f, 50f, 53f, c.objWoodD.copy(alpha = .38f))
              rect(57f, 94f, 50f, 49f, c.objWoodD.copy(alpha = .38f))
              dot(108f, 87f, 3f, c.lamp)
              rect(145f, 70f, 124f, 7f, c.objWood)
              rect(149f, 77f, 5f, 76f, c.objWood)
              rect(260f, 77f, 5f, 76f, c.objWood)
              rect(145f, 108f, 124f, 6f, c.objWood)
              rect(145f, 146f, 124f, 7f, c.objWood)
              repeat(3) { i ->
                rect(160 + i * 31f, 94f, 22f, 12f, c.objLinen, 6f)
                rect(160 + i * 31f, 130f, 23f, 16f, if (i == 1) c.objMug else c.objLinen, 3f)
              }
              rect(283f, 97f, 59f, 24f, c.objWood, 2f)
              rect(276f, 126f, 72f, 28f, c.objWood, 2f)
              line(314f, 97f, 314f, 121f, c.objWoodD, 4f)
              line(313f, 126f, 313f, 154f, c.objWoodD, 4f)
              rect(282f, 135f, 21f, 12f, c.paperRaised, 1f)
            }
          }
        }
      }
}

@Composable
fun CatalogCallout(number: Int, label: String, onClick: (() -> Unit)? = null) {
  val c = LocalModakColors.current
  Row(
      Modifier.fillMaxWidth()
          .heightIn(min = 48.dp)
          .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
      verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier.size(26.dp)
                .background(c.objInk, androidx.compose.foundation.shape.CircleShape),
            contentAlignment = Alignment.Center) {
              Text(
                  "$number",
                  style = ModakType.number.copy(fontSize = 14.sp, lineHeight = 18.sp),
                  color = c.paper)
            }
        Spacer(Modifier.width(12.dp))
        Text(label, style = ModakType.ui)
      }
}
