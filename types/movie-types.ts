export interface MovieDetails {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    runtime: number;
    genres: Genre[];
    // Add other fields you need from the API
  }
  
  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }
  
  export interface Video {
    id: string;
    key: string;
    site: string;
    type: string;
  }

  export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
  }
  
  export interface MovieResponse {
    results: Movie[];
    total_results: number;
    page: number;
    total_pages: number;
  }
  
  