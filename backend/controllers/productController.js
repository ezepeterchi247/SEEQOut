const Product = require("../models/Product");
const Seller = require("../models/Seller");

exports.getProducts = async (req, res) => {
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
};
exports.createProduct = async (req, res) => {
  try {

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      market: req.body.market,
      shop: req.body.shop,
      seller: seller._id,
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
};

exports.getMyProducts = async (req, res) => {
  try {

    const seller = await Seller.findOne({
      user: req.user.userId
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found."
      });
    }

    const products = await Product.find({
      seller: seller._id
    }).populate(
      "seller",
      "businessName ownerName phone market shop"
    );

    res.json({
      success: true,
      products
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
exports.searchProducts = async (req, res) => {
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
};
