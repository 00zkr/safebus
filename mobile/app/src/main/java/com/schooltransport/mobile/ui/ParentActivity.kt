package com.schooltransport.mobile.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.schooltransport.mobile.R
import com.schooltransport.mobile.api.RetrofitClient
import com.schooltransport.mobile.data.SessionManager
import com.schooltransport.mobile.data.Bus
import com.schooltransport.mobile.repository.TransportRepository
import com.schooltransport.mobile.viewmodel.ParentViewModel
import com.schooltransport.mobile.viewmodel.ViewModelFactory

class ParentActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: ParentViewModel
    private lateinit var adapter: NotificationAdapter
    private lateinit var notificationHelper: AppNotificationHelper
    private val refreshHandler = Handler(Looper.getMainLooper())
    private var latestBus: Bus? = null
    private lateinit var liveText: TextView
    private val seenNotificationIds = mutableSetOf<Int>()
    private var initialNotificationsLoaded = false
    private val refreshTask = object : Runnable {
        override fun run() {
            refreshData()
            refreshHandler.postDelayed(this, 15000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parent)

        sessionManager = SessionManager(this)
        notificationHelper = AppNotificationHelper(this)
        requestNotificationPermissionIfNeeded()
        val repository = TransportRepository(RetrofitClient.create(this))
        viewModel = ViewModelProvider(this, ViewModelFactory(repository))[ParentViewModel::class.java]

        val childInfoText = findViewById<TextView>(R.id.childInfoText)
        val typeFilter = findViewById<Spinner>(R.id.typeFilter)
        val dateFilter = findViewById<EditText>(R.id.dateFilter)
        val filterButton = findViewById<Button>(R.id.filterButton)
        liveText = findViewById(R.id.parentLiveText)
        adapter = NotificationAdapter()

        findViewById<RecyclerView>(R.id.notificationsList).apply {
            layoutManager = LinearLayoutManager(this@ParentActivity)
            adapter = this@ParentActivity.adapter
        }

        val filterOptions = listOf("all", "departure", "near_stop", "arrival", "delay")
        typeFilter.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, filterOptions)

        filterButton.setOnClickListener {
            val selectedType = typeFilter.selectedItem.toString().takeIf { it != "all" }
            val selectedDate = dateFilter.text.toString().trim().takeIf { it.isNotBlank() }
            viewModel.loadNotifications(sessionManager.getStudentId(), selectedType, selectedDate)
        }
        findViewById<Button>(R.id.refreshParentButton).setOnClickListener { refreshData() }
        findViewById<Button>(R.id.openBusMapButton).setOnClickListener { openBusMap() }
        findViewById<Button>(R.id.logoutParentButton).setOnClickListener { logout() }

        viewModel.homeState.observe(this) { result ->
            result
                .onSuccess { state ->
                    latestBus = state.bus
                    childInfoText.text = """
                        Child: ${state.student?.full_name ?: "-"}
                        Bus: ${state.bus?.name ?: "-"}
                        Driver: ${state.bus?.driver_name ?: "-"}
                        Route: ${state.route?.name ?: "-"}
                        Status: ${state.bus?.status ?: "-"}
                        Location: ${state.bus?.current_lat ?: "-"}, ${state.bus?.current_lng ?: "-"}
                    """.trimIndent()
                    liveText.text = "Updated just now. Auto-refresh every 15 seconds."
                }
                .onFailure { showError(it) }
        }

        viewModel.notifications.observe(this) { result ->
            result
                .onSuccess {
                    adapter.submitList(it)
                    showNewSystemNotifications(it)
                    if (it.isEmpty()) {
                        liveText.text = "No notifications match the current filters."
                    }
                }
                .onFailure { showError(it) }
        }

        refreshData()
        refreshHandler.postDelayed(refreshTask, 15000)
    }

    override fun onDestroy() {
        super.onDestroy()
        refreshHandler.removeCallbacks(refreshTask)
    }

    private fun refreshData() {
        liveText.text = "Loading latest transport data..."
        viewModel.loadHome()
        viewModel.loadNotifications(sessionManager.getStudentId())
    }

    private fun openBusMap() {
        val bus = latestBus
        val lat = bus?.current_lat
        val lng = bus?.current_lng

        if (lat == null || lng == null) {
            Toast.makeText(this, "No bus location available yet", Toast.LENGTH_SHORT).show()
            return
        }

        val uri = Uri.parse("geo:$lat,$lng?q=$lat,$lng(${Uri.encode(bus.name)})")
        startActivity(Intent(Intent.ACTION_VIEW, uri))
    }

    private fun logout() {
        sessionManager.clear()
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }

    private fun showNewSystemNotifications(notifications: List<com.schooltransport.mobile.data.ParentNotification>) {
        val sortedNotifications = notifications.sortedBy { it.id }

        if (!initialNotificationsLoaded) {
            seenNotificationIds.addAll(sortedNotifications.map { it.id })
            initialNotificationsLoaded = true
            return
        }

        sortedNotifications
            .filter { seenNotificationIds.add(it.id) }
            .forEach { notificationHelper.showParentNotification(it) }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 300)
        }
    }

    private fun showError(error: Throwable) {
        Toast.makeText(this, error.message ?: "Request failed. Check backend connection.", Toast.LENGTH_LONG).show()
    }
}
