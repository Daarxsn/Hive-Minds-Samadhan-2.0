import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

export default function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // join the chat (called when user enters name)
  const joinChat = () => {
    if (!username.trim()) return alert('Please enter your name');

    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('connected', socketRef.current.id);
      socketRef.current.emit('join', username);
    });

    socketRef.current.on('users', (list) => setUsers(list));
    socketRef.current.on('message_history', (history) => setMessages(history || []));
    socketRef.current.on('message', (m) => setMessages((prev) => [...prev, m]));

    setLoggedIn(true);
  };

  // send a message
  const sendMessage = () => {
    if (!message.trim()) return;
    if (!socketRef.current) return;

    socketRef.current.emit('message', message);
    setMessage('');
  };

  // disconnect socket when user closes or refreshes the page
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  if (!loggedIn) {
    return (
      <div className="login-wrapper">
        <h2>Welcome — enter your name to join</h2>
        <input
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinChat}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h3>Online</h3>
        <ul>
          {users.map((u, idx) => (
            <li key={idx}>{u}</li>
          ))}
        </ul>
      </div>

      <div className="chat">
        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className="message">
              <div className="meta">
                {m.user} • {new Date(m.time).toLocaleTimeString()}
              </div>
              <div className="text">{m.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="composer">
          <input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
