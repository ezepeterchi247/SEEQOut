const Review = require("../models/Review");
const Seller = require("../models/Seller");

// Add a review
exports.addReview = async (req, res) => {
  try {

    const seller = await Seller.findById(req.params.sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found."
      });
    }

    const existing = await Review.findOne({
      user: req.user.userId,
      seller: seller._id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this seller."
      });
    }

    const review = new Review({
      user: req.user.userId,
      seller: seller._id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      review
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Get reviews for a seller
exports.getSellerReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      seller: req.params.sellerId
    }).populate("user", "name email");

    const total = reviews.length;

    const average =
      total === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) / total;

    res.json({
      success: true,
      averageRating: Number(average.toFixed(1)),
      totalReviews: total,
      reviews
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
