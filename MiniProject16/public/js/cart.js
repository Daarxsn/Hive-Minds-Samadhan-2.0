function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function setCart(c) { localStorage.setItem('cart', JSON.stringify(c)); }

async function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-container');
  if (!cart.length) return container.innerHTML = '<p>Cart empty</p>';

  const details = await Promise.all(cart.map(i => fetch('/api/products/'+i.id).then(r=>r.json())));
  container.innerHTML = details.map((p, idx) => `
    <div>
      ${p.name} - ₹${p.price} x ${cart[idx].quantity}
    </div>
  `).join('');
}

document.getElementById('checkout-btn').addEventListener('click', async () => {
  const items = getCart();
  const res = await fetch('/checkout', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ items })
  });
  const data = await res.json();
  window.location = data.url;
});

renderCart();

