const genToken = require("../../utils/genToken");

// Centralized error messages
const ERROR_MESSAGES = {
  NO_USER: "No user data provided",
  SERVER_ERROR: "An unexpected error occurred",
  OAUTH_ERROR: "OAuth authentication failed",
};

module.exports = async (req, res) => {
  try {
    // Check for OAuth errors
    if (req.authError) {
      console.error("OAuth error:", req.authError);
      return res.status(401).json({
        status: "error",
        message: ERROR_MESSAGES.OAUTH_ERROR,
      });
    }

    const user = req.user;

    // Validate user
    if (!user) {
      console.error("No user in request:", req.user);
      return res.status(401).json({
        status: "error",
        message: ERROR_MESSAGES.NO_USER,
      });
    }

    // Generate JWT token
    const token = genToken(user);
    console.log("Generated token (truncated):", token.slice(0, 10) + "...");

    // Validate environment variable
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error("FRONTEND_URL not set");
      return res.status(500).json({
        status: "error",
        message: ERROR_MESSAGES.SERVER_ERROR,
      });
    }
    return res.redirect(
      302,
      `${frontendUrl}/api/auth/google_callback?token=${token}`
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return res.status(500).json({
      status: "error",
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
