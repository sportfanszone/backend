module.exports = async (req, res) => {
  try {
    const topics = {
      posts: 10,
      followers: 200,
      topContributors: [
        {
          id: 1,
          name: "John",
          profileImage: "/images/blankProfile.png",
        },
        {
          id: 2,
          name: "Jane",
          profileImage: "/images/blankProfile.png",
        },
        {
          id: 3,
          name: "Alice",
          profileImage: "/images/blankProfile.png",
        },
        {
          id: 4,
          name: "Bob",
          profileImage: "/images/blankProfile.png",
        },
        {
          id: 5,
          name: "Charlie",
          profileImage: "/images/blankProfile.png",
        },
        {
          id: 6,
          name: "Dave",
          profileImage: "/images/blankProfile.png",
        },
      ],
    };

    res.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
