// Reports clicks on outbound links to Umami, which only tracks page views on
// its own. Links to on-site files carry a data-umami-event attribute instead.
document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const link = target?.closest('a[href]');
  if (!link || !window.umami) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin) {
    window.umami.track('outbound', { url: url.href });
  }
});
