import nodemailer from "nodemailer";
import config from "../Config/config.env";

interface EmailOptions {
  to: string;
  from: string;
  html: string;
  subject: string;
}

const sendMail = async function (options: EmailOptions): Promise<void> {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: Number(config.EMAIL_PORT),
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };
  // send the mail here
  await transporter.sendMail(mailOptions);
};

export default sendMail;
