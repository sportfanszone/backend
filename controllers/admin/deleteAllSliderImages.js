const path = require("path");
const fs = require("fs").promises;
const { SliderImage } = require("../../models");

module.exports = async (req, res) => {
  const sliderDir = path.join(process.cwd(), "public", "images", "slider");

  try {
    const sliderImages = await SliderImage.findAll({
      attributes: ["url"],
    });

    const deletedCount = await SliderImage.destroy({ where: {} });

    try {
      const files = await fs.readdir(sliderDir);
      const imageFiles = sliderImages.map((image) =>
        image.url.split("/").pop()
      );
      for (const file of files) {
        if (file === ".gitkeep") continue;
        if (imageFiles.includes(file)) {
          const filePath = path.join(sliderDir, file);
          await fs.unlink(filePath).catch((err) => {
            console.error("Failed to delete file:", filePath, err);
          });
        }
      }
    } catch (err) {
      console.error("Error accessing slider directory:", err);
    }

    return res.json({
      status: "success",
      message: `Deleted ${deletedCount} slider image(s)`,
    });
  } catch (error) {
    console.error("Error in deleteAllSliderImages:", error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
