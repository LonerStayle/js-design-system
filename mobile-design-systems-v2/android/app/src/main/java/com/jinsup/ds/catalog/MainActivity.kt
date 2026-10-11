package com.jinsup.ds.catalog

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import com.jinsup.ds.t01_neobrutalism.screens.PanpanApp
import com.jinsup.ds.t02_swiss.screens.OseonApp
import com.jinsup.ds.t03_editorial.screens.HaengganApp
import com.jinsup.ds.t04_glass.screens.YunseulApp
import com.jinsup.ds.t15_hygge.screens.ModakApp
import com.jinsup.ds.t30_corporate_clean_saas.screens.LedgerApp

class MainActivity : ComponentActivity() {
  private var captureRevision by mutableIntStateOf(0)

  override fun onCreate(savedInstanceState: Bundle?) {
    val capturing = com.jinsup.ds.BuildConfig.DEBUG && intent.getBooleanExtra("capture", false)
    super.onCreate(if (capturing) null else savedInstanceState)
    setContent {
      key(captureRevision) {
        Catalog(
            intent.getIntExtra("theme", 0),
            intent.getIntExtra("screen", 0),
            intent.getBooleanExtra("dark", false),
        )
      }
    }
    captureDebugWindow()
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    if (com.jinsup.ds.BuildConfig.DEBUG && intent.getBooleanExtra("capture", false)) {
      setIntent(intent)
      captureRevision++
      captureDebugWindow()
    }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Catalog(initialTheme: Int = 0, initialScreen: Int = 0, initialDark: Boolean = false) {
  var theme by rememberSaveable { mutableIntStateOf(initialTheme) }
  var dark by rememberSaveable { mutableStateOf(initialDark) }
  val view = LocalView.current
  SideEffect {
    val window = (view.context as Activity).window
    WindowCompat.getInsetsController(window, view).apply {
      isAppearanceLightStatusBars = !dark
      isAppearanceLightNavigationBars = !dark
    }
  }

  BackHandler(theme != 0) { theme = 0 }
  when (theme) {
    1 -> PanpanApp(dark, initialScreen, { theme = 0 }, { dark = !dark })
    2 -> OseonApp(dark, initialScreen, { theme = 0 }, { dark = !dark })
    3 -> HaengganApp(dark, initialScreen, { theme = 0 }, { dark = !dark })
    4 -> YunseulApp(dark, initialScreen, { theme = 0 }, { dark = !dark })
    15 -> ModakApp(dark, initialScreen, { theme = 0 }, { dark = !dark })
    30 -> LedgerApp(dark, initialScreen, { theme = 0 }, { dark = !dark })
    else ->
        MaterialTheme(colorScheme = if (dark) darkColorScheme() else lightColorScheme()) {
          Scaffold(
              topBar = {
                TopAppBar(
                    title = { Text("모바일 테마") },
                    actions = {
                      IconButton(onClick = { dark = !dark }) {
                        Icon(Icons.Outlined.Contrast, "밝기 전환")
                      }
                    },
                )
              }) { padding ->
                Column(
                    Modifier.padding(padding)
                        .verticalScroll(rememberScrollState())
                        .padding(24.dp)) {
                      Text("완성 테마 6종", style = MaterialTheme.typography.headlineLarge)
                      Spacer(Modifier.height(24.dp))
                      listOf(
                              Triple(1, "판판레코드", "네오 브루탈리즘"),
                              Triple(2, "오선음악당", "스위스 인터내셔널"),
                              Triple(3, "행간", "에디토리얼 매거진"),
                              Triple(4, "윤슬홈", "글래스모피즘"),
                              Triple(15, "모닥", "스칸디나비안 휘게"),
                              Triple(30, "레저라인", "경비 정산"))
                          .forEach { row ->
                            ListItem(
                                headlineContent = { Text("%02d %s".format(row.first, row.second)) },
                                supportingContent = { Text(row.third) },
                                modifier = Modifier.clickable { theme = row.first },
                                trailingContent = { Icon(Icons.Outlined.ChevronRight, null) })
                            HorizontalDivider()
                          }
                    }
              }
        }
  }
}
