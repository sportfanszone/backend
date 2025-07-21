module.exports = async (req, res) => {
  try {
    const clubs = [
      { id: 1, name: "Chelsea", logo: "/images/chelsea.png" },
      { id: 2, name: "Arsenal", logo: "/images/arsenalLogo.png" },
      { id: 3, name: "Liverpool", logo: "/images/liverpool.png" },
      {
        id: 4,
        name: "Manchester City",
        logo: "/images/manchesterCityLogo.png",
      },
      {
        id: 5,
        name: "Manchester United",
        logo: "/images/manchesterUnited.png",
      },
      {
        id: 6,
        name: "Tottenham Hotspur",
        logo: "/images/tottenhamHotspur.png",
      },
    ];

    res.status(200).json({
      status: "success",
      clubs,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
