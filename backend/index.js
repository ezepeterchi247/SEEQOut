const express = require("express");

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.json({
    app: "SEEQOut",
    version: "1.0.0",
    status: "Running",
    message: "Welcome to SEEQOut API"
  });
});

app.get("/markets", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Arena Market",
      city: "Lagos",
      state: "Lagos"
    },
    {
      id: 2,
      name: "Balogun Market",
      city: "Lagos",
      state: "Lagos"
    },
    {
      id: 3,
      name: "Computer Village",
      city: "Lagos",
      state: "Lagos"
    },
    {
      id: 4,
      name: "Trade Fair",
      city: "Lagos",
      state: "Lagos"
    }
  ]);
});
app.get("/products", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Nike Air Max",
      category: "Footwear",
      market: "Arena Market",
      shop: "A17",
      price: "₦45,000",
      seller: "John Shoes"
    },
    {
      id: 2,
      name: "Adidas Superstar",
      category: "Footwear",
      market: "Arena Market",
      shop: "B12",
      price: "₦38,000",
      seller: "Kings Footwear"
    }
  ]);
});
app.get("/search", (req, res) => {
  const search = req.query.q?.toLowerCase() || "";

  const products = [
    {
      id: 1,
      name: "Nike Air Max",
      category: "Footwear",
      market: "Arena Market",
      shop: "A17",
      price: "₦45,000",
      seller: "John Shoes"
    },
    {
      id: 2,
      name: "Adidas Superstar",
      category: "Footwear",
      market: "Arena Market",
      shop: "B12",
      price: "₦38,000",
      seller: "Kings Footwear"
    },
    {
      id: 3,
      name: "School Sandals",
      category: "Children",
      market: "Balogun Market",
      shop: "C20",
      price: "₦12,000",
      seller: "Happy Kids"
    }
  ];

  const results = products.filter(product =>
    product.name.toLowerCase().includes(search)
  );

  res.json(results);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
