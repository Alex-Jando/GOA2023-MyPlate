package com.example.mealprepapp

import android.annotation.SuppressLint
import android.content.Context
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.widget.Toast
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import java.io.BufferedReader
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {

    // All Javascript ran, will be handled by verified by the app, so there shouldn't be any security concerns.
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

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

        webView.addJavascriptInterface(WebAppInterface(this), "app")

        val assetLoader = WebViewAssetLoader.Builder()
                        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
                        .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
                        .build()

        webView.webViewClient = LocalContentWebViewClient(assetLoader)

        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }
}

class WebAppInterface(private val mContext: Context) {
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