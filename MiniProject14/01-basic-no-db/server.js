// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, nextIdRef } = require('./users');


const app = express();
app.use(cors());
app.use(express.json());


const { PORT = 5000, JWT_SECRET = 'dev-secret' } = process.env;


function safeUser(u) {
return { id: u.id, name: u.name, email: u.email };
}

// POST /api/register
app.post('/api/register', async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) {
return res.status(400).json({ error: 'name, email, password are required' });
}
if (password.length < 6) {
return res.status(400).json({ error: 'password must be at least 6 characters' });
}
const exists = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
if (exists) {
return res.status(409).json({ error: 'email already registered' });
}
const passwordHash = await bcrypt.hash(password, 10);
const newUser = { id: nextIdRef.value++, name, email: String(email).toLowerCase(), passwordHash };
users.push(newUser);
return res.status(201).json({ message: 'registered', user: safeUser(newUser) });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'server error' });
}
});


// POST /api/login
app.post('/api/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) {
return res.status(400).json({ error: 'email and password are required' });
}
const user = users.find(u => u.email === String(email).toLowerCase());
if (!user) return res.status(401).json({ error: 'invalid credentials' });


const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ error: 'invalid credentials' });


const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
return res.json({ message: 'logged in', token });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'server error' });
}
});




// auth middleware
function auth(req, res, next) {
const header = req.headers['authorization'] || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) return res.status(401).json({ error: 'missing token' });
try {
const payload = jwt.verify(token, JWT_SECRET);
req.user = payload; // { userId }
next();
} catch (e) {
return res.status(401).json({ error: 'invalid or expired token' });
}
}


// GET /api/me (protected)
app.get('/api/me', auth, (req, res) => {
const me = users.find(u => u.id === req.user.userId);
if (!me) return res.status(404).json({ error: 'user not found' });
return res.json({ user: safeUser(me) });
});


app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));