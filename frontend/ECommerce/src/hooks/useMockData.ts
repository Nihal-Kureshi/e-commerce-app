import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Order, Product } from '../types';
import { apiService } from '../services/api';

const CART_STORAGE_KEY = 'shopping_cart';

export function useMockData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      // Start with empty cart if loading fails
      setCart([]);
    }
  }

  async function saveCart(cartData: CartItem[]) {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    } catch (error: any) {
      console.error('Failed to save cart:', error);
      // Cart save failure is not critical, continue silently
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error: any) {
      const message = error.message || 'Failed to load products';
      setError(message);
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      const data = await apiService.getUserOrders();
      setOrders(data);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      // Don't set global error for orders as it's not critical
    }
  }

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      } else {
        newCart = [{ product, quantity: qty }, ...prev];
      }
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      const newCart = prev.map(i =>
        i.product.id === productId ? { ...i, quantity } : i,
      );
      saveCart(newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(i => i.product.id !== productId);
      saveCart(newCart);
      return newCart;
    });
  }, []);

  async function placeOrder(selectedCartItems?: CartItem[]) {
    const itemsToOrder = selectedCartItems || cart;

    if (itemsToOrder.length === 0) {
      throw new Error('No items to order');
    }

    try {
      const subtotal = itemsToOrder.reduce(
        (s, c) => s + c.product.price * c.quantity,
        0,
      );
      const shipping = subtotal > 200 ? 0 : 12.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      const orderData = {
        items: itemsToOrder.map(item => ({
          productId: parseInt(item.product.id),
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
      };

      const newOrder = await apiService.placeOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);

      // Remove only ordered items from cart
      const orderedProductIds = new Set(
        itemsToOrder.map(item => item.product.id),
      );
      const remainingCart = cart.filter(
        item => !orderedProductIds.has(item.product.id),
      );
      setCart(remainingCart);
      saveCart(remainingCart);

      return newOrder;
    } catch (error: any) {
      console.error('Failed to place order:', error);
      throw new Error(error.message || 'Failed to place order. Please try again.');
    }
  }

  const cartSummary = useMemo(() => {
    if (cart.length === 0) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }
    
    const subtotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 12.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cart]);

  return {
    products,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    orders,
    placeOrder,
    cartSummary,
    loading,
    error,
    loadProducts,
    loadOrders,
  };
}
