'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/services/useFetch';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieResponse {
  results: Movie[];
  total_results: number;
  page: number;
  total_pages: number;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const endpoint = debouncedSearch ? '/search/movie' : '/discover/movie';
        const params = debouncedSearch
          ? { 
              query: debouncedSearch,
              include_adult: false,
              page: 1,
              region: 'US' // Add region for better results
            }
          : { 
              sort_by: 'popularity.desc',
              include_adult: false,
              page: 1,
              'vote_count.gte': 100 // Only movies with significant votes
            };

        const data = await fetchData(endpoint, 'en', params) as MovieResponse;
        
        if (data.results.length === 0) {
          setError(debouncedSearch ? 'No movies found matching your search.' : 'No movies available.');
        }
        
        setMovies(data.results);
        setTotalResults(data.total_results);
      } catch (err) {
        setError(
          debouncedSearch 
            ? 'Failed to search movies. Please try again.' 
            : 'Failed to load popular movies. Please refresh the page.'
        );
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [debouncedSearch]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading && !searchTerm} // Prevent new searches while initial load
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {debouncedSearch ? 'Search Results' : 'Popular Movies'}
        </h1>
        {debouncedSearch && !loading && !error && (
          <p className="text-gray-600 mt-2">
            Found {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{debouncedSearch}"
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex justify-center items-center py-10">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      )}

      {/* Movies Grid */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105">
                <div className="relative h-[300px]">
                  {movie.poster_path ? (
                    <Image
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No Poster</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                    {movie.title}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 text-sm">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </p>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No movies found</p>
        </div>
      )}
    </div>
  );
}