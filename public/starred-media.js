(() => {
  const grid = document.getElementById('masonry-grid');
  const btn = document.getElementById('load-more');
  if (!grid || !btn) return;

  btn.addEventListener('click', async () => {
    const seed = btn.dataset.seed;
    const offset = btn.dataset.offset;

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
      grid.appendChild(div);
    }

    if (data.hasMore) {
      btn.dataset.offset = String(parseInt(offset, 10) + 25);
      btn.disabled = false;
      btn.textContent = 'Load more';
    } else {
      btn.remove();
    }
  });
})();
