const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const sellerAuth = require("../middleware/sellerAuth");
const upload = require("../middleware/upload");

const {
  getProducts,
  getProductById,
  createProduct,
  getMyProducts,
  searchProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post(
  "/products",
  sellerAuth,
  upload.array("image", 4),
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

router.delete(
  "/products/:id",
  auth,
  deleteProduct
);

module.exports = router;
