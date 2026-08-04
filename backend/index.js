require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Market = require("./models/Market");
const Product = require("./models/Product");
const Seller = require("./models/Seller");
const User = require("./models/User");
const auth = require("./middleware/auth");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const recentlyViewedRoutes = require("./routes/recentlyViewedRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", favoriteRoutes);
app.use("/", reviewRoutes);
app.use("/", sellerRoutes);
app.use("/", recentlyViewedRoutes);
app.use("/", dashboardRoutes);
app.use("/", orderRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    app: "SEEQOut",
    version: "1.0.0",
    status: "Running",
    message: "Welcome to SEEQOut API"
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.get("/markets", async (req, res) => {
  try {
    const markets = await Market.find();

    res.json(markets);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/sellers", async (req, res) => {
  try {
    const sellers = await Seller.find();

    res.json(sellers);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
app.get("/seed", async (req, res) => {
  try {
    await Market.deleteMany({});

    await Market.create({
      name: "Arena Market",
      city: "Lagos",
      state: "Lagos",
      description: "Nigeria's largest footwear market"
    });

    res.json({
      success: true,
      message: "Market added successfully!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/seed-seller", async (req, res) => {
  try {
const user = await User.findOne({
  email: "jane@example.com"
});

if (!user) {
  return res.json({
    success: false,
    message: "User not found. Register Jane first."
  });
}
    const seller = new Seller({
      user: user._id,
      businessName: "John Shoes",
      ownerName: "John Okafor",
      phone: "08012345678",
      email: "john@example.com",
      market: "Arena Market",
      shop: "A17",
      address: "Arena Market, Oshodi, Lagos"
    });

    await seller.save();

    res.json({
      success: true,
      message: "Seller added successfully!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/seed-product", async (req, res) => {
  try {
    const seller = await Seller.findOne({
      businessName: "John Shoes"
    });

    if (!seller) {
      return res.json({
        success: false,
        message: "Seller not found. Seed a seller first."
      });
    }

    const product = new Product({
      name: "Nike Air Max",
      category: "Footwear",
      market: "Arena Market",
      shop: "A17",
      seller: seller._id,
      price: 45000,
      image: "",
      description: "Original Nike Air Max sneakers"
    });

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
