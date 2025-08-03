module.exports = async (req, res) => {
  try {
    const newOtp = require("../../utils/genOtp")();
    req.session.otp = newOtp;
    req.session.otpExpires = Date.now() + 3 * 60 * 1000;

    console.log("Resent OTP:", req.session.otp);

    await require("../../utils/mails/signupOtp.mail")({
      user: req.session.user,
      otpCode: newOtp,
    });

    res.cookie("allowOtp", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 60 * 1000,
      sameSite: "lax",
    });
    res.json({
      status: "success",
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
