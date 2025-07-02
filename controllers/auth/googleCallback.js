const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const user = req.user.toJSON();

    if (!user) {
      return res.status(500).json({
        status: "error",
        message: "An unexpected error occurred",
      });
    }

    let expiresIn = "2h";
    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    // Generate JWT token
    const token = jwt.sign({ user: user }, process.env.USER_TOKEN_SECRET, {
      expiresIn,
    });

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires,
    });
    res.redirect(`${process.env.FRONTEND_URL}/user/dashboard`);
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
