package com.schooltransport.mobile.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.schooltransport.mobile.R
import com.schooltransport.mobile.api.RetrofitClient
import com.schooltransport.mobile.data.SessionManager
import com.schooltransport.mobile.repository.TransportRepository
import com.schooltransport.mobile.viewmodel.LoginViewModel
import com.schooltransport.mobile.viewmodel.ViewModelFactory

class LoginActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        sessionManager = SessionManager(this)
        sessionManager.getRole()?.let { role ->
            if (!sessionManager.getToken().isNullOrBlank()) {
                openRoleScreen(role)
                return
            }
        }

        val repository = TransportRepository(RetrofitClient.create(this))
        viewModel = ViewModelProvider(this, ViewModelFactory(repository))[LoginViewModel::class.java]

        val usernameInput = findViewById<EditText>(R.id.usernameInput)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val loginButton = findViewById<Button>(R.id.loginButton)
        val statusText = findViewById<TextView>(R.id.statusText)

        loginButton.setOnClickListener {
            statusText.text = ""
            loginButton.isEnabled = false
            loginButton.text = "Logging in..."
            viewModel.login(usernameInput.text.toString().trim(), passwordInput.text.toString())
        }

        viewModel.loginResult.observe(this) { result ->
            loginButton.isEnabled = true
            loginButton.text = "Login"
            result
                .onSuccess { response ->
                    sessionManager.saveSession(response)
                    openRoleScreen(response.user.role)
                }
                .onFailure { error ->
                    statusText.text = error.message ?: "Login failed. Check the backend and credentials."
                }
        }
    }

    private fun openRoleScreen(role: String) {
        val target = when (role) {
            "parent" -> ParentActivity::class.java
            "driver" -> DriverActivity::class.java
            else -> null
        }

        if (target == null) {
            findViewById<TextView>(R.id.statusText).text = "Mobile app supports parent and driver roles"
            return
        }

        startActivity(Intent(this, target))
        finish()
    }
}
