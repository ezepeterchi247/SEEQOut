const Product = require("../models/Product");

exports.searchByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image to search."
      });
    }

    const products = await Product.find()
      .populate(
        "seller",
        "businessName ownerName phone market shop"
      )
      .limit(50);

    return res.json({
      success: true,
      message: "Image received successfully.",
      image: `/uploads/${req.file.filename}`,
      products
    });

  } catch (error) {
    console.log("Image search error:", error);

    return res.status(500).json({
      success: false,
      message: "Image search failed.",
      error: error.message
    });
  }
};
