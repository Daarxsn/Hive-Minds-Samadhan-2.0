<div className="chat-container">
  <div className="sidebar">
    <h2>Online</h2>
    <ul>
      {users.map((user, idx) => (
        <li key={idx}>{user}</li>
      ))}
    </ul>
  </div>

  <div className="messages">
    <div>
      {messages.map((msg, idx) => (
        <div key={idx} className="message">
          <strong>{msg.user}</strong> • {msg.time}
          <p>{msg.text}</p>
        </div>
      ))}
    </div>

    <div className="input-box">
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
</div>
