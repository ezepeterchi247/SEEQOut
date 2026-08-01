const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  addReview,
  getSellerReviews
} = require("../controllers/reviewController");

// Add a review
router.post(
  "/reviews/:sellerId",
  auth,
  addReview
);

// Get all reviews for a seller
router.get(
  "/reviews/:sellerId",
  getSellerReviews
);

module.exports = router;
