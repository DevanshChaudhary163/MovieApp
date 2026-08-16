import { useState, useEffect, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import CategoryTabs from "../components/CategoryTabs";
import GenreFilter from "../components/GenreFilter";
import Pagination from "../components/Pagination";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getMoviesByGenre,
  getGenres,
  searchMovies,
  getBackdropUrl,
} from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [category, setCategory] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { openMovieDetail } = useMovieContext();

  // Load genres on initial render
  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch((e) => console.error("Failed to load genres", e));
  }, []);

  const fetchMovies = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (activeSearch.trim()) {
        data = await searchMovies(activeSearch, targetPage);
      } else if (selectedGenre !== null) {
        data = await getMoviesByGenre(selectedGenre, targetPage);
      } else {
        switch (category) {
          case "top_rated":
            data = await getTopRatedMovies(targetPage);
            break;
          case "upcoming":
            data = await getUpcomingMovies(targetPage);
            break;
          case "now_playing":
            data = await getNowPlayingMovies(targetPage);
            break;
          case "popular":
          default:
            data = await getPopularMovies(targetPage);
            break;
        }
      }

      setMovies(data.results);
      setTotalPages(data.totalPages);
      setTotalResults(data.totalResults);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  }, [activeSearch, selectedGenre, category]);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSelectedGenre(null);
    setActiveSearch(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  };

  const handleSelectCategory = (catId) => {
    setActiveSearch("");
    setSearchQuery("");
    setSelectedGenre(null);
    setCategory(catId);
  };

  const handleSelectGenre = (genreId) => {
    setActiveSearch("");
    setSearchQuery("");
    setSelectedGenre(genreId);
  };

  const handlePageChange = (newPage) => {
    fetchMovies(newPage);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  const featuredMovie = movies.length > 0 && !activeSearch ? movies[0] : null;

  return (
    <div className="home-container">
      {/* Featured Spotlight Banner */}
      {featuredMovie && (
        <section
          className="hero-banner"
          style={{
            backgroundImage: featuredMovie.backdrop_path
              ? `linear-gradient(to right, rgba(15,16,22,0.95) 20%, rgba(15,16,22,0.4) 60%, rgba(15,16,22,0.95) 100%), linear-gradient(to top, #0f1016, transparent 60%), url(${getBackdropUrl(featuredMovie.backdrop_path)})`
              : "linear-gradient(135deg, #1f1c2c, #928dab)",
          }}
        >
          <div className="hero-content">
            <span className="hero-badge">Featured Spotlight</span>
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-overview">{featuredMovie.overview}</p>
            <div className="hero-actions">
              <button
                className="btn-hero-play"
                onClick={() => openMovieDetail(featuredMovie.id)}
              >
                ▶ View Details & Trailer
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search Bar Section */}
      <section className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search movies by title (e.g. Inception, Avatar, Batman)..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {activeSearch && (
          <div className="search-result-status">
            <span>
              Showing results for: <strong>"{activeSearch}"</strong> ({totalResults} found)
            </span>
            <button className="btn-reset-filter" onClick={handleClearSearch}>
              Reset to Categories
            </button>
          </div>
        )}
      </section>

      {/* Filter Navigation (Hidden if searching) */}
      {!activeSearch && (
        <section className="filters-section">
          <CategoryTabs
            activeCategory={selectedGenre !== null ? null : category}
            onSelectCategory={handleSelectCategory}
          />
          {genres.length > 0 && (
            <GenreFilter
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={handleSelectGenre}
            />
          )}
        </section>
      )}

      {/* Main Movie Grid Content */}
      <section className="movies-section">
        {error && (
          <div className="error-card">
            <p>{error}</p>
            <button className="retry-btn" onClick={() => fetchMovies(page)}>
              ↻ Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="movies-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="no-movies-card">
            <div className="no-movies-icon">🍿</div>
            <h2>No movies found</h2>
            <p>Try searching for a different keyword or browse other categories.</p>
            <button className="btn-primary" onClick={handleClearSearch}>
              Explore Popular Movies
            </button>
          </div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
