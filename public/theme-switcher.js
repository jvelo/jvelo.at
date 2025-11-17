(function() {
  const THEME_KEY = 'theme-preference';
  const DEFAULT_THEME = 'light';

  const theme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  if (theme !== 'system') {
    document.documentElement.setAttribute('data-theme', theme);
  }
})();

class ThemeSwitcher extends HTMLElement {
  constructor() {
    super();
    this.THEME_KEY = 'theme-preference';
    this.DEFAULT_THEME = 'light';
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.applyStoredTheme();
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
    return localStorage.getItem(this.THEME_KEY) || this.DEFAULT_THEME;
  }

  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
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

  applyStoredTheme() {
    const theme = this.getTheme();
    this.applyTheme(theme);
  }
}

customElements.define('theme-switcher', ThemeSwitcher);
