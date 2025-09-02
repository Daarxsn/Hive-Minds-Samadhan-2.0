// users.js
// This is JUST for learning. Data resets when server restarts.


const users = []; // { id, name, email, passwordHash }
let nextId = 1;


module.exports = {
users,
nextIdRef: { get value() { return nextId; }, set value(v) { nextId = v; } }
};