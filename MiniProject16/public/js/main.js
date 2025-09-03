async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const list = document.getElementById('product-list');
  list.innerHTML = products.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <strong>₹${p.price}</strong><br>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function setCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.quantity++;
  else cart.push({ id, quantity: 1 });
  setCart(cart);
  updateCount();
}

function updateCount() {
  document.getElementById('cart-count').innerText = getCart().reduce((s,i)=>s+i.quantity,0);
}

document.addEventListener('DOMContentLoaded', () => { loadProducts(); updateCount(); });

