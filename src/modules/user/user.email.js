import nodemailer from 'nodemailer';
import { renderFile } from 'ejs';
import { resolve } from 'path';
import generateToken from '../../utils/generateToken.js';

const sendMail = async ({ data, action, actionURL }) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter
    .sendMail({
      from: `"${process.env.APP_NAME || 'App'}" <${process.env.EMAIL_ACCOUNT}>`,
      to: data.email,
      subject: `${action}`,
      html: await renderFile(resolve('views', 'email.ejs'), { token: generateToken(data, '15m'), action, actionURL }),
      priority: 'high',
    })
    .then((email) => {
      if (process.env.NODE_ENV === 'dev') console.log(email);
    })
    .catch((err) => res.json({ message: err, statusCode: 500 }));
};
export default sendMail;
