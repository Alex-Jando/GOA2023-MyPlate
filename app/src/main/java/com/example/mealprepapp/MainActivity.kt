package com.example.mealprepapp

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
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

        val htmlStream = resources.openRawResource(R.raw.index)

        val htmlData = htmlStream.readBytes().toString(Charsets.UTF_8)

        webView.loadData(htmlData,
                         "text/html",
                         "utf-8")
    }
}