// app/home/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { fetchData } from '@/services/useFetch';
import { MovieSkeleton } from '@/components/Skeleton';
import MovieCard from '@/components/MovieCard';
import home from '@/public';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        // await delay(2000); // wait 2 seconds
        const data = await fetchData('/movie/popular');
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-8">
      {[...Array(10)].map((_, index) => (
        <MovieSkeleton key={index} />
      ))}
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl my-12">
      <div>
        <img src={home} alt="" />
      </div>
    <div>
      <h1 className="text-3xl font-bold mb-5">Popular Movies</h1>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-8 mb-5">
        {movies.slice(10).map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
   
    </div>
  );
};

export default HomePage;