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

const app = express();

app.use(express.json());

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
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      "SEEQOUT_SECRET_KEY",
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate(
        "seller",
        "businessName ownerName phone market shop"
      );

    res.json(products);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post("/products", auth, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      market: req.body.market,
      shop: req.body.shop,
      seller: req.body.seller,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product
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

app.get("/search", async (req, res) => {
  try {
    const search = req.query.q || "";

    const products = await Product.find({
      name: {
        $regex: search,
        $options: "i"
      }
    }).populate(
      "seller",
      "businessName ownerName phone market shop"
    );

    res.json(products);

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
    const seller = new Seller({
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
