package com.schooltransport.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.schooltransport.mobile.data.LoginResponse
import com.schooltransport.mobile.repository.TransportRepository
import kotlinx.coroutines.launch

class LoginViewModel(private val repository: TransportRepository) : ViewModel() {
    private val _loginResult = MutableLiveData<Result<LoginResponse>>()
    val loginResult: LiveData<Result<LoginResponse>> = _loginResult

    fun login(username: String, password: String) {
        viewModelScope.launch {
            try {
                _loginResult.value = Result.success(repository.login(username, password))
            } catch (error: Exception) {
                _loginResult.value = Result.failure(error)
            }
        }
    }
}
