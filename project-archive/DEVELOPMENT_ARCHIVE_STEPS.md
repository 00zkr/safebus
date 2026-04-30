# Development Archive Steps

This document explains how to archive the development of the SafeBus project in a clean, professional way.

## 1. Create the final archive folder

Create a final delivery folder named:

```text
SafeBus-Archive/
```

Recommended structure:

```text
SafeBus-Archive/
  01_Project_Overview/
  02_Requirements/
  03_Design_and_Architecture/
  04_Backend/
  05_Web_Dashboard/
  06_Mobile_App/
  07_Database/
  08_Testing_and_Validation/
  09_Deployment/
  10_Final_Reports/
  11_Presentation/
  12_Appendices/
```

## 2. Archive project overview

Store these files in `01_Project_Overview/`:

- Project title and description.
- Problem statement.
- Project objectives.
- Target users.
- Main features.
- Technologies used.
- Screenshots of the final application.

Suggested file:

```text
01_Project_Overview/Project_Overview.md
```

Content to include:

- SafeBus is a school transport tracking system.
- The system connects administrators, drivers, and parents.
- The administrator uses a web dashboard.
- The parent and driver use a mobile application.
- The backend centralizes authentication, transport data, notifications, and realtime events.

## 3. Archive requirements

Store these files in `02_Requirements/`:

- Functional requirements.
- Non-functional requirements.
- User roles and permissions.
- Use case descriptions.
- User stories.

Functional requirements examples:

- The administrator can manage students.
- The administrator can manage buses.
- The administrator can manage routes.
- The administrator can view notifications.
- The driver can start a route.
- The driver can update bus status.
- The driver can send GPS location.
- The parent can view child transport data.
- The parent can view notifications.

Non-functional requirements examples:

- The system should be simple to run locally.
- The dashboard should update live when bus data changes.
- The mobile app should store the login session.
- API inputs should be validated.
- User access should be role-based.

## 4. Archive architecture and design

Store these files in `03_Design_and_Architecture/`:

- Global architecture diagram.
- Backend architecture diagram.
- Mobile architecture diagram.
- Web dashboard architecture diagram.
- Data flow diagram.
- Authentication flow.
- Notification flow.

Suggested diagrams:

```text
Admin Web Dashboard -> Backend API -> MySQL
Driver Mobile App -> Backend API -> MySQL
Parent Mobile App -> Backend API -> MySQL
Backend API -> Socket.IO Events -> Web Dashboard
```

Recommended architecture sections:

- Client-server architecture.
- REST API communication.
- JWT authentication.
- Role-based access control.
- Realtime updates using Socket.IO.
- Docker Compose deployment.

## 5. Archive backend development

Store these files in `04_Backend/`:

- Backend README.
- API documentation.
- Authentication documentation.
- Route documentation.
- Service documentation.
- Validation documentation.
- Error handling documentation.

Backend source folders to describe:

- `src/config`: environment, database, realtime setup.
- `src/controllers`: HTTP request handlers.
- `src/routes`: API route definitions.
- `src/services`: business logic.
- `src/models`: database access layer.
- `src/middlewares`: authentication, validation, error handling.
- `src/validators`: express-validator rules.
- `src/utils`: demo user utilities.

API documentation should include:

- Endpoint URL.
- HTTP method.
- Required role.
- Request body.
- Response example.
- Validation errors.

## 6. Archive web dashboard development

Store these files in `05_Web_Dashboard/`:

- Web README.
- Page list.
- Component list.
- API client description.
- Realtime event handling description.
- Screenshots.

Dashboard pages to document:

- Login
- Dashboard
- Buses
- Students
- Routes
- Driver accounts
- Parent accounts
- Notifications

Important source folders:

- `src/pages`: page-level dashboard screens.
- `src/components`: reusable UI components.
- `src/api`: backend API client and realtime connection.

## 7. Archive mobile app development

Store these files in `06_Mobile_App/`:

- Mobile README.
- Screens documentation.
- ViewModel documentation.
- API integration documentation.
- Session storage documentation.
- Permission documentation.
- Screenshots from emulator or device.

Mobile screens to document:

- Login screen.
- Parent home screen.
- Driver dashboard screen.

Important source folders:

- `api`: Retrofit client and API service.
- `data`: models and session manager.
- `repository`: data access abstraction.
- `ui`: activities, adapters, notification helper.
- `viewmodel`: screen state and business interaction.
- `res/layout`: XML layouts.

## 8. Archive database work

Store these files in `07_Database/`:

- Database schema.
- Seed data.
- Entity relationship diagram.
- Table dictionary.
- Example SQL queries.

Files to copy:

```text
backend/database/schema.sql
backend/database/seed.sql
```

