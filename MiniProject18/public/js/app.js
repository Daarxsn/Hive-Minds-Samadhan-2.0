const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

let boardData = null;

async function fetchBoard() {
  const res = await fetch("/api/board");
  return res.json();
}

async function createCard(listId, title, assignee) {
  const res = await fetch("/api/cards", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ list_id: listId, title, assignee })
  });
  return res.json();
}

async function deleteCard(id) {
  await fetch(`/api/cards/${id}`, { method:"DELETE" });
}

async function moveCard(id, toListId, toPosition) {
  await fetch(`/api/cards/${id}/move`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ to_list_id: toListId, to_position: toPosition })
  });
}

async function createList(name) {
  const res = await fetch("/api/lists", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ name })
  });
  return res.json();
}

function renderBoard(data) {
  boardData = data; // keep for progress calc
  const board = qs("#board");
  board.innerHTML = "";
  const listTpl = qs("#listTemplate");
  const cardTpl = qs("#cardTemplate");

  data.lists.forEach(list => {
    const $list = listTpl.content.firstElementChild.cloneNode(true);
    qs(".list-title", $list).textContent = list.name;
    const $cards = qs(".cards", $list);
    $cards.dataset.listId = list.id;

    // add cards
    list.cards.forEach(card => {
      const $c = cardTpl.content.firstElementChild.cloneNode(true);
      $c.dataset.cardId = card.id;
      qs(".card-title-text", $c).textContent = card.title;
      qs(".assignee", $c).textContent = card.assignee || "Unassigned";

      // drag events
      $c.addEventListener("dragstart", onDragStart);
      $c.addEventListener("dragend", onDragEnd);
      qs(".delete-card", $c).addEventListener("click", async () => {
        await deleteCard(card.id);
        await loadAndRender();
      });

      $cards.appendChild($c);
    });

    // add card UI
    const addBtn = qs(".add-card-btn", $list);
    addBtn.addEventListener("click", async () => {
      const titleInput = qs(".card-title", $list);
      const assigneeInput = qs(".card-assignee", $list);
      const title = titleInput.value.trim();
      const assignee = assigneeInput.value.trim();
      if (!title) return;
      await createCard(list.id, title, assignee);
      titleInput.value = "";
      assigneeInput.value = "";
      await loadAndRender();
    });

    // drop zone events
    $cards.addEventListener("dragover", onDragOver);
    $cards.addEventListener("dragleave", onDragLeave);
    $cards.addEventListener("drop", onDrop);

    board.appendChild($list);
  });

  updateProgress();
}

function updateProgress() {
  // Treat cards in list named 'Done' as completed
  if (!boardData) return;
  const allCards = boardData.lists.flatMap(l => l.cards);
  const total = allCards.length;
  const doneList = boardData.lists.find(l => l.name.toLowerCase() === "done");
  const done = doneList ? doneList.cards.length : 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  qs("#progressFill").style.width = `${pct}%`;
  qs("#progressText").textContent = `${pct}% complete`;
}

// DnD
let dragged = null;

function onDragStart(e) {
  dragged = e.currentTarget;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", dragged.dataset.cardId);
  setTimeout(() => dragged.classList.add("dragging"), 0);
}
function onDragEnd() {
  if (dragged) dragged.classList.remove("dragging");
  dragged = null;
}

function onDragOver(e) {
  e.preventDefault();
  this.classList.add("drag-over");
  const after = getDragAfterElement(this, e.clientY);
  const card = qs(".dragging");
  if (!card) return;
  if (after == null) {
    this.appendChild(card);
  } else {
    this.insertBefore(card, after);
  }
}
function onDragLeave() {
  this.classList.remove("drag-over");
}
async function onDrop(e) {
  e.preventDefault();
  this.classList.remove("drag-over");

  const toListId = parseInt(this.dataset.listId, 10);
  const order = qsa(".card", this).map((el, i) => ({ id: +el.dataset.cardId, pos: i }));
  const movedId = +e.dataTransfer.getData("text/plain");
  const toPos = order.find(o => o.id === movedId)?.pos ?? order.length;

  await moveCard(movedId, toListId, toPos);
  await loadAndRender();
}

function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll(".card:not(.dragging)")];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

async function loadAndRender() {
  const data = await fetchBoard();
  renderBoard(data);
}

document.addEventListener("DOMContentLoaded", async () => {
  // add new list
  qs("#addListBtn").addEventListener("click", async () => {
    const name = qs("#newListName").value.trim();
    if (!name) return;
    await createList(name);
    qs("#newListName").value = "";
    await loadAndRender();
  });

  await loadAndRender();
});

