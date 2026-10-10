package com.jinsup.ds.catalog

import android.app.Activity
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import com.jinsup.ds.t30_corporate_clean_saas.screens.LedgerApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Catalog(
                intent.getIntExtra("theme", 0),
                intent.getIntExtra("screen", 0),
                intent.getBooleanExtra("dark", false),
            )
        }
        captureDebugWindow()
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
                    }
                ) { padding ->
                    Column(Modifier.padding(padding).padding(24.dp)) {
                        Text("파일럿 2종", style = MaterialTheme.typography.headlineLarge)
                        Spacer(Modifier.height(24.dp))
                        ListItem(
                            headlineContent = { Text("01 판판레코드") },
                            supportingContent = { Text("네오 브루탈리즘 · 운영, 음반, 문의, 매장") },
                            modifier = Modifier.clickable { theme = 1 },
                            trailingContent = { Icon(Icons.Outlined.ChevronRight, null) },
                        )
                        HorizontalDivider()
                        ListItem(
                            headlineContent = { Text("30 레저라인") },
                            supportingContent = { Text("경비 정산 · 마감, 결재, 규칙") },
                            modifier = Modifier.clickable { theme = 30 },
                            trailingContent = { Icon(Icons.Outlined.ChevronRight, null) },
                        )
                        Spacer(Modifier.height(24.dp))
                        Text("다른 테마는 파일럿 검토 후 추가됩니다.")
                    }
                }
            }
    }
}
