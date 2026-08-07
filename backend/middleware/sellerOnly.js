const sellerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Only registered sellers can add products."
    });
  }

  next();
};

module.exports = sellerOnly;
