package com.schooltransport.mobile.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import android.widget.EditText
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
import com.google.android.gms.location.Priority
import com.google.android.gms.location.LocationServices
import com.google.android.gms.tasks.CancellationTokenSource
import com.schooltransport.mobile.repository.TransportRepository
import com.schooltransport.mobile.viewmodel.DriverViewModel
import com.schooltransport.mobile.viewmodel.ViewModelFactory

class DriverActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager
    private lateinit var viewModel: DriverViewModel
    private lateinit var adapter: NotificationAdapter
    private val refreshHandler = Handler(Looper.getMainLooper())
    private var latestBus: Bus? = null
    private lateinit var liveText: TextView
    private val demoLatitude = 33.5731
    private val demoLongitude = -7.5898
    private val refreshTask = object : Runnable {
        override fun run() {
            refreshNotifications()
            refreshHandler.postDelayed(this, 15000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_driver)

        sessionManager = SessionManager(this)
        val repository = TransportRepository(RetrofitClient.create(this))
        viewModel = ViewModelProvider(this, ViewModelFactory(repository))[DriverViewModel::class.java]

        val statusText = findViewById<TextView>(R.id.driverStatusText)
        val latInput = findViewById<EditText>(R.id.latInput)
        val lngInput = findViewById<EditText>(R.id.lngInput)
        val stopNameInput = findViewById<EditText>(R.id.stopNameInput)
        liveText = findViewById(R.id.driverLiveText)
        adapter = NotificationAdapter()

        findViewById<RecyclerView>(R.id.driverNotificationsList).apply {
            layoutManager = LinearLayoutManager(this@DriverActivity)
            adapter = this@DriverActivity.adapter
        }

        findViewById<Button>(R.id.startRouteButton).setOnClickListener { viewModel.startRoute() }
        findViewById<Button>(R.id.departureButton).setOnClickListener { viewModel.updateStatus("departure") }
        findViewById<Button>(R.id.delayButton).setOnClickListener { viewModel.updateStatus("delay") }
        findViewById<Button>(R.id.arrivalButton).setOnClickListener { viewModel.updateStatus("arrival") }
        findViewById<Button>(R.id.nearStopButton).setOnClickListener {
            val stopName = stopNameInput.text.toString().trim()

            if (stopName.isBlank()) {
                Toast.makeText(this, "Enter a stop name", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.nearStop(stopName)
            }
        }
        findViewById<Button>(R.id.refreshDriverButton).setOnClickListener { refreshNotifications() }
        findViewById<Button>(R.id.logoutDriverButton).setOnClickListener { logout() }
        findViewById<Button>(R.id.openDriverMapButton).setOnClickListener { openBusMap() }
        findViewById<Button>(R.id.sendCurrentLocationButton).setOnClickListener { sendCurrentPhoneLocation() }
        findViewById<Button>(R.id.sendLocationButton).setOnClickListener {
            val lat = latInput.text.toString().toDoubleOrNull()
            val lng = lngInput.text.toString().toDoubleOrNull()

            if (lat == null || lng == null) {
                Toast.makeText(this, "Enter valid latitude and longitude", Toast.LENGTH_SHORT).show()
            } else {
                viewModel.updateLocation(lat, lng)
            }
        }

        viewModel.actionResult.observe(this) { result ->
            result
                .onSuccess { response ->
                    latestBus = response.bus
                    statusText.text = """
                        Bus: ${response.bus.name}
                        Status: ${response.bus.status}
                        Location: ${response.bus.current_lat ?: "-"}, ${response.bus.current_lng ?: "-"}
                        Notifications: ${response.notifications_created ?: 0}
                    """.trimIndent()
                    liveText.text = "Updated just now. Auto-refresh every 15 seconds."
                    refreshNotifications()
                }
                .onFailure { showError(it) }
        }

        viewModel.notifications.observe(this) { result ->
            result
                .onSuccess {
                    adapter.submitList(it)
                    if (it.isEmpty()) {
                        liveText.text = "No driver notifications yet."
                    }
                }
                .onFailure { showError(it) }
        }

        refreshNotifications()
        refreshHandler.postDelayed(refreshTask, 15000)
    }

    override fun onDestroy() {
        super.onDestroy()
        refreshHandler.removeCallbacks(refreshTask)
    }

    private fun refreshNotifications() {
        liveText.text = "Loading latest driver notifications..."
        viewModel.loadBusNotifications(sessionManager.getBusId())
    }

    private fun sendCurrentPhoneLocation() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 200)
            return
        }

        val fusedClient = LocationServices.getFusedLocationProviderClient(this)
        fusedClient.getCurrentLocation(Priority.PRIORITY_HIGH_ACCURACY, CancellationTokenSource().token)
            .addOnSuccessListener { location ->
                if (location == null) {
                    fusedClient.lastLocation
                        .addOnSuccessListener { lastLocation ->
                            if (lastLocation == null) {
                                sendDemoLocation()
                            } else {
                                viewModel.updateLocation(lastLocation.latitude, lastLocation.longitude)
                            }
                        }
                        .addOnFailureListener { sendDemoLocation() }
                } else {
                    viewModel.updateLocation(location.latitude, location.longitude)
                }
            }
            .addOnFailureListener { sendDemoLocation() }
    }

    private fun sendDemoLocation() {
        Toast.makeText(this, "Sending demo GPS for emulator", Toast.LENGTH_SHORT).show()
        viewModel.updateLocation(demoLatitude, demoLongitude)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == 200 && grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) {
            sendCurrentPhoneLocation()
        } else if (requestCode == 200) {
            sendDemoLocation()
        }
    }

    private fun openBusMap() {
        val bus = latestBus
        val lat = bus?.current_lat
        val lng = bus?.current_lng

        if (lat == null || lng == null) {
            Toast.makeText(this, "Send a location first", Toast.LENGTH_SHORT).show()
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

    private fun showError(error: Throwable) {
        Toast.makeText(this, error.message ?: "Request failed. Check backend connection.", Toast.LENGTH_LONG).show()
    }
}
