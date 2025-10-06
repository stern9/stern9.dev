import { Resend } from "resend";

export default async function (req, res) {
  const {
    RESEND_API_KEY,
    TO_EMAIL_ADDRESS: to_email,
    FROM_EMAIL_ADDRESS: from_email,
  } = process.env;

  if (!RESEND_API_KEY) {
    return res.status(500).send("Email service not configured.");
  }

  const resend = new Resend(RESEND_API_KEY);

  const { fullName, email, message } = req.body;

  try {
    await resend.emails.send({
      from: from_email,
      to: to_email,
      subject: `New Message From stern9.dev - ${email}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${fullName} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    res.status(200).send("Message sent.");
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).send("Message not sent.");
  }
}
