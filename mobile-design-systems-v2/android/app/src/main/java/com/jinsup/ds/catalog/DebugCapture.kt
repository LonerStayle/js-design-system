package com.jinsup.ds.catalog

import android.app.Activity
import android.graphics.Bitmap
import android.os.Handler
import android.os.Looper
import android.view.PixelCopy
import com.jinsup.ds.BuildConfig
import java.io.File

private var captureSequence = 0

/** 검증 전용: 다른 앱과 시스템 오버레이가 아닌 이 앱의 실제 Window 표면을 복사한다. */
fun Activity.captureDebugWindow() {
    if (!BuildConfig.DEBUG || !intent.getBooleanExtra("capture", false)) return
    val output = File(filesDir, "capture.png")
    val ready = File(filesDir, "capture.id")
    val requestId = intent.getStringExtra("capture_id").orEmpty()
    val sequence = ++captureSequence
    val error = File(filesDir, "capture.error")
    output.delete()
    ready.delete()
    error.delete()
    val handler = Handler(Looper.getMainLooper())
    window.decorView.postDelayed(
        {
            val view = window.decorView
            if (sequence != captureSequence || isFinishing || view.width == 0 || view.height == 0) return@postDelayed
            val bitmap = Bitmap.createBitmap(view.width, view.height, Bitmap.Config.ARGB_8888)
            PixelCopy.request(
                window,
                bitmap,
                { result ->
                    if (sequence != captureSequence) {
                        bitmap.recycle()
                        return@request
                    }
                    if (result == PixelCopy.SUCCESS) {
                        val temporary = File(filesDir, "capture.tmp")
                        temporary.outputStream().use {
                            bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
                        }
                        temporary.renameTo(output)
                        ready.writeText(requestId)
                    } else {
                        error.writeText("PixelCopy 오류: $result")
                    }
                    bitmap.recycle()
                },
                handler,
            )
        },
        1800,
    )
}
