class ImageGallery extends HTMLElement {
  connectedCallback() {
    const images = Array.from(this.querySelectorAll('img'));
    if (images.length === 0) return;

    const ratio = this.getAttribute('ratio') || '16/9';
    const isAuto = ratio === 'auto';
    const align = this.getAttribute('align') || 'center';
    const caption = this.querySelector('figcaption');

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        :host { display: block; margin: 2rem 0; }

        .viewport {
          overflow: hidden;
          position: relative;
          cursor: pointer;
          ${isAuto ? '' : `aspect-ratio: ${ratio};`}
          border: 1px solid var(--color-border, #181818);
        }

        .viewport::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3rem;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.4));
          pointer-events: none;
        }

        .track {
          display: flex;
          ${isAuto ? '' : 'height: 100%;'}
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .slide {
          flex: 0 0 100%;
          min-width: 0;
          ${isAuto ? '' : 'height: 100%;'}
        }

        .slide img {
          width: 100%;
          ${isAuto ? '' : 'height: 100%;'}
          object-fit: ${isAuto ? 'contain' : 'cover'};
          object-position: ${align};
          display: block;
        }

        .dots {
          position: absolute;
          bottom: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 2;
        }

        .dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.6);
          background: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }

        .dot::before {
          content: '';
          position: absolute;
          inset: -0.5rem;
        }

        .dot.active {
          background: #fff;
          border-color: #fff;
        }

        ::slotted(figcaption) {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--color-accent, #9C7D7D);
          margin-top: 0.5rem;
          text-align: center;
        }
      </style>
      <div class="viewport">
        <div class="track"></div>
        <div class="dots"></div>
      </div>
      <slot name="caption"></slot>
    `;

    const track = shadow.querySelector('.track');
    const dotsContainer = shadow.querySelector('.dots');
    const viewport = shadow.querySelector('.viewport');

    // Move images into shadow DOM slides
    const srcs = images.map((img) => ({ src: img.src, alt: img.alt || '' }));
    images.forEach((img) => img.remove());

    srcs.forEach(({ src, alt }) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      slide.appendChild(img);
      track.appendChild(slide);
    });

    // Move caption to slot
    if (caption) {
      caption.setAttribute('slot', 'caption');
      this.appendChild(caption);
    }

    // Dots (only for multi-image galleries)
    if (srcs.length > 1) {
      srcs.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Image ${i + 1}`);
        dot.addEventListener('click', (e) => { e.stopPropagation(); this._goTo(i); });
        dotsContainer.appendChild(dot);
      });
    }

    this._current = 0;
    this._srcs = srcs;
    this._track = track;
    this._dotsContainer = dotsContainer;

    // Click to open lightbox
    viewport.addEventListener('click', () => this._openLightbox());

    // Touch swipe
    this._setupSwipe(viewport, {
      onLeft: () => this._goTo(this._current + 1),
      onRight: () => this._goTo(this._current - 1),
    });
  }

  _goTo(index) {
    this._current = Math.max(0, Math.min(index, this._srcs.length - 1));
    this._track.style.transform = `translateX(-${this._current * 100}%)`;
    this._dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === this._current);
    });
  }

  _setupSwipe(el, { onLeft, onRight }) {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    el.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });

    el.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onLeft();
      else onRight();
    }, { passive: true });
  }

  _openLightbox() {
    const current = { value: this._current };
    const srcs = this._srcs;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';

    overlay.innerHTML = `
      <style>
        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .lightbox.open { opacity: 1; }
        .lightbox-img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          display: block;
        }
        .lightbox-close, .lightbox-prev, .lightbox-next {
          position: absolute;
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
          opacity: 1;
        }
        .lightbox-close { top: 1.5rem; right: 1.5rem; font-size: 2.5rem; }
        .lightbox-prev, .lightbox-next {
          top: 50%;
          transform: translateY(-50%);
          font-size: 3.5rem;
        }
        .lightbox-prev { left: 1.5rem; }
        .lightbox-next { right: 1.5rem; }
        .lightbox-dots {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.6rem;
        }
        .lightbox-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }
        .lightbox-dot::before {
          content: '';
          position: absolute;
          inset: -0.5rem;
        }
        .lightbox-dot.active {
          background: #fff;
          border-color: #fff;
        }
      </style>
      <img class="lightbox-img" />
      <button class="lightbox-close" aria-label="Close">&times;</button>
      ${srcs.length > 1 ? `
        <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
        <button class="lightbox-next" aria-label="Next">&#8250;</button>
        <div class="lightbox-dots">
          ${srcs.map((_, i) => `<button class="lightbox-dot${i === current.value ? ' active' : ''}" aria-label="Image ${i + 1}"></button>`).join('')}
        </div>
      ` : ''}
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const imgEl = overlay.querySelector('.lightbox-img');
    const prev = overlay.querySelector('.lightbox-prev');
    const next = overlay.querySelector('.lightbox-next');
    const dots = overlay.querySelectorAll('.lightbox-dot');

    function show(index) {
      current.value = Math.max(0, Math.min(index, srcs.length - 1));
      imgEl.src = srcs[current.value].src;
      imgEl.alt = srcs[current.value].alt;
      dots.forEach((d, i) => d.classList.toggle('active', i === current.value));
      if (prev) prev.style.visibility = current.value === 0 ? 'hidden' : 'visible';
      if (next) next.style.visibility = current.value === srcs.length - 1 ? 'hidden' : 'visible';
    }

    show(current.value);
    requestAnimationFrame(() => overlay.classList.add('open'));

    function teardown() {
      overlay.classList.remove('open');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 200);
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape') teardown();
      if (e.key === 'ArrowLeft') show(current.value - 1);
      if (e.key === 'ArrowRight') show(current.value + 1);
    }

    document.addEventListener('keydown', onKey);
    overlay.querySelector('.lightbox-close').addEventListener('click', (e) => { e.stopPropagation(); teardown(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) teardown(); });
    if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); show(current.value - 1); });
    if (next) next.addEventListener('click', (e) => { e.stopPropagation(); show(current.value + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); show(i); }));

    this._setupSwipe(overlay, {
      onLeft: () => show(current.value + 1),
      onRight: () => show(current.value - 1),
    });
  }
}

customElements.define('image-gallery', ImageGallery);

// Wrap standalone images in work pages as single-image galleries
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('page-work')) return;

  document.querySelectorAll('.prose img').forEach((img) => {
    if (img.closest('image-gallery') || img.closest('.hero-cover')) return;

    const gallery = document.createElement('image-gallery');
    gallery.setAttribute('ratio', 'auto');
    const clone = img.cloneNode(true);
    gallery.appendChild(clone);
    img.replaceWith(gallery);
  });
});
