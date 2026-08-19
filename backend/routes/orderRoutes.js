const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const sellerAuth = require("../middleware/sellerAuth");

const {
  createOrder,
  getMyOrders,
  getSellerOrders,
  acceptOrder,
  rejectOrder,
  deliverOrder
} = require("../controllers/orderController");

router.post("/orders/:productId", auth, createOrder);

router.get("/orders", auth, getMyOrders);

router.get(
  "/orders/seller",
  sellerAuth,
  getSellerOrders
);

router.patch(
  "/orders/:orderId/accept",
  sellerAuth,
  acceptOrder
);

router.patch(
  "/orders/:orderId/reject",
  sellerAuth,
  rejectOrder
);

router.patch(
  "/orders/:orderId/deliver",
  sellerAuth,
  deliverOrder
);

module.exports = router;
