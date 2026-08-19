const path = require("path");
const { generateImageEmbedding } = require("./embeddingService");

/**
 * Generate visual embeddings for all four canonical SEEQOut product images.
 *
 * Product.images stores API paths such as:
 *   /uploads/example.jpg
 *
 * This service converts those API paths into filesystem paths before
 * passing them to the embedding provider.
 */
async function generateProductEmbeddings(imagePaths) {
  if (!Array.isArray(imagePaths) || imagePaths.length !== 4) {
    throw new Error(
      "Exactly 4 product images are required to generate product embeddings."
    );
  }

  const embeddings = [];

  for (const imagePath of imagePaths) {
    if (!imagePath) {
      throw new Error("Product image path is missing.");
    }

    const relativePath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    const filesystemPath = path.join(__dirname, "..", relativePath);

    const embedding = await generateImageEmbedding(filesystemPath);
    embeddings.push(embedding);
  }

  return embeddings;
}

module.exports = {
  generateProductEmbeddings,
};
