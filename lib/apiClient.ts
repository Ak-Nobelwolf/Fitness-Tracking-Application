import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export interface ApiClientConfig {
  baseURL: string;
  ownerId?: string;
  timeout?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private ownerId: string | null = null;
  private isOnline: boolean = true;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (config.ownerId) {
      this.setOwnerId(config.ownerId);
    }

    this.setupInterceptors();
    this.setupOnlineListener();
  }

  private setupOnlineListener() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.isOnline = true;
      });
      window.addEventListener("offline", () => {
        this.isOnline = false;
      });
      this.isOnline = navigator.onLine;
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.ownerId) {
          config.headers["x-owner-id"] = this.ownerId;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & { _retryCount?: number };
        
        if (!config) {
          return Promise.reject(error);
        }

        config._retryCount = config._retryCount || 0;

        const shouldRetry = 
          this.isTransientError(error) && 
          config._retryCount < MAX_RETRIES;

        if (shouldRetry) {
          config._retryCount += 1;
          
          await this.delay(RETRY_DELAY * config._retryCount);
          
          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  private isTransientError(error: AxiosError): boolean {
    if (!error.response) {
      return true;
    }

    const status = error.response.status;
    return status === 408 || status === 429 || status >= 500;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setOwnerId(ownerId: string) {
    this.ownerId = ownerId;
  }

  getOwnerId(): string | null {
    return this.ownerId;
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (this.isOffline()) {
      throw new Error("Cannot make request while offline");
    }
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    if (this.isOffline()) {
      throw new Error("Cannot make request while offline");
    }
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    if (this.isOffline()) {
      throw new Error("Cannot make request while offline");
    }
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    if (this.isOffline()) {
      throw new Error("Cannot make request while offline");
    }
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (this.isOffline()) {
      throw new Error("Cannot make request while offline");
    }
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
});

export default apiClient;
