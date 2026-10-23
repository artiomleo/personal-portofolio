// Reports contact-form failures to Slack. Accepts only small JSON posts from the site itself.
const ALLOWED_ORIGINS = [/^https:\/\/(www\.)?artiomleo\.com$/, /^https:\/\/[a-z0-9-]+(--[a-z0-9-]+)?\.netlify\.app$/];
const MAX_LENGTH = 4096;

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.some((pattern) => pattern.test(origin))) return new Response("Forbidden", { status: 403 });

  const raw = await req.text();
  if (raw.length > MAX_LENGTH) return new Response("Payload too large", { status: 413 });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body || typeof body !== "object" || typeof body.error !== "string") {
    return new Response("Invalid payload", { status: 400 });
  }

  // VITE_SLACK_WEBHOOK_URL is the old name; it works until the variable is renamed in Netlify.
  const webhookUrl = Netlify.env.get("SLACK_WEBHOOK_URL") ?? Netlify.env.get("VITE_SLACK_WEBHOOK_URL");
  if (!webhookUrl) return new Response("Reporting is not configured", { status: 500 });

  const slackRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `Form submission error:\n${JSON.stringify({ error: body.error, data: body.data ?? null }, null, 2)}`,
    }),
  });

  if (!slackRes.ok) return new Response("Failed to notify Slack", { status: 500 });
  return new Response("Reported to Slack", { status: 200 });
};
