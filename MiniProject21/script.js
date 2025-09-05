// small interactivity: modal & year
document.getElementById('year').textContent = new Date().getFullYear();

// modal open/close
const profileCard = document.getElementById('profileCard');
const modal = document.getElementById('profileModal');
const closeModal = document.getElementById('closeModal');

if (profileCard && modal) {
  profileCard.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'false');
  });
}
if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
  });
}
// close when clicking outside content
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.setAttribute('aria-hidden', 'true');
});
