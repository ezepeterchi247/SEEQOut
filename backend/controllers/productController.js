const Product = require("../models/Product");
const Seller = require("../models/Seller");

exports.getProducts = async (req, res) => {
  try {

const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;


    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    if (req.query.gender) {
      filter.gender = req.query.gender;
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(filter)
  .skip(skip)
  .limit(limit)
      .populate(
        "seller",
        "businessName ownerName phone market shop"
      );

    res.json({
  success: true,
  page,
  limit,
  totalProducts,
  totalPages,
  products
});

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
exports.createProduct = async (req, res) => {
  try {

   if (!req.files || req.files.length !== 4) {
  return res.status(400).json({
    success: false,
    message: "Please upload exactly 4 product photos: front, side, back, and detail."
  });
}

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
      brand: req.body.brand,
      gender: req.body.gender,
      market: req.body.market,
      shop: req.body.shop,
      seller: seller._id,
      price: req.body.price,
      image: req.files && req.files.length > 0
  ? `/uploads/${req.files[0].filename}`
  : "",

images: req.files
  ? req.files.map(
      (file) => `/uploads/${file.filename}`
    )
  : [],

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
    product.brand = req.body.brand || product.brand;
    product.gender = req.body.gender || product.gender;
    product.market = req.body.market || product.market;
    product.shop = req.body.shop || product.shop;
    product.price = req.body.price || product.price;
    if (req.files && req.files.length > 0) {
      if (req.files.length !== 4) {
        return res.status(400).json({
          success: false,
          message: "Please upload exactly 4 product photos: front, side, back, and detail."
        });
      }

      product.images = req.files.map((file) => `/uploads/${file.filename}`);
      product.image = product.images[0];
      product.visualEmbeddings = [];
    }
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

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "businessName ownerName phone market shop"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
