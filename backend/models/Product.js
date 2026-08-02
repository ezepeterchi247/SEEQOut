const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  brand: {
    type: String,
    default: ""
  },

  gender: {
    type: String,
    enum: ["Men", "Women", "Children", "Unisex"],
    default: "Unisex"
  },

  market: {
    type: String,
    required: true
  },

  shop: {
    type: String,
    required: true
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
  ref: "Seller",
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    default: ""
  },

  description: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
