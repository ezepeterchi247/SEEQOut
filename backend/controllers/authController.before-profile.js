const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Seller = require("../models/Seller");

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      businessName,
      market,
      shop,
      address
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and password are required."
      });
    }

    const accountRole = role || "buyer";

    if (!["buyer", "seller"].includes(accountRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role."
      });
    }

    if (accountRole === "seller") {
      if (!businessName || !market || !shop) {
        return res.status(400).json({
          success: false,
          message: "Business name, market and shop number are required for sellers."
        });
      }
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
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
      role: accountRole
    });

    await user.save();

    let seller = null;

    if (user.role === "seller") {
      seller = new Seller({
        user: user._id,
        businessName,
        ownerName: fullName,
        phone,
        email,
        market,
        shop,
        address: address || ""
      });

      await seller.save();
    }

    user.password = undefined;
    res.status(201).json({
      success: true,
      message:
        user.role === "seller"
          ? "Seller account created successfully!"
          : "Buyer account created successfully!",
      user,
      seller
    });

  } catch (err) {
    console.log("Registration error:", err);

    res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
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
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    user.password = undefined;
    res.json({
      success: true,
      message: "Login successful!",
      token,
      user
    });

  } catch (err) {
    console.log("Login error:", err);

    res.status(500).json({
      success: false,
      message: "Login failed.",
      error: err.message
    });
  }
};
