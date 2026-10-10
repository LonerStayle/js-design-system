package com.jinsup.ds.t01_neobrutalism.components

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import com.jinsup.ds.t01_neobrutalism.theme.*

@Composable
fun PriceSticker(label: String) {
    val c = LocalPanpanColors.current
    Box(
        Modifier.rotate(-2f)
            .drawBehind { drawRect(c.shadowInk, topLeft = Offset(3.dp.toPx(), 3.dp.toPx())) }
            .background(c.highlight)
            .border(2.dp, c.stickerEdge)
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Text(
            label,
            style = PanpanType.ui.copy(fontSize = 18.sp),
            fontWeight = FontWeight.Bold,
            color = c.onHighlight,
        )
    }
}

@Composable
fun AlbumArt() {
    val c = LocalPanpanColors.current
    Canvas(
        Modifier.fillMaxWidth().aspectRatio(1.45f).semantics {
            contentDescription = "지하 3층 앨범 표지, 흑백 계단과 붉은 사각형"
        }
    ) {
        drawRect(c.printPaper)
        repeat(5) { i ->
            drawRect(
                c.printInk,
                topLeft = Offset(0f, 16 + i * size.height * .12f),
                size = Size(size.width, size.height * .065f),
            )
        }
        drawRect(
            c.printRed,
            topLeft = Offset(size.width * .73f, size.height * .25f),
            size = Size(size.width * .15f, size.height * .23f),
        )
    }
}
