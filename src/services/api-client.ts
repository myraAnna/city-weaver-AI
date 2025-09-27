/**
 * API Client for City Weaver AI
 * Handles all HTTP requests with proper error handling, authentication, and retry logic
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fdebe4e2cb1e.ngrok-free.app';
const API_TIMEOUT = 180000; // 3 minutes for AI planning operations

// Types for API responses
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  ok: boolean;
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class APIClientError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'APIClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Request options interface
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

// Token management
class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cityweaver_auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('cityweaver_auth_token');
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cityweaver_auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// API Client class
export class APIClient {
  private baseURL: string;
  private tokenManager: TokenManager;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.tokenManager = TokenManager.getInstance();
  }

  /**
   * Make an HTTP request with proper error handling
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = API_TIMEOUT,
      retry = true,
      retryAttempts = 3,
      retryDelay = 1000
    } = options;

    // Build URL
    const url = `${this.baseURL}${endpoint}`;
    console.log(`🌐 APIClient.makeRequest: ${method} ${url}`);
    console.log('📦 Request body (raw):', body);
    console.log('📦 Request body (JSON):', JSON.stringify(body, null, 2));
    console.log('📦 Request body type:', typeof body);

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...headers
    };

    // Skip authentication for now
    // const token = this.tokenManager.getToken();
    // if (token) {
    //   requestHeaders['Authorization'] = `Bearer ${token}`;
    //   console.log('🔐 Added auth token to request');
    // } else {
    //   console.log('⚠️ No auth token available');
    // }
    console.log('🔓 Skipping auth for all endpoints');

    console.log('📋 Request headers:', requestHeaders);

    // Prepare request config
    const jsonBody = body ? JSON.stringify(body) : undefined;
    console.log('🔥 FINAL JSON BODY BEING SENT:', jsonBody);

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      body: jsonBody,
    };

    let lastError: APIClientError | null = null;

    // Retry logic
    for (let attempt = 1; attempt <= (retry ? retryAttempts : 1); attempt++) {
      console.log(`🔄 Attempt ${attempt}/${retry ? retryAttempts : 1}`);
      
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        console.log('📡 Making fetch request...');
        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('📡 Fetch response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        // Parse response
        let responseData: any;
        const contentType = response.headers.get('content-type');
        console.log('📄 Response content-type:', contentType);

        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('📄 Parsed JSON response:', responseData);
        } else {
          responseData = await response.text();
          console.log('📄 Text response:', responseData);
        }

        // Handle successful response
        if (response.ok) {
          console.log('✅ Request successful');
          return {
            data: responseData,
            status: response.status,
            ok: true
          };
        }

        // Handle HTTP errors
        const errorMessage = responseData?.error || responseData?.message || `HTTP ${response.status}`;
        const errorCode = responseData?.code;
        console.error('❌ HTTP error:', {
          status: response.status,
          message: errorMessage,
          code: errorCode,
          data: responseData
        });

        lastError = new APIClientError(
          errorMessage,
          response.status,
          errorCode,
          responseData
        );

        // Don't retry on client errors (4xx) except for 401 (unauthorized)
        if (response.status >= 400 && response.status < 500 && response.status !== 401) {
          console.log('🚫 Client error, not retrying');
          break;
        }

        // Handle 401 - clear token and don't retry
        if (response.status === 401) {
          console.log('🔐 Unauthorized, clearing token');
          this.tokenManager.clearToken();
          break;
        }

      } catch (error) {
        console.error('💥 Request exception:', error);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.error('⏰ Request timeout');
            lastError = new APIClientError('Request timeout', 408);
          } else {
            console.error('🌐 Network error:', error.message);
            lastError = new APIClientError(
              error.message || 'Network error',
              0
            );
          }
        }
      }

      // Wait before retry (except on last attempt)
      if (attempt < retryAttempts && retry) {
        const delay = retryDelay * attempt;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Return error response
    console.error('💀 All attempts failed, returning error');
    return {
      error: lastError?.message || 'Unknown error',
      status: lastError?.status || 0,
      ok: false
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method'>): Promise<APIResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.tokenManager.setToken(token);
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.tokenManager.clearToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return this.tokenManager.getToken();
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export utility functions for error handling
export const isAPIError = (error: any): error is APIClientError => {
  return error instanceof APIClientError;
};

export const getErrorMessage = (error: any): string => {
  if (isAPIError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const getErrorStatus = (error: any): number => {
  if (isAPIError(error)) {
    return error.status;
  }
  return 0;
};

export default apiClient;