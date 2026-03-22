// <confirm-button> — wraps a submit button, intercepts click to show confirmation
// Use data-message attribute for custom confirm text
class ConfirmButton extends HTMLElement {
  connectedCallback() {
    const btn = this.querySelector('button');
    if (!btn) return;
    const message = this.getAttribute('data-message') || 'are you sure?';
    btn.addEventListener('click', (e) => {
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  }
}
customElements.define('confirm-button', ConfirmButton);

// Flash auto-dismiss
(() => {
  const flash = document.getElementById('admin-flash');
  if (!flash) return;
  setTimeout(() => {
    flash.style.transition = 'opacity 0.3s';
    flash.style.opacity = '0';
    setTimeout(() => flash.remove(), 300);
  }, 5000);
})();

// Bulk select / delete
(() => {
  const selectAll = document.getElementById('select-all');
  const deleteBtn = document.getElementById('bulk-delete-btn');
  if (!selectAll || !deleteBtn) return;

  const checkboxes = () => document.querySelectorAll('#bulk-form input[name="pk"]');

  function updateDeleteBtn() {
    const checked = document.querySelectorAll('#bulk-form input[name="pk"]:checked');
    deleteBtn.disabled = checked.length === 0;
    deleteBtn.textContent = checked.length > 0
      ? `delete selected (${checked.length})`
      : 'delete selected';
  }

  selectAll.addEventListener('change', () => {
    checkboxes().forEach((cb) => { cb.checked = selectAll.checked; });
    updateDeleteBtn();
  });

  document.getElementById('bulk-form').addEventListener('change', (e) => {
    if (e.target.name === 'pk') updateDeleteBtn();
  });
})();
