package com.jinsup.ds.t30_corporate_clean_saas.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.*
import com.jinsup.ds.t30_corporate_clean_saas.LedgerFacts as F
import com.jinsup.ds.t30_corporate_clean_saas.theme.*

@Composable
fun ApprovalLine(approved: Boolean = false, rejected: Boolean = false) {
    val c = LocalLedgerColors.current
    val stampScale = remember { Animatable(1f) }
    LaunchedEffect(approved) {
        if (approved) {
            stampScale.snapTo(1.25f)
            stampScale.animateTo(1f, tween(LedgerMotion.stamp, easing = LedgerMotion.ease))
        }
    }
    Row(
        Modifier.fillMaxWidth().semantics {
            contentDescription =
                if (rejected) "박도윤 반려"
                else if (approved) "박도윤 승인 완료, 이서진 결재 대기" else "최민재 승인 완료, 박도윤 결재 차례"
        }
    ) {
        repeat(3) { i ->
            Column(
                Modifier.weight(1f)
                    .background(if (i == 1 && !approved) c.primaryTint else c.surface)
                    .border(1.dp, c.lineStrong),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    listOf("팀장", "재무", "대표")[i],
                    Modifier.padding(6.dp),
                    style = LedgerType.ui.copy(fontSize = 12.sp),
                )
                HorizontalDivider(color = c.lineStrong)
                Box(
                    Modifier.padding(8.dp)
                        .size(46.dp)
                        .graphicsLayer {
                            scaleX = if (i == 1) stampScale.value else 1f
                            scaleY = scaleX
                            rotationZ = -8f
                        }
                        .border(
                            if (i == 0 || i == 1 && approved) 2.dp else 1.dp,
                            if (i == 0 || i == 1 && approved) c.stamp
                            else if (i == 1) c.primary else c.lineStrong,
                            if (rejected && i == 1) RectangleShape else CircleShape,
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        if (i == 0) "민재"
                        else if (i == 1) {
                            if (rejected) "반려" else if (approved) "도윤" else "차례"
                        } else "대기",
                        style = LedgerType.ui.copy(fontSize = 13.sp),
                        color =
                            if (i == 0 || i == 1 && approved) c.stamp
                            else if (i == 1) c.primary else c.text2,
                    )
                }
                Text(
                    listOf(F.author, F.reviewer, F.director)[i],
                    Modifier.padding(bottom = 8.dp),
                    style = LedgerType.ui.copy(fontSize = 12.sp),
                )
            }
        }
    }
}

@Composable
fun ApprovalProgress(done: Int = 1) {
    val c = LocalLedgerColors.current
    Row(verticalAlignment = Alignment.CenterVertically) {
        repeat(3) { i ->
            Box(
                Modifier.padding(end = 2.dp)
                    .size(8.dp)
                    .background(if (i < done) c.text else c.surface)
                    .border(1.dp, c.lineStrong)
            )
        }
        Spacer(Modifier.width(4.dp))
        Text("$done/3 승인", style = LedgerType.ui.copy(fontSize = 12.sp), color = c.text2)
    }
}

@Composable
fun LedgerRule(label: String, value: String, total: Boolean = false) {
    val c = LocalLedgerColors.current
    Column {
        if (total) HorizontalDivider(color = c.ruleHead, thickness = 2.dp)
        Row(Modifier.fillMaxWidth().padding(vertical = 14.dp), verticalAlignment = Alignment.Top) {
            Text(
                label,
                Modifier.weight(2f),
                style = LedgerType.ui.copy(fontSize = 14.sp),
                color = c.text2,
            )
            Text(
                value,
                Modifier.weight(3f),
                textAlign = TextAlign.End,
                style = LedgerType.ui.copy(fontFeatureSettings = "tnum"),
                fontWeight = if (total) FontWeight.Bold else FontWeight.Medium,
            )
        }
        HorizontalDivider(color = c.line)
    }
}
