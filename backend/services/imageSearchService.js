const path = require("path");
const Product = require("../models/Product");
const { generateImageEmbedding } = require("./embeddingService");
const { rankProducts } = require("./visualSearchEngine");

/**
 * SEEQOut VISUAL SEARCH SERVICE
 *
 * Pipeline:
 *
 * Buyer Image
 *     ↓
 * Image Embedding
 *     ↓
 * Products with visual embeddings
 *     ↓
 * Visual similarity ranking
 *     ↓
 * Clean ranked product results
 *
 * Embeddings remain backend-only.
 */
exports.findVisualMatches = async ({ imagePath }) => {
  if (!imagePath) {
    throw new Error("Search image is required.");
  }

  const relativePath = imagePath.startsWith("/")
    ? imagePath.slice(1)
    : imagePath;

  const filesystemPath = path.join(
    __dirname,
    "..",
    relativePath
  );

  // Generate the buyer's query embedding.
  const queryEmbedding =
    await generateImageEmbedding(filesystemPath);

  // Only indexed products participate in visual search.
  const products = await Product.find({
    "visualEmbeddings.0": { $exists: true }
  })
    .populate(
      "seller",
      "businessName ownerName phone market shop"
    )
    .limit(100);

  // Rank using the strongest matching product image.
  const rankedResults =
    rankProducts(queryEmbedding, products);

  /*
   * IMPORTANT:
   * Never send visualEmbeddings to the mobile app.
   * They are internal search data only.
   */
  return rankedResults.map((result) => {
    const product = result.product.toObject
      ? result.product.toObject()
      : { ...result.product };

    delete product.visualEmbeddings;

    return {
      product,
      similarity: result.similarity
    };
  });
};
