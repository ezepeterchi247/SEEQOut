const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: "Nigeria"
  }
});

module.exports = mongoose.model("Market", MarketSchema);
