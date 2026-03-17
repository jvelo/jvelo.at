(() => {
  function initGalleries() {
    document.querySelectorAll('.figure-gallery').forEach((figure) => {
      const images = Array.from(figure.querySelectorAll('img'));
      if (images.length < 2) return;

      const ratio = figure.dataset.ratio || '16/9';
      const caption = figure.querySelector('figcaption');

      // Wrap images in a viewport
      const viewport = document.createElement('div');
      viewport.className = 'gallery-viewport';
      viewport.style.aspectRatio = ratio;

      const track = document.createElement('div');
      track.className = 'gallery-track';

      images.forEach((img) => {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        slide.appendChild(img);
        track.appendChild(slide);
      });

      viewport.appendChild(track);

      // Dots
      const dots = document.createElement('div');
      dots.className = 'gallery-dots';
      images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Image ${i + 1}`);
        dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); });
        dots.appendChild(dot);
      });

      // Insert into figure
      figure.innerHTML = '';
      viewport.appendChild(dots);
      figure.appendChild(viewport);
      if (caption) figure.appendChild(caption);

      let current = 0;

      function goTo(index) {
        current = Math.max(0, Math.min(index, images.length - 1));
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.querySelectorAll('.gallery-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }

      // Click to open lightbox
      viewport.addEventListener('click', () => openLightbox(images, current));

      // Touch swipe on gallery
      setupSwipe(viewport, {
        onLeft: () => goTo(current + 1),
        onRight: () => goTo(current - 1),
      });
    });
  }

  function setupSwipe(el, { onLeft, onRight }) {
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

  function openLightbox(images, startIndex) {
    let current = startIndex;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';

    const imgEl = document.createElement('img');
    imgEl.className = 'lightbox-img';

    const close = document.createElement('button');
    close.className = 'lightbox-close';
    close.innerHTML = '&times;';
    close.setAttribute('aria-label', 'Close');

    const prev = document.createElement('button');
    prev.className = 'lightbox-prev';
    prev.innerHTML = '&#8249;';
    prev.setAttribute('aria-label', 'Previous');

    const next = document.createElement('button');
    next.className = 'lightbox-next';
    next.innerHTML = '&#8250;';
    next.setAttribute('aria-label', 'Next');

    const dots = document.createElement('div');
    dots.className = 'lightbox-dots';
    images.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'lightbox-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Image ${i + 1}`);
      dot.addEventListener('click', (e) => { e.stopPropagation(); show(i); });
      dots.appendChild(dot);
    });

    overlay.appendChild(imgEl);
    overlay.appendChild(close);
    if (images.length > 1) {
      overlay.appendChild(prev);
      overlay.appendChild(next);
      overlay.appendChild(dots);
    }
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => overlay.classList.add('open'));

    function show(index) {
      current = Math.max(0, Math.min(index, images.length - 1));
      imgEl.src = images[current].src;
      imgEl.alt = images[current].alt || '';
      dots.querySelectorAll('.lightbox-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
      prev.style.visibility = current === 0 ? 'hidden' : 'visible';
      next.style.visibility = current === images.length - 1 ? 'hidden' : 'visible';
    }

    show(current);

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
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    }

    document.addEventListener('keydown', onKey);
    close.addEventListener('click', (e) => { e.stopPropagation(); teardown(); });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) teardown();
    });
    prev.addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
    next.addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });

    // Touch swipe on lightbox
    setupSwipe(overlay, {
      onLeft: () => show(current + 1),
      onRight: () => show(current - 1),
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }
})();
