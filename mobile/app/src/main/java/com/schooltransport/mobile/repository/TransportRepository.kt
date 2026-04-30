package com.schooltransport.mobile.repository

import com.schooltransport.mobile.api.ApiService
import com.schooltransport.mobile.data.LocationRequest
import com.schooltransport.mobile.data.LoginRequest
import com.schooltransport.mobile.data.NearStopRequest
import com.schooltransport.mobile.data.StatusRequest

class TransportRepository(private val api: ApiService) {
    suspend fun login(username: String, password: String) = api.login(LoginRequest(username, password))

    suspend fun getStudents() = api.getStudents()

    suspend fun getBuses() = api.getBuses()

    suspend fun getRoutes() = api.getRoutes()

    suspend fun getNotifications(studentId: Int? = null, busId: Int? = null, type: String? = null, date: String? = null) =
        api.getNotifications(studentId, busId, type, date)

    suspend fun startRoute() = api.startRoute()

    suspend fun updateStatus(status: String) = api.updateStatus(StatusRequest(status))

    suspend fun nearStop(stopName: String) = api.nearStop(NearStopRequest(stopName))

    suspend fun updateLocation(lat: Double, lng: Double) = api.updateLocation(LocationRequest(lat, lng))
}
