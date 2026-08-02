const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

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

router.get("/orders/seller", auth, getSellerOrders);

router.patch("/orders/:orderId/accept", auth, acceptOrder);

router.patch("/orders/:orderId/reject", auth, rejectOrder);

router.patch("/orders/:orderId/deliver", auth, deliverOrder);

module.exports = router;
