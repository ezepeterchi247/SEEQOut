const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Review = require("../models/Review");

exports.getSellerPage = async (req, res) => {
  try {

    const seller = await Seller.findById(req.params.sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found."
      });
    }

    const products = await Product.find({
      seller: seller._id
    });

    const reviews = await Review.find({
      seller: seller._id
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / totalReviews;

    res.json({
      success: true,
      seller,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      products
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.contactSeller = async (req, res) => {
  try {

    const seller = await Seller.findById(req.params.sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found."
      });
    }

    const phone = seller.phone.replace(/\D/g, "");

    res.json({
      success: true,
      businessName: seller.businessName,
      phone: seller.phone,
      whatsapp: `https://wa.me/234${phone.slice(-10)}`
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
