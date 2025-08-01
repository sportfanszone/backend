module.exports = async (req, res) => {
  try {
    const { club: clubId } = req.query;

    const topics = await require("./../../utils/getPosts")({
      clubId,
      userId: req.user.id,
    });

    const topContributors = [
      {
        id: 1,
        firstName: "John",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 2,
        firstName: "Jane",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 3,
        firstName: "Alice",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 4,
        firstName: "Bob",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 5,
        firstName: "Charlie",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 6,
        firstName: "Dave",
        profileImageUrl: "/images/blankProfile.png",
      },
    ];

    res.json({ status: "success", topics, topContributors });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
