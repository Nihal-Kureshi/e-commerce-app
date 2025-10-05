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
    const existing = await prisma.product.count();
    if (existing > 0) return res.json({ message: "Products already seeded" });

    const products = [
      { name: "iPhone 15", category: "Electronics", price: 999, image: "" },
      { name: "Samsung Galaxy S23", category: "Electronics", price: 899, image: "" },
      { name: "Nike Sneakers", category: "Fashion", price: 120, image: "" },
      { name: "Levi's Jeans", category: "Fashion", price: 60, image: "" },
    ];

    const created = await prisma.product.createMany({ data: products });
    res.json({ message: "Products seeded", count: created.count });
  } catch (err) {
    console.error("Seed Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
