module.exports = (req, res) => {
  console.log("Verifying login status...");
  console.log(req.cookies);
  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ loggedIn: false });

  res.json({ loggedIn: true });
};
