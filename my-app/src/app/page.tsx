"use client";

import { client } from "@/sanity/lib/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
  color: string;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from Sanity
        const data = await client.fetch(`
          *[_type == "product"]{
            _id,
            name,
            "image": image,
            description,
            price,
            category,
            color
          }
        `);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching data from Sanity:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sanity Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-lg shadow-lg p-4"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {product.description.slice(0, 50)}...
              </p>
              <p className="text-gray-800 font-bold text-lg mb-2">
                ${product.price}
              </p>
              <p className="text-gray-500 text-sm">
                Category: {product.category}
              </p>
              <p className="text-gray-500 text-sm">Color: {product.color}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;
