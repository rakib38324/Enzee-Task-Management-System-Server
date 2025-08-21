# 📝  Welcome to Enzee Task Management System

This is an **individual personal task management system** built with **Express.js**, **TypeScript**, **MongoDB**, and **JWT authentication**.  
It enables users to securely manage their tasks, featuring authentication, email verification, and CRUD operations for tasks.

---
### Backend Live Link
```
https://enzee-task-management-system-server.onrender.com
```
### Frontend Live Link
```
https://enzee-task-management-frontend.vercel.app
```
### Frontend GitHub Link
```
https://github.com/rakib38324/Enzee-Task-Management-System-Frontend
```
### API Documentation
```
https://documenter.getpostman.com/view/31202574/2sB3BLhS3H
```

## 🚀 Features

- 🔐 **User Authentication**
  - Signup  
  - Login  
  - Forget Password & Reset Password  
  - Email Verification System  

- 📝 **Task Management**
  - Create Task  
  - Update Task  
  - Update Task Status (e.g., Pending → Completed)  
  - Delete Task
  - After completing the task, find the notification in your email.

---
### Project Structure
```
backend/
├── src/
│   ├── app/
│   │   ├── config/         # Environment configuration
│   │   ├── errors/         # Global error handling
│   │   ├── interface/      # Global interface declarations
│   │   ├── middlewares/    # Middlewares (auth, error handling, etc.)
│   │   ├── models/         # Mongoose Schemas
│   │   │   ├── Auth/       # Auth Module
│   │   │   |   ├── controller/   # Auth controllers
│   │   │   |   ├── interface/    # Auth-related interfaces
│   │   │   |   ├── router/       # Auth routes
│   │   │   |   ├── service/      # Auth services (business logic)
│   │   │   |   └── validation/   # Auth input validation
│   │   │   ├── UserRegistration/       # User Registration Module
│   │   │   |   ├── controller/   # User Registration controllers
│   │   │   |   ├── interface/    # User Registration-related interfaces
│   │   │   |   ├── router/       # User Registration routes
│   │   │   |   ├── service/      # User Registration services (business logic)
│   │   │   |   └── validation/   # User Registration input validation
│   │   │   └── Task/       # task Module
│   │   │       ├── controller/   # task controllers
│   │   │       ├── interface/    # task-related interfaces
│   │   │       ├── router/       # task routes
│   │   │       ├── service/      # task services (business logic)
│   │   │       └── validation/   # task input validation
│   │   ├── routers/        # API Routes entry point
│   │   └── utils/          # Utility functions (email, tokens, helpers)
│   │
│   ├── server.ts           # Server setup (Render entry point)
│   └── app.ts              # Main app initialization
│
├── dist/                   # Compiled JavaScript (after build)
├── package.json
└── tsconfig.json


```
## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rakib38324/Enzee-Task-Management-System-Server.git
cd Enzee-Task-Management-System-Server
```

### 2. Install resources
```bash
npm install
```

### 3. .env file structure
```
NODE_ENV=development
PORT=5000

DATABASE_URL=Your MongoDB database URL

BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=5ee2e2a94b5ad5d2510182ff9b1bb473440e8ef8abcf82a31a5c24dd616237f4b433c312050f6d989f22f95ee6e9db32ba0a7796caca455f87984bd6f5977a87
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_SECRET=b60d48feca045bae433b3d6cdbd40709b4c96f8a4c0f8dcf6a4c47c04d936251b6939b644ab39937006cdc9ca250bf880d35830f710e8944a225c428896be660
JWT_REFRESH_EXPIRES_IN=1d
EMAIL_VERIFICATION_UI_LINK=frontend_live_link/email-verification
RESET_PASSWORD_UI_LINK=frontend_live_link/reset-password
CLIENT_UI_LINK=frontend_live_link

```

 ### 4. Start in development
```bash
npm run start:dev
```

 ### 6. Start in production
```bash
npm run build
npm start
```

# 🛠️ Design Choices

Email Verification System: Implemented to ensure only valid users can access the platform and to enhance account security.

JWT Authentication: Chosen for stateless, scalable authentication. Tokens are generated for access and refresh sessions.

Express + TypeScript: Provides type safety and a better developer experience.

MongoDB (Mongoose): Flexible document-based database for storing user and task data.

Separation of Concerns: Authentication, middleware, and task management are modularized for a clean architecture.

# ⚖️ Trade-offs & Assumptions

JWT over Sessions:
I chose JWT tokens for security and scalability. They allow stateless authentication, but the trade-off is that token invalidation is harder compared to session-based auth.

Access & Refresh Tokens:
I used short-lived access tokens for requests and long-lived refresh tokens for renewing sessions, balancing security vs. usability.

Email Provider Assumption:
Assumed that SMTP credentials (e.g., Gmail, SendGrid) would be available for email verification and password reset flows.

# ⚡ Challenges

Email Sending Issue on Vercel
When deploying the backend on Vercel, the email service did not work properly because serverless functions restrict long-running connections (like SMTP).

✅ Solution: I deployed the backend on Render, which supports persistent connections and SMTP, and kept the frontend on Vercel. This solved the email verification & password reset issue.

CORS Configurations
Had to explicitly configure CORS in Express to allow communication between frontend (Next.js) and backend (Render).

# ✅ Need Future Improvements

Add task categories & priority levels.

Add real-time updates with WebSockets (Socket.IO).

Implement unit & integration tests with Jest.

Deploy frontend (Next.js) + backend (Express) together in Docker for easier scaling.
