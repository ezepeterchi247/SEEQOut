const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getProducts,
  createProduct
} = require("../controllers/productController");

router.get("/products", getProducts);

router.post("/products", auth, createProduct);

module.exports = router;
