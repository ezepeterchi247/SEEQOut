const RecentlyViewed = require("../models/RecentlyViewed");
const Product = require("../models/Product");

// Save a viewed product
exports.addRecentlyViewed = async (req, res) => {
  try {

    const existing = await RecentlyViewed.findOne({
      user: req.user.userId,
      product: req.params.productId
    });

    if (existing) {

      existing.updatedAt = new Date();

      await existing.save();

      return res.json({
        success: true,
        message: "Recently viewed updated."
      });
    }

    await RecentlyViewed.create({
      user: req.user.userId,
      product: req.params.productId
    });

    res.status(201).json({
      success: true,
      message: "Product added to recently viewed."
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get recently viewed products
exports.getRecentlyViewed = async (req, res) => {
  try {

    const recentlyViewed = await RecentlyViewed.find({
      user: req.user.userId
    })
      .populate("product")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      recentlyViewed
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
