# Civic Reporting Platform

A full-stack web application where residents can report local infrastructure issues (potholes, broken streetlights, sanitation, etc.), track status updates, and filter reports by status.

## Live Demo

**Deployed app:** _Add your Render URL here after deployment_  
Render: https://civic-reporting-platform-kzu5.onrender.com/

## Team Members

- Julian Espinosa (solo)

## Technologies Used

- **Frontend:** React, `fetch` API
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (`pg`)
- **Version control:** Git, GitHub

## Features

- Create civic issue reports (title, description, category, location)
- View all reports from PostgreSQL
- Filter reports by status (`open`, `in_progress`, `resolved`)
- Update report status
- Delete reports
- Client-side error handling for failed API requests

## Project Structure

```text
node-api-postgres/
├── client/          # React frontend
├── server/          # Express API + static hosting
│   ├── index.js
│   └── queries.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed and running

### 1. Install dependencies

From project root:

```bash
npm install
npm install --prefix client
```

### 2. Create database and table

Connect to Postgres:

```bash
psql -U me -d api
```

Create the `reports` table:

```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  location_text VARCHAR(150) NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Exit with `\q`.

### 3. Configure local database credentials

Local development uses the defaults in `server/queries.js`:

- user: `me`
- database: `api`
- password: `password`
- host: `localhost`
- port: `5432`

Update these if your local Postgres setup is different.

### 4. Build frontend and start server

```bash
npm run build
npm start
```

Open:

- App UI: `http://localhost:8000`
- API: `http://localhost:8000/reports`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reports` | Get all reports |
| `GET` | `/reports/:id` | Get one report by id |
| `POST` | `/reports` | Create a report |
| `PATCH` | `/reports/:id/status` | Update report status |
| `DELETE` | `/reports/:id` | Delete a report |

### Example POST body

```json
{
  "title": "Pothole on Main St",
  "description": "Large pothole near crosswalk",
  "category": "road",
  "location_text": "Main St & 3rd Ave"
}
```

## Deployment (Render) — Checklist

Use this checklist to satisfy the assignment deployment requirement.

### A. Push code to GitHub

- [ ] Repo is public: `https://github.com/devespinosa77-star/Civic-Reporting-Platform.git`
- [ ] Latest code is pushed

### B. Create Render PostgreSQL

1. Go to [Render](https://render.com) → **New +** → **PostgreSQL**
2. Name it (e.g. `civic-reports-db`)
3. Copy the **Internal Database URL** (or External if needed)

### C. Run table SQL on production DB

In Render Postgres → **Connect** → run the same `CREATE TABLE reports (...)` SQL from above.

### D. Create Render Web Service

1. **New +** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. **Environment Variables:**
   - `DATABASE_URL` = your Render Postgres connection string
   - `NODE_ENV` = `production`
5. Deploy

### E. Verify deployment

- [ ] Open deployed URL in browser
- [ ] Create a report in the UI
- [ ] Confirm `GET /reports` returns JSON on production
- [ ] Paste live URL into this README under **Live Demo**
- [ ] Commit and push README update

## Assignment Requirements Mapping

| Requirement | Status |
|-------------|--------|
| React frontend with interactivity | Implemented |
| Express backend (2+ endpoints) | Implemented |
| PostgreSQL + CRUD | Implemented |
| Frontend ↔ backend HTTP integration | Implemented |
| Public deployment + README link | Complete after Render deploy |
| 10+ meaningful Git commits | In progress |
| Complete README | This file |

## Reflections

_Replace this section with your own notes before submission._

- **What I learned:** Connecting React to an Express API, using PostgreSQL for persistence, and structuring CRUD endpoints.
- **Challenges:** Managing route order in Express, restarting Node after code changes, and creating the `reports` schema in Postgres.
- **Next improvements:** Add responsive CSS, geolocation capture in the form, and optional city API integration.
- **AI tools used:** Cursor AI assisted with debugging `node server/index.js`, CRUD route design, README drafting, and deployment planning.

## License

ISC
