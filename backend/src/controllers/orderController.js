import prisma from "../config/db.js";

// ✅ Place order (Protected)
export const placeOrder = async (req, res) => {
  try {
    const userId = parseInt(req.user);
    const { items, total } = req.body;

    // Validation
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ message: "Valid total amount is required" });
    }

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return res.status(400).json({ message: "Each item must have productId, quantity, and price" });
      }
      
      if (item.quantity <= 0 || item.price <= 0) {
        return res.status(400).json({ message: "Item quantity and price must be greater than 0" });
      }
    }

    // Validate and convert productIds
    const productIds = items.map(item => {
      const id = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId;
      if (isNaN(id)) {
        throw new Error(`Invalid productId: ${item.productId}`);
      }
      return id;
    });
    
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      return res.status(404).json({ 
        message: `Products not found: ${missingIds.join(', ')}` 
      });
    }

    // Calculate and verify total
    let calculatedTotal = 0;
    const orderItems = items.map(item => {
      const productId = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId;
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        throw new Error(`Product ${productId} not found`);
      }
      
      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;
      
      return {
        productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      };
    });

    const order = await prisma.order.create({
      data: { 
        userId, 
        items: orderItems, 
        total: calculatedTotal 
      },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place Order Error:", err);
    
    if (err.message.includes('Invalid productId') || err.message.includes('not found')) {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: "Failed to place order. Please try again." });
  }
};

// ✅ Get all orders of logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = parseInt(req.user);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Failed to load orders. Please try again." });
  }
};

// ✅ Get single order details
export const getOrderById = async (req, res) => {
  try {
    const userId = parseInt(req.user);
    const orderId = parseInt(req.params.orderId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId 
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found or access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get Order Error:", err);
    res.status(500).json({ message: "Failed to load order details. Please try again." });
  }
};
