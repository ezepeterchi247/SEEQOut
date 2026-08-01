const express = require("express");
const router = express.Router();

const {
  getSellerPage,
  contactSeller
} = require("../controllers/sellerController");

// Public seller page
router.get(
  "/seller/:sellerId",
  getSellerPage
);

router.get(
  "/seller/:sellerId/contact",
  contactSeller
);

module.exports = router;
