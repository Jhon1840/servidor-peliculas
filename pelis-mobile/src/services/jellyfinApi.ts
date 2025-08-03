import axios from 'axios';
import { CONFIG, getImageUrl, formatRuntime } from '../config/constants';

// Crear instancia de axios con configuración base
const jellyfinApi = axios.create({
  baseURL: CONFIG.JELLYFIN_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Emby-Token': CONFIG.JELLYFIN_API_KEY,
  },
});

export interface Movie {
  Id: string;
  Name: string;
  Overview: string;
  ProductionYear?: number;
  RunTimeTicks?: number;
  UserData?: {
    Played: boolean;
    PlayCount: number;
    PlaybackPositionTicks: number;
  };
  ImageTags?: {
    Primary?: string;
    Backdrop?: string;
  };
  MediaSources?: Array<{
    Id: string;
    Protocol: string;
    Path: string;
  }>;
}

export interface MoviesResponse {
  Items: Movie[];
  TotalRecordCount: number;
}

let cachedUserId: string = '';

async function getUserId(): Promise<string> {
  if (cachedUserId) return cachedUserId;
  const response = await jellyfinApi.get('/Users');
  
  const users = response.data;
  if (Array.isArray(users) && users.length > 0) {
    cachedUserId = users[0].Id as string;
    return cachedUserId;
  }
  throw new Error('No se encontró ningún usuario en Jellyfin');
}

export const jellyfinService = {
  // Obtener todas las películas
  async getMovies(): Promise<MoviesResponse> {
    try {
      const userId = await getUserId();
      const response = await jellyfinApi.get(`/Users/${userId}/Items`, {
        params: {
          IncludeItemTypes: 'Movie',
          Recursive: true,
          Fields: 'PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount',
          ImageTypeLimit: 1,
          EnableImageTypes: 'Primary,Backdrop,Banner,Thumb',
          StartIndex: 0,
          Limit: 50,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Obtener detalles de una película específica
  async getMovieDetails(movieId: string): Promise<Movie> {
    try {
      const userId = await getUserId();
      const response = await jellyfinApi.get(`/Users/${userId}/Items/${movieId}`, {
        params: {
          Fields: 'PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount,Overview,ProductionYear,RunTimeTicks',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Obtener URL de imagen
  getImageUrl(itemId: string, imageType: string = 'Primary', tag?: string): string {
    return getImageUrl(itemId, imageType, tag);
  },

  // Obtener URL de reproducción
  getPlaybackUrl(itemId: string): string {
    return `${CONFIG.JELLYFIN_BASE_URL}/Videos/${itemId}/stream?static=true`;
  },

  // Buscar películas
  async searchMovies(query: string): Promise<MoviesResponse> {
    try {
      const userId = await getUserId();
      const response = await jellyfinApi.get(`/Users/${userId}/Items`, {
        params: {
          IncludeItemTypes: 'Movie',
          Recursive: true,
          SearchTerm: query,
          Fields: 'PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount',
          ImageTypeLimit: 1,
          EnableImageTypes: 'Primary,Backdrop,Banner,Thumb',
          StartIndex: 0,
          Limit: 50,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },
};

export default jellyfinService; 