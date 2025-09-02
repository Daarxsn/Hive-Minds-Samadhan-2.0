# Authentication Basics (Backend Only)

## How to Run
1. Install dependencies:
   npm install

2. Start the server:
   npm run dev

3. Server runs on:
   http://localhost:5000

## Routes

### Register
POST /api/register
Body (JSON):
{
  "email": "asha@example.com",
  "password": "secret123"
}

### Login
POST /api/login
Body (JSON):
{
  "email": "asha@example.com",
  "password": "secret123"
}
→ Returns a JWT token.

### Get Current User (Protected)
GET /api/me
Headers:
Authorization: Bearer <your-token-here>
