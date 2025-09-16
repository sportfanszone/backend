module.exports = async () => {
  try {
    const achievements = [
      {
        name: "",
        image: "/images/activeFan.jpg",
      },
      {
        name: "",
        image: "/images/fansInfluencer.jpg",
      },
      {
        name: "",
        image: "/images/topContributor.jpg",
      },
      {
        name: "",
        image: "/images/viralFan.jpg",
      },
    ];

    return achievements;
  } catch (error) {
    console.log(`Error getting user's achievements: ${error}`);
    throw new Error(error);
  }
};
