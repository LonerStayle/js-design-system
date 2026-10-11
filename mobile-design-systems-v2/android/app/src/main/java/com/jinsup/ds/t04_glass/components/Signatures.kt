package com.jinsup.ds.t04_glass.components

import android.os.Build
import android.provider.Settings
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.geometry.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.*
import androidx.compose.ui.input.pointer.*
import androidx.compose.ui.layout.*
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import com.jinsup.ds.t04_glass.theme.*
import kotlinx.coroutines.launch

private fun DrawScope.river(c: YunseulColors, w: Float, h: Float) {
  drawRect(
      Brush.verticalGradient(
          0f to c.skyTop, .2f to c.skyMid, .55f to c.skyLow, 1f to c.horizon, endY = h * .78f),
      size = Size(w, h))
  val sun = Offset(w * (if (c.dark) .78f else .17f), h * (if (c.dark) .17f else .48f))
  drawCircle(
      Brush.radialGradient(
          listOf(c.sun.copy(alpha = .55f), c.sun.copy(alpha = 0f)),
          center = sun,
          radius = 54.dp.toPx()),
      54.dp.toPx(),
      sun)
  drawCircle(c.sun, if (c.dark) 14.dp.toPx() else 26.dp.toPx(), sun)
  if (c.dark)
      repeat(32) { i ->
        drawCircle(
            c.sun.copy(alpha = .55f),
            if (i % 3 == 0) 1.2.dp.toPx() else .6.dp.toPx(),
            Offset((i * 71 % 390) / 390f * w, (i * 41 % 210) / 844f * h))
      }
  val hill =
      Path().apply {
        moveTo(0f, h * .61f)
        lineTo(w * .15f, h * .54f)
        lineTo(w * .36f, h * .59f)
        lineTo(w * .6f, h * .52f)
        lineTo(w * .82f, h * .58f)
        lineTo(w, h * .53f)
        lineTo(w, h * .75f)
        lineTo(0f, h * .75f)
        close()
      }
  drawPath(hill, c.hill)
  repeat(15) { i ->
    val x = i * w / 14
    val height = (32 + i * 17 % 62).dp.toPx()
    drawRect(
        if (i % 2 == 0) c.skyline else c.skylineFar,
        Offset(x, h * .71f - height),
        Size(w / 20, height + 32.dp.toPx()))
    if (c.dark) {
      var y = 6.dp.toPx()
      while (y < height) {
        if ((i + y.toInt()) % 3 != 0)
            drawRect(
                c.windowLit,
                Offset(x + 4.dp.toPx(), h * .71f - height + y),
                Size(2.dp.toPx(), 3.dp.toPx()))
        y += 12.dp.toPx()
      }
    }
  }
  drawRect(
      Brush.verticalGradient(listOf(c.river, c.riverDeep), startY = h * .75f, endY = h),
      Offset(0f, h * .75f),
      Size(w, h * .25f))
  repeat(38) { i ->
    val y = h * .78f + i * h * .0054f
    val x = (i * 37 % 390) / 390f * w
    drawLine(
        c.glint.copy(alpha = .6f),
        Offset(x, y),
        Offset(x + (8 + i % 5 * 8).dp.toPx(), y),
        1.5.dp.toPx())
  }
  drawLine(c.skyline, Offset(0f, h * .79f), Offset(w, h * .775f), 5.dp.toPx())
}

@Composable
fun RiverWindow(modifier: Modifier = Modifier) {
  val c = LocalYunseulColors.current
  Canvas(modifier.fillMaxSize()) { river(c, size.width, size.height) }
}

