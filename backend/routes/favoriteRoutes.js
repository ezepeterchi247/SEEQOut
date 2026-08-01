const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  addFavorite,
  getFavorites,
  removeFavorite
} = require("../controllers/favoriteController");

// Add a product to favorites
router.post(
  "/favorites/:productId",
  auth,
  addFavorite
);

// Get all my favorites
router.get(
  "/favorites",
  auth,
  getFavorites
);

// Remove a favorite
router.delete(
  "/favorites/:productId",
  auth,
  removeFavorite
);

module.exports = router;
