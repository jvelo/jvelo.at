class PageLoader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.progress = 0;
    this.progressInterval = null;

    const bar = document.createElement('div');
    bar.id = 'bar';

    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 1rem;
        z-index: 10000;
        pointer-events: none;
        display: none;
      }

      :host([loading]) {
        display: block;
      }

      #bar {
        height: 100%;
        background: var(--color-ink, black);
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
        e.hashChange ||
        e.navigationType === 'traverse'
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

    window.addEventListener('pageshow', (e) => {
      if (e.persisted) {
        this.resetProgress();
      }
    });
  }

  startProgress() {
    this.progress = 0;
    this.bar.style.transition = 'none';
    this.bar.style.width = '0%';
    this.setAttribute('loading', '');

    setTimeout(() => {this.bar.style.transition = '';});

    this.progressInterval = setInterval(() => {
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

  resetProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.progress = 0;
    this.showInitialLoad();
  }
}

customElements.define('page-loader', PageLoader);
