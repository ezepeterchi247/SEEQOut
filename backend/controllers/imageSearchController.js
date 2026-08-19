const imageSearchService = require("../services/imageSearchService");

exports.searchByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image to search.",
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const products = await imageSearchService.findVisualMatches({
      imagePath,
    });

    return res.json({
      success: true,
      message: "Image search completed successfully.",
      image: imagePath,
      products,
    });
  } catch (error) {
    console.log("Image search error:", error);

    return res.status(500).json({
      success: false,
      message: "Image search failed.",
      error: error.message,
    });
  }
};
