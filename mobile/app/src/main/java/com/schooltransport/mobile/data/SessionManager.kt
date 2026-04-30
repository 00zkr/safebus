package com.schooltransport.mobile.data

import android.content.Context

class SessionManager(context: Context) {
    private val prefs = context.getSharedPreferences("school_transport_session", Context.MODE_PRIVATE)

    fun saveSession(response: LoginResponse) {
        prefs.edit()
            .putString("token", response.token)
            .putString("username", response.user.username)
            .putString("role", response.user.role)
            .putInt("bus_id", response.user.bus_id ?: -1)
            .putInt("student_id", response.user.student_id ?: -1)
            .apply()
    }

    fun getToken(): String? = prefs.getString("token", null)

    fun getRole(): String? = prefs.getString("role", null)

    fun getStudentId(): Int? = prefs.getInt("student_id", -1).takeIf { it > 0 }

    fun getBusId(): Int? = prefs.getInt("bus_id", -1).takeIf { it > 0 }

    fun clear() {
        prefs.edit().clear().apply()
    }
}
