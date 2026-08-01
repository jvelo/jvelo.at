(() => {
  const grid = document.getElementById('masonry-grid');
  const btn = document.getElementById('load-more');
  if (!grid || !btn) return;

  const cols = Array.from(grid.querySelectorAll('.masonry-col'));
  const colHeights = cols.map((col) => col.offsetHeight);
  let loading = false;

  function shortestColIndex() {
    let min = Infinity;
    let idx = 0;
    for (let i = 0; i < colHeights.length; i++) {
      if (colHeights[i] < min) { min = colHeights[i]; idx = i; }
    }
    return idx;
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

    const colWidth = cols[0].offsetWidth;

    for (const item of data.items) {
      const idx = shortestColIndex();
      const div = document.createElement('div');
      div.className = 'masonry-item';
      const img = document.createElement('img');
      img.src = item.media_url;
      img.width = item.media_width;
      img.height = item.media_height;
      img.style.aspectRatio = `${item.media_width} / ${item.media_height}`;
      img.loading = 'lazy';
      img.alt = '';
      div.appendChild(img);
      cols[idx].appendChild(div);

      // Track height using aspect ratio (image scales to column width)
      const imgHeight = colWidth * (item.media_height / item.media_width);
      colHeights[idx] += imgHeight;
    }

    if (data.hasMore) {
      btn.dataset.offset = String(parseInt(offset, 10) + data.items.length);
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
