import nodemailer from "nodemailer";

const createMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.NODEMAILER_AUTH_USER,
      pass: process.env.NODEMAILER_AUTH_PASS,
    },
  });
  return transporter;
};

export default createMailTransporter;
