const sgMail = require("@sendgrid/mail");

export default async function (req, res) {
  const {
    SENDGRID_API_KEY: client_id,
    TO_EMAIL_ADDRESS: to_email,
    FROM_EMAIL_ADDRESS: from_email,
  } = process.env;

  sgMail.setApiKey(client_id);

  const { fullName, email, message } = req.body;

  const content = {
    to: to_email,
    from: from_email,
    subject: `New Message From stern9.dev - ${email}`,
    text: message,
    html: `
    <p>From: ${fullName}</p>
    <p>${message}</p>`,
  };

  try {
    await sgMail.send(content);
    res.status(200).send("Message sent.");
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).send("Message not sent.");
  }
}
