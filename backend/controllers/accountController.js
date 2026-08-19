const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.log("Get profile error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to load profile."
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and phone are required."
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: req.user.userId }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is already in use."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim()
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user
    });
  } catch (err) {
    console.log("Update profile error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to update profile."
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required."
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 6 characters."
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const matches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!matches) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect."
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully."
    });
  } catch (err) {
    console.log("Change password error:", err);
    res.status(500).json({
      success: false,
      message: "Unable to change password."
    });
  }
};
