import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

export const recieveMail = async (user, link) => {
  const { email, username } = user;
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Verification Email",
    html: `<h1>Hello, ${username}!</h1>
<h3>Thank you for registering. Please verify your account by clicking the link below:</h3>
<a href="${link}" target="_blank" style="display:inline-block; padding:10px 20px; background-color:#4CAF50; color:#fff; text-decoration:none; border-radius:5px;">Verify My Account</a>
<h3>If you did not sign up for this account, you can safely ignore this email.</h3>
`,
  });
};

export const forgotMail = async (user, link) => {
  const { email, username } = user;
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Reset password request",
    html: `<h1>Hello, ${username}!</h1>
<h3>We received a request to reset your password.</h3>
<h3>Click the button below to set a new password:</h3>
<a href="${link}" target="_blank" style="display:inline-block; padding:12px 20px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:5px;">Reset My Password</a>
<h3>If you didn’t request a password reset, you can safely ignore this email.</h3>
`,
  });
};
