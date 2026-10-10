plugins { id("com.android.application"); id("org.jetbrains.kotlin.android"); id("org.jetbrains.kotlin.plugin.compose") }
android {
 namespace = "com.jinsup.ds"
 compileSdk = 36
 defaultConfig { applicationId = "com.jinsup.ds.v2"; minSdk = 26; targetSdk = 36; versionCode = 1; versionName = "1.0" }
 compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
 kotlinOptions { jvmTarget = "17" }
 buildFeatures { compose = true; buildConfig = true }
 sourceSets["main"].res.srcDirs("src/main/res", "src/main/java/com/jinsup/ds/t01_neobrutalism/res", "src/main/java/com/jinsup/ds/t30_corporate_clean_saas/res")
}
dependencies {
 implementation(platform("androidx.compose:compose-bom:2024.10.00"))
 implementation("androidx.activity:activity-compose:1.9.3")
 implementation("androidx.compose.ui:ui")
 implementation("androidx.compose.ui:ui-tooling-preview")
 implementation("androidx.compose.material3:material3")
 implementation("androidx.compose.material:material-icons-extended")
 debugImplementation("androidx.compose.ui:ui-tooling")
}
