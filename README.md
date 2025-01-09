# Real-time Chat Application

A simple, real-time chat application built with React, Express, Socket.IO, and MongoDB.

## Tech Stack

- **Frontend**: React, Socket.IO Client
- **Backend**: Express.js, Socket.IO
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Package Manager**: Bun

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher) or [Bun](https://bun.sh/) runtime
- [MongoDB](https://www.mongodb.com/) (local or Atlas cluster)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/y3eet/realtime-chat-app.git
cd realtime-chat-app
```

2. Create a `.env` file in the server directory:
```bash
cd server
touch .env
```

3. Add the following environment variables to `server/.env`:
```plaintext
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
CLIENT_URL=http://localhost:4173
```

## Installation

1. Install server dependencies:
```bash
cd server
bun install
```

2. Install client dependencies:
```bash
cd ../client
bun install
```

## Running the Application

1. Start the client development server:
```bash
cd client
bun run start
```

2. Start the backend server:
```bash
cd server
bun start
```

The application should now be running at:
- Frontend: `http://localhost:4173` or `(dev) http://localhost:5173`
- Backend: `http://localhost:5000`