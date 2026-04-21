# Split Backend API

Production-ready Express + TypeScript + Prisma (MongoDB) backend for authentication and panel layout persistence.

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Run Commands](#run-commands)
7. [Authentication Guide](#authentication-guide)
8. [API Reference](#api-reference)
9. [Error Response Format](#error-response-format)
10. [Troubleshooting](#troubleshooting)

## Overview
This backend provides:
- User registration and login with JWT.
- Profile and password management.
- Forgot-password flow with OTP email verification.
- Panel layout save/load per user.

Base URL:

```text
http://localhost:5000/api/v1
```

## Tech Stack
- Node.js
- Express
- TypeScript
- Prisma ORM
- MongoDB
- Zod validation
- JWT authentication
- Nodemailer (SMTP)

## Project Structure

```text
src/
	app/
		middlewares/
		modules/
			Auth/
			User/
			PanelLayout/
		routes/
	config/
	errors/
	helpers/
	interfaces/
	shared/
```

## Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd splitter_builder/split_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment
Create `.env` in `split_backend/` and copy this template.

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"

BCRYPT_SALT_ROUNDS=12

JWT_SECRET="your_jwt_secret"
EXPIRES_IN="7d"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_TOKEN_EXPIRES_IN="30d"

RESET_PASS_TOKEN="your_reset_pass_token_secret"
RESET_PASS_TOKEN_EXPIRES_IN="5m"
RESET_PASS_LINK="http://localhost:3001/reset-password"

EMAIL="your-sender-email@example.com"
BREVO_PASS="your-email-app-password"

# Optional SMTP overrides
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-sender-email@example.com"
SMTP_PASS="your-email-app-password"
SMTP_FROM="your-sender-email@example.com"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/
```

## Environment Variables
Required:
- `PORT`
- `DATABASE_URL`
- `BCRYPT_SALT_ROUNDS`
- `JWT_SECRET`
- `EXPIRES_IN`
- `RESET_PASS_TOKEN`
- `RESET_PASS_TOKEN_EXPIRES_IN`
- `EMAIL` and `BREVO_PASS` (or `SMTP_USER` and `SMTP_PASS`) for OTP mail sending

Optional:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`
- `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_IN`, `RESET_PASS_LINK`

## Run Commands

| Command | Description |
|---|---|
| `npm run dev` | Run dev server with auto-reload |
| `npm run build` | Build TypeScript to `dist/` |
| `npm start` | Run built server |
| `npm run generate` | Run module generator (TS) |
| `npm run cModule` | Run module generator (JS script) |

## Authentication Guide
Protected routes require `Authorization` header with the raw JWT token.

Example:

```http
Authorization: <jwt-token>
```

Note: Login/Register also set an `httpOnly` cookie named `token`, but route middleware currently validates `Authorization` header.

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth

#### `POST /auth/login`
Login with email/password.

Request body:

```json
{
	"email": "user@example.com",
	"password": "123456"
}
```

#### `POST /auth/logout`
Logout current user (clears cookie).

#### `GET /auth/profile`
Get current user profile.

Headers:

```http
Authorization: <jwt-token>
```

#### `PUT /auth/change-password`
Change current password.

Headers:

```http
Authorization: <jwt-token>
```

Request body:

```json
{
	"oldPassword": "old-pass",
	"newPassword": "new-pass"
}
```

#### `POST /auth/forgot-password`
Send reset OTP to user email.

Request body:

```json
{
	"email": "user@example.com"
}
```

#### `POST /auth/verify-forgot-password`
Verify OTP for reset flow.

Request body:

```json
{
	"email": "user@example.com",
	"otp": "123456"
}
```

#### `POST /auth/reset-password`
Reset password after OTP verification.

Request body:

```json
{
	"email": "user@example.com",
	"newPassword": "new-pass-123"
}
```

#### `POST /auth/send-otp`
Send verification OTP by email.

Request body:

```json
{
	"email": "user@example.com"
}
```

### Users

#### `POST /users/register`
Create/register a new user.

Request body:

```json
{
	"name": "Azad",
	"email": "azad@example.com",
	"password": "123456"
}
```

#### `POST /users/verify-otp`
Verify OTP and complete registration flow.

Request body:

```json
{
	"email": "user@example.com",
	"otp": "123456"
}
```

#### `GET /users/`
Get all users (ADMIN / SUPER_ADMIN only).

Headers:

```http
Authorization: <jwt-token>
```

#### `PUT /users/profile`
Update own profile.

Headers:

```http
Authorization: <jwt-token>
```

Request body (partial update):

```json
{
	"name": "Updated Name",
	"email": "updated@example.com",
	"profileImage": "https://...",
	"phoneNumber": "01234567890"
}
```

#### `PUT /users/:id`
Update user by ID (ADMIN / SUPER_ADMIN only).

Headers:

```http
Authorization: <jwt-token>
```

### Panel Layout

#### `GET /panel-layout/me`
Get current user layout (returns `null` if none).

Headers:

```http
Authorization: <jwt-token>
```

#### `PUT /panel-layout/me`
Upsert current user layout.

Headers:

```http
Authorization: <jwt-token>
```

Request body:

```json
{
	"layout": {
		"id": 0,
		"type": "leaf",
		"color": "#FF1493"
	}
}
```

## Error Response Format
Typical error shape:

```json
{
	"success": false,
	"message": "An unexpected error occurred!",
	"errorSources": ["Unknown Error"],
	"err": {},
	"stack": "..."
}
```

## Troubleshooting

### 1. OTP/Email Not Sending
- Verify `.env` SMTP values (`SMTP_USER`, `SMTP_PASS`, `EMAIL`).
- For Gmail, use an App Password (not normal account password).

### 2. Unauthorized on Protected Routes
- Ensure `Authorization` header contains a valid JWT token.
- Re-login and retry.

### 3. Prisma/Mongo Connection Issues
- Verify `DATABASE_URL`.
- Run `npx prisma generate` after schema changes.

### 4. Port Already in Use
- Stop existing process on `5000`.
- Or change `PORT` in `.env`.


