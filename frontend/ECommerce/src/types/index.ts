// Core Product Types
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  userId?: number;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  token?: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

// API Types
export interface ApiError {
  message: string;
  status?: number;
}

export interface PlaceOrderRequest {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  outline: string;
  shadow: string;
}

export interface Typography {
  heading1: {
    fontSize: number;
    fontWeight: string;
  };
  heading2: {
    fontSize: number;
    fontWeight: string;
  };
  body: {
    fontSize: number;
  };
  caption: {
    fontSize: number;
  };
  button: {
    fontSize: number;
    fontWeight: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Navigation Types
export interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  replace: (screen: string, params?: any) => void;
  reset: (config: { index: number; routes: { name: string }[] }) => void;
}

// Component Props Types
export interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  navigation: NavigationProp;
  cardType: 'big' | 'small';
}

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  rightComponent?: React.ReactNode;
}

export interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  navigation: NavigationProp;
  emptyMessage?: string;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  initialNumToRender?: number;
}

// Hook Types
export interface UseSearchResult<T> {
  query: string;
  searchError: string;
  filteredItems: T[];
  handleSearchChange: (text: string) => void;
}

export interface UseProductGridResult {
  dimensions: { width: number; height: number };
  gridColumns: number;
  gridPadding: number;
  cardGap: number;
  flatListProps: {
    numColumns: number;
    key: string;
    columnWrapperStyle?: any;
    contentContainerStyle: any;
    getItemLayout: (data: any, index: number) => { length: number; offset: number; index: number };
    removeClippedSubviews: boolean;
  };
}

// Context Types
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export interface GridContextType {
  cardType: 'big' | 'small';
  toggleCardType: () => void;
}

// App Data Context Types
export interface AppDataContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: (items: CartItem[]) => Promise<Order>;
  loadProducts: () => Promise<void>;
  loadOrders: () => Promise<void>;
}

// Validation Types
export type ValidationResult = string | null;

export interface ValidationRules {
  email: (email: string) => ValidationResult;
  password: (password: string) => ValidationResult;
  name: (name: string) => ValidationResult;
}

// Responsive Types
export type DeviceType = 'phone' | 'tablet' | 'large';
export type CardType = 'big' | 'small';

export interface ResponsiveConfig {
  phone: { maxWidth: number };
  tablet: { maxWidth: number };
  large: { minWidth: number };
}