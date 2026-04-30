package com.schooltransport.mobile.api

import com.schooltransport.mobile.data.Bus
import com.schooltransport.mobile.data.DriverActionResponse
import com.schooltransport.mobile.data.LocationRequest
import com.schooltransport.mobile.data.LoginRequest
import com.schooltransport.mobile.data.LoginResponse
import com.schooltransport.mobile.data.NearStopRequest
import com.schooltransport.mobile.data.ParentNotification
import com.schooltransport.mobile.data.RouteItem
import com.schooltransport.mobile.data.StatusRequest
import com.schooltransport.mobile.data.Student
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("students")
    suspend fun getStudents(): List<Student>

    @GET("buses")
    suspend fun getBuses(): List<Bus>

    @GET("routes")
    suspend fun getRoutes(): List<RouteItem>

    @GET("notifications")
    suspend fun getNotifications(
        @Query("student_id") studentId: Int? = null,
        @Query("bus_id") busId: Int? = null,
        @Query("type") type: String? = null,
        @Query("date") date: String? = null
    ): List<ParentNotification>

    @POST("driver/start-route")
    suspend fun startRoute(): DriverActionResponse

    @POST("driver/update-status")
    suspend fun updateStatus(@Body request: StatusRequest): DriverActionResponse

    @POST("driver/near-stop")
    suspend fun nearStop(@Body request: NearStopRequest): DriverActionResponse

    @POST("driver/update-location")
    suspend fun updateLocation(@Body request: LocationRequest): DriverActionResponse
}
