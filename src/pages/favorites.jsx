import { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import "../css/Favorites.css";

function Favorites() {
  const { favorites, clearAllFavorites } = useMovieContext();
  const [filterQuery, setFilterQuery] = useState("");

  const filteredFavorites = favorites.filter((movie) =>
    movie.title.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

  const handleClear = () => {
    if (window.confirm("Are you sure you want to remove all movies from your favorites?")) {
      clearAllFavorites();
    }
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty-container">
        <div className="favorites-empty-card">
          <div className="empty-heart-icon">💔</div>
          <h2>No favorite movies yet</h2>
          <p>
            You haven't saved any movies to your collection. Click the heart icon on any movie card to add it here!
          </p>
          <Link to="/" className="btn-explore">
            🎬 Explore Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-title-wrap">
          <h2>Your Favorite Movies</h2>
          <span className="favorites-counter-badge">
            {favorites.length} {favorites.length === 1 ? "Movie" : "Movies"} Saved
          </span>
        </div>

        <div className="favorites-actions-bar">
          <input
            type="text"
            placeholder="Filter your favorites..."
            className="favorites-filter-input"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />

          <button className="btn-clear-all" onClick={handleClear}>
            Clear All
          </button>
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="favorites-no-match">
          <p>No favorites match "{filterQuery}"</p>
          <button className="btn-reset-filter" onClick={() => setFilterQuery("")}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredFavorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
