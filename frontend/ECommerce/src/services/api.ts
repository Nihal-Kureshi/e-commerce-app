import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://e-commerce-app-0ayo.onrender.com/api';
const TOKEN_KEY = 'auth_token';

class ApiService {
  private token: string | null = null;

  async setToken(token: string) {
    try {
      this.token = token;
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save token:', error);
      throw new Error('Failed to save authentication token');
    }
  }

  async getStoredToken() {
    try {
      if (!this.token) {
        this.token = await AsyncStorage.getItem(TOKEN_KEY);
      }
      return this.token;
    } catch (error) {
      console.error('Failed to get stored token:', error);
      return null;
    }
  }

  async logout() {
    try {
      this.token = null;
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
      // Continue with logout even if storage fails
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const url = `${BASE_URL}${endpoint}`;
      const token = await this.getStoredToken();
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'Network request failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await this.setToken(data.token);
    return data;
  }

  async register(name: string, email: string, password: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    await this.setToken(data.token);
    return data;
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  // Orders
  async placeOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.request('/orders');
  }

  async getOrderById(orderId: string) {
    return this.request(`/orders/${orderId}`);
  }

  // User Profile
  async getUserProfile() {
    return this.request('/auth/profile');
  }
}

export const apiService = new ApiService();