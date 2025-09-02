import { apiClient } from './api/ApiClient';
import { Movie, MoviesResponse, MovieDetails, SearchParams } from './models/Movie';

export class MovieService {
  private readonly defaultFields = 'PrimaryImageAspectRatio,BasicSyncInfo,MediaSourceCount,Overview,ProductionYear,RunTimeTicks,Genres,CommunityRating,CriticRating,OfficialRating,DateCreated,PremiereDate';
  private readonly defaultImageTypes = 'Primary,Backdrop,Banner,Thumb';

  async getMovies(params?: Partial<SearchParams>): Promise<MoviesResponse> {
    const userId = await apiClient.getUserId();
    
    const searchParams: SearchParams = {
      includeItemTypes: 'Movie',
      recursive: true,
      fields: this.defaultFields,
      imageTypeLimit: 1,
      enableImageTypes: this.defaultImageTypes,
      startIndex: 0,
      limit: 50,
      sortBy: 'DateCreated',
      sortOrder: 'Descending',
      ...params,
    };

    const queryParams = this.buildQueryParams(searchParams);
    
    return apiClient.get<MoviesResponse>(`/Users/${userId}/Items`, {
      params: queryParams,
    });
  }

  async getMovieDetails(movieId: string): Promise<MovieDetails> {
    const userId = await apiClient.getUserId();
    
    return apiClient.get<MovieDetails>(`/Users/${userId}/Items/${movieId}`, {
      params: {
        fields: this.defaultFields + ',People,Studios,Taglines,TrailerUrls',
      },
    });
  }

  async searchMovies(query: string, params?: Partial<SearchParams>): Promise<MoviesResponse> {
    const userId = await apiClient.getUserId();
    
    const searchParams: SearchParams = {
      includeItemTypes: 'Movie',
      recursive: true,
      searchTerm: query,
      fields: this.defaultFields,
      imageTypeLimit: 1,
      enableImageTypes: this.defaultImageTypes,
      startIndex: 0,
      limit: 50,
      ...params,
    };

    const queryParams = this.buildQueryParams(searchParams);
    
    return apiClient.get<MoviesResponse>(`/Users/${userId}/Items`, {
      params: queryParams,
    });
  }

  async getRecentlyAdded(limit: number = 20): Promise<MoviesResponse> {
    return this.getMovies({
      limit,
      sortBy: 'DateCreated',
      sortOrder: 'Descending',
    });
  }

  async getMostPlayed(limit: number = 20): Promise<MoviesResponse> {
    return this.getMovies({
      limit,
      sortBy: 'PlayCount',
      sortOrder: 'Descending',
    });
  }

  async getUnwatched(limit: number = 20): Promise<MoviesResponse> {
    const userId = await apiClient.getUserId();
    
    return apiClient.get<MoviesResponse>(`/Users/${userId}/Items`, {
      params: {
        includeItemTypes: 'Movie',
        recursive: true,
        fields: this.defaultFields,
        imageTypeLimit: 1,
        enableImageTypes: this.defaultImageTypes,
        startIndex: 0,
        limit,
        filters: 'IsUnplayed',
        sortBy: 'DateCreated',
        sortOrder: 'Descending',
      },
    });
  }

  async getMoviesByGenre(genre: string, limit: number = 20): Promise<MoviesResponse> {
    return this.getMovies({
      genres: genre,
      limit,
      sortBy: 'DateCreated',
      sortOrder: 'Descending',
    });
  }

  async getMoviesByYear(year: number, limit: number = 20): Promise<MoviesResponse> {
    return this.getMovies({
      years: year.toString(),
      limit,
      sortBy: 'DateCreated',
      sortOrder: 'Descending',
    });
  }

  getImageUrl(itemId: string, imageType: string = 'Primary', tag?: string): string {
    return apiClient.getImageUrl(itemId, imageType, tag);
  }

  getPlaybackUrl(itemId: string): string {
    return apiClient.getPlaybackUrl(itemId);
  }

  private buildQueryParams(params: SearchParams): Record<string, any> {
    const queryParams: Record<string, any> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams[key] = value;
      }
    });
    
    return queryParams;
  }
}

export const movieService = new MovieService();
