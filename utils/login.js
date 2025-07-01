const jwt = require("jsonwebtoken");

module.exports = (
  user,
  res,
  expiresIn = "2h",
  expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
) => {
  const token = jwt.sign({ user: user }, process.env.USER_TOKEN_SECRET, {
    expiresIn,
  });

  console.log("New token: ", token);

  return res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    httpOnly: true,
  });
};
