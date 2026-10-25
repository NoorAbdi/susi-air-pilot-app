# Susi Air Pilot Portal

A mobile-first web application built for Susi Air pilots to track flight hours, monitor document expirations, and view duty schedules. 

## Tech Stack
* **Frontend:** Nuxt 3 (Vue 3, SSR), Pinia (State Management), Chart.js (Rolling Sum Visualization), SCSS.
* **Backend:** NestJS, TypeScript, class-validator/class-transformer.
* **Data:** In-memory JSON (as per requirements, strictly no databases).

## How to Run Locally

### Prerequisites
* Node.js (v18+)
* npm

### 1. Start the Backend (NestJS)
Open a terminal and run:
\`\`\`bash
cd nest
npm install
npm run start:dev
\`\`\`
The API will be available at `http://localhost:3001`.

### 2. Start the Frontend (Nuxt 3)
Open a second terminal and run:
\`\`\`bash
cd nuxt
npm install
npm run dev
\`\`\`
The web app will be available at `http://localhost:3000`.

## Test Credentials
* **Username:** `budiluhur`
* **Password:** `susiairtest`

## Key Technical Implementations
1. **Server-Side Math:** All rolling sum flight hour calculations are strictly executed on the backend Service layer to ensure zero client-side manipulation.
2. **Mobile-First Constraints:** The Nuxt application is constrained to a 480px maximum width to enforce the operational mobile design on desktop viewports.
3. **Security:** The backend is protected by a global JWT Auth Guard and utilizes a global Exception Filter to format error messages securely.
4. **Reactive State:** The Pinia Auth Store persists the JWT using `useCookie` to ensure authentication survives SSR hydration and hard reloads.