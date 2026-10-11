package com.jinsup.ds.t04_glass.components

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
import com.jinsup.ds.t04_glass.theme.*

enum class ButtonKind {
  Primary,
  Secondary,
  Ghost,
  Destructive,
}

@Composable
fun YunseulButton(
    label: String,
    modifier: Modifier = Modifier,
    kind: ButtonKind = ButtonKind.Primary,
    enabled: Boolean = true,
    loading: Boolean = false,
    onClick: () -> Unit,
) {
  val c = LocalYunseulColors.current
  val source = remember { MutableInteractionSource() }
  val pressed by source.collectIsPressedAsState()
  val focused by source.collectIsFocusedAsState()
  val shift by animateDpAsState(0.dp, tween(YunseulMotion.press), label = "누름")
  val fill =
      if (!enabled) c.surfaceSunken
      else
          when (kind) {
            ButtonKind.Primary -> c.ink
            ButtonKind.Destructive -> c.danger
            else -> c.surface
          }
  val fg =
      if (!enabled) c.text2
      else
          when (kind) {
            ButtonKind.Primary -> c.onInk
            ButtonKind.Destructive -> c.onDanger
            else -> c.text
          }
  Box(
      modifier.padding(end = 0.dp, bottom = 0.dp).offset(shift, shift).drawBehind {
        if (false && !pressed && kind != ButtonKind.Ghost)
            drawRect(
                c.line,
                topLeft = androidx.compose.ui.geometry.Offset(0.dp.toPx(), 0.dp.toPx()),
            )
      }) {
        Surface(
            color = fill,
            shape = RoundedCornerShape(YunseulShape.control),
            border =
                BorderStroke(
                    YunseulShape.rule,
                    if (focused) c.primary else if (kind == ButtonKind.Ghost) fill else c.line,
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
            Text(label, color = fg, style = YunseulType.ui, fontWeight = FontWeight.Bold)
          }
        }
      }
}

@Composable
fun YunseulIconButton(icon: ImageVector, label: String, onClick: () -> Unit) {
  IconButton(onClick = onClick, modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)) {
    Icon(icon, contentDescription = label)
  }
}

@Composable
fun YunseulTextField(
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
      textStyle = YunseulType.ui,
      shape = RoundedCornerShape(YunseulShape.control),
      modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
  )
}

@Composable
fun YunseulCard(content: @Composable ColumnScope.() -> Unit) {
  val c = LocalYunseulColors.current
  Column(
      Modifier.fillMaxWidth()
          .border(YunseulShape.rule, c.line, RoundedCornerShape(YunseulShape.panel))
          .padding(16.dp),
      content = content,
  )
}

@Composable
fun YunseulBadge(label: String, alert: Boolean = false) {
  val c = LocalYunseulColors.current
  Box(
      Modifier.background(
              if (alert) c.warningTint else c.primaryTint,
              RoundedCornerShape(YunseulShape.badge),
          )
          .padding(horizontal = 8.dp, vertical = 4.dp)) {
        Text(
            label,
            color = if (alert) c.warning else c.primary,
            style = YunseulType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp),
            fontWeight = FontWeight.Bold,
        )
      }
}

@Composable
fun YunseulTabs(labels: List<String>, selected: Int, onSelect: (Int) -> Unit) {
  val c = LocalYunseulColors.current
  Row(
      Modifier.fillMaxWidth().padding(top = 0.dp),
      verticalAlignment = Alignment.Bottom,
  ) {
    labels.forEachIndexed { i, label ->
      Column(
          Modifier.weight(1f)
              .padding(end = 0.dp)
              .background(if (i == selected) c.primaryTint else c.surface)
              .then(if (false) Modifier.border(3.dp, c.line) else Modifier)
              .clickable(role = Role.Tab) { onSelect(i) }
              .semantics { this.selected = i == selected }) {
            Box(
                Modifier.fillMaxWidth().heightIn(min = 48.dp).padding(8.dp),
                contentAlignment = Alignment.Center,
            ) {
              Text(
                  label,
                  style = YunseulType.ui.copy(fontSize = 14.sp),
                  color = if (i == selected) c.primary else c.text,
                  fontWeight = if (i == selected) FontWeight.Bold else FontWeight.Normal,
              )
            }
            if (true)
                HorizontalDivider(
                    thickness = if (i == selected) 2.dp else 1.dp,
                    color = if (i == selected) c.text else c.line,
                )
          }
    }
  }
}

@Composable
fun YunseulTopAppBar(title: String, dark: Boolean, onBack: () -> Unit, onToggle: () -> Unit) {
  val c = LocalYunseulColors.current
  Column(Modifier.statusBarsPadding()) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = 60.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
      YunseulIconButton(Icons.AutoMirrored.Outlined.ArrowBack, "테마 목록", onBack)
      Text(
          title,
          Modifier.weight(1f),
          style = YunseulType.ui.copy(fontSize = 20.sp),
          fontWeight = FontWeight.Bold,
      )
      YunseulIconButton(
          if (dark) Icons.Outlined.LightMode else Icons.Outlined.DarkMode,
          "밝기 전환",
          onToggle,
      )
    }
    HorizontalDivider(color = c.line, thickness = YunseulShape.rule)
  }
}

