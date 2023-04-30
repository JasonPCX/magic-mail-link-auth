import nodemailer from "nodemailer";

// Generate SMTP service account from ethereal.email
async function createTestAccount() {
  try {
    const account = await nodemailer.createTestAccount();
    
    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
    return transporter;
  } catch (error) {
    console.log("Failed to create a testing account", error.message);
    process.exit(1);
  }
}

const transporter = await createTestAccount();

export async function sendMail({receiver, subject, text, html}) {
  // Message object
  const message = {
    from: process.env.MAIL_NAME,
    to: receiver,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log("Error occurred when a mail was tried to be sent. " + err.message);
    process.exit(1);
  }
}
