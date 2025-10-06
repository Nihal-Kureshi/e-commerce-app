import prisma from "../config/db.js";

// ✅ Place order (Protected)
export const placeOrder = async (req, res) => {
  try {
    const userId = parseInt(req.user); // from auth middleware
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Order items required" });

    if (!total) return res.status(400).json({ message: "Total amount required" });

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = await prisma.order.create({
      data: { userId, items, total },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all orders of logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = parseInt(req.user); // from auth middleware
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single order details
export const getOrderById = async (req, res) => {
  try {
    const userId = parseInt(req.user);
    const orderId = parseInt(req.params.orderId);

    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId 
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
