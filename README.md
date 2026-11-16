Authentication API – Node.js, Express & Supabase

A RESTful Authentication API built using **Node.js**, **Express.js**, and **Supabase Auth**. This project implements user signup, login, logout, and protected routes using Supabase JWT access-token verification.

It also includes interactive API documentation using Swagger UI.

## Features

- User registration (Signup)
- User login with email and password
- User logout
- JWT-based authentication
- Protected API routes using reusable authentication middleware
- Access-token verification through Supabase Auth
- Public and protected endpoints
- Interactive API documentation using Swagger UI

## Technologies Used

- Node.js
- Express.js
- Supabase
- Supabase Auth
- Swagger UI Express
- YAML (OpenAPI Specification)
- Thunder Client

## Project Structure

text
week-4/
├── server.js
├── openapi.yaml
├── package.json
├── package-lock.json
├── .env
└── .gitignore


## Installation and Setup

### 1. Clone the Repository

bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd week-4


### 2. Install Dependencies

bash
npm install


### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_publishable_key


Replace the placeholder values with your Supabase project credentials.

**Important:** Never commit your `.env` file or expose your Supabase credentials publicly.

### 4. Start the Server

bash
node server.js

The server will run at:
http://localhost:3000

## API Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Authenticate an existing user | No |
| POST | `/auth/logout` | Logout the authenticated user | Yes |
| GET | `/public/info` | Retrieve public information | No |
| GET | `/protected/profile` | Retrieve authenticated user profile | Yes |

## Authentication

Protected endpoints require a valid Supabase access token.

Include the following header in protected requests:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The reusable `verifyToken` middleware validates the access token using:

```javascript
supabase.auth.getUser(token)
```

If the token is valid, authenticated user information is attached to the request object, allowing access to protected resources.

Invalid, missing, or expired tokens are rejected.

## Swagger API Documentation

This project uses Swagger UI to provide interactive API documentation.

After starting the server, visit:

**http://localhost:3000/docs**

Swagger UI allows you to:

- Explore available API endpoints.
- View request parameters and response formats.
- Execute API requests directly from the browser.
- Authenticate using a Supabase access token through the Authorize button.
- Test protected endpoints.

The API documentation is defined in `openapi.yaml`.

## Testing

API endpoints were tested using:

- Thunder Client
- Swagger UI

Testing includes user registration, login, public endpoint access, protected endpoint access, and authentication failure scenarios.

## Security

- Environment variables are used to store Supabase project credentials.
- `.env` is excluded from version control.
- Protected routes use reusable JWT verification middleware.
- Invalid or expired access tokens are rejected.
- Supabase Auth handles user authentication.

## Project Goal

The goal of this project is to understand and implement backend authentication workflows, JWT verification, middleware-based route protection, and API documentation using Swagger UI.
:::
