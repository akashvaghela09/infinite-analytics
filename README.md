# Infinite Analytics

A full-stack analytics dashboard built with the MERN stack (MongoDB, Express, React, Node.js).

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit, Plotly.js
- **Backend:** Node.js, Express, Mongoose, Passport.js (Google OAuth + local auth)
- **Database:** MongoDB

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)
- A [Google Cloud Platform](https://console.cloud.google.com/) project with OAuth 2.0 credentials (for Google login)
- An [ImgBB](https://imgbb.com/) API key (for image uploads)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/akashvaghela09/infinite-analytics.git
cd infinite-analytics
```

### 2. Install dependencies

Install all dependencies for the root, server, and client in one go:

```bash
npm run install:all
```

### 3. Configure environment variables

The project uses two `.env` files — one for the server and one for the client. Example files are provided; copy them and fill in the required values.

#### Server environment (`server/.env`)

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set the following variables:

| Variable               | Description                              | Example                                          |
| ---------------------- | ---------------------------------------- | ------------------------------------------------ |
| `NODE_ENV`             | Application environment                  | `development`                                    |
| `PORT`                 | Server port                              | `5000`                                           |
| `MONGODB_URI`          | MongoDB connection string                | `mongodb://localhost:27017/infinite-analytics`   |
| `JWT_SECRET`           | Secret key for JWT tokens (min 32 chars) | `your_jwt_secret_min_32_characters_long`         |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                   | `your_client_id.apps.googleusercontent.com`      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret               | `your_client_secret`                             |
| `GOOGLE_CALLBACK_URL`  | OAuth callback URL                       | `http://localhost:5000/api/auth/google/callback` |
| `IMGBB_API_KEY`        | ImgBB API key for image uploads          | `your_imgbb_api_key`                             |
| `CLIENT_URL`           | Frontend URL (for CORS)                  | `http://localhost:5173`                          |

#### Client environment (`client/.env`)

```bash
cp client/.env.example client/.env
```

| Variable            | Description          | Example                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

### 4. Run the application

Start both the server and client concurrently:

```bash
npm run dev
```

- **Server** runs on `http://localhost:5000`
- **Client** runs on `http://localhost:5173`

Alternatively, start each independently:

```bash
npm run server   # Start Express backend only
npm run client   # Start Vite frontend only
```
