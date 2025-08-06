const genToken = require("../../utils/genToken");
const { PendingSignup } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log("Current OTP:", otp);

    // Check if OTP is provided
    if (!otp) {
      return res.status(400).json({
        status: "error",
        message: "OTP is required",
      });
    }

    const pendingSignup = await PendingSignup.findOne({
      where: { otp },
    });

    // Check if session is valid
    if (!pendingSignup) {
      return res.status(400).json({
        status: "error",
        message: "Invalid otp",
      });
    }

    // Check if OTP has expired
    if (Date.now() > pendingSignup.otpExpires) {
      await PendingSignup.destroy({ where: { otp } });
      return res.status(400).json({
        status: "error",
        message: "OTP has expired",
      });
    }

    // Create user
    const userCreated = await require("../../utils/createUser")(
      pendingSignup.userData
    );
    if (!userCreated) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create user",
      });
    }
    console.log("User created successfully:", userCreated);

    // Generate JWT token
    const token = genToken(userCreated.user);

    return res.json({
      status: "success",
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
