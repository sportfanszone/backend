// controllers/addSliderImage.js
const path = require("path");
const { SliderImage } = require("../../models");
const { uploadAsync } = require("../../middlewares/sliderUpload");
const deleteUploadedFiles = require("../../utils/deleteUploadedFiles");

module.exports = async (req, res) => {
  const MAX_IMAGES = 5;
  const filePath = path.join(process.cwd(), "public", "images", "slider");

  try {
    await uploadAsync(req, res);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No image files uploaded",
      });
    }

    const uploadedImages = req.files;
    const savedImages = [];

    const currentImageCount = await SliderImage.count();
    if (currentImageCount + req.files.length > MAX_IMAGES) {
      deleteUploadedFiles(req.files, filePath);
      return res.status(400).json({
        status: "error",
        message: `Cannot upload more than ${MAX_IMAGES} images`,
      });
    }

    for (const file of uploadedImages) {
      const imageUrl = `${process.env.BACKEND_URL}/images/slider/${file.filename}`;

      const sliderImage = await SliderImage.create({
        url: imageUrl,
        name: file.originalname,
        size: file.size,
      });

      savedImages.push({
        id: sliderImage.id,
        url: sliderImage.url,
        name: sliderImage.name,
        size: sliderImage.size,
      });
    }

    return res.json({
      status: "success",
      message: `Successfully uploaded ${savedImages.length} image(s)`,
      data: savedImages,
    });
  } catch (error) {
    deleteUploadedFiles(req.files, filePath);
    console.error("Error in addSliderImage:", error);

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "error",
          message: "File size too large. Maximum file size is 5MB",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Failed to upload file",
        });
      }
    }

    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};
