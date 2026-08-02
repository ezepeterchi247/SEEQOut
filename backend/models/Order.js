const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  quantity: {
    type: Number,
    default: 1
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Rejected",
      "Cancelled",
      "Delivered"
    ],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", orderSchema);
