// View Transitions API for smooth page navigation
(function() {
  // Check if View Transitions API is supported
  const supportsViewTransitions = 'startViewTransition' in document;

  // Create loading progress bar
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 15px;
    background: black;
    width: 0%;
    transition: width 300ms linear;
    z-index: 10000;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  let progressInterval = null;

  function startProgress() {
    progressBar.style.width = '0%';
    progressBar.style.display = 'block';

    let progress = 0;
    progressInterval = setInterval(() => {
      // Slow down as we get closer to 100%
      const increment = progress < 50 ? 10 : progress < 80 ? 5 : 1;
      progress = Math.min(progress + increment, 90);
      progressBar.style.width = progress + '%';
    }, 100);
  }

  function finishProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    progressBar.style.width = '100%';
    setTimeout(() => {
      progressBar.style.display = 'none';
    }, 200);
  }

  // Intercept all link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');

    // Only handle internal links
    if (!link) return;

    const href = link.getAttribute('href');

    // Skip hash-only links (like #navigation, #top) - allow normal scroll behavior
    if (!href || href.startsWith('#')) {
      console.log('Skipping hash link:', href);
      return;
    }

    // Check if it's an external link
    if (link.hostname !== window.location.hostname) return;
    if (link.target === '_blank') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();

    // Start progress bar
    startProgress();

    // Navigate with View Transitions if supported
    if (supportsViewTransitions) {
      document.startViewTransition(async () => {
        await navigate(href);
      });
    } else {
      navigate(href);
    }
  });

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    // Only handle actual navigation, not hash changes
    if (window.location.hash) return;

    // Start progress bar
    startProgress();

    if (supportsViewTransitions) {
      document.startViewTransition(async () => {
        await navigate(window.location.pathname);
      });
    } else {
      navigate(window.location.pathname);
    }
  });

  async function navigate(url) {
    try {
      // Fetch the new page
      const response = await fetch(url);
      const html = await response.text();

      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Update the page title
      document.title = doc.title;

      // Update the main content
      const newMain = doc.querySelector('.main-content');
      const currentMain = document.querySelector('.main-content');
      if (newMain && currentMain) {
        currentMain.innerHTML = newMain.innerHTML;
      }

      // Update the URL without triggering navigation
      if (window.location.pathname !== url) {
        window.history.pushState({}, '', url);
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Finish progress bar
      finishProgress();

    } catch (error) {
      console.error('Navigation error:', error);
      // Finish progress bar on error
      finishProgress();
      // Fallback to regular navigation
      window.location.href = url;
    }
  }
})();
