package com.example.mealprepapp

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupWebView()
    }
    // Local code will be ran, so there is no chance for an XXS attack, and javascript doesn't pose a threat
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val webView: WebView = findViewById(R.id.webview)

        webView.webViewClient = WebViewClient()

        webView.settings.javaScriptEnabled = true

        val webViewData = "<html><body><h1 style=\"text-align: center;\">Hello Alex!</h1></body</html>"

        val encodedWebViewData = Base64.encodeToString(webViewData.toByteArray(), Base64.NO_PADDING)

        webView.loadData(encodedWebViewData,
                         "text/html",
                         "base64")
    }
}