module.exports = async (req, res) => {
  try {
    const topics = {
      posts: 10,
      followers: 200,
      topics: [
        {
          id: 1,
          title:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam.",
          likes: 10,
          comments: 5,
          upVotes: 20,
          createdAt: "10:02AM",
          user: {
            firstName: "John",
            middleName: "Doe",
            lastName: "Nna",
            profileImageUrl: "/images/blankProfile.png",
          },
        },
        {
          id: 2,
          title: "Lorem ipsum dolor sit, amet consectetur adipisicing.",
          likes: 10,
          comments: 5,
          upVotes: 20,
          createdAt: "10:02AM",
          user: {
            firstName: "John",
            middleName: "Doe",
            lastName: "Nna",
            profileImageUrl: "/images/blankProfile.png",
          },
        },
        {
          id: 3,
          title: "Lorem ipsum dolor sit, amet consectetur adipisicing.",
          likes: 10,
          comments: 5,
          upVotes: 20,
          createdAt: "10:02AM",
          user: {
            firstName: "John",
            middleName: "Doe",
            lastName: "Nna",
            profileImageUrl: "/images/blankProfile.png",
          },
        },
        {
          id: 1,
          title:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit, voluptatum.",
          likes: 10,
          comments: 5,
          upVotes: 20,
          createdAt: "10:02AM",
          user: {
            firstName: "John",
            middleName: "Doe",
            lastName: "Nna",
            profileImageUrl: "/images/blankProfile.png",
          },
        },
        {
          id: 2,
          title:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit, tum.",
          likes: 10,
          comments: 5,
          upVotes: 20,
          createdAt: "10:02AM",
          user: {
            firstName: "John",
            middleName: "Doe",
            lastName: "Nna",
            profileImageUrl: "/images/blankProfile.png",
          },
        },
        {
          id: 3,
          title:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, voluptatum.",
          likes: 10,
          comments: 5,
          upVotes: 20,
          createdAt: "10:02AM",
          user: {
            firstName: "John",
            middleName: "Doe",
            lastName: "Nna",
            profileImageUrl: "/images/blankProfile.png",
          },
        },
      ],
      topContributors: [
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
      ],
    };

    res.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
