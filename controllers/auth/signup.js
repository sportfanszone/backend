module.exports = (req, res) => {
  console.log("My message");
  console.log(req.body);
  res.cookie("allowOtp", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // maxAge: 3 * 60 * 1000,
    maxAge: 3 * 1000,
    sameSite: "lax",
    path: "/",
  });
  res.json({ status: "success" });
};
