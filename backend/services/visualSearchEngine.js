/**
 * SEEQOut VISUAL SEARCH ENGINE
 *
 * This module is responsible for visual similarity.
 *
 * Pipeline:
 *
 * Buyer Image
 *     ↓
 * Image Embedding
 *     ↓
 * Compare with SEEQOut Product Embeddings
 *     ↓
 * Similarity Score
 *     ↓
 * Ranked Products
 *
 * The actual AI embedding model will plug into this module.
 */

/**
 * Calculate cosine similarity between two vectors.
 */
function cosineSimilarity(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    return 0;
  }

  if (vectorA.length !== vectorB.length || vectorA.length === 0) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct /
    (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * Rank products according to visual similarity.
 */
function rankProducts(queryEmbedding, products) {
  return products
    .map((product) => {
      const embeddings = Array.isArray(product.visualEmbeddings)
        ? product.visualEmbeddings
        : [];

      let bestScore = 0;

      for (const embedding of embeddings) {
        const score = cosineSimilarity(
          queryEmbedding,
          embedding
        );

        if (score > bestScore) {
          bestScore = score;
        }
      }

      return {
        product,
        similarity: Math.max(0, Math.min(1, bestScore)),
      };
    })
    .filter((item) => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);
}

module.exports = {
  cosineSimilarity,
  rankProducts,
};
