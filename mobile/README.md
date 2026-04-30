# SafeBus Mobile App

Native Android app for Toubkal IT Center transport tracking.

## Features

- Kotlin native Android app
- Retrofit API calls
- JWT saved locally with `SharedPreferences`
- ViewModel + LiveData screen state
- RecyclerView notification lists
- Role-based UI:
  - Parent
  - Driver

## Backend URL

The app uses:

```text
http://10.0.2.2:5000/
```

This is the Android emulator address for your local machine. Keep the backend running with:

```bash
docker compose up -d --build
```

If you use a physical Android device, change `BASE_URL` in:

```text
app/src/main/java/com/schooltransport/mobile/api/RetrofitClient.kt
```

to your computer LAN IP, for example:

```text
http://192.168.1.20:5000/
```

## Demo Users

Parent:

```text
username: parent
password: parent123
```

Driver:

```text
username: driver
password: driver123
```

The mobile app intentionally blocks admin login from opening a mobile screen because admin belongs to the web dashboard.

## Screens

- Login screen
- Parent home:
  - child info
  - assigned bus
  - route name
  - live bus status
  - notifications with type/date filters
- Driver dashboard:
  - start route
  - departure/delay/arrival buttons
  - manual GPS sender
  - current phone GPS sender
  - open bus location in the device map app
  - bus notification history

## Mobile Improvements

- Parent and driver screens auto-refresh every 15 seconds.
- Parent and driver users can logout.
- Parent can open the assigned bus location in a map app.
- Driver can send manual GPS coordinates or the phone's current GPS location.
