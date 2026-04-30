package com.schooltransport.mobile.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.schooltransport.mobile.R
import com.schooltransport.mobile.data.ParentNotification

class NotificationAdapter : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    private val items = mutableListOf<NotificationListItem>()

    fun submitList(notifications: List<ParentNotification>) {
        items.clear()
        val grouped = notifications.groupBy { notification ->
            notification.created_at.take(10).ifBlank { "Unknown date" }
        }

        grouped.forEach { (date, rows) ->
            items.add(NotificationListItem.Header(if (date == today()) "Today" else date))
            rows.forEach { notification -> items.add(NotificationListItem.Row(notification)) }
        }
        notifyDataSetChanged()
    }

    override fun getItemViewType(position: Int): Int {
        return when (items[position]) {
            is NotificationListItem.Header -> 0
            is NotificationListItem.Row -> 1
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == 0) {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.item_notification_header, parent, false)
            HeaderViewHolder(view)
        } else {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.item_notification, parent, false)
            NotificationViewHolder(view)
        }
    }

    override fun getItemCount(): Int = items.size

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (val item = items[position]) {
            is NotificationListItem.Header -> (holder as HeaderViewHolder).bind(item.label)
            is NotificationListItem.Row -> (holder as NotificationViewHolder).bind(item.notification)
        }
    }

    class HeaderViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val headerText: TextView = itemView.findViewById(R.id.headerText)

        fun bind(label: String) {
            headerText.text = label
        }
    }

    class NotificationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val typeText: TextView = itemView.findViewById(R.id.typeText)
        private val messageText: TextView = itemView.findViewById(R.id.messageText)
        private val dateText: TextView = itemView.findViewById(R.id.dateText)

        fun bind(notification: ParentNotification) {
            typeText.text = "${labelFor(notification.type)} • ${priorityFor(notification.type)}"
            typeText.setTextColor(ContextCompat.getColor(itemView.context, colorFor(notification.type)))
            messageText.text = notification.message
            dateText.text = notification.created_at
        }

        private fun labelFor(type: String): String {
            return when (type) {
                "departure" -> "Departure"
                "near_stop" -> "Near Stop"
                "arrival" -> "Arrival"
                "delay" -> "Delay"
                else -> type.replaceFirstChar { it.uppercase() }
            }
        }

        private fun priorityFor(type: String): String {
            return when (type) {
                "delay" -> "High priority"
                "near_stop" -> "Medium priority"
                else -> "Normal priority"
            }
        }

        private fun colorFor(type: String): Int {
            return when (type) {
                "departure" -> android.R.color.holo_blue_dark
                "near_stop" -> android.R.color.holo_green_dark
                "arrival" -> android.R.color.holo_purple
                "delay" -> android.R.color.holo_orange_dark
                else -> android.R.color.darker_gray
            }
        }
    }

    private sealed class NotificationListItem {
        data class Header(val label: String) : NotificationListItem()
        data class Row(val notification: ParentNotification) : NotificationListItem()
    }

    private fun today(): String {
        return java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(java.util.Date())
    }
}
