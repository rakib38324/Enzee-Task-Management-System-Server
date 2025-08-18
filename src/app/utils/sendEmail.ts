import nodemailer from 'nodemailer';
import config from '../config/config';

export const sendEmail = async (subject: string, to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'develop',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'aminul15-3832@diu.edu.bd',
      pass: 'btoa cfbk moma oduc',
    },
  });

  await transporter.sendMail({
    from: 'aminul15-3832@diu.edu.bd', // sender address
    to, // list of receivers
    subject, // Subject line
    text: '', // plain text body
    html, // html body
  });
};
