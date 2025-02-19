// app/home/page.tsx
'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchData } from '@/services/useFetch';
import { MovieSkeleton } from '@/components/Skeleton';
import MovieCard from '@/components/MovieCard';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout>();

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 800;
      const container = scrollContainerRef.current;
      const newScrollPosition = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      // If we've reached the end, scroll back to start
      if (newScrollPosition >= container.scrollWidth - container.clientWidth) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          left: newScrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Auto scroll setup
  useEffect(() => {
    if (!isPaused) {
      autoScrollIntervalRef.current = setInterval(() => {
        scroll('right');
      }, 4000);
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isPaused, scroll]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#f7ff00] to-[#ffbf00] ">
      <Image 
        src="/home.jpg"
        alt="Movies Banner"
        width={1200}
        height={400}
        className="absolute inset-0 w-full h-full object-cover filter backdrop-blur-md"
        priority
      />
      <div className="relative inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
      <h1 className="text-4xl font-bold  text-white drop-shadow-lg shadow-black ">Popular Movies</h1>
      <div className="relative filter backdrop-blur-md my-[9em] ">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600/90 hover:bg-blue-700/90 text-white p-4 rounded-r-lg z-10 transition-all duration-300 shadow-lg"
          aria-label="Scroll left"
        >
          <span className="text-xl">←</span>
        </button>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-hidden space-x-6 pb-8 scrollbar-hide scroll-smooth"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {movies.map(movie => (
            <div key={movie.id} className="flex-none w-[220px] transform transition-transform duration-300 hover:scale-105 filter backdrop-blur-md">
              <MovieCard movie={movie} className="overflow-hidden w-full rounded-lg shadow-lg" />
            </div>
          ))}
        </div>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600/90 hover:bg-blue-700/90 text-white p-4 rounded-l-lg z-10 transition-all duration-300 shadow-lg"
          aria-label="Scroll right"
        >
          <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;