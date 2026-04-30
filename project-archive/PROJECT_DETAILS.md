# SafeBus Project Details

## Project identity

Project name: SafeBus

Project type: academic / demo transport tracking system

Context: school transport tracking for Toubkal IT Center

Main goal: provide a simple full-stack system where administrators manage transport data, drivers update bus activity and location, and parents follow the assigned bus status and notifications.

## Main users

| User | Platform | Purpose |
| --- | --- | --- |
| Administrator | Web dashboard | Manage students, buses, routes, drivers, parent accounts, and notifications |
| Driver | Android mobile app | Start route, update status, send GPS location, and send near-stop updates |
| Parent | Android mobile app | View child transport information, bus status, bus location, and notifications |

## Demo accounts

| Username | Password | Role |
| --- | --- | --- |
| `admin` | `admin123` | admin |
| `driver` | `driver123` | driver |
| `parent` | `parent123` | parent |

## Technology stack

| Layer | Technologies |
| --- | --- |
| Backend | Node.js, Express, MySQL, Socket.IO, JWT, express-validator |
| Web | React, Vite, Axios, React Router, Socket.IO client, lucide-react |
| Mobile | Android, Kotlin, Retrofit, Gson, ViewModel, LiveData, RecyclerView, SharedPreferences |
| Database | MySQL 8 |
| Deployment / runtime | Docker Compose |

## Repository modules

```text
backend/
  database/
    schema.sql
    seed.sql
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    validators/
    utils/

web/
  src/
    api/
    components/
    pages/

mobile/
  app/src/main/java/com/schooltransport/mobile/
    api/
    data/
    repository/
    ui/
    viewmodel/
  app/src/main/res/
```

## Backend summary

The backend exposes the API used by the dashboard and the mobile app.

Main responsibilities:

- Authenticate demo users with JWT.
- Protect routes according to role.
- Manage students, buses, routes, drivers, and notifications.
- Store and update bus status and GPS location.
- Generate notifications when driver actions happen.
- Emit realtime events with Socket.IO.
- Reset demo data for repeatable demonstrations.

Important endpoints:

- `GET /health`
- `POST /auth/login`
- `GET /students`, `POST /students`, `PUT /students/:id`, `DELETE /students/:id`
- `GET /buses`, `POST /buses`, `PUT /buses/:id`, `DELETE /buses/:id`
- `GET /routes`, `POST /routes`, `PUT /routes/:id`, `DELETE /routes/:id`
- `GET /notifications`
- `POST /notifications`
- `POST /driver/start-route`
- `POST /driver/update-status`
- `POST /driver/update-location`
- `POST /driver/near-stop`
- `POST /demo/reset`

Realtime events:

- `bus:updated`
- `bus:location`
- `notifications:created`
- `demo:reset`

## Web dashboard summary

The web dashboard is dedicated to the administrator role.

Main features:

- Login as administrator.
- View dashboard statistics.
- Manage buses.
- Manage students.
- Manage routes.
- Manage driver accounts.
- Manage parent accounts.
- View and filter notifications.
- Receive live updates from backend Socket.IO events.
- Display bus location using OpenStreetMap embeds without an external map API key.

Local URL:

```text
http://localhost:3000
```

## Mobile app summary

The Android app is dedicated to parent and driver roles.

Parent features:

- Login as parent.
- View child information.
- View assigned bus and route.
- View live bus status.
- View notifications with filters.
- Open bus location in a map app.
- Auto-refresh data.
- Logout.

Driver features:

- Login as driver.
- Start route.
- Send departure, delay, and arrival status.
- Send manual GPS coordinates.
- Send current phone GPS location.
- Send near-stop notification.
- Open bus location in a map app.
- View bus notification history.
- Auto-refresh data.
- Logout.

Emulator backend URL:

```text
http://10.0.2.2:5000/
```

## Database summary

The database is initialized from:

- `backend/database/schema.sql`
- `backend/database/seed.sql`

The project keeps the core database focused on transport data. Demo users are handled in code, so the database remains limited to the required domain tables.

Recommended database documentation to add later:

- Entity relationship diagram.
- Table dictionary.
- Main constraints.
- Example records.
- Data flow between API, dashboard, and mobile app.

## Deployment summary

The project runs with Docker Compose:

```bash
docker compose up --build
```

Services:

- `mysql`: MySQL 8 database.
- `backend`: API server on port `5000`.
- `web`: dashboard on port `3000`.

Main URLs:

```text
Backend: http://localhost:5000
Web dashboard: http://localhost:3000
```

## Core business rules

- Each student is assigned to one bus and one route.
- Only administrators access the web dashboard.
- Parents and drivers use the Android app.
- Driver actions create parent notifications when appropriate.
- Bus location updates are stored in the bus record.
- Realtime events update the web dashboard and notification state.
- Near-stop notifications are blocked when the bus route is completed.

## Development phases

1. Requirements definition
2. Database design
3. Backend API implementation
4. Authentication and role protection
5. Realtime event integration
6. Web dashboard implementation
7. Android mobile app implementation
8. Docker Compose integration
9. Demo data and demo users
10. Testing and validation
11. Final documentation
12. Presentation and delivery archive
