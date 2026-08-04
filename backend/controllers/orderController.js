const Order = require("../models/Order");
const Product = require("../models/Product");
const Seller = require("../models/Seller");

// Create Order
exports.createOrder = async (req, res) => {
  try {

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    const order = new Order({
      buyer: req.user.userId,
      seller: product.seller,
      product: product._id,
      quantity: req.body.quantity || 1
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// My Orders
exports.getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      buyer: req.user.userId
    })
      .populate("product")
      .populate("seller", "businessName ownerName phone");

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
// Seller Orders
exports.getSellerOrders = async (req, res) => {
  try {

    const Seller = require("../models/Seller");

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const orders = await Order.find({
      seller: seller._id
    })
      .populate("buyer", "email")
      .populate("product");

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
// Accept Order
exports.acceptOrder = async (req, res) => {
  try {

    const Seller = require("../models/Seller");

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const order = await Order.findOne({
      _id: req.params.orderId,
      seller: seller._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

if (order.status !== "Pending") {
  return res.status(400).json({
    success: false,
    message: `Only pending orders can be accepted. Current status: ${order.status}`
  });
}

    order.status = "Accepted";

    await order.save();

    res.json({
      success: true,
      message: "Order accepted successfully!",
      order
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};
// Reject Order
exports.rejectOrder = async (req, res) => {
  try {

    const Seller = require("../models/Seller");

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const order = await Order.findOne({
      _id: req.params.orderId,
      seller: seller._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

if (order.status !== "Pending") {
  return res.status(400).json({
    success: false,
    message: `Only pending orders can be rejected. Current status: ${order.status}`
  });
}

    order.status = "Rejected";

    await order.save();

    res.json({
      success: true,
      message: "Order rejected successfully!",
      order
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};
// Deliver Order
exports.deliverOrder = async (req, res) => {
  try {

    const Seller = require("../models/Seller");

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const order = await Order.findOne({
      _id: req.params.orderId,
      seller: seller._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

if (order.status !== "Accepted") {
  return res.status(400).json({
    success: false,
    message: `Only accepted orders can be delivered. Current status: ${order.status}`
  });
}

    order.status = "Delivered";

    await order.save();

    res.json({
      success: true,
      message: "Order marked as delivered!",
      order
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};
