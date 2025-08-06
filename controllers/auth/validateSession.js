const { PendingSignup } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log("Current sessionId:", sessionId);

    if (!sessionId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP session",
      });
    }

    const pendingSignup = await PendingSignup.findOne({
      where: { id: sessionId },
    });

    if (!pendingSignup || pendingSignup.otpExpires < Date.now()) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired OTP session",
      });
    }

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error in validate-session:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
