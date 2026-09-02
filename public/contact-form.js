class ContactForm extends HTMLElement {
  connectedCallback() {
    const sitekey = this.getAttribute('sitekey') || '';
    this._isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    this.innerHTML = `
      <div class="contact-overlay" aria-hidden="true">
        <div class="contact-modal" role="dialog" aria-label="Contact form">
          <div class="contact-modal-header">
            <h2 class="contact-title">Get in touch</h2>
            <button class="contact-close" aria-label="Close">&times;</button>
          </div>
          <form class="contact-form" novalidate>
            <div class="contact-field">
              <label for="contact-name">Your Name</label>
              <input type="text" id="contact-name" name="name" required autocomplete="name" />
            </div>
            <div class="contact-field">
              <label for="contact-email">Email</label>
              <input type="email" id="contact-email" name="email" required autocomplete="email" />
            </div>
            <div class="contact-field">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" name="message" required rows="5"></textarea>
            </div>
            ${sitekey && !this._isDev ? `<div class="cf-turnstile" data-sitekey="${sitekey}" data-size="flexible"></div>` : ''}
            <div class="contact-status" aria-live="polite"></div>
            <button type="submit" class="contact-submit">Send message</button>
          </form>
        </div>
      </div>
    `;

    this._overlay = this.querySelector('.contact-overlay');
    this._form = this.querySelector('.contact-form');
    this._status = this.querySelector('.contact-status');
    this._closeBtn = this.querySelector('.contact-close');

    this._closeBtn.addEventListener('click', () => this.close());
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) this.close();
    });

    document.addEventListener('keydown', this._onKey = (e) => {
      if (e.key === 'Escape' && this._overlay.getAttribute('aria-hidden') === 'false') {
        this.close();
      }
    });

    document.addEventListener('click', this._onClick = (e) => {
      if (!e.target.closest('a[href="#contact"]')) return;
      e.preventDefault();
      this.open();
    });

    this._form.addEventListener('submit', (e) => this._handleSubmit(e));
  }

  disconnectedCallback() {
    if (this._onKey) document.removeEventListener('keydown', this._onKey);
    if (this._onClick) document.removeEventListener('click', this._onClick);
  }

  open() {
    this._resetForm();
    this._overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => this._overlay.classList.add('open'));
    this._form.querySelector('input').focus();
    this._renderOrResetTurnstile();
  }

  close() {
    this._overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      this._overlay.setAttribute('aria-hidden', 'true');
    }, 200);
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const name = this._form.querySelector('[name="name"]').value.trim();
    const email = this._form.querySelector('[name="email"]').value.trim();
    const message = this._form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      this._showStatus('Please fill in all fields.', true);
      return;
    }

    const turnstileInput = this._form.querySelector('[name="cf-turnstile-response"]');
    const token = turnstileInput ? turnstileInput.value : '';
    if (!token && !this._isDev) {
      this._showStatus('Please wait for the verification to complete.', true);
      return;
    }

    const submit = this._form.querySelector('.contact-submit');
    submit.disabled = true;
    submit.textContent = 'Sending…';

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, token }),
      });

      if (res.ok) {
        this._form.style.display = 'none';
        this._showSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        this._showStatus(data.error || 'Something went wrong. Please try again.', true);
      }
    } catch {
      this._showStatus('Network error. Please try again.', true);
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send message';
    }
  }

  _showStatus(msg, isError) {
    this._status.textContent = msg;
    this._status.className = 'contact-status' + (isError ? ' error' : ' success');
  }

  _showSuccess() {
    const modal = this.querySelector('.contact-modal');
    let msg = modal.querySelector('.contact-success');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'contact-success';
      msg.innerHTML = '<p>Message sent — I\'ll get back to you soon.</p>';
      modal.appendChild(msg);
    }
    msg.style.display = '';
  }

  _resetForm() {
    this._form.style.display = '';
    this._form.reset();
    this._status.textContent = '';
    this._status.className = 'contact-status';
    const msg = this.querySelector('.contact-success');
    if (msg) msg.style.display = 'none';
  }

  _renderOrResetTurnstile() {
    if (this._isDev) return;
    const container = this.querySelector('.cf-turnstile');
    if (!container) return;
    if (typeof turnstile === 'undefined') {
      window.addEventListener('load', () => this._renderOrResetTurnstile(), { once: true });
      return;
    }
    try {
      if (this._turnstileWidgetId === undefined) {
        this._turnstileWidgetId = turnstile.render(container, {
          sitekey: container.dataset.sitekey,
          size: 'flexible',
        });
      } else {
        turnstile.reset(this._turnstileWidgetId);
      }
    } catch (err) {
      console.error('Turnstile render/reset failed', err);
    }
  }
}

customElements.define('contact-form', ContactForm);
