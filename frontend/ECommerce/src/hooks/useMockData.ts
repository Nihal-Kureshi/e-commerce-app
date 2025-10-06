import { useState, useEffect, useMemo } from 'react';
import { CartItem, Order, Product } from '../types';
import { apiService } from '../services/api';

export function useMockData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    try {
      const data = await apiService.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  }

  function addToCart(product: Product, qty = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [{ product, quantity: qty }, ...prev];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }

  async function placeOrder(shipping: any, payment: any) {
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: cartSummary.total,
        shippingAddress: shipping,
        paymentMethod: payment
      };
      
      const newOrder = await apiService.placeOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      return newOrder;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }

  const cartSummary = useMemo(() => {
    const subtotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 12.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cart]);

  return { products, cart, addToCart, updateQuantity, removeFromCart, orders, placeOrder, cartSummary, loading, loadProducts, loadOrders };
}