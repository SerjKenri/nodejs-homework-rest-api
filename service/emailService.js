const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmEmail = (email, token) => {
  if (!email || !token) return;

  const msg = {
    to: email,
    from: "serjkenri@gmail.com",
    subject: "Email Confirmation",
    text: "Please click the link to confirm your email.",
    html: `<strong>Click to confirm your email address <a href=${`http://localhost:3000/api/users/verify/${token}`}>VERIFY</a></strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendConfirmEmail;
