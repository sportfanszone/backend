const { User } = require("../../models");

module.exports = async (req, res) => {
  try {
    console.log("req.body");
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

    //   Create user
    const userCreated = await require("../../utils/createUser")(req.body);
    if (!userCreated) {
      return res.status(500).json({
        status: "error",
        message: "Failed to create user",
      });
    }
    console.log("User created successfully:", userCreated);

    return res.json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
