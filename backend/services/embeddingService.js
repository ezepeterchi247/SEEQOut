const { GoogleGenAI } = require("@google/genai");

const EMBEDDING_MODEL = "gemini-embedding-2";
const EMBEDDING_DIMENSION = 768;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

/**
 * Generate a visual embedding for one image.
 *
 * This is the provider boundary for SEEQOut visual search.
 * The rest of the application should not depend directly
 * on Gemini or any specific embedding model.
 */
async function generateImageEmbedding(imagePath) {
  if (!imagePath) {
    throw new Error("Image path is required.");
  }

  const fs = require("fs");

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const mimeType =
    imagePath.toLowerCase().endsWith(".png")
      ? "image/png"
      : imagePath.toLowerCase().endsWith(".webp")
        ? "image/webp"
        : "image/jpeg";

  const ai = getClient();

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
      ],
    },
    config: {
      outputDimensionality: EMBEDDING_DIMENSION,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("Embedding provider returned an empty embedding.");
  }

  return embedding;
}

module.exports = {
  generateImageEmbedding,
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSION,
};