@Composable
fun YunseulNavigationBar(
    labels: List<String>,
    icons: List<ImageVector>,
    selected: Int,
    onSelect: (Int) -> Unit,
) {
  val c = LocalYunseulColors.current
  Column(Modifier.navigationBarsPadding()) {
    HorizontalDivider(color = c.line, thickness = YunseulShape.rule)
    Row(Modifier.fillMaxWidth()) {
      labels.forEachIndexed { i, label ->
        Column(
            Modifier.weight(1f)
                .background(if (i == selected) c.primaryTint else c.surface)
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
              tint = if (i == selected) c.primary else c.text2,
          )
          Spacer(Modifier.height(4.dp))
          Text(
              label,
              style = YunseulType.ui.copy(fontSize = 12.sp, lineHeight = 18.sp),
              color = if (i == selected) c.primary else c.text2,
              fontWeight = FontWeight.Bold,
          )
        }
      }
    }
  }
}

@Composable
fun YunseulListItem(
    title: String,
    subtitle: String,
    onClick: (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null,
) {
  val c = LocalYunseulColors.current
  Column(
      Modifier.fillMaxWidth()
          .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)) {
        Row(
            Modifier.padding(16.dp).heightIn(min = 48.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
          Column(Modifier.weight(1f)) {
            Text(title, style = YunseulType.ui, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Text(subtitle, style = YunseulType.ui.copy(fontSize = 13.sp), color = c.text2)
          }
          if (trailing != null) trailing()
        }
        HorizontalDivider(color = c.line, thickness = 1.dp)
      }
}

@Composable
fun YunseulDialog(title: String, text: String, onDismiss: () -> Unit, onConfirm: () -> Unit) {
  AlertDialog(
      onDismissRequest = onDismiss,
      title = { Text(title) },
      text = { Text(text) },
      confirmButton = { YunseulButton("확인", onClick = onConfirm) },
      dismissButton = { YunseulButton("취소", kind = ButtonKind.Ghost, onClick = onDismiss) },
  )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun YunseulBottomSheet(onDismiss: () -> Unit, content: @Composable ColumnScope.() -> Unit) {
  ModalBottomSheet(onDismissRequest = onDismiss, shape = RoundedCornerShape(YunseulShape.panel)) {
    Column(
        Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).imePadding().padding(16.dp),
        content = content,
    )
  }
}

@Composable
fun YunseulSnackbar(host: SnackbarHostState) {
  SnackbarHost(host) { data ->
    val c = LocalYunseulColors.current
    Snackbar(
        containerColor = c.surfaceInk,
        contentColor = c.onSurfaceInk,
        shape = RoundedCornerShape(YunseulShape.panel),
    ) {
      Text(data.visuals.message, style = YunseulType.ui)
    }
  }
}

@Composable
fun YunseulSwitch(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
  Row(
      Modifier.fillMaxWidth().heightIn(min = 56.dp),
      verticalAlignment = Alignment.CenterVertically,
  ) {
    Text(label, Modifier.weight(1f), style = YunseulType.ui)
    Switch(checked, onChange, modifier = Modifier.semantics { contentDescription = label })
  }
}

@Composable
fun YunseulCheckbox(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
  Row(
      Modifier.fillMaxWidth().heightIn(min = 48.dp).clickable(role = Role.Checkbox) {
        onChange(!checked)
      },
      verticalAlignment = Alignment.CenterVertically,
  ) {
    Checkbox(checked, onChange, modifier = Modifier.semantics { contentDescription = label })
    Text(label, style = YunseulType.ui)
  }
}

@Composable
fun YunseulRadio(label: String, selected: Boolean, onClick: () -> Unit) {
  Row(
      Modifier.fillMaxWidth()
          .heightIn(min = 48.dp)
          .clickable(role = Role.RadioButton, onClick = onClick),
      verticalAlignment = Alignment.CenterVertically,
  ) {
    RadioButton(selected, onClick, modifier = Modifier.semantics { contentDescription = label })
    Text(label, style = YunseulType.ui)
  }
}

@Composable
fun YunseulProgress(value: Float, label: String) {
  val c = LocalYunseulColors.current
  Column {
    Text(label, style = YunseulType.ui.copy(fontSize = 13.sp), color = c.text2)
    Spacer(Modifier.height(8.dp))
    LinearProgressIndicator(
        progress = { value },
        modifier = Modifier.fillMaxWidth().height(4.dp).semantics { contentDescription = label },
        color = c.primary,
        trackColor = c.surfaceSunken,
        strokeCap = androidx.compose.ui.graphics.StrokeCap.Butt,
        gapSize = 0.dp,
        drawStopIndicator = {},
    )
  }
}

@Composable
fun YunseulEmptyState(message: String, onReset: () -> Unit) {
  Column(
      Modifier.fillMaxWidth().padding(24.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
  ) {
    Icon(Icons.Outlined.Inbox, null, Modifier.size(48.dp))
    Spacer(Modifier.height(16.dp))
    Text(message)
    Spacer(Modifier.height(16.dp))
    YunseulButton("전체 보기", onClick = onReset)
  }
}

@Composable
fun YunseulSkeleton() {
  val c = LocalYunseulColors.current
  Column(Modifier.semantics { contentDescription = "불러오는 중" }) {
    repeat(3) {
      Box(
          Modifier.fillMaxWidth()
              .padding(vertical = 12.dp)
              .height(12.dp)
              .background(c.surfaceSunken))
    }
  }
}
