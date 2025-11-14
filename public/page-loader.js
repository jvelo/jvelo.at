// Page Loader Web Component
// Handles client-side navigation with View Transitions and progress indication
class PageLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.progress = 0;
    this.progressInterval = null;

    // Create the progress bar element
    const bar = document.createElement('div');
    bar.id = 'bar';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 15px;
        z-index: 10000;
        pointer-events: none;
        display: none;
      }

      :host([loading]) {
        display: block;
      }

      #bar {
        height: 100%;
        background: black;
        width: 0%;
        transition: width 300ms linear;
      }
    `;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(bar);
    this.bar = bar;
  }

  connectedCallback() {
    // Show the progress bar at 100% on initial page load
    this.showInitialLoad();

    // Set up Navigation API when component is added to DOM
    this.setupNavigation();
  }

  showInitialLoad() {
    // Show bar at 100% for initial page load
    this.bar.style.width = '100%';
    this.setAttribute('loading', '');
    // Keep it visible (don't remove the loading attribute)
  }

  setupNavigation() {
    // Check if Navigation API is supported
    if (typeof navigation === 'undefined') {
      return;
    }

    // Intercept navigations for progress bar only
    navigation.addEventListener('navigate', (e) => {
      // Skip non-HTTP(S) URLs, external URLs, downloads, and hash navigations
      const url = new URL(e.destination.url);

      if (
        !url.protocol.startsWith('http') ||
        url.origin !== location.origin ||
        e.downloadRequest ||
        e.hashChange
      ) {
        return;
      }

      // Start progress bar
      this.startProgress();

      // Add listener to finish progress when navigation completes
      navigation.addEventListener('navigatesuccess', () => {
        this.finishProgress();
      }, { once: true });

      navigation.addEventListener('navigateerror', () => {
        this.finishProgress();
      }, { once: true });
    });
  }

  startProgress() {
    this.progress = 0;
    this.bar.style.width = '0%';
    this.setAttribute('loading', '');

    this.progressInterval = setInterval(() => {
      // Slow down as we get closer to 100%
      const increment = this.progress < 50 ? 10 : this.progress < 80 ? 5 : 1;
      this.progress = Math.min(this.progress + increment, 90);
      this.bar.style.width = this.progress + '%';
    }, 100);
  }

  finishProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.bar.style.width = '100%';
    // Keep the bar visible at 100% (don't remove loading attribute)
  }
}

customElements.define('page-loader', PageLoader);
