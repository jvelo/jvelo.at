export async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

interface ContactEmailConfig {
  scwSecretKey: string;
  scwProjectId: string;
  toEmail: string;
  fromEmail: string;
}

export async function sendContactEmail(name: string, email: string, message: string, config: ContactEmailConfig): Promise<boolean> {
  const res = await fetch('https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': config.scwSecretKey,
    },
    body: JSON.stringify({
      from: { email: config.fromEmail, name: `${name} (via jvelo.at)` },
      to: [{ email: config.toEmail }],
      subject: `Contact from ${name}`,
      text: message,
      project_id: config.scwProjectId,
      additional_headers: [
        { key: 'Reply-To', value: `${name} <${email}>` },
      ],
    }),
  });

  if (!res.ok) {
    console.error('Scaleway email error:', res.status, await res.text());
  }
  return res.ok;
}
