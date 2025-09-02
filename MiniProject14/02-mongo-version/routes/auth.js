const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');


const router = express.Router();


function safeUser(u) { return { id: u._id, name: u.name, email: u.email }; }


// POST /api/auth/register
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;
if (!name || !email || !password) {
return res.status(400).json({ error: 'name, email, password are required' });
}
if (password.length < 6) {
return res.status(400).json({ error: 'password must be at least 6 characters' });
}


const existing = await User.findOne({ email: String(email).toLowerCase() });