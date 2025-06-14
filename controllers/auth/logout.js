module.exports = (req, res) => {
  // Clear the userToken cookie
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    status: "success",
  });
};
