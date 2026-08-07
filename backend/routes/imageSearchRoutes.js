const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { searchByImage } = require("../controllers/imageSearchController");

router.post(
  "/image-search",
  upload.single("image"),
  searchByImage
);

module.exports = router;
