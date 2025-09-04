
// Get data from localStorage or set defaults
let users = JSON.parse(localStorage.getItem('users') || '["Alice","Bob"]');
let posts = JSON.parse(localStorage.getItem('posts') || '[]');
let currentUser = users[0];

// DOM Elements
const userSelect = document.getElementById('userSelect');
const filterUserSelect = document.getElementById('filterUser');
const postsContainer = document.getElementById('postsContainer');
const notifications = document.getElementById('notifications');

// Avatar colors
const avatarColors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#FF6EC7'];

// ===== Render Users =====
function renderUsers() {
  userSelect.innerHTML = '';
  filterUserSelect.innerHTML = '<option value="all">All Users</option>';

  users.forEach((user) => {
    const opt = document.createElement('option');
    opt.value = user;
    opt.textContent = user;
    userSelect.appendChild(opt);

    const opt2 = document.createElement('option');
    opt2.value = user;
    opt2.textContent = user;
    filterUserSelect.appendChild(opt2);
  });

  userSelect.value = currentUser;
}

// ===== Add New User =====
function addUser() {
  const name = prompt("Enter new username:");
  if (name && !users.includes(name)) {
    users.push(name);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    addNotification(`${name} added as a new user`);
  }
}

// ===== Event Listeners =====
userSelect.addEventListener('change', () => currentUser = userSelect.value);
filterUserSelect.addEventListener('change', renderPosts);

// ===== Dark Mode Toggle =====
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

// ===== Notifications =====
function addNotification(msg) {
  const notif = document.createElement('div');
  notif.textContent = msg;
  notifications.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ===== Create Post =====
function createPost() {
  const content = document.getElementById('postContent').value.trim();
  const imageFile = document.getElementById('postImage').files[0];

  if (!content && !imageFile) return alert("Write something or select an image!");

  let imageURL = '';
  if (imageFile) imageURL = URL.createObjectURL(imageFile);

  const post = {
    id: Date.now(),
    user: currentUser,
    content,
    image: imageURL,
    timestamp: new Date(),
    likes: 0,
    likedBy: [],
    comments: [],
    reactions: [] // store emoji reactions
  };

  posts.unshift(post);
  localStorage.setItem('posts', JSON.stringify(posts));

  document.getElementById('postContent').value = '';
  document.getElementById('postImage').value = '';

  addNotification(`${currentUser} created a post`);
  renderPosts();
}

// ===== Like Post =====
function likePost(id) {
  const post = posts.find(p => p.id === id);
  if (!post.likedBy) post.likedBy = [];

  if (post.likedBy.includes(currentUser)) {
    post.likes--;
    post.likedBy = post.likedBy.filter(u => u !== currentUser);
  } else {
    post.likes++;
    post.likedBy.push(currentUser);
  }

  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// ===== Add Comment =====
function addComment(postId) {
  const text = prompt("Enter comment:");
  if (!text) return;

  const post = posts.find(p => p.id === postId);
  post.comments.push({ user: currentUser, text, likes: 0, likedBy: [] });

  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// ===== Like Comment =====
function likeComment(postId, commentIdx) {
  const post = posts.find(p => p.id === postId);
  const comment = post.comments[commentIdx];

  if (!comment.likedBy) comment.likedBy = [];

  if (comment.likedBy.includes(currentUser)) {
    comment.likes--;
    comment.likedBy = comment.likedBy.filter(u => u !== currentUser);
  } else {
    comment.likes++;
    comment.likedBy.push(currentUser);
  }

  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// ===== Time Ago =====
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  const mins = Math.floor(seconds / 60); if (mins < 60) return mins + ' min ago';
  const hours = Math.floor(mins / 60); if (hours < 24) return hours + ' hrs ago';
  const days = Math.floor(hours / 24); return days + ' days ago';
}

// ===== React to Post =====
function reactPost(id, emoji) {
  const post = posts.find(p => p.id === id);
  if (!post.reactions) post.reactions = [];
  post.reactions.push({ user: currentUser, emoji });

  addNotification(`${currentUser} reacted ${emoji}`);
  localStorage.setItem('posts', JSON.stringify(posts));
  renderPosts();
}

// ===== Render Posts =====
function renderPosts() {
  postsContainer.innerHTML = '';
  const filter = filterUserSelect.value;
  const filtered = filter === 'all' ? posts : posts.filter(p => p.user === filter);

  filtered.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';

    const avatarLetter = post.user.charAt(0);
    const avatarColor = avatarColors[users.indexOf(post.user) % avatarColors.length];

    // Render post HTML
    div.innerHTML = `
      <div class="post-header">
        <div class="avatar" style="background:${avatarColor}">${avatarLetter}</div>
        <strong>${post.user}</strong>
        <span class="post-timestamp">${timeAgo(new Date(post.timestamp))}</span>
      </div>
      <p>${post.content}</p>
      ${post.image ? `<img src="${post.image}" />` : ''}
      <div class="post-actions">
        <button class="like-btn ${post.likedBy.includes(currentUser) ? 'liked' : ''}" onclick="likePost(${post.id})">❤️ ${post.likes}</button>
        <button onclick="addComment(${post.id})">💬 Comment</button>
      </div>
      <div class="reactions">
        <span onclick="reactPost(${post.id},'❤️')">❤️</span>
        <span onclick="reactPost(${post.id},'😂')">😂</span>
        <span onclick="reactPost(${post.id},'😮')">😮</span>
        <span onclick="reactPost(${post.id},'👍')">👍</span>
      </div>
      <div class="comment-section">
        ${post.comments.map((c, i) => `
          <div class="comment">
            <span><strong>${c.user}:</strong> ${c.text} (${c.likes})</span>
            <button onclick="likeComment(${post.id},${i})">❤️</button>
          </div>
        `).join('')}
      </div>
    `;

    postsContainer.appendChild(div);
  });
}

// ===== Initial Render =====
renderUsers();
renderPosts();
