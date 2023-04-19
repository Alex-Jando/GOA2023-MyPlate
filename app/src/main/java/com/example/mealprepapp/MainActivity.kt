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

        webView.webViewClient = CustomWebViewClient()

        webView.settings.javaScriptEnabled = true

        loadFileData("index.html")
    }
    private fun getAssetData(fileName: String): String {
        val fileStream = application.assets.open(fileName).bufferedReader()
        val fileData = fileStream.use {
            it.readText()
        }
        return fileData
    }
    private fun loadFileData(fileName: String) {
        val webView: WebView = findViewById(R.id.webview)
        val data = getAssetData(fileName)
        webView.loadData(data,
                         "text/html",
                         "utf-8")
    }
}

private class CustomWebViewClient : WebViewClient() {
    override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
        return if url.startsWith("App://") {
            loadFileData(url)
            false // Allow the WebView to load the URL instead of opening it in a browser
        } else {
            true
        }
    }
    
}