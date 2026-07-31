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
exports.updateProduct = async (req, res) => {
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

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.market = req.body.market || product.market;
    product.shop = req.body.shop || product.shop;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.description =
      req.body.description || product.description;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully!",
      product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
exports.deleteProduct = async (req, res) => {
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

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: seller._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully!"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
