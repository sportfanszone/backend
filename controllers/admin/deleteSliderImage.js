const { SliderImage } = require("../../models");
const path = require("path");
const fs = require("fs").promises;

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const sliderImage = await SliderImage.findByPk(id);
    if (!sliderImage) {
      return res.status(404).json({
        status: "error",
        message: "Image not found",
      });
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "slider",
      sliderImage.url.split("/").pop()
    );
    await fs.unlink(filePath).catch((err) => {
      console.error("Error deleting file:", err);
    });

    await sliderImage.destroy();

    return res.json({
      status: "success",
      message: "Image has been removed from the slider",
    });
  } catch (error) {
    console.error("Error in deleteSliderImage:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