Table dictionary should include:

- Table name.
- Column name.
- Data type.
- Required or optional.
- Primary key and foreign key.
- Description.

## 9. Archive testing and validation

Store these files in `08_Testing_and_Validation/`:

- Test plan.
- API test cases.
- Web dashboard test cases.
- Mobile app test cases.
- Known limitations.
- Validation screenshots.

Recommended test cases:

- Admin login succeeds.
- Invalid login fails.
- Admin can create, update, and delete a student.
- Admin can create, update, and delete a bus.
- Driver can start route.
- Driver can send delay status.
- Driver can send GPS location.
- Parent can view assigned bus status.
- Parent can filter notifications.
- Realtime dashboard updates appear after driver actions.
- Demo reset restores seed state.

For each test case, record:

- Test ID.
- Objective.
- Preconditions.
- Steps.
- Expected result.
- Actual result.
- Status.
- Screenshot or evidence.

## 10. Archive deployment work

Store these files in `09_Deployment/`:

- Docker Compose explanation.
- Environment variables.
- Local run guide.
- Troubleshooting guide.
- Port list.

Main run command:

```bash
docker compose up --build
```

Main ports:

| Service | Port |
| --- | --- |
| Web dashboard | `3000` |
| Backend API | `5000` |
| MySQL | `3306` |

## 11. Archive reports

Store these files in `10_Final_Reports/`:

- French LaTeX report.
- English LaTeX report.
- Short English README.
- Abstracts in French and English.
- Bibliography.

Recommended report chapters:

1. General introduction
2. Project context
3. Requirements analysis
4. System design
5. Implementation
6. Testing and validation
7. Deployment
8. Results and discussion
9. Conclusion and future improvements

## 12. Archive presentation

Store these files in `11_Presentation/`:

- English PowerPoint presentation.
- Speaker notes.
- Demo scenario.
- Screenshots used in slides.

Recommended slide order:

1. Title
2. Problem statement
3. Objectives
4. Target users
5. System architecture
6. Database model
7. Backend API
8. Web dashboard
9. Mobile app
10. Realtime notifications
11. Demo scenario
12. Testing
13. Challenges
14. Conclusion
15. Future improvements

## 13. Archive appendices

Store these files in `12_Appendices/`:

- API examples.
- Extra screenshots.
- Source code tree.
- Installation logs.
- Build logs.
- Glossary.
- Acronyms.

## 14. Final archive checklist

Before submitting the archive, verify:

- The source code is included.
- `node_modules`, `dist`, and build cache folders are excluded unless required.
- The database schema and seed files are included.
- The Docker Compose file is included.
- The backend, web, and mobile READMEs are included.
- The final reports are included.
- The presentation is included.
- Screenshots are clear and named correctly.
- Test evidence is included.
- The archive can be opened and understood without running the code.
- The project can be run from the included instructions.

## 15. Recommended archive naming

Use a clear final zip name:

```text
SafeBus_Project_Archive_2026.zip
```

Recommended internal naming:

```text
SafeBus_Source_Code/
SafeBus_Documentation/
SafeBus_Presentation/
SafeBus_Reports/
SafeBus_Testing_Evidence/
```

## 16. Suggested development timeline

| Phase | Work completed |
| --- | --- |
| Phase 1 | Define project idea, users, and transport problem |
| Phase 2 | Design database schema and seed data |
| Phase 3 | Build backend API and authentication |
| Phase 4 | Add role-based access and validation |
| Phase 5 | Add driver actions and notification logic |
| Phase 6 | Add realtime events with Socket.IO |
| Phase 7 | Build React administrator dashboard |
| Phase 8 | Build Android parent and driver app |
| Phase 9 | Integrate Docker Compose |
| Phase 10 | Test flows and prepare documentation |

## 17. Evidence to collect

Collect screenshots for:

- Docker containers running.
- Backend health endpoint.
- Admin login.
- Dashboard overview.
- Student management.
- Bus management.
- Route management.
- Notifications page.
- Driver mobile dashboard.
- Parent mobile screen.
- GPS update evidence.
- Realtime dashboard update after driver action.
- Database tables.

Collect command evidence for:

```bash
docker compose up --build
curl http://localhost:5000/health
npm run build
```

For mobile, collect:

```bash
gradlew assembleDebug
```

## 18. Future improvements to document

Possible future improvements:

- Real production user table instead of demo users.
- Password reset.
- Push notifications.
- Live map tracking in the mobile app.
- Driver route history.
- Parent multi-child support.
- Deployment to a cloud server.
- Automated API tests.
- End-to-end dashboard tests.
- CI/CD pipeline.
- Better security configuration for production.
