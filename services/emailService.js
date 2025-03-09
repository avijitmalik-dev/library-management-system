const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send an email
const sendPasswordEmail = (to, generatedPassword) => {
  console.log(`Sending password email to: ${to} with generated password`);

  const subject = 'Your Generated Password';
  const text = `Hello,\n\nYour new password is: ${generatedPassword}\n\nPlease use it to log in to your account.`;
  const html = `<p>Hello,</p><p>Your new password is: <strong>${generatedPassword}</strong></p><p>Please use it to log in to your account.</p>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendPasswordEmail };
