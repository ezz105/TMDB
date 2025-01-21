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
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div key={movie.id} className="bg-gray-200 rounded p-4 shadow">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-64 object-cover rounded-t"
      />
      <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
      <p className="text-gray-600">Release Date: {movie.release_date}</p>
      <p className="text-gray-600">Vote Average: {movie.vote_average}</p>
    </div>
  );
};

export default MovieCard;