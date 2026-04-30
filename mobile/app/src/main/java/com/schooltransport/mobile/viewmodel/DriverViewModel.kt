package com.schooltransport.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.schooltransport.mobile.data.DriverActionResponse
import com.schooltransport.mobile.data.ParentNotification
import com.schooltransport.mobile.repository.TransportRepository
import kotlinx.coroutines.launch

class DriverViewModel(private val repository: TransportRepository) : ViewModel() {
    private val _actionResult = MutableLiveData<Result<DriverActionResponse>>()
    val actionResult: LiveData<Result<DriverActionResponse>> = _actionResult

    private val _notifications = MutableLiveData<Result<List<ParentNotification>>>()
    val notifications: LiveData<Result<List<ParentNotification>>> = _notifications

    fun startRoute() {
        runAction { repository.startRoute() }
    }

    fun updateStatus(status: String) {
        runAction { repository.updateStatus(status) }
    }

    fun nearStop(stopName: String) {
        runAction { repository.nearStop(stopName) }
    }

    fun updateLocation(lat: Double, lng: Double) {
        runAction { repository.updateLocation(lat, lng) }
    }

    fun loadBusNotifications(busId: Int?) {
        viewModelScope.launch {
            try {
                _notifications.value = Result.success(repository.getNotifications(busId = busId))
            } catch (error: Exception) {
                _notifications.value = Result.failure(error)
            }
        }
    }

    private fun runAction(block: suspend () -> DriverActionResponse) {
        viewModelScope.launch {
            try {
                _actionResult.value = Result.success(block())
            } catch (error: Exception) {
                _actionResult.value = Result.failure(error)
            }
        }
    }
}
