// <confirm-button> — wraps a submit button, intercepts click to show confirmation
class ConfirmButton extends HTMLElement {
  connectedCallback() {
    const btn = this.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      if (!confirm('are you sure?')) {
        e.preventDefault();
      }
    });
  }
}
customElements.define('confirm-button', ConfirmButton);

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
