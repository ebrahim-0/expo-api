const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, link, otp, name) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   auth: {
    //     user: "devonte.dubuque7@ethereal.email",
    //     pass: "5R3ECj1VXwkGSgzBGv",
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Static Template</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
  <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;">
    <main>
      <div style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;">
        <div style="width: 100%; max-width: 489px; margin: 0 auto;">
          <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">Hi ${name},</p>
          <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">Use the following OTP to complete the procedure to change your email address. OTP is valid for <span style="font-weight: 600; color: #1f1f1f;">10 minutes</span>. Do not share this code with others.</p>
          <p style="margin: 0; margin-right: 10px;margin-top: 40px; font-size: 40px; font-weight: 600; letter-spacing: 10px; color: #ba3d4f;">${otp}</p>
        </div>
      </div>

    </main>
  </div>
</body>
</html>

`;

    await transporter.sendMail({
      from: '"Expo 👻" <ebrahimabdelrazik2002@gmail.com>',
      to: email,
      subject: subject,
      text: "Your OTP for password reset is: " + otp, // Plain text version of the email body
      html: htmlContent, // HTML version of the email body
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
