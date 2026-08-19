const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/accountController");

router.get("/account/profile", auth, getProfile);
router.put("/account/profile", auth, updateProfile);
router.put("/account/password", auth, changePassword);

module.exports = router;
