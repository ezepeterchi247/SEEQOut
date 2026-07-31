const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getProducts,
  createProduct,
  getMyProducts,
  searchProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.get("/products", getProducts);

router.post("/products", auth, createProduct);

router.get("/my-products", auth, getMyProducts);

router.get("/search", searchProducts);

router.put("/products/:id", auth, updateProduct);

router.delete("/products/:id", auth, deleteProduct);

module.exports = router;
