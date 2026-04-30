# SafeBus - School Transport Tracking System

SafeBus is a full-stack school transport tracking system built for an academic demo. It helps school administrators manage transport operations, allows drivers to update bus activity and location, and lets parents follow their child's assigned bus status and notifications.

The project includes a Node.js backend, a React web dashboard, a native Android mobile app, a MySQL database, and Docker Compose support.

## Video Demo

Add your demo video link here:

```text
TODO: https://your-demo-video-link.com
```

## Features

### Administrator Web Dashboard

- Secure admin login
- Dashboard overview
- Manage students
- Manage buses
- Manage routes
- Manage driver accounts
- Manage parent accounts
- View and filter notifications
- Live updates through Socket.IO
- Bus location display using OpenStreetMap embeds

### Driver Mobile App

- Driver login
- Start route
- Send departure, delay, and arrival status
- Send manual GPS coordinates
- Send current phone GPS location
- Send near-stop notifications
- Open bus location in the map app
- View bus notification history
- Auto-refresh transport data
- Logout

### Parent Mobile App

- Parent login
- View child transport information
- View assigned bus and route
- View live bus status
- View notifications with filters
- Open assigned bus location in the map app
- Auto-refresh transport data
- Logout

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Backend | Node.js, Express.js, MySQL, JWT, Socket.IO, express-validator |
| Web Dashboard | React, Vite, Axios, React Router, Socket.IO Client, lucide-react |
| Mobile App | Android, Kotlin, Retrofit, Gson, ViewModel, LiveData, RecyclerView, SharedPreferences |
| Database | MySQL 8 |
| Deployment | Docker Compose |

## Project Structure

```text
.
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── web/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   └── pages/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── mobile/
│   ├── app/
│   ├── gradle/
│   ├── build.gradle.kts
│   └── README.md
├── project-archive/
├── docker-compose.yml
└── README.md
```

## System Architecture

```text
Administrator -> Web Dashboard -> Backend API -> MySQL
Driver        -> Android App   -> Backend API -> MySQL
Parent        -> Android App   -> Backend API -> MySQL

Backend API -> Socket.IO Events -> Web Dashboard
```

The backend centralizes authentication, business rules, database access, notifications, and realtime events. The web dashboard is used by administrators, while the Android app is used by parents and drivers.

## Demo Accounts

| Username | Password | Role | Platform |
| --- | --- | --- | --- |
| `admin` | `admin123` | Admin | Web dashboard |
| `driver` | `driver123` | Driver | Android app |
| `parent` | `parent123` | Parent | Android app |

## Getting Started

### Prerequisites

Make sure you have installed:

- Docker
- Docker Compose
- Node.js and npm, only if you want to run backend or web manually
- Android Studio, only if you want to run the mobile app

## Run with Docker Compose

From the project root, run:

```bash
docker compose up --build
```

After startup, open:

```text
Web dashboard: http://localhost:3000
Backend API:   http://localhost:5000
MySQL:         localhost:3306
```

To stop the services:

```bash
docker compose down
```

## Backend

The backend provides REST API endpoints and realtime events.

### Backend URL

```text
http://localhost:5000
```

### Main Backend Commands

```bash
cd backend
npm install
npm run dev
```

### Main API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check API health |
| `POST` | `/auth/login` | Login and receive JWT token |
| `GET` | `/students` | List students |
| `POST` | `/students` | Create student |
| `PUT` | `/students/:id` | Update student |
| `DELETE` | `/students/:id` | Delete student |
| `GET` | `/buses` | List buses |
| `POST` | `/buses` | Create bus |
| `PUT` | `/buses/:id` | Update bus |
| `DELETE` | `/buses/:id` | Delete bus |
| `GET` | `/routes` | List routes |
| `POST` | `/routes` | Create route |
| `PUT` | `/routes/:id` | Update route |
| `DELETE` | `/routes/:id` | Delete route |
| `GET` | `/notifications` | List notifications |
| `POST` | `/notifications` | Create notification |
| `POST` | `/driver/start-route` | Start driver route |
| `POST` | `/driver/update-status` | Update bus status |
| `POST` | `/driver/update-location` | Update bus GPS location |
| `POST` | `/driver/near-stop` | Send near-stop notification |
| `POST` | `/demo/reset` | Reset demo data |

### Realtime Events

The backend uses Socket.IO to emit:

- `bus:updated`
- `bus:location`
- `notifications:created`
- `demo:reset`

## Web Dashboard

The web dashboard is built with React and Vite.

### Web URL

```text
http://localhost:3000
```

### Run Web Manually

```bash
cd web
npm install
npm run dev
```

### Build Web App

```bash
cd web
npm run build
```

## Android Mobile App

The mobile app is a native Android app built with Kotlin.

### Run Mobile App

1. Open the `mobile/` folder in Android Studio.
2. Start the backend with Docker Compose.
3. Run the app on an Android emulator or physical device.

For Android emulator, the app uses:

```text
http://10.0.2.2:5000/
```

If you use a physical Android device, update the backend base URL in:

```text
mobile/app/src/main/java/com/schooltransport/mobile/api/RetrofitClient.kt
```

Use your computer LAN IP, for example:

```text
http://192.168.1.20:5000/
```

## Database

The MySQL database is initialized automatically by Docker Compose using:

```text
backend/database/schema.sql
backend/database/seed.sql
```

The database stores the transport domain data, while demo users are handled in code for this academic version.

## Environment Variables

The Docker Compose file configures the backend with:

```text
NODE_ENV=development
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_USER=transport_user
DB_PASSWORD=transport_pass
DB_NAME=school_transport
JWT_SECRET=change_this_secret_for_demo
JWT_EXPIRES_IN=1d
```

For production usage, replace demo credentials and secrets with secure values.

## Business Rules

- Each student is assigned to one bus and one route.
- Only admins can access the web dashboard.
- Parents and drivers use the Android mobile app.
- Driver actions create parent notifications when appropriate.
- Bus GPS updates are stored in the bus record.
- Dashboard data updates live through Socket.IO events.
- Near-stop notifications are blocked when the route is completed.

## Testing Checklist

Recommended manual validation:

- Admin can login on the web dashboard.
- Invalid login is rejected.
- Admin can create, update, and delete students.
- Admin can create, update, and delete buses.
- Admin can create, update, and delete routes.
- Driver can start a route.
- Driver can send departure, delay, and arrival status.
- Driver can send GPS location.
- Parent can view assigned child, bus, route, and notifications.
- Dashboard receives realtime updates after driver actions.
- Demo reset restores the original data.

## Documentation

Additional documentation is available in:

```text
project-archive/
```

It includes:

- Project details
- Development archive steps
- Suggested reports and papers
- Recommended final archive structure

## Future Improvements

- Replace demo users with a production users table.
- Add password reset.
- Add push notifications.
- Add full live map tracking on mobile.
- Add driver route history.
- Add multi-child support for parents.
- Add automated API tests.
- Add end-to-end dashboard tests.
- Add CI/CD pipeline.
- Deploy to a cloud server.
- Improve production security configuration.

## License

This project is currently prepared for academic/demo use. Add a license before publishing it as an open-source project.
