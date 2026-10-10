package com.jinsup.ds.t01_neobrutalism.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import com.jinsup.ds.t01_neobrutalism.theme.*

enum class ButtonKind {
    Primary,
    Secondary,
    Ghost,
    Destructive,
}

@Composable
fun PanpanButton(
    label: String,
    modifier: Modifier = Modifier,
    kind: ButtonKind = ButtonKind.Primary,
    enabled: Boolean = true,
    loading: Boolean = false,
    onClick: () -> Unit,
) {
    val c = LocalPanpanColors.current
    val source = remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val focused by source.collectIsFocusedAsState()
    val shift by
        animateDpAsState(if (pressed) 6.dp else 0.dp, tween(PanpanMotion.press), label = "누름")
    val fill =
        if (!enabled) c.disabledFill
        else
            when (kind) {
                ButtonKind.Primary -> c.accent
                ButtonKind.Destructive -> c.dangerBtn
                else -> c.surface
            }
    val fg =
        if (!enabled) c.fgMuted
        else
            when (kind) {
                ButtonKind.Primary -> c.onAccent
                ButtonKind.Destructive -> c.onDangerBtn
                else -> c.fg
            }
    Box(
        modifier.padding(end = 6.dp, bottom = 6.dp).offset(shift, shift).drawBehind {
            if (true && !pressed && kind != ButtonKind.Ghost)
                drawRect(
                    c.shadowInk,
                    topLeft = androidx.compose.ui.geometry.Offset(6.dp.toPx(), 6.dp.toPx()),
                )
        }
    ) {
        Surface(
            color = fill,
            shape = RoundedCornerShape(PanpanShape.control),
            border =
                BorderStroke(
                    PanpanShape.rule,
                    if (focused) c.focus else if (kind == ButtonKind.Ghost) fill else c.rule,
                ),
        ) {
            Row(
                Modifier.defaultMinSize(minWidth = 48.dp, minHeight = 48.dp)
                    .clickable(
                        enabled = enabled && !loading,
                        interactionSource = source,
                        indication = null,
                        role = Role.Button,
                        onClick = onClick,
                    )
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
            ) {
                if (loading) {
                    CircularProgressIndicator(
                        Modifier.size(16.dp).semantics { contentDescription = "처리 중" },
                        color = fg,
                        strokeWidth = 2.dp,
                    )
                    Spacer(Modifier.width(8.dp))
                }
                Text(label, color = fg, style = PanpanType.ui, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun PanpanIconButton(icon: ImageVector, label: String, onClick: () -> Unit) {
    IconButton(onClick = onClick, modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)) {
        Icon(icon, contentDescription = label)
    }
}

@Composable
fun PanpanTextField(
    label: String,
    value: String,
    onChange: (String) -> Unit,
    helper: String? = null,
    error: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onChange,
        label = { Text(label) },
        supportingText = { if (error != null || helper != null) Text(error ?: helper.orEmpty()) },
        isError = error != null,
        textStyle = PanpanType.ui,
        shape = RoundedCornerShape(PanpanShape.control),
        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
    )
}

@Composable
fun PanpanCard(content: @Composable ColumnScope.() -> Unit) {
    val c = LocalPanpanColors.current
    Column(
        Modifier.fillMaxWidth()
            .border(PanpanShape.rule, c.rule, RoundedCornerShape(PanpanShape.panel))
            .padding(16.dp),
        content = content,
    )
}

@Composable
fun PanpanBadge(label: String, alert: Boolean = false) {
    val c = LocalPanpanColors.current
    Box(
        Modifier.background(
                if (alert) c.dangerFill else c.highlight,
                RoundedCornerShape(PanpanShape.badge),
            )
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            label,
            color = if (alert) c.onDanger else c.onHighlight,
            style = PanpanType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp),
            fontWeight = FontWeight.Bold,
        )
    }
}

@Composable
fun PanpanTabs(labels: List<String>, selected: Int, onSelect: (Int) -> Unit) {
    val c = LocalPanpanColors.current
    Row(
        Modifier.fillMaxWidth().padding(top = if (true) 12.dp else 0.dp),
        verticalAlignment = Alignment.Bottom,
    ) {
        labels.forEachIndexed { i, label ->
            Column(
                Modifier.weight(1f)
                    .padding(end = if (true) 4.dp else 0.dp)
                    .background(if (i == selected) c.highlight else c.surface)
                    .then(if (true) Modifier.border(3.dp, c.rule) else Modifier)
                    .clickable(role = Role.Tab) { onSelect(i) }
                    .semantics { this.selected = i == selected }
            ) {
                Box(
                    Modifier.fillMaxWidth()
                        .heightIn(min = if (true && i == selected) 60.dp else 48.dp)
                        .padding(8.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        label,
                        style = PanpanType.ui.copy(fontSize = 14.sp),
                        color = if (i == selected) c.onHighlight else c.fg,
                        fontWeight = if (i == selected) FontWeight.Bold else FontWeight.Normal,
                    )
                }
                if (!true)
                    HorizontalDivider(
                        thickness = if (i == selected) 2.dp else 1.dp,
                        color = if (i == selected) c.fg else c.rule,
                    )
            }
        }
    }
}

@Composable
fun PanpanTopAppBar(title: String, dark: Boolean, onBack: () -> Unit, onToggle: () -> Unit) {
    val c = LocalPanpanColors.current
    Column(Modifier.statusBarsPadding()) {
        Row(
            Modifier.fillMaxWidth().heightIn(min = 60.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            PanpanIconButton(Icons.AutoMirrored.Outlined.ArrowBack, "테마 목록", onBack)
            Text(
                title,
                Modifier.weight(1f),
                style = PanpanType.ui.copy(fontSize = 20.sp),
                fontWeight = FontWeight.Bold,
            )
            PanpanIconButton(
                if (dark) Icons.Outlined.LightMode else Icons.Outlined.DarkMode,
                "밝기 전환",
                onToggle,
            )
        }
        HorizontalDivider(color = c.rule, thickness = PanpanShape.rule)
    }
}

@Composable
fun PanpanNavigationBar(
    labels: List<String>,
    icons: List<ImageVector>,
    selected: Int,
    onSelect: (Int) -> Unit,
) {
    val c = LocalPanpanColors.current
    Column(Modifier.navigationBarsPadding()) {
        HorizontalDivider(color = c.rule, thickness = PanpanShape.rule)
        Row(Modifier.fillMaxWidth()) {
            labels.forEachIndexed { i, label ->
                Column(
                    Modifier.weight(1f)
                        .background(if (i == selected) c.highlight else c.surface)
                        .clickable(role = Role.Tab) { onSelect(i) }
                        .semantics { this.selected = i == selected }
                        .heightIn(min = 68.dp)
                        .padding(vertical = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        icons[i],
                        contentDescription = null,
                        tint = if (i == selected) c.onHighlight else c.fgMuted,
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        label,
                        style = PanpanType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp),
                        color = if (i == selected) c.onHighlight else c.fgMuted,
                        fontWeight = FontWeight.Bold,
                    )
                }
            }
        }
    }
}

@Composable
fun PanpanListItem(
    title: String,
    subtitle: String,
    onClick: (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null,
) {
    val c = LocalPanpanColors.current
    Column(
        Modifier.fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
    ) {
        Row(
            Modifier.padding(16.dp).heightIn(min = 48.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(title, style = PanpanType.ui, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(4.dp))
                Text(subtitle, style = PanpanType.ui.copy(fontSize = 13.sp), color = c.fgMuted)
            }
            if (trailing != null) trailing()
        }
        HorizontalDivider(color = c.rule, thickness = if (true) 2.dp else 1.dp)
    }
}

@Composable
fun PanpanDialog(title: String, text: String, onDismiss: () -> Unit, onConfirm: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = { Text(text) },
        confirmButton = { PanpanButton("확인", onClick = onConfirm) },
        dismissButton = { PanpanButton("취소", kind = ButtonKind.Ghost, onClick = onDismiss) },
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PanpanBottomSheet(onDismiss: () -> Unit, content: @Composable ColumnScope.() -> Unit) {
    ModalBottomSheet(onDismissRequest = onDismiss, shape = RoundedCornerShape(PanpanShape.panel)) {
        Column(
            Modifier.fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .imePadding()
                .padding(16.dp),
            content = content,
        )
    }
}

@Composable
fun PanpanSnackbar(host: SnackbarHostState) {
    SnackbarHost(host) { data ->
        val c = LocalPanpanColors.current
        Snackbar(
            containerColor = c.slabInk,
            contentColor = c.onSlabInk,
            shape = RoundedCornerShape(PanpanShape.panel),
        ) {
            Text(data.visuals.message, style = PanpanType.ui)
        }
    }
}

@Composable
fun PanpanSwitch(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = 56.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(label, Modifier.weight(1f), style = PanpanType.ui)
        Switch(checked, onChange, modifier = Modifier.semantics { contentDescription = label })
    }
}

@Composable
fun PanpanCheckbox(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable(role = Role.Checkbox) {
            onChange(!checked)
        },
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Checkbox(checked, onChange, modifier = Modifier.semantics { contentDescription = label })
        Text(label, style = PanpanType.ui)
    }
}

@Composable
fun PanpanRadio(label: String, selected: Boolean, onClick: () -> Unit) {
    Row(
        Modifier.fillMaxWidth()
            .heightIn(min = 48.dp)
            .clickable(role = Role.RadioButton, onClick = onClick),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        RadioButton(selected, onClick, modifier = Modifier.semantics { contentDescription = label })
        Text(label, style = PanpanType.ui)
    }
}

@Composable
fun PanpanProgress(value: Float, label: String) {
    val c = LocalPanpanColors.current
    Column {
        Text(label, style = PanpanType.ui.copy(fontSize = 13.sp), color = c.fgMuted)
        Spacer(Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { value },
            modifier =
                Modifier.fillMaxWidth().height(if (true) 16.dp else 4.dp).semantics {
                    contentDescription = label
                },
            color = c.accent,
            trackColor = c.disabledFill,
            strokeCap = androidx.compose.ui.graphics.StrokeCap.Butt,
            gapSize = 0.dp,
            drawStopIndicator = {},
        )
    }
}

@Composable
fun PanpanEmptyState(message: String, onReset: () -> Unit) {
    Column(
        Modifier.fillMaxWidth().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(Icons.Outlined.Inbox, null, Modifier.size(48.dp))
        Spacer(Modifier.height(16.dp))
        Text(message)
        Spacer(Modifier.height(16.dp))
        PanpanButton("전체 보기", onClick = onReset)
    }
}

@Composable
fun PanpanSkeleton() {
    val c = LocalPanpanColors.current
    Column(Modifier.semantics { contentDescription = "불러오는 중" }) {
        repeat(3) {
            Box(
                Modifier.fillMaxWidth()
                    .padding(vertical = 12.dp)
                    .height(12.dp)
                    .background(c.disabledFill)
            )
        }
    }
}
