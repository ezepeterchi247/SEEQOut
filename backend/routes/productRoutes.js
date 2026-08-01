const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const upload = require("../middleware/upload");

const {
  getProducts,
  createProduct,
  getMyProducts,
  searchProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.get("/products", getProducts);

router.post(
  "/products",
  auth,
  upload.single("image"),
  createProduct
);

router.get("/my-products", auth, getMyProducts);

router.get("/search", searchProducts);

router.put(
  "/products/:id",
  auth,
  upload.single("image"),
  updateProduct
);

router.delete("/products/:id", auth, deleteProduct);

module.exports = router;
