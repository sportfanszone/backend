const { SliderImage } = require("../../models");

module.exports = async (req, res) => {
  try {
    const sliderImages = await SliderImage.findAll({
      attributes: ["id", "url", "name", "size"],
    });

    return res.json({
      status: "success",
      data: sliderImages,
    });
  } catch (error) {
    console.error("Error in getSliderImages:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch slider images",
    });
  }
};
