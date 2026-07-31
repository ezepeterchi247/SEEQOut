require("dotenv").config();

const express = require("express");
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

const app = express();

app.use(express.json());

app.use("/", authRoutes);
app.use("/", productRoutes);

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
app.put("/products/:id", auth, async (req, res) => {
  try {

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.market = req.body.market || product.market;
    product.shop = req.body.shop || product.shop;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.description =
      req.body.description || product.description;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully!",
      product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
app.delete("/products/:id", auth, async (req, res) => {
  try {

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    await Product.deleteOne({
      _id: product._id
    });

    res.json({
      success: true,
      message: "Product deleted successfully!"
    });

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
