const { User } = require("../../models");

module.exports = async (req, res) => {
  try {
    console.log("My message");
    console.log(req.body);

    // Check if email already is in use
    const emailExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (emailExists) {
      return res.status(400).json({
        status: "error",
        message: "Email already in use",
        errors: [{ field: "email", message: "Email already in use" }],
      });
    }

    // Check if username already exists
    const usernameExsits = await User.findOne({
      where: { username: req.body.username },
    });
    if (usernameExsits) {
      return res.status(400).json({
        status: "error",
        message: "Username already in use",
        errors: [{ field: "username", message: "Username already in use" }],
      });
    }

    // Generate OTP
    const otp = require("../../utils/genOtp")();
    req.session.otp = otp;
    req.session.user = req.body;
    req.session.otpExpires = Date.now() + 3 * 60 * 1000;

    res.cookie("allowOtp", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
