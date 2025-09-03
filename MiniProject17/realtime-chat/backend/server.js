// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // allow browser to connect in development

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite dev server URL
    methods: ['GET', 'POST']
  }
});

// In-memory data (keeps things simple)
let users = {}; // socketId -> username
let messages = []; // array of { id, user, text, time }
const MAX_HISTORY = 50;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // When a client tells us their name
  socket.on('join', (username) => {
    users[socket.id] = username || 'Anonymous';

    // send the current user list to everyone
    io.emit('users', Object.values(users));

    // send recent chat history to the newly connected socket
    socket.emit('message_history', messages);
  });

  // When a message comes from a client
  socket.on('message', (text) => {
    const message = {
      id: Date.now(),
      user: users[socket.id] || 'Anonymous',
      text: text,
      time: new Date().toISOString()
    };

    // keep history limited
    messages.push(message);
    if (messages.length > MAX_HISTORY) messages.shift();

    // broadcast the new message to everyone
    io.emit('message', message);
  });

  // When someone disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    delete users[socket.id];
    io.emit('users', Object.values(users));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port', PORT));
