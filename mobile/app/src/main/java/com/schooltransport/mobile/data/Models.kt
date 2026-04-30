package com.schooltransport.mobile.data

data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class User(
    val username: String,
    val role: String,
    val bus_id: Int?,
    val student_id: Int?
)

data class Student(
    val id: Int,
    val full_name: String,
    val parent_phone: String,
    val bus_id: Int,
    val route_id: Int
)

data class Bus(
    val id: Int,
    val name: String,
    val driver_name: String,
    val status: String,
    val current_lat: String?,
    val current_lng: String?
)

data class RouteItem(
    val id: Int,
    val name: String,
    val stops: Any?,
    val start_time: String,
    val end_time: String,
    val bus_id: Int
)

data class ParentNotification(
    val id: Int,
    val student_id: Int,
    val type: String,
    val message: String,
    val created_at: String,
    val student_name: String?,
    val bus_id: Int?
)

data class DriverActionResponse(
    val bus: Bus,
    val route: RouteItem?,
    val notifications_created: Int?
)

data class StatusRequest(val status: String)

data class NearStopRequest(val stop_name: String)

data class LocationRequest(
    val lat: Double,
    val lng: Double
)
