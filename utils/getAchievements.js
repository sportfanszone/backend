module.exports = async () => {
  try {
    const achievements = [
      {
        name: "",
        image: "/images/blankProfile.png",
      },
      {
        name: "",
        image: "/images/blankProfile.png",
      },
      {
        name: "",
        image: "/images/blankProfile.png",
      },
      {
        name: "",
        image: "/images/blankProfile.png",
      },
    ];

    return achievements;
  } catch (error) {
    console.log(`Error getting user's achievements: ${error}`);
    throw new Error(error);
  }
};
