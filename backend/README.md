# SafeBus Backend

Backend for the Toubkal IT Center transport tracking demo.

## Run with Docker Compose

From the repository root:

```bash
docker compose up --build
```

API base URL:

```text
http://localhost:5000
```

## Demo Users

No `users` table is used, so the database stays limited to the required four tables.

| Username | Password | Role | Demo scope |
| --- | --- | --- | --- |
| `admin` | `admin123` | `admin` | CRUD access |
| `driver` | `driver123` | `driver` | bus `1` |
| `parent` | `parent123` | `parent` | student `1` |

## Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Use the returned token as:

```text
Authorization: Bearer <token>
```

## Endpoints

- `GET /health`
- `POST /auth/login`
- `GET /students`
- `POST /students`
- `PUT /students/:id`
- `DELETE /students/:id`
- `GET /buses`
- `POST /buses`
- `PUT /buses/:id`
- `DELETE /buses/:id`
- `GET /routes`
- `POST /routes`
- `PUT /routes/:id`
- `DELETE /routes/:id`
- `GET /notifications?student_id=&bus_id=&type=&date=`
- `POST /notifications`
- `POST /driver/start-route`
- `POST /driver/update-status`
- `POST /driver/update-location`
- `POST /driver/near-stop`
- `POST /demo/reset`

## Driver Actions

Driver actions are available only to the `driver` role. The demo driver controls bus `1`.

### Start route

```http
POST /driver/start-route
Authorization: Bearer <driver-token>
```

This sets the driver's bus to `active` and creates `departure` notifications for all students assigned to the bus.

### Update status

```http
POST /driver/update-status
Authorization: Bearer <driver-token>
Content-Type: application/json

{
  "status": "delay"
}
```

Allowed values:

- `departure` sets bus status to `active`
- `delay` sets bus status to `delayed`
- `arrival` sets bus status to `completed`

Each status creates parent notifications for all students assigned to the driver's bus.

### Update location

```http
POST /driver/update-location
Authorization: Bearer <driver-token>
Content-Type: application/json

{
  "lat": 33.5731,
  "lng": -7.5898
}
```

GPS updates are stored directly in the `buses` table.

### Near stop

```http
POST /driver/near-stop
Authorization: Bearer <driver-token>
Content-Type: application/json

{
  "stop_name": "Central Stop"
}
```

This creates `near_stop` notifications for all students assigned to the driver's bus. It is blocked when the bus status is `completed`.

## Business Rules

- Each student is assigned to one bus and one route.
- Each driver action creates parent notifications when appropriate.
- When the bus status is `completed`, `near_stop` notifications are blocked for students assigned to that bus.

## Realtime Events

The backend uses Socket.IO on the same server as the REST API.

- `bus:updated` is emitted when bus status or GPS changes.
- `bus:location` is emitted when a driver sends GPS.
- `notifications:created` is emitted when the system creates parent notifications.
- `demo:reset` is emitted when admin resets the demo data.
