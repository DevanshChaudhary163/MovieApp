import "../css/MovieCard.css";

function SkeletonCard() {
  return (
    <div className="movie-card skeleton-card">
      <div className="movie-poster skeleton-shimmer"></div>
      <div className="movie-info">
        <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
        <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
