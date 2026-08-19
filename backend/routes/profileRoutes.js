const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/profileController");

router.get("/profile", auth, getProfile);
router.patch("/profile", auth, updateProfile);
router.patch("/profile/password", auth, changePassword);

module.exports = router;
