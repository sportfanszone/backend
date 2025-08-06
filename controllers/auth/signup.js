const { User, PendingSignup } = require("../../models");

module.exports = async (req, res) => {
  try {
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
    const usernameExists = await User.findOne({
      where: { username: req.body.username },
    });
    if (usernameExists) {
      return res.status(400).json({
        status: "error",
        message: "Username already in use",
        errors: [{ field: "username", message: "Username already in use" }],
      });
    }

    // Generate OTP
    const otpCode = require("../../utils/genOtp")();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const pendingSignup = await PendingSignup.create({
      email: req.body.email,
      otp: otpCode,
      otpExpires,
      userData: ({
        firstName,
        middleName,
        lastName,
        username,
        email,
        password,
      } = req.body),
    });

    // Save session (implicit with express-session)
    await require("../../utils/mails/signupOtp.mail")({
      user: req.body,
      otpCode,
    });
    console.log("Generated OTP:", otpCode);

    console.log("pendingSignup.id");
    console.log(pendingSignup.id);

    // Return session ID
    res.json({ status: "success", data: { sessionId: pendingSignup.id } });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
