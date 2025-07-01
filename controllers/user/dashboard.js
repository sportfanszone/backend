module.exports = async (req, res) => {
  try {
    const profileViews = [
      {
        id: 1,
        firstName: "Amaka",
        middleName: "Chisom",
        lastName: "Okeke",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 2,
        firstName: "Tunde",
        middleName: "Ayoola",
        lastName: "Fashola",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 3,
        firstName: "Blessing",
        middleName: "Ngozi",
        lastName: "Umeh",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 4,
        firstName: "Michael",
        middleName: "Ifeanyi",
        lastName: "Ojo",
        profileImageUrl: "/images/blankProfile.png",
      },
      {
        id: 5,
        firstName: "Fatima",
        middleName: "Zainab",
        lastName: "Bello",
        profileImageUrl: "/images/blankProfile.png",
      },
    ];

    console.log("Hello ");
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({ status: "success", profileViews });
  } catch (error) {
    console.error("Error in dashboard controller:", error);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      errors: [{ message: "Internal server error" }],
    });
  }
};
