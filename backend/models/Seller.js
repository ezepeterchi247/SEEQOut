const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
  businessName: {
    type: String,
    required: true
  },

  ownerName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    default: ""
  },

  market: {
    type: String,
    required: true
  },

  shop: {
    type: String,
    required: true
  },

  address: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Seller", sellerSchema);
