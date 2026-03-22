export const adminStyles = `
  @font-face {
    font-family: 'Departure Mono';
    src: url('/fonts/DepartureMono-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --color-bg: #181818;
    --color-text: #ffffff;
    --color-accent: #FFD043;
    --color-border: #F3F3F3;
    --color-code-bg: #1a1a1a;
  }

  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; }

  .admin { font-family: 'Departure Mono', 'IBM Plex Mono', monospace; font-size: 0.81rem; line-height: 1.35; color: #ffffff; background: #181818; min-height: 100vh; }
  .admin * { color: inherit; }
  .admin a { text-decoration: none; }
  .admin a:hover { color: var(--color-accent); }

  .admin-bar { display: flex; align-items: center; justify-content: space-between; padding: 0.45rem 0.9rem; border-bottom: 1px solid var(--color-border); }
  .admin-bar-title { font-size: 0.81rem; letter-spacing: -0.5px; }
  .admin-crumbs { display: flex; gap: 0.36rem; font-size: 0.72rem; opacity: 0.6; }
  .admin-crumbs span { opacity: 0.4; }

  .admin-body { padding: 0.9rem; max-width: 1200px; }

  .admin-section-title { font-size: 0.9rem; margin: 0 0 0.72rem 0; letter-spacing: -0.5px; }

  /* Tables */
  .admin table { width: 100%; border-collapse: collapse; font-size: 0.72rem; }
  .admin th { text-align: left; padding: 0.27rem 0.45rem; border-bottom: 1px solid var(--color-border); font-weight: normal; opacity: 0.5; font-size: 0.63rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .admin td { padding: 0.27rem 0.45rem; border-bottom: 1px solid var(--color-border); max-width: 18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; position: relative; }
  .admin td:has(.cell-image) { overflow: visible; }
  .admin tr:hover td { background: var(--color-code-bg); }
  .admin tr:hover td a { color: var(--color-accent); }
  .admin td a { text-decoration: none; display: block; color: inherit; }
  .admin .pk-col { opacity: 0.5; }
  .admin .cell-null { opacity: 0.25; font-style: italic; }
  .admin td img { border: 1px solid var(--color-border); }
  .admin .cell-image { position: relative; display: inline-block; }
  .admin .cell-image-preview { display: none; position: absolute; bottom: 100%; left: 0; z-index: 100; max-height: 240px; width: auto; max-width: 360px; margin-bottom: 0.27rem; border: 1px solid var(--color-border); background: var(--color-bg); }
  .admin .cell-image:hover .cell-image-preview { display: block; }
  .admin .row-select { width: 0.9rem; height: 0.9rem; cursor: pointer; }
  .admin .row-count { opacity: 0.4; }

  /* Pagination */
  .admin-pager { display: flex; gap: 0.45rem; align-items: center; margin-top: 0.72rem; font-size: 0.72rem; }
  .admin-pager a { padding: 0.18rem 0.36rem; border: 1px solid var(--color-border); }
  .admin-pager a:hover { background: var(--color-code-bg); }
  .admin-pager .current { opacity: 0.5; }

  /* Forms */
  .admin-form { display: flex; flex-direction: column; gap: 0.54rem; max-width: 36rem; }
  .admin-field { display: flex; flex-direction: column; gap: 0.18rem; }
  .admin-field label { font-size: 0.63rem; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.5; }
  .admin-field input, .admin-field textarea, .admin-field select { font-family: inherit; font-size: 0.81rem; padding: 0.27rem 0.36rem; border: 1px solid #555; background: var(--color-bg); color: #bbb; }
  .admin-field input:focus, .admin-field textarea:focus, .admin-field select:focus { color: #ffffff; border-color: #ffffff; outline: none; }
  .admin-field textarea { min-height: 4.5rem; resize: vertical; }
  .admin-field input:disabled { color: #555; border-color: #333; cursor: not-allowed; }
  .admin-field .field-hint { font-size: 0.54rem; opacity: 0.35; }

  /* Buttons */
  .admin-actions { display: flex; gap: 0.45rem; margin-top: 0.45rem; }
  .admin-btn { font-family: inherit; font-size: 0.72rem; padding: 0.27rem 0.54rem; border: 1px solid var(--color-border); background: var(--color-bg); color: var(--color-text); cursor: pointer; text-decoration: none; display: inline-block; }
  .admin-btn:hover { background: var(--color-text); color: var(--color-bg); }
  .admin-btn-danger { border-color: #c44; color: #c44; }
  .admin-btn-danger:hover { background: #c44; color: #fff; }

  /* Flash messages */
  .admin-flash { padding: 0.36rem 0.54rem; margin-bottom: 0.72rem; font-size: 0.72rem; border: 1px solid var(--color-border); }
  .admin-flash-success { border-color: var(--color-accent); color: var(--color-accent); }
  .admin-flash-error { border-color: #c44; color: #c44; }

  /* Toolbar */
  .admin-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.72rem; }
`;
