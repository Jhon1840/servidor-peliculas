export interface Movie {
  Id: string;
  Name: string;
  Overview?: string;
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
    Banner?: string;
    Thumb?: string;
  };
  MediaSources?: Array<{
    Id: string;
    Protocol: string;
    Path: string;
  }>;
  Genres?: string[];
  CommunityRating?: number;
  CriticRating?: number;
  OfficialRating?: string;
  DateCreated?: string;
  PremiereDate?: string;
}

export interface MoviesResponse {
  Items: Movie[];
  TotalRecordCount: number;
}

export interface MovieDetails extends Movie {
  People?: Array<{
    Name: string;
    Role: string;
    Type: string;
  }>;
  Studios?: Array<{
    Name: string;
  }>;
  Taglines?: string[];
  TrailerUrls?: string[];
}

export interface SearchParams {
  query?: string;
  includeItemTypes?: string;
  recursive?: boolean;
  fields?: string;
  imageTypeLimit?: number;
  enableImageTypes?: string;
  startIndex?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'Ascending' | 'Descending';
  filters?: string;
  years?: string;
  genres?: string;
}
