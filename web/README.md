# SafeBus Web Dashboard

React admin dashboard for Toubkal IT Center transport tracking.

## Run

From the repository root:

```bash
docker compose up -d --build
```

SafeBus dashboard:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

## Demo Login

```text
username: admin
password: admin123
```

Only the `admin` role is allowed into the dashboard.

## Improvements

- Dashboard receives live Socket.IO updates from the backend.
- The dashboard map uses OpenStreetMap embeds, so no API key is required.
- When the driver sends GPS, the dashboard map and bus table update live.
