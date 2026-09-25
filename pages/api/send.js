import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (str) =>
  str.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method not allowed.");
  }

  const {
    RESEND_API_KEY,
    TO_EMAIL_ADDRESS: to_email,
    FROM_EMAIL_ADDRESS: from_email,
  } = process.env;

  if (!RESEND_API_KEY) {
    return res.status(500).send("Email service not configured.");
  }

  const fullName = String(req.body?.fullName ?? "").trim();
  const email = String(req.body?.email ?? "").trim();
  const message = String(req.body?.message ?? "").trim();
  const honeypot = String(req.body?.company ?? "");

  // Pretend success so bots don't retry.
  if (honeypot) {
    return res.status(200).send("Message sent.");
  }

  if (!fullName || !message || !EMAIL_RE.test(email)) {
    return res
      .status(400)
      .send("Please fill in your name, a valid email and a message.");
  }
  if (fullName.length > 100 || email.length > 200 || message.length > 5000) {
    return res.status(400).send("Your message is too long.");
  }

  const resend = new Resend(RESEND_API_KEY);

  // Resend returns errors instead of throwing, so check `error` explicitly.
  let error;
  try {
    ({ error } = await resend.emails.send({
      from: from_email,
      to: to_email,
      replyTo: email,
      subject: `New message from stern9.dev — ${fullName}`,
      text: `From: ${fullName} (${email})\n\n${message}`,
      html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${escapeHtml(fullName)} (${escapeHtml(email)})</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
    `,
    }));
  } catch (err) {
    error = err;
  }

  if (error) {
    console.error("Resend error:", error);
    return res.status(502).send("Message not sent. Please try again later.");
  }

  return res.status(200).send("Message sent.");
}
