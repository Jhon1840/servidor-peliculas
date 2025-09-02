import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CONFIG } from '../../config/constants';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ApiClient {
  private client: AxiosInstance;
  private cachedUserId: string = '';

  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.JELLYFIN_BASE_URL,
      timeout: CONFIG.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-Emby-Token': CONFIG.JELLYFIN_API_KEY,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Response Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Error del servidor',
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      return {
        message: 'No se pudo conectar al servidor',
        code: 'NETWORK_ERROR',
      };
    } else {
      return {
        message: error.message || 'Error desconocido',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  async getUserId(): Promise<string> {
    if (this.cachedUserId) return this.cachedUserId;
    
    try {
      const users = await this.get<any[]>('/Users');
      
      if (Array.isArray(users) && users.length > 0) {
        this.cachedUserId = users[0].Id as string;
        return this.cachedUserId;
      }
      throw new Error('No se encontró ningún usuario en Jellyfin');
    } catch (error) {
      throw new Error('Error al obtener el ID del usuario');
    }
  }

  getImageUrl(itemId: string, imageType: string = 'Primary', tag?: string): string {
    if (!tag) return '';
    
    const width = CONFIG.IMAGE_QUALITY.POSTER.maxWidth;
    const height = CONFIG.IMAGE_QUALITY.POSTER.maxHeight;
    
    return `${CONFIG.JELLYFIN_BASE_URL}/Items/${itemId}/Images/${imageType}?tag=${tag}&maxWidth=${width}&maxHeight=${height}`;
  }

  getPlaybackUrl(itemId: string): string {
    return `${CONFIG.JELLYFIN_BASE_URL}/Videos/${itemId}/stream?static=true`;
  }
}

export const apiClient = new ApiClient();
