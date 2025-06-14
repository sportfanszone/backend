module.exports = async (req, res) => {
  try {
    // Check if OTP is provided
    if (!req.body.otp) {
      return res.status(400).json({
        status: "error",
        message: "OTP is required",
      });
    }

    // Check if OTP has expired
    if (Date.now() > req.session.otpExpires) {
      return res.status(400).json({
        status: "error",
        message: "OTP has expired",
      });
    }

    // Check if OTP is valid
    if (!req.session.otp || req.session.otp !== req.body.otp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OTP please try again",
      });
    }

    //   Create user
    const userCreated = await require("../../utils/createUser")(
      req.session.user
    );
    if (!userCreated) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create user",
      });
    }
    console.log("User created successfully:", userCreated);

    res.clearCookie("allowOtp");
    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
