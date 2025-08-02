const jwt = require("jsonwebtoken");
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

    // Set secure cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      path: "/",
    });

    console.log("Cookie set with token:", token);

    // Redirect to dashboard
    return res.redirect(`${process.env.FRONTEND_URL}/user/dashboard`);
  } catch (error) {
    console.error("Google callback error:", error);
    return res.status(500).json({
      status: "error",
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};
