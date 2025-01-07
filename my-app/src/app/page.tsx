"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
  category: string;
  color: string;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://677d87324496848554cafcbc.mockapi.io/api/v1/products"
        );
        const data = await response.json();
        setProducts(data); // Parse JSON data and set products
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products && products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg shadow-lg p-4"
          >
            <Image
            width={100}
            height={100}
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">
              {product.description.slice(0, 50)}...
            </p>
            <p className="text-gray-800 font-bold text-lg mb-2">${product.price}</p>
            <p className="text-gray-500 text-sm">Category: {product.category}</p>
            <p className="text-gray-500 text-sm">Color: {product.color}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
