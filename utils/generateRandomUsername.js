module.exports = (email) => {
  if (!email || typeof email !== "string") return "user";

  const atIndex = email.indexOf("@");
  if (atIndex === -1) return "user";

  return email.slice(0, atIndex);
};
