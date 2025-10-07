import { ValidationResult, Product, CartItem } from '../types';

// Form Validation
export const validators = {
  email: (email: string): ValidationResult => {
    if (!email?.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  password: (password: string): ValidationResult => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (password.length > 128) return 'Password must be less than 128 characters';
    return null;
  },

  name: (name: string): ValidationResult => {
    if (!name?.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters long';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    return null;
  },

  required: (value: string, fieldName: string): ValidationResult => {
    if (!value?.trim()) return `${fieldName} is required`;
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): ValidationResult => {
    if (value.length < min) return `${fieldName} must be at least ${min} characters`;
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): ValidationResult => {
    if (value.length > max) return `${fieldName} must be less than ${max} characters`;
    return null;
  },
};

// Data Validation
export const validateProduct = (product: any): product is Product => {
  return (
    product &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number' &&
    typeof product.category === 'string' &&
    typeof product.image === 'string' &&
    product.price > 0
  );
};

export const validateCartItem = (item: any): item is CartItem => {
  return (
    item &&
    validateProduct(item.product) &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

export const validateOrderData = (items: CartItem[], total: number): ValidationResult => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'Order must contain at least one item';
  }

  for (const item of items) {
    if (!validateCartItem(item)) {
      return 'Invalid cart item found';
    }
  }

  if (typeof total !== 'number' || total <= 0) {
    return 'Invalid order total';
  }

  const calculatedTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  if (Math.abs(calculatedTotal - total) > 0.01) {
    return 'Order total does not match items';
  }

  return null;
};

// API Response Validation
export const validateApiResponse = (response: any, expectedFields: string[]): ValidationResult => {
  if (!response || typeof response !== 'object') {
    return 'Invalid response format';
  }

  for (const field of expectedFields) {
    if (!(field in response)) {
      return `Missing required field: ${field}`;
    }
  }

  return null;
};

// Network Validation
export const validateNetworkResponse = (response: Response): ValidationResult => {
  if (!response.ok) {
    return `Network error: ${response.status} ${response.statusText}`;
  }
  return null;
};