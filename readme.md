# Blog Application - Backend Documentation

## Overview

Backend server for a multi-role blog app built with Express.js, MongoDB, and Mongoose. Provides APIs for authentication, article management, user handling, and admin controls.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcryptjs
* Multer
* Cloudinary
* CORS
* dotenv
* nodemon

---

## Project Structure

```bash id="4o7izx"
backend/
├── APIs/
├── config/
├── middleware/
├── models/
├── services/
├── server.js
├── package.json
└── .env
```

---

## Installation

```bash id="gquazq"
git clone <repo-url>
cd backend
npm install
npm run dev
```

Server runs at:

```bash id="94mk2o"
http://localhost:4000
```

---

## Environment Variables

```env id="ljq74e"
PORT=4000
MONGO_DB_URL=your_mongodb_url
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

FRONTEND_URL=http://localhost:5173
```

---

## Database Models

### User Model

Fields:

* firstName
* lastName
* email
* password
* role
* isBlocked
* comments
* createdAt

### Article Model

Fields:

* author
* title
* category
* content
* imageUrl
* comments
* status
* createdAt

---

## API Endpoints

### Common APIs

Base: `/common-api`

| Method | Endpoint           | Purpose         |
| ------ | ------------------ | --------------- |
| POST   | `/login`           | User login      |
| GET    | `/logout`          | Logout          |
| PUT    | `/change-password` | Update password |

---

### User APIs

Base: `/user-api`

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/users`               |
| GET    | `/users/:userId`       |
| GET    | `/read-articles`       |
| PUT    | `/articles`            |
| GET    | `/articles/:articleId` |

---

### Author APIs

Base: `/author-api`

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | `/authors`             |
| POST   | `/articles`            |
| PUT    | `/articles`            |
| PATCH  | `/articles/:articleId` |
| GET    | `/articles`            |

---

### Admin APIs

Base: `/admin-api`

| Method | Endpoint        |
| ------ | --------------- |
| POST   | `/admins`       |
| PUT    | `/block-user`   |
| PUT    | `/unblock-user` |

---

## Authentication

JWT-based authentication flow:

1. User logs in
2. Server generates JWT
3. Token stored in cookies/localStorage
4. Protected routes verify token

### Middleware

* `verifyToken.js`
* `checkUser.js`
* `checkAuthor.js`
* `checkAdmin.js`

---

## File Upload

Uses Multer + Cloudinary.

```js id="8c1v4d"
const result = await uploadToCloudinary(file);
```

Returns:

```json id="mr7l8n"
{
  "url": "https://..."
}
```

---

## CORS

Allowed origins:

```js id="09lw7s"
[
  "http://localhost:5173",
  "https://blog-app-frontend.vercel.app"
]
```

---

## Running the Server

### Development

```bash id="h9ocxh"
npm run dev
```

### Production

```bash id="l5mjlwm"
npm start
```

---

## Deployment

Backend configured for Render using `render.yaml`.

### Steps

1. Push to GitHub
2. Connect repo to Render
3. Add environment variables
4. Deploy

---

## API Response Format

### Success

```json id="9ceybd"
{
  "message": "Success",
  "data": {}
}
```

### Error

```json id="f4gwjp"
{
  "message": "Error occurred"
}
```

---

## Security Features

* Password hashing with bcryptjs
* JWT authentication
* Protected routes
* CORS protection
* HTTP-only cookies
* Environment variable security

---

## Common Issues

| Issue                     | Solution            |
| ------------------------- | ------------------- |
| MongoDB connection failed | Verify DB URL       |
| JWT expired               | Login again         |
| Cloudinary upload fails   | Check credentials   |
| CORS error                | Verify frontend URL |

---

## Future Enhancements

* Email verification
* Password reset
* Pagination
* Search & filtering
* Swagger API docs
* Rate limiting
* Unit testing

---

## Version

**Version:** 1.0.0
**Updated:** May 2026
