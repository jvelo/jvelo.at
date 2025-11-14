// Page Loader Web Component
// Handles client-side navigation with View Transitions and progress indication
class PageLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.progress = 0;
    this.progressInterval = null;

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
    this.showInitialLoad();
    this.setupNavigation();
  }

  showInitialLoad() {
    this.bar.style.width = '100%';
    this.setAttribute('loading', '');
  }

  setupNavigation() {
    if (typeof navigation === 'undefined') {
      return;
    }

    navigation.addEventListener('navigate', (e) => {
      const url = new URL(e.destination.url);

      if (
        !url.protocol.startsWith('http') ||
        url.origin !== location.origin ||
        e.downloadRequest ||
        e.hashChange
      ) {
        return;
      }

      this.startProgress();

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
    // Disable transition for instant reset to 0%
    this.bar.style.transition = 'none';
    this.bar.style.width = '0%';
    this.setAttribute('loading', '');

    // Re-enable transition after a brief delay
    setTimeout(() => {this.bar.style.transition = '';});

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
  }
}

customElements.define('page-loader', PageLoader);
