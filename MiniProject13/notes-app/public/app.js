// public/app.js
const list = document.getElementById('notes-list');
const form = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');

async function loadNotes() {
  const res = await fetch('/api/notes');
  const notes = await res.json();
  render(notes);
}

function render(notes) {
  list.innerHTML = '';
  notes.forEach(n => {
    const li = document.createElement('li');
    li.className = 'note';
    li.innerHTML = `
      <div class="content">
        <p class="note-title">${escapeHTML(n.title)}</p>
        <p>${escapeHTML(n.body)}</p>
        <small>id: ${n.id} • ${new Date(n.created_at).toLocaleString()}</small>
        <div class="row">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      </div>
    `;

    // Edit
    li.querySelector('.edit').onclick = async () => {
      const newTitle = prompt('New title:', n.title);
      if (newTitle === null) return;
      const newBody = prompt('New body:', n.body);
      if (newBody === null) return;

      const res = await fetch(`/api/notes/${n.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, body: newBody })
      });
      if (!res.ok) return alert('Update failed');
      loadNotes();
    };

    // Delete
    li.querySelector('.delete').onclick = async () => {
      if (!confirm('Delete this note?')) return;
      const res = await fetch(`/api/notes/${n.id}`, { method: 'DELETE' });
      if (res.status !== 204) return alert('Delete failed');
      loadNotes();
    };

    list.appendChild(li);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const payload = { title: titleInput.value.trim(), body: bodyInput.value.trim() };
  if (!payload.title || !payload.body) return;

  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) return alert('Create failed');

  form.reset();
  loadNotes();
};

// Simple escape to avoid HTML injection in our tiny demo
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[s]));
}

loadNotes();
