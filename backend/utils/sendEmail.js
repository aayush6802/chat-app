import createMailTransporter from "./createMailTransporter.js";

const sendEmail = (user) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: `"Chat Sync" <${process.env.NODEMAILER_AUTH_USER}>`,
    to: user.email,
    subject: "Verify your email to login...",
    html: `<div>Hello ${user?.name}, please verify your email by clicking this link... </div><a href='${process.env.VERCEL_URL}/verify-email?emailToken=${user?.emailToken}'>Verify Email</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("mail error->", error);
    }
    console.log("Message sent: ", info?.messageId);
  });
};

export default sendEmail;
