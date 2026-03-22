(() => {
  const grid = document.getElementById('masonry-grid');
  const btn = document.getElementById('load-more');
  if (!grid || !btn) return;

  const cols = Array.from(grid.querySelectorAll('.masonry-col'));
  let loading = false;

  function shortestCol() {
    let min = Infinity;
    let target = cols[0];
    for (const col of cols) {
      const h = col.offsetHeight;
      if (h < min) { min = h; target = col; }
    }
    return target;
  }

  async function loadMore() {
    if (loading) return;
    const seed = btn.dataset.seed;
    const offset = btn.dataset.offset;

    loading = true;
    btn.disabled = true;
    btn.textContent = 'Loading…';

    const res = await fetch(`/api/starred-media?seed=${seed}&offset=${offset}`);
    const data = await res.json();

    for (const item of data.items) {
      const div = document.createElement('div');
      div.className = 'masonry-item';
      const img = document.createElement('img');
      img.src = item.media_url;
      img.width = item.media_width;
      img.height = item.media_height;
      img.loading = 'lazy';
      img.alt = '';
      div.appendChild(img);
      shortestCol().appendChild(div);
    }

    if (data.hasMore) {
      btn.dataset.offset = String(parseInt(offset, 10) + 25);
      btn.disabled = false;
      btn.textContent = 'Load more';
    } else {
      btn.remove();
      observer.disconnect();
    }

    loading = false;
  }

  btn.addEventListener('click', loadMore);

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadMore();
  }, { rootMargin: '200px' });

  observer.observe(btn);
})();
