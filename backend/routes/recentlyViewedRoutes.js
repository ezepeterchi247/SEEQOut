const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  addRecentlyViewed,
  getRecentlyViewed
} = require("../controllers/recentlyViewedController");

// Save a viewed product
router.post(
  "/recently-viewed/:productId",
  auth,
  addRecentlyViewed
);

// Get user's recently viewed products
router.get(
  "/recently-viewed",
  auth,
  getRecentlyViewed
);

module.exports = router;
