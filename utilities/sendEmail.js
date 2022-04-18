const nodemailer = require('nodemailer');

exports.sendEmail = (userEmail, url, status) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = {
    to: userEmail,
    from: process.env.NODEMAILER_USER,
    subject: 'Server Status Update',
    text: `A check you have created for ${url} has its status changed. Current status is: ${status.toLowerCase()}`,
  };

  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      console.log(err);
      return Promise.reject(err);
    }
    return Promise.resolve();
  });
};
