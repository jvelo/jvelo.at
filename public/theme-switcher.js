const THEME_KEY = 'theme-preference';
const DEFAULT_THEME = 'light';

// Applied at script load (before first paint) to avoid a flash of the wrong theme
(() => {
  const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  if (theme !== 'system') {
    document.documentElement.setAttribute('data-theme', theme);
  }
})();

class ThemeSwitcher extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.applyTheme(this.getTheme());
  }

  render() {
    this.innerHTML = `
      <select id="theme-select" class="theme-select">
        <option value="light">☀ Light</option>
        <option value="system">⚙ System</option>
        <option value="dark">☾ Dark</option>
      </select>
    `;
  }

  setupEventListeners() {
    const select = this.querySelector('select');
    if (select) {
      select.addEventListener('change', (e) => this.setTheme(e.target.value));
    }
  }

  getTheme() {
    return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  }

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    this.applyTheme(theme);
    document.getElementById('#top')?.scrollIntoView();
  }

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }

    // Update select value
    const select = this.querySelector('select');
    if (select) {
      select.value = theme;
    }
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
