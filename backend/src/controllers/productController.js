import prisma from "../config/db.js";

// ✅ Get all products (with optional category/search)
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const products = await prisma.product.findMany({ where });
    res.json(products);
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Seed some initial products (optional)
export const seedProducts = async (req, res) => {
  try {
    // Delete existing products to allow re-seeding
    await prisma.product.deleteMany({});

    const products = [
      // Electronics
      { name: "iPhone 15 Pro", category: "Electronics", price: 999, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400" },
      { name: "Samsung Galaxy S24", category: "Electronics", price: 899, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
      { name: "MacBook Air M3", category: "Electronics", price: 1299, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
      { name: "iPad Pro", category: "Electronics", price: 799, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
      { name: "AirPods Pro", category: "Electronics", price: 249, image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400" },
      
      // Fashion
      { name: "Nike Air Max", category: "Fashion", price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
      { name: "Levi's 501 Jeans", category: "Fashion", price: 60, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
      { name: "Adidas Hoodie", category: "Fashion", price: 80, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
      { name: "Ray-Ban Sunglasses", category: "Fashion", price: 150, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
      { name: "Leather Jacket", category: "Fashion", price: 200, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
      
      // Home
      { name: "Coffee Maker", category: "Home", price: 89, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
      { name: "Plant Pot Set", category: "Home", price: 35, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
      { name: "Table Lamp", category: "Home", price: 45, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
      { name: "Throw Pillow", category: "Home", price: 25, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
      
      // Sports
      { name: "Yoga Mat", category: "Sports", price: 30, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" },
      { name: "Dumbbells Set", category: "Sports", price: 75, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" },
      { name: "Basketball", category: "Sports", price: 25, image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400" },
      { name: "Running Shoes", category: "Sports", price: 110, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
      
      // Books
      { name: "Programming Book", category: "Books", price: 40, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400" },
      { name: "Novel Collection", category: "Books", price: 25, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400" },
      { name: "Cookbook", category: "Books", price: 30, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
    ];

    const created = await prisma.product.createMany({ data: products });
    res.json({ message: "Products seeded", count: created.count });
  } catch (err) {
    console.error("Seed Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
