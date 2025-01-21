"use client";

import { useState } from "react";
import Link from "next/link";
// import { Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              TMDB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/movies" className="text-gray-300 hover:text-white transition">
              Movies
            </Link>
            <Link href="/tv-shows" className="text-gray-300 hover:text-white transition">
              TV Shows
            </Link>
            <Link href="/trending" className="text-gray-300 hover:text-white transition">
              Trending
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="bg-gray-900 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
              {/* <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? <span /> : <span  />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies, TV shows..."
                  className="bg-gray-900 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                />
                <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col space-y-4">
              <Link
                href="/movies"
                className="text-gray-300 hover:text-white transition px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/tv-shows"
                className="text-gray-300 hover:text-white transition px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                TV Shows
              </Link>
              <Link
                href="/trending"
                className="text-gray-300 hover:text-white transition px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Trending
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;