import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://e-commerce-app-0ayo.onrender.com/api';
const TOKEN_KEY = 'auth_token';

class ApiService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async getStoredToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
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
}

export const apiService = new ApiService();