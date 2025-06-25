const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    console.log("My message");
    console.log(req.body);

    // Check if user exsits
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email or password is not correct",
        errors: [
          { field: "email", message: "Email or password is not correct" },
          { field: "password", message: "Email or password is not correct" },
        ],
      });
    }

    // Check if password is correct
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCorrect) {
      return res.status(400).json({
        status: "error",
        message: "Email or password is not correct",
        errors: [
          { field: "email", message: "Email or password is not correct" },
          { field: "password", message: "Email or password is not correct" },
        ],
      });
    }

    let expiresIn = "2h";
    let expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (req.body.rememberMe && req.body.rememberMe === "on") {
      expiresIn = "3d";
      expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

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

    res.json({ status: "success" });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
