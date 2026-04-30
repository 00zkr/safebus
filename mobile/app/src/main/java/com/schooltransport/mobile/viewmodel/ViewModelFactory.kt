package com.schooltransport.mobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.schooltransport.mobile.repository.TransportRepository

class ViewModelFactory(private val repository: TransportRepository) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(LoginViewModel::class.java) -> LoginViewModel(repository) as T
            modelClass.isAssignableFrom(ParentViewModel::class.java) -> ParentViewModel(repository) as T
            modelClass.isAssignableFrom(DriverViewModel::class.java) -> DriverViewModel(repository) as T
            else -> throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
