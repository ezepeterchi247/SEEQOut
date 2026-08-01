const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// Add a product to favorites
exports.addFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user.userId,
      product: req.params.productId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already in favorites."
      });
    }

    const favorite = new Favorite({
      user: req.user.userId,
      product: req.params.productId
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: "Product added to favorites!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get my favorite products
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user.userId
    }).populate("product");

    res.json({
      success: true,
      favorites
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Remove a favorite
exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.userId,
      product: req.params.productId
    });

    res.json({
      success: true,
      message: "Favorite removed successfully!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
