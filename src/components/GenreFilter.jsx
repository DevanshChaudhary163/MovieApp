import "../css/Home.css";

function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="genre-filter-container">
      <button
        className={`genre-filter-chip ${selectedGenre === null ? "active" : ""}`}
        onClick={() => onSelectGenre(null)}
      >
        All Genres
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`genre-filter-chip ${selectedGenre === genre.id ? "active" : ""}`}
          onClick={() => onSelectGenre(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
