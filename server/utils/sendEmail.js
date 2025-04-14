import nodemailer from "nodemailer";
export const sendEmail = async (to, subject, text) => {
  try {
    const trasport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // done
      service: process.env.SMTP_SERVICE, // done
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await trasport.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: text,
    });
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
