// app/components/MovieCard.tsx
import React from 'react';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  poster_path: string;
}

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  return (
    <div 
      key={movie.id} 
      className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full  mx-auto ${className}`}
    >
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded-full text-sm sm:text-base">
          ★ {movie.vote_average.toFixed(1)}
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1">{movie.title}</h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
          {new Date(movie.release_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;