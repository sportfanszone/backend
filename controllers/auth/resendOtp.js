// backend/controllers/auth/resendOtp.js
module.exports = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (
      !sessionId ||
      sessionId !== req.sessionID ||
      !req.session.otp ||
      !req.session.otpExpires
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired session",
      });
    }

    // Generate new OTP
    const newOtp = require("../../utils/genOtp")();
    req.session.otp = newOtp;
    req.session.otpExpires = Date.now() + 3 * 60 * 1000;

    // Save session
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });

    // Send OTP email
    await require("../../utils/mails/signupOtp.mail")({
      user: req.session.user,
      otpCode: newOtp,
    });
    console.log("Resent OTP:", newOtp);

    res.json({
      status: "success",
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
