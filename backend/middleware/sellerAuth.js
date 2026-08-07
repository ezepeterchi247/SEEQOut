const auth = require("./auth");

const sellerAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Seller access required."
      });
    }

    next();
  });
};

module.exports = sellerAuth;
