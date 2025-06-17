export default async (req, context) => {
  const body = await req.json();

  const webhookUrl = Netlify.env.get("VITE_SLACK_WEBHOOK_URL") || import.meta.env.VITE_SLACK_WEBHOOK_URL;

  const slackRes = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: `Form submission error:\n${JSON.stringify(body, null, 2)}`
    })
  });

  if (!slackRes.ok) {
    return new Response("Failed to notify Slack", { status: 500 });
  }

  return new Response("Reported to Slack", { status: 200 });
};
