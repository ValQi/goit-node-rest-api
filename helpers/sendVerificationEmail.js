const nodemailer = require("nodemailer");
require("dotenv").config();
const { PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "valqi@meta.ua",
    pass: PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async ({ to, subject, text, html, from = "valqi@meta.ua" }) => {
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
module.exports = sendEmail;