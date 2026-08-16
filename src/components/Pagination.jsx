import "../css/Home.css";

function Pagination({ currentPage, totalPages, onPageChange, loading }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
      >
        ← Previous
      </button>

      <span className="pagination-info">
        Page <strong>{currentPage}</strong> of <strong>{Math.min(totalPages, 500)}</strong>
      </span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= Math.min(totalPages, 500) || loading}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
