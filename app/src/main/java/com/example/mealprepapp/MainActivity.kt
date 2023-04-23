package com.example.mealprepapp

import android.annotation.SuppressLint
import android.app.Application
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
import java.io.InputStreamReader

class MainActivity : AppCompatActivity() {

    // All Javascript ran, will be handled by verified by the app, so there shouldn't be any security concerns.
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)
        
        val webView: WebView = findViewById(R.id.webview)

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
    fun saveMealPlans(mealPlans: String): String {
        return mealPlans
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