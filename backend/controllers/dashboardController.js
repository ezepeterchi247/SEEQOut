const Product = require("../models/Product");
const Favorite = require("../models/Favorite");
const Review = require("../models/Review");
const Seller = require("../models/Seller");

exports.getDashboard = async (req, res) => {
  try {

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const totalProducts = await Product.countDocuments({
      seller: seller._id
    });

    const reviews = await Review.find({
      seller: seller._id
    });

    const totalReviews = reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {
      averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews;
    }

    const sellerProducts = await Product.find({
      seller: seller._id
    }).select("_id");

    const productIds = sellerProducts.map(product => product._id);

    const totalFavorites = await Favorite.countDocuments({
      product: { $in: productIds }
    });

    res.json({
      success: true,
      dashboard: {
        totalProducts,
        totalFavorites,
        totalReviews,
        averageRating: Number(averageRating.toFixed(1))
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
