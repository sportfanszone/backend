module.exports = (req, res) => {
  const newOtp = require("../../utils/genOtp");
  req.session.otp = newOtp();
  req.session.otpExpires = Date.now() + 3 * 60 * 1000;
  console.log("Resent OTP:", req.session.otp);
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
};
