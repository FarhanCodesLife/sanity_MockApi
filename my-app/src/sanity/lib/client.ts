import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, apiToken } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: apiToken, // Use the API token with write permissions
});

// Function to upload image to Sanity's Asset Store
const uploadImageToSanity = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();

  const imageAsset = await client.assets.upload('image', blob, {
    filename: `product-image-${Date.now()}.jpg`, // Use a unique filename for each image
  });

  return imageAsset;
};

const migrateDataToSanity = async () => {
  try {
    // Fetch data from MockAPI
    const response = await fetch(
      "https://677d87324496848554cafcbc.mockapi.io/api/v1/products"
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products from MockAPI');
    }

    const products = await response.json();

    // Loop through products and add to Sanity
    for (const product of products) {
      // Upload the product image to Sanity
      const imageAsset = await uploadImageToSanity(product.image);

      // Construct the document with the uploaded image reference
      const doc = {
        _type: "product", // Ensure this matches your Sanity schema
        name: product.name,
        image: {
          _type: 'image',
          asset: {
            _ref: imageAsset._id, // Reference the uploaded image
            _type: 'reference',
          },
        },
        description: product.description,
        price: parseFloat(product.price), // Ensure price is a number
        category: product.category,
        color: product.color,
      };

      // Create the product document in Sanity
      const result = await client.create(doc);
      console.log("Product added:", result);
    }

    console.log("All products migrated successfully!");
  } catch (err) {
    console.error("Error migrating data:", err);
  }
};

// Call the migration function
migrateDataToSanity();
