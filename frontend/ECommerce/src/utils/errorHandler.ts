import { Alert } from 'react-native';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network connection failed') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

export const errorHandler = {
  // Handle API errors
  handleApiError: (error: any): AppError => {
    if (error.name === 'NetworkError' || error.message?.includes('Network')) {
      return new NetworkError('Please check your internet connection and try again');
    }

    if (error.status === 401 || error.statusCode === 401) {
      return new AuthError('Please login again');
    }

    if (error.status === 400 || error.statusCode === 400) {
      return new ValidationError(error.message || 'Invalid request');
    }

    if (error.status >= 500) {
      return new AppError('Server error. Please try again later');
    }

    return new AppError(error.message || 'Something went wrong');
  },

  // Show user-friendly error messages
  showError: (error: Error | AppError, title: string = 'Error') => {
    let message = 'Something went wrong. Please try again.';

    if (error instanceof NetworkError) {
      message = 'Please check your internet connection and try again.';
    } else if (error instanceof AuthError) {
      message = 'Please login again to continue.';
    } else if (error instanceof ValidationError) {
      message = error.message;
    } else if (error.message) {
      message = error.message;
    }

    Alert.alert(title, message);
  },

  // Log errors (in production, send to crash reporting service)
  logError: (error: Error, context?: string) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    console.error('Error logged:', errorInfo);

    // In production:
    // crashlytics().recordError(error);
    // analytics().logEvent('error', errorInfo);
  },

  // Retry mechanism
  withRetry: async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw errorHandler.handleApiError(error);
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  },
};