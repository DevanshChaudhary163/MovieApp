import { useState, useEffect } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import { getMovieDetails, getImageUrl, getBackdropUrl } from "../services/api";
import "../css/Modal.css";

function MovieDetailModal() {
  const { selectedMovieId, closeMovieDetail, isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!selectedMovieId) {
      setMovie(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setShowTrailer(false);

    getMovieDetails(selectedMovieId)
      .then((data) => {
        if (isMounted) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError("Failed to load movie details");
          setLoading(false);
        }
      });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMovieDetail();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMovieId, closeMovieDetail]);

  if (!selectedMovieId) return null;

  const favorite = movie ? isFavorite(movie.id) : false;

  const toggleFavorite = () => {
    if (!movie) return;
    if (favorite) {
      removeFromFavorites(movie.id, movie.title);
    } else {
      addToFavorites(movie);
    }
  };

  // Find YouTube trailer if present
  const trailer = movie?.videos?.results?.find(
    (vid) => (vid.type === "Trailer" || vid.type === "Teaser") && vid.site === "YouTube"
  );

  const backdrop = movie?.backdrop_path ? getBackdropUrl(movie.backdrop_path) : null;
  const poster = movie?.poster_path ? getImageUrl(movie.poster_path, "w500") : null;
  const cast = movie?.credits?.cast?.slice(0, 6) || [];
  const similar = movie?.similar?.results?.slice(0, 4) || [];

  return (
    <div className="modal-backdrop" onClick={closeMovieDetail}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeMovieDetail} aria-label="Close modal">
          ✕
        </button>

        {loading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading movie details...</p>
          </div>
        ) : error || !movie ? (
          <div className="modal-error">
            <p>{error || "Movie not found"}</p>
            <button className="btn-secondary" onClick={closeMovieDetail}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div
              className="modal-hero"
              style={{
                backgroundImage: backdrop ? `linear-gradient(to bottom, rgba(15,16,22,0.4), #0f1016), url(${backdrop})` : "none",
              }}
            >
              <div className="modal-hero-content">
                <div className="modal-poster-wrap">
                  <img
                    src={poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"}
                    alt={movie.title}
                    className="modal-poster"
                  />
                </div>

                <div className="modal-header-info">
                  <h1 className="modal-title">{movie.title}</h1>
                  {movie.tagline && <p className="modal-tagline">"{movie.tagline}"</p>}

                  <div className="modal-meta-row">
                    {movie.release_date && (
                      <span className="meta-badge">{movie.release_date.split("-")[0]}</span>
                    )}
                    {movie.runtime > 0 && (
                      <span className="meta-badge">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                    )}
                    {movie.vote_average > 0 && (
                      <span className="meta-badge rating-badge">
                        ★ {movie.vote_average.toFixed(1)} <span className="vote-count">({movie.vote_count})</span>
                      </span>
                    )}
                    {movie.original_language && (
                      <span className="meta-badge lang-badge">{movie.original_language.toUpperCase()}</span>
                    )}
                  </div>

                  <div className="modal-genres">
                    {movie.genres?.map((g) => (
                      <span key={g.id} className="genre-pill">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  <div className="modal-action-buttons">
                    <button
                      className={`btn-fav-toggle ${favorite ? "is-fav" : ""}`}
                      onClick={toggleFavorite}
                    >
                      {favorite ? "♥ In Favorites" : "♡ Add to Favorites"}
                    </button>

                    {trailer && (
                      <button
                        className="btn-trailer"
                        onClick={() => setShowTrailer((prev) => !prev)}
                      >
                        {showTrailer ? "Hide Trailer" : "▶ Watch Trailer"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-body">
              {showTrailer && trailer && (
                <div className="trailer-embed-wrap">
                  <h3>Official Trailer</h3>
                  <div className="video-responsive">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
                      title={`${movie.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="modal-section">
                <h3>Overview</h3>
                <p className="modal-overview">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>

              {cast.length > 0 && (
                <div className="modal-section">
                  <h3>Top Cast</h3>
                  <div className="cast-grid">
                    {cast.map((actor) => (
                      <div key={actor.id} className="cast-card">
                        <img
                          src={
                            actor.profile_path
                              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                              : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=60"
                          }
                          alt={actor.name}
                          className="cast-avatar"
                        />
                        <div className="cast-info">
                          <p className="cast-name">{actor.name}</p>
                          <p className="cast-character">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similar.length > 0 && (
                <div className="modal-section">
                  <h3>You May Also Like</h3>
                  <div className="similar-grid">
                    {similar.map((simMovie) => (
                      <div
                        key={simMovie.id}
                        className="similar-card"
                        onClick={() => {
                          setMovie(null);
                          setLoading(true);
                          getMovieDetails(simMovie.id).then((d) => {
                            setMovie(d);
                            setLoading(false);
                          });
                        }}
                      >
                        <img
                          src={
                            simMovie.poster_path
                              ? getImageUrl(simMovie.poster_path, "w342")
                              : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=342&auto=format&fit=crop&q=60"
                          }
                          alt={simMovie.title}
                        />
                        <p className="similar-title">{simMovie.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieDetailModal;
