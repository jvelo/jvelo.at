interface BlurbInput {
  title: string | null;
  description: string | null;
  note: string | null;
  apiKey: string;
}

interface ClaudeResponse {
  content?: Array<{ type: string; text?: string }>;
  error?: { message?: string };
}

const MODEL = 'claude-haiku-4-5-20251001';

function buildPrompt({ title, description, note }: Omit<BlurbInput, 'apiKey'>): string {
  const titleLine = `Title: ${title || '(unknown)'}`;
  const descLine = `Site's own description: ${description || '(none)'}`;

  // Style rules: no em dashes anywhere in the output. Use commas, periods,
  // colons, or restructured sentences. En dashes for ranges (e.g. "1990–2020")
  // are fine.
  const styleRules =
    'Style rules: one short sentence, max ~20 words. Neutral-literary voice. Do not restate the site\'s tagline verbatim. Do not start with "This site" or "A website that". Do not use em dashes (—) anywhere in the output; use commas, periods, or rewrite the sentence. Return only the blurb text, no quotes, no preamble.';

  if (note && note.trim()) {
    return `You are writing a one-line blurb for a personal webpage that lists interesting websites someone finds worth visiting. The curator has left a short note on why this site stands out. Use it as the seed and polish it into a crisp, specific blurb.

${styleRules}

${titleLine}
${descLine}
Curator's note: ${note.trim()}`;
  }

  return `You are writing a one-line blurb for a personal webpage that lists interesting websites someone finds worth visiting. Based on the title and description, write a crisp, specific blurb capturing what the site is and why a curious visitor might enjoy it.

${styleRules}

${titleLine}
${descLine}`;
}

export async function generateBlurb(input: BlurbInput): Promise<string> {
  const prompt = buildPrompt(input);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': input.apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const body = (await res.json()) as ClaudeResponse;
  if (!res.ok) {
    throw new Error(`Claude API error ${res.status}: ${body.error?.message || 'unknown'}`);
  }
  const text = body.content?.find((c) => c.type === 'text')?.text?.trim();
  if (!text) throw new Error('Claude returned empty blurb');
  return text;
}
