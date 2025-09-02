# Authentication Basics (Backend with MongoDB)

## How to Run
1. Install dependencies:
   npm install

2. Create a `.env` file in the project folder with:
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   MONGO_URI=your_mongo_connection_string_here

3. Start the server:
   npm run dev

4. Server runs on:
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

### Notes
- Requires MongoDB Atlas (or local MongoDB) connection via `MONGO_URI`.
- Users are saved in the `users` collection in your database.
