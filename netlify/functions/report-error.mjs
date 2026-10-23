// Reports contact-form failures to Slack. Accepts only small JSON posts from the site and its own deploy previews.
const MAX_BYTES = 4096;

const escapeSlack = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("`", "'");
const field = (value, max) => (typeof value === "string" ? value.slice(0, max) : "");

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const allowed = [/^https:\/\/(www\.)?artiomleo\.com$/];
  const site = context?.site?.name;
  if (site) allowed.push(new RegExp(`^https://([a-z0-9-]+--)?${site}\\.netlify\\.app$`));
  const origin = req.headers.get("origin") ?? "";
  if (!allowed.some((pattern) => pattern.test(origin))) return new Response("Forbidden", { status: 403 });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return new Response("Payload too large", { status: 413 });
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BYTES) return new Response("Payload too large", { status: 413 });

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
  const webhookUrl = Netlify.env.get("SLACK_WEBHOOK_URL") || Netlify.env.get("VITE_SLACK_WEBHOOK_URL");
  if (!webhookUrl) return new Response("Reporting is not configured", { status: 500 });

  const data = body.data && typeof body.data === "object" ? body.data : {};
  const report = {
    error: field(body.error, 1000),
    name: field(data.name, 100),
    email: field(data.email, 254),
    message: field(data.message, 1500),
  };

  try {
    const slackRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `Form submission error:\n\`\`\`${escapeSlack(JSON.stringify(report, null, 2))}\`\`\`` }),
      signal: AbortSignal.timeout(5000),
    });
    if (!slackRes.ok) return new Response("Failed to notify Slack", { status: 502 });
  } catch {
    return new Response("Failed to notify Slack", { status: 502 });
  }
  return new Response("Reported to Slack", { status: 200 });
};
