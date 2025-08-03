const transporter = require("../../config/mailer");

module.exports = async function sendOTPEmail({ user, otpCode }) {
  try {
    const template = `
      <div style="max-width: 700px; min-width: 500px; background-color: rgb(255, 255, 255); padding: 20px; margin: auto;">
        <div style="font-size: 16px; padding: 25px; border: 1px solid #000;">
          <center>
            <img src="${
              process.env.FRONTEND_URL
            }/images/logo.png" alt="Sportfanszone logo">
          </center>
          <hr>
          <h2 style="text-align: center;">Your One-Time Password (OTP)</h2>
          <p>Hi ${user.firstName} ${user.lastName},</p>
          <p>Your OTP code is:</p>
          <h1 style="text-align: center; background: #4058a2; color: #fff; padding: 10px;">${otpCode}</h1>
          <p>This code will expire in 10 minutes. Do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr>
          <footer style="text-align: center; color: gray; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Sportfanszone - All rights reserved.
          </footer>
        </div>
      </div>
    `;

    let info = await transporter.sendMail({
      from: `Sportfanszone <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Code",
      html: template,
    });

    console.log("OTP Email sent: %s", info.messageId, " to ", user.email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error(error);
  }
};
