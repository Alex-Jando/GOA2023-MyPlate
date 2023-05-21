package com.example.mealprepapp

import android.Manifest
import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.icu.text.SimpleDateFormat
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.util.Date
import java.util.Locale

class MainActivity : AppCompatActivity() {

    // All Javascript ran, will be handled by verified by the app, so there shouldn't be any security concerns.
    @RequiresApi(Build.VERSION_CODES.N)
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val mChannel =
                NotificationChannel("MyPlateNotificationChannelCalendar", "MyPlateNotificationChannelCalendar", NotificationManager.IMPORTANCE_DEFAULT)
            mChannel.description = "My Plate's Notification Channel For The Calendar"
            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(mChannel)
        }

        val builder = NotificationCompat.Builder(this, "MyPlateNotificationChannelCalendar")
            .setSmallIcon(R.drawable.logo)
            .setContentTitle("title")
            .setContentText("content")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)

        with(NotificationManagerCompat.from(this)) {
            if (ActivityCompat.checkSelfPermission(
                    applicationContext,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                notify(SimpleDateFormat("ddHHmmss", Locale.CANADA).format(Date()).toInt(), builder.build())
            }
        }

        val path = applicationContext.filesDir

        val mealPlansFile = File(path, "meal_plans.json")
        if (!mealPlansFile.exists()) {
            mealPlansFile.createNewFile()
            val writer = FileOutputStream(mealPlansFile)
            writer.write("{}".toByteArray())
        }

        val settingsFile = File(path, "settings.json")
        if (!settingsFile.exists()) {
            settingsFile.createNewFile()
            val writer = FileOutputStream(settingsFile)
            writer.write("{}".toByteArray())
        }

        val webView: WebView = findViewById(R.id.WebView)

        webView.settings.javaScriptEnabled = true

        webView.addJavascriptInterface(WebAppInterface(this, this.requestPermissionLauncher), "app")

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
            .build()

        webView.webViewClient = LocalContentWebViewClient(assetLoader)

        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    @RequiresApi(Build.VERSION_CODES.N)
    fun sendNotification(title: String, content: String) {

    }
    private val requestPermissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) {}

}
class WebAppInterface(private val mContext: Context, private val mRequestPermissionLauncher: ActivityResultLauncher<String>) {
    @JavascriptInterface
    fun showToast(toast: String) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show()
    }
    @JavascriptInterface
    fun getAsset(fileName: String): String {
        return mContext.assets.open(fileName).bufferedReader().use { it.readText() }
    }
    @JavascriptInterface
    fun getLocalFile(fileName: String): String {
        val path = mContext.filesDir
        val reader = FileInputStream(File(path, fileName))
        return reader.bufferedReader().use { it.readText() }
    }
    @JavascriptInterface
    fun saveLocalFile(fileData: String, fileName: String) {
        val path = mContext.filesDir
        val writer = FileOutputStream(File(path, fileName))
        writer.write(fileData.toByteArray())
    }
    @JavascriptInterface
    fun postNotification() {

    }
    @RequiresApi(Build.VERSION_CODES.TIRAMISU)
    @JavascriptInterface
    fun requestNotificationPermission() {
        when (PackageManager.PERMISSION_GRANTED) {
            ContextCompat.checkSelfPermission(
                mContext,
                Manifest.permission.POST_NOTIFICATIONS
            ) -> {
            }
            else -> {
                mRequestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }
    @JavascriptInterface
    fun hasNotificationPermission(): Boolean {
        return when (PackageManager.PERMISSION_GRANTED) {
            ContextCompat.checkSelfPermission(
                mContext,
                Manifest.permission.POST_NOTIFICATIONS
            ) -> {
                true
            }
            else -> {
                false
            }
        }
    }
}

private class LocalContentWebViewClient(private val assetLoader: WebViewAssetLoader) : WebViewClientCompat() {
    override fun shouldInterceptRequest(
        view: WebView,
        request: WebResourceRequest
    ): WebResourceResponse? {
        return if (request.url.toString().startsWith("https://appassets.androidplatform.net")) {
            assetLoader.shouldInterceptRequest(request.url)
        } else {
            super.shouldInterceptRequest(view, request)
        }
    }
}