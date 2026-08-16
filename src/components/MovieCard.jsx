import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { getImageUrl } from "../services/api";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites, openMovieDetail } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const onFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id, movie.title);
    } else {
      addToFavorites(movie);
    }
  };

  const handleCardClick = () => {
    openMovieDetail(movie.id);
  };

  const posterSrc = getImageUrl(movie.poster_path, "w500");
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="movie-card" onClick={handleCardClick} role="button" tabIndex={0}>
      <div className="movie-poster">
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
          }}
        />

        {rating && (
          <div className="card-rating-badge">
            <span className="star">★</span> {rating}
          </div>
        )}

        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? "♥" : "♡"}
          </button>
          
          <div className="overlay-click-hint">
            <span>Click for Details & Trailer</span>
          </div>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-sub-info">
          <span className="movie-year">{releaseYear}</span>
          {movie.original_language && (
            <span className="movie-lang">{movie.original_language.toUpperCase()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
