const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const RecentlyViewed = require("../models/RecentlyViewed");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const [favoriteCount, recentlyViewedCount] = await Promise.all([
      Favorite.countDocuments({ user: req.user.userId }),
      RecentlyViewed.countDocuments({ user: req.user.userId })
    ]);

    res.json({
      success: true,
      user,
      stats: {
        favoriteCount,
        recentlyViewedCount
      }
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
    const { fullName, email, phone, interests } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "That email is already in use."
        });
      }

      user.email = email.trim().toLowerCase();
    }

    if (phone && phone !== user.phone) {
      const existingPhone = await User.findOne({
        phone: phone.trim(),
        _id: { $ne: user._id }
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "That phone number is already in use."
        });
      }

      user.phone = phone.trim();
    }

    if (fullName !== undefined) {
      user.fullName = fullName.trim();
    }

    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests
        : [];
    }

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser
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
        message: "New password must be at least 6 characters."
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
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
