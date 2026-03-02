import nodemailer from "nodemailer";

export const verifyEmail = (token, email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Verify your email:
http://localhost:5173/verify/${token}`,
  };

  transporter.sendMail(mailConfigurations, (error, info) => {
    if (error) {
      console.log("Email error:", error);
      return;
    }
    console.log("Email sent:", info.response);
  });
};
