module.exports = (req, res) => {
  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ loggedIn: false });

  res.json({ loggedIn: true });
};
