# Susi Air Pilot Portal

A mobile-first web application built for Susi Air pilots to track flight hours, monitor document expirations, and view duty schedules. 

## How to Set Up and Run

### Prerequisites
* Node.js (v18+)
* npm

### Start the Backend (NestJS)
```bash
cd nest
npm install
npm run start:dev
```
The API runs at `http://localhost:3001`.

### Start the Frontend (Nuxt 3)
Open a separate terminal:
```bash
cd nuxt
npm install
npm run dev
```
The web app runs at `http://localhost:3000`.

**Test Credentials:** 
* Username: `johndoe`
* Password: `susiairtest`

## Required Environment Variables

### Backend (`/nest/.env`)
* `PORT` (Optional, defaults to 3001)
* `JWT_SECRET` (Required for auth token signing. Example: `susiair-secret-key`)

### Frontend (`/nuxt/.env`)
* `NUXT_PUBLIC_API_BASE` (Required to connect to the backend. Example: `http://localhost:3001` or your live production URL).

## Main Choices & Reasoning

1. **Server-Side Rolling Sum Calculation:** The brief explicitly required the rolling sum to run on the server. I isolated this math into a dedicated `FlightHoursService`. This prevents client-side manipulation of regulatory limits and keeps the frontend bundle lightweight by avoiding heavy date-math processing on the client.
2. **Mobile-First Desktop Constraint:** The brief requested a mobile-first operational tool. Instead of building a fully responsive desktop grid that dilutes the mobile experience, I constrained the Nuxt application wrapper to a `480px` maximum width. This guarantees the UI behaves exactly like a mobile app regardless of the device.
3. **Chart.js Limit Line Implementation:** To draw the red limit line dynamically based on the toggle, I injected a second dataset with a constant value rather than installing heavy annotation plugins. This kept dependencies minimal and operational.
4. **Native Date Math for Calendar:** I opted for native JavaScript `Date` functions rather than installing libraries like `date-fns` or `moment` to generate the monthly grid. It is faster, keeps the payload small, and handles the month-switching logic flawlessly.

## What I Would Change With More Time

1. **Persistent Database:** I would replace the in-memory JSON loading with a PostgreSQL database managed via Prisma or TypeORM to allow for actual data mutation (e.g., logging a new flight).
2. **PWA Integration:** Since pilots often operate in low-connectivity environments, I would configure Nuxt PWA to cache the schedule and flight hours for offline viewing.
3. **End-to-End Testing:** I would write Cypress or Playwright tests to programmatically verify the chart toggles, auth guards, and rolling sum boundaries to prevent regressions.
4. **Refresh Tokens:** I would implement a short-lived access token + HttpOnly refresh token flow to improve security rather than relying on a single long-lived JWT in a cookie.