@Composable
fun GlassPanel(
    modifier: Modifier = Modifier,
    on: Boolean = false,
    radius: Int = 24,
    padding: Int = 16,
    content: @Composable ColumnScope.() -> Unit
) {
  val scope = rememberCoroutineScope()
  val sweep = remember { Animatable(1f) }
  val context = LocalContext.current
  val reduce =
      Settings.Global.getFloat(
          context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
  val c = LocalYunseulColors.current
  val shape = RoundedCornerShape(radius.dp)
  val config = LocalConfiguration.current
  var position by remember { mutableStateOf(Offset.Zero) }
  Box(
      modifier
          .fillMaxWidth()
          .pointerInput(reduce) {
            awaitEachGesture {
              awaitFirstDown(requireUnconsumed = false, pass = PointerEventPass.Initial)
              if (!reduce)
                  scope.launch {
                    sweep.snapTo(0f)
                    sweep.animateTo(1f, tween(YunseulMotion.sweep))
                  }
            }
          }
          .shadow(12.dp, shape, clip = false)
          .clip(shape)
          .onGloballyPositioned { position = it.positionInRoot() }) {
        if (!on && Build.VERSION.SDK_INT >= 31)
            Canvas(Modifier.matchParentSize().blur(18.dp)) {
              translate(-position.x, -position.y) {
                river(c, config.screenWidthDp.dp.toPx(), config.screenHeightDp.dp.toPx())
              }
            }
        Column(
            Modifier.fillMaxWidth()
                .background(
                    if (on) c.tileOn
                    else if (Build.VERSION.SDK_INT < 31) c.glassSolid else c.glass2)
                .drawWithContent {
                  drawContent()
                  if (sweep.value < 1f) {
                    val x = size.width * sweep.value
                    drawLine(
                        c.kelvinMid.copy(alpha = (1f - sweep.value) * .7f),
                        Offset(x - 20.dp.toPx(), 1.dp.toPx()),
                        Offset(x + 20.dp.toPx(), 1.dp.toPx()),
                        3.dp.toPx())
                  }
                  drawRoundRect(
                      Brush.linearGradient(
                          listOf(
                              c.kelvinMid.copy(alpha = if (c.dark) .35f else 1f),
                              c.kelvinMid.copy(alpha = .08f),
                              c.lamp.copy(alpha = if (c.dark) .4f else .1f))),
                      cornerRadius = CornerRadius(radius.dp.toPx()),
                      style = Stroke(1.5.dp.toPx()))
                  drawLine(
                      c.kelvinMid.copy(alpha = if (c.dark) .12f else .5f),
                      Offset(radius.dp.toPx(), 2.dp.toPx()),
                      Offset(size.width - radius.dp.toPx(), 2.dp.toPx()),
                      1.dp.toPx())
                }
                .padding(padding.dp),
            content = content)
      }
}

@Composable
fun YunseulLamp(variant: Int) {
  val c = LocalYunseulColors.current
  Canvas(
      Modifier.fillMaxWidth().height(272.dp).semantics {
        contentDescription = "유리 돔 무드등, ${listOf("서리","호박","심해")[variant]}"
      }) {
        val center = Offset(size.width * .5f, size.height * .46f)
        val r = 88.dp.toPx()
        val glow = listOf(c.kelvinMid, c.lamp, c.primary)[variant]
        drawCircle(
            Brush.radialGradient(
                listOf(glow.copy(alpha = .65f), glow.copy(alpha = 0f)),
                center = center,
                radius = 126.dp.toPx()),
            126.dp.toPx(),
            center)
        drawCircle(
            Brush.radialGradient(
                0f to c.kelvinMid,
                .24f to glow.copy(alpha = .95f),
                1f to glow.copy(alpha = .12f),
                center = center,
                radius = r),
            r,
            center)
        drawCircle(c.kelvinMid.copy(alpha = .7f), r, center, style = Stroke(1.5.dp.toPx()))
        drawArc(
            c.kelvinMid.copy(alpha = .4f),
            144f,
            117f,
            false,
            Offset(center.x - r + 10.dp.toPx(), center.y - r + 10.dp.toPx()),
            Size((r - 10.dp.toPx()) * 2, (r - 10.dp.toPx()) * 2),
            style = Stroke(1.5.dp.toPx()))
        drawOval(
            Brush.verticalGradient(
                listOf(c.glassSolid, c.skyline, c.lamp.copy(alpha = .5f)),
                startY = 214.dp.toPx(),
                endY = 235.dp.toPx()),
            Offset(size.width / 2 - 84.dp.toPx(), 208.dp.toPx()),
            Size(168.dp.toPx(), 24.dp.toPx()))
      }
}

@Composable
fun YunseulGauge(value: Float, label: String) {
  val c = LocalYunseulColors.current
  Box(
      Modifier.fillMaxWidth().height(160.dp).semantics { contentDescription = label },
      contentAlignment = Alignment.Center) {
        Canvas(Modifier.size(144.dp)) {
          drawArc(c.track, -90f, 360f, false, style = Stroke(8.dp.toPx(), cap = StrokeCap.Round))
          drawArc(
              c.primary,
              -90f,
              360f * value,
              false,
              style = Stroke(8.dp.toPx(), cap = StrokeCap.Round))
        }
        Text(
            label,
            style =
                YunseulType.number.copy(
                    fontSize = 50.sp, lineHeight = 60.sp, fontWeight = FontWeight.ExtraLight),
            color = c.text)
      }
}
