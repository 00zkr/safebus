package com.schooltransport.mobile.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.schooltransport.mobile.data.Bus
import com.schooltransport.mobile.data.ParentNotification
import com.schooltransport.mobile.data.RouteItem
import com.schooltransport.mobile.data.Student
import com.schooltransport.mobile.repository.TransportRepository
import kotlinx.coroutines.launch

data class ParentHomeState(
    val student: Student?,
    val bus: Bus?,
    val route: RouteItem?
)

class ParentViewModel(private val repository: TransportRepository) : ViewModel() {
    private val _homeState = MutableLiveData<Result<ParentHomeState>>()
    val homeState: LiveData<Result<ParentHomeState>> = _homeState

    private val _notifications = MutableLiveData<Result<List<ParentNotification>>>()
    val notifications: LiveData<Result<List<ParentNotification>>> = _notifications

    fun loadHome() {
        viewModelScope.launch {
            try {
                val students = repository.getStudents()
                val buses = repository.getBuses()
                val routes = repository.getRoutes()
                val student = students.firstOrNull()
                val bus = buses.firstOrNull { it.id == student?.bus_id }
                val route = routes.firstOrNull { it.id == student?.route_id }
                _homeState.value = Result.success(ParentHomeState(student, bus, route))
            } catch (error: Exception) {
                _homeState.value = Result.failure(error)
            }
        }
    }

    fun loadNotifications(studentId: Int? = null, type: String? = null, date: String? = null) {
        viewModelScope.launch {
            try {
                _notifications.value = Result.success(repository.getNotifications(studentId = studentId, type = type, date = date))
            } catch (error: Exception) {
                _notifications.value = Result.failure(error)
            }
        }
    }
}
