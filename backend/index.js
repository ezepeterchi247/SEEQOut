require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const Market = require("./models/Market");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    app: "SEEQOut",
    version: "1.0.0",
    status: "Running",
    message: "Welcome to SEEQOut API"
  });
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
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
app.get("/search", (req, res) => {
  const search = req.query.q?.toLowerCase() || "";

  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      category: "Footwear",
      market: "Arena Market",
      shop: "A17",
      price: "₦45,000",
      seller: "John Shoes"
    },
    {
      id: 2,
      name: "Adidas Superstar",
      category: "Footwear",
      market: "Arena Market",
      shop: "B12",
      price: "₦38,000",
      seller: "Kings Footwear"
    },
    {
      id: 3,
      name: "School Sandals",
      category: "Children",
      market: "Balogun Market",
      shop: "C20",
      price: "₦12,000",
      seller: "Happy Kids"
    }
  ];

  const results = products.filter(product =>
    product.name.toLowerCase().includes(search)
  );

  res.json(results);
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
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
app.get("/seed-product", async (req, res) => {
  try {
    const product = new Product({
      name: "Nike Air Max",
      category: "Footwear",
      market: "Arena Market",
      shop: "A17",
      seller: "John Shoes",
      price: 45000,
      image: "",
      description: "Original Nike Air Max sneakers"
    });

    await product.save();

    res.json({
      success: true,
      message: "Product added successfully!"
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
