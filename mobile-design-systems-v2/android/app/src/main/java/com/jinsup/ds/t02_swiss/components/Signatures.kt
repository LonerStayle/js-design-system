package com.jinsup.ds.t02_swiss.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.*
import androidx.compose.ui.unit.*
import com.jinsup.ds.R
import com.jinsup.ds.t02_swiss.theme.*

@Composable
fun GridPlate(
    title: String,
    number: String,
    caption: String,
    height: Int = 208,
    paper: Boolean = false,
    poster: Boolean = false
) {
  val c = LocalOseonColors.current
  val wide = number.length > 2
  val compact = !wide && !poster && !paper && height <= 160
  val numberSize = with(LocalDensity.current) { (if (wide) 96.dp else 164.dp).toSp() }
  val bg = if (poster) c.plateRed else if (paper) c.litPaper else c.plateInk
  val fg = if (poster) c.onPlateRed else if (paper) c.onPosterPaper else c.onPlateInk
  Box(
      Modifier.fillMaxWidth().height(height.dp).background(bg).clipToBounds().semantics {
        contentDescription = "$title, $number, $caption"
      }) {
        Canvas(Modifier.fillMaxSize()) {
          drawRect(
              if (poster) c.plateInk else c.accent,
              size = androidx.compose.ui.geometry.Size(size.width, 8.dp.toPx()))
          val step = (size.width - 32.dp.toPx()) / 4
          var x = 16.dp.toPx()
          while (x < size.width) {
            drawLine(fg.copy(alpha = .16f), Offset(x, 0f), Offset(x, size.height), .7.dp.toPx())
            x += step
          }
          var y = 0f
          while (y < size.height) {
            drawLine(fg.copy(alpha = .16f), Offset(0f, y), Offset(size.width, y), .7.dp.toPx())
            y += 64.dp.toPx()
          }
        }
        Text(
            number,
            Modifier.align(
                    if (wide) Alignment.BottomStart
                    else if (paper || compact) Alignment.TopEnd else Alignment.BottomEnd)
                .offset(
                    x = if (wide) (-24).dp else 8.dp,
                    y = if (paper || compact) (-44).dp else if (wide) 12.dp else 38.dp),
            color = fg,
            style =
                OseonType.number.copy(
                    fontFamily = FontFamily(Font(R.font.b2_intertight_900, FontWeight.Black)),
                    fontWeight = FontWeight.Black,
                    fontSize = numberSize,
                    lineHeight = numberSize))
        Text(
            caption,
            Modifier.padding(
                start = if (wide) 220.dp else 16.dp, top = if (wide) 98.dp else 24.dp, end = 16.dp),
            color = fg,
            style = OseonType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp))
        Text(
            title,
            Modifier.align(Alignment.BottomStart)
                .padding(
                    start = if (wide) 220.dp else 16.dp,
                    end = if (wide) 16.dp else if (paper || compact) 130.dp else 16.dp,
                    bottom =
                        if (wide) 72.dp else if (compact) 24.dp else if (poster) 40.dp else 76.dp)
                .graphicsLayer { if (poster) rotationZ = -45f },
            color = fg,
            style =
                OseonType.display.copy(
                    fontSize = if (poster) 48.sp else if (wide || compact) 24.sp else 30.sp,
                    lineHeight = 40.sp))
      }
}

@Composable
fun OseonBullet(label: String, value: Double) {
  val c = LocalOseonColors.current
  Column(Modifier.fillMaxWidth().padding(vertical = 12.dp)) {
    Row {
      Text(label, Modifier.weight(1f), style = OseonType.ui, fontWeight = FontWeight.Bold)
      Text("$value%", style = OseonType.ui, fontWeight = FontWeight.Black)
    }
    Spacer(Modifier.height(12.dp))
    Canvas(
        Modifier.fillMaxWidth().height(16.dp).semantics {
          contentDescription = "판매율 $value%, 목표 85%"
        }) {
          drawRect(c.surface2)
          drawRect(
              c.fg,
              size =
                  androidx.compose.ui.geometry.Size(
                      size.width * (value / 100).toFloat(), size.height))
          drawLine(
              c.accent,
              Offset(size.width * .85f, 0f),
              Offset(size.width * .85f, size.height),
              2.dp.toPx())
        }
  }
}
