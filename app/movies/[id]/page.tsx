'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchData } from '@/services/useFetch';
import Image from 'next/image';
import Link from 'next/link';
import { MovieDetails, Cast, Video ,  } from '@/types/movie-types'; // Define these types based on API response



export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movie details, credits, and videos in parallel
        const [details, credits, videos] = await Promise.all([
          fetchData(`/movie/${id}`, 'en'),
          fetchData(`/movie/${id}/credits`, 'en'),
          fetchData(`/movie/${id}/videos`, 'en')
        ]);

        setMovie(details);
        setCast(credits.cast.slice(0, 10)); // Show top 10 cast members
        setVideos(videos.results.filter((v: Video) => v.site === 'YouTube' && v.type === 'Trailer'));
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 text-center">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <Link href="/movies" className="text-blue-500 hover:underline">
          Back to Movies
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 text-center">
        <p className="text-xl mb-4">Movie not found</p>
        <Link href="/movies" className="text-blue-500 hover:underline">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Back Button */}
      <Link href="/movies" className="mb-8 inline-block text-blue-500 hover:underline">
        ← Back to Movies
      </Link>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Poster */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No poster available</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h1 className="text-4xl font-bold mb-4">
            {movie.title} ({new Date(movie.release_date).getFullYear()})
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-600">
              {movie.runtime} mins
            </span>
            <div className="flex gap-2">
              {movie.genres.map(genre => (
                <span key={genre.id} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Overview */}
          <p className="text-lg mb-8 text-gray-700">{movie.overview}</p>

          {/* Trailer */}
          {videos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Trailer</h2>
              <div className="aspect-video w-full max-w-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${videos[0].key}`}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {cast.map(member => (
                  <div key={member.id} className="flex-shrink-0 w-32">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                      {member.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 20vw, 10vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    <p className="text-gray-600 text-sm truncate">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}