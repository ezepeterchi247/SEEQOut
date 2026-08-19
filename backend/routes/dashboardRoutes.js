const express = require("express");
const router = express.Router();

const sellerAuth = require("../middleware/sellerAuth");
const { getDashboard } = require("../controllers/dashboardController");

router.get("/dashboard", sellerAuth, getDashboard);

module.exports = router;
