import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages or using ISR
})

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
      const doc = {
        _type: "product", // Ensure this matches your Sanity schema
        name: product.name,
        image: {
          _type: 'image',
          asset: {
            _ref: 'image-asset-id', // Replace with your image handling logic
            _type: 'reference',
          },
        },
        description: product.description,
        price: parseFloat(product.price), // Ensure price is a number
        category: product.category,
        color: product.color,
      };

      // Ensure you handle image references if needed
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
