package com.schooltransport.mobile.ui

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import android.Manifest
import android.content.pm.PackageManager
import com.schooltransport.mobile.R
import com.schooltransport.mobile.data.ParentNotification

class AppNotificationHelper(private val context: Context) {
    companion object {
        private const val CHANNEL_ID = "transport_parent_alerts"
    }

    init {
        createChannel()
    }

    fun showParentNotification(notification: ParentNotification) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        val intent = Intent(context, ParentActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            notification.id,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val systemNotification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(titleFor(notification.type))
            .setContentText(notification.message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(notification.message))
            .setPriority(priorityFor(notification.type))
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        NotificationManagerCompat.from(context).notify(notification.id, systemNotification)
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val channel = NotificationChannel(
            CHANNEL_ID,
            "Parent transport alerts",
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "School bus departure, arrival, delay, and near-stop alerts"
        }

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(channel)
    }

    private fun titleFor(type: String): String {
        return when (type) {
            "departure" -> "Bus started"
            "arrival" -> "Bus arrived"
            "delay" -> "Bus delayed"
            "near_stop" -> "Bus near stop"
            else -> "Transport update"
        }
    }

    private fun priorityFor(type: String): Int {
        return if (type == "delay" || type == "near_stop") {
            NotificationCompat.PRIORITY_HIGH
        } else {
            NotificationCompat.PRIORITY_DEFAULT
        }
    }
}
