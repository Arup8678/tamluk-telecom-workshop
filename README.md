# Tamluk Telecom – Computer Workshop Management System

A full-stack, secure government-style web application for the Purba Medinipur District Police to manage computer repair requests and item requisitions from various Police Stations and Offices.

## Features
- **Frontend**: React (modern UI with Vanilla CSS for glassmorphism styling)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT token-based authentication
- **Passwords**: Encrypted using bcrypt
- **Roles**: Admin, SRIC, Inspector

## Project Structure
```
TC Tamluk/
├── client/          (React Frontend)
│   ├── src/         (Components & Pages)
│   ├── package.json
│   └── vite.config.js
└── server/          (Express Backend)
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js    (Entry Point)
    ├── package.json
    └── seed.js      (Seed admin users)
```

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port `27017` (or provide `MONGO_URI` in `.env`)

### 1. Backend Setup
1. Open a new terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. (Optional) Run the seed script to create default admin users:
   ```bash
   node seed.js
   ```
   **Default Users Created**:
   - `admin` / `admin123` (Role: Admin)
   - `sric` / `admin123` (Role: SRIC)
   - `inspector` / `admin123` (Role: Inspector)

3. Start the server:
   ```bash
   node server.js
   ```
   *The server should now be running on `http://localhost:5000`*

### 2. Frontend Setup
1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Start the React development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`*

## Security Points
- All API routes handling sensitive modifications are protected via JWT middleware.
- Role-based middleware ensures only `Admin`, `SRIC`, and `Inspector` can update or view requests in the dashboard.
- Admin role can delete requests.
