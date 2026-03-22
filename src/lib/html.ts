interface TocEntry {
  id: string;
  text: string;
}

export function extractToc(html: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    entries.push({ id: match[1], text: match[2].replace(/<[^>]*>/g, '') });
  }
  return entries;
}

export function addHeadingIds(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    return `<h2${attrs} id="${id}">${content}</h2>`;
  });
}
