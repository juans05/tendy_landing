export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RECLAMOS_FROM_EMAIL;
  if (!apiKey || !from) throw new Error('RESEND_API_KEY o RECLAMOS_FROM_EMAIL no configurados');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!response.ok) throw new Error(`Resend rechazó el envío (${response.status}): ${await response.text()}`);
}
