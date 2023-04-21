package com.example.mealprepapp

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

class MainActivity : AppCompatActivity() {

    // All JS ran, will be handled by verified by the app, so there shouldn't be any security concerns.
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)
        
        val webView: WebView = findViewById(R.id.webview)

        webView.settings.javaScriptEnabled = true

        val assetLoader = WebViewAssetLoader.Builder()
                        .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
                        .addPathHandler("/res/", WebViewAssetLoader.ResourcesPathHandler(this))
                        .build()

        webView.webViewClient = LocalContentWebViewClient(assetLoader)

        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
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