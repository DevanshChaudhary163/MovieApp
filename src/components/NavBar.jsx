import "../css/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";

function NavBar() {
  const location = useLocation();
  const { favorites } = useMovieContext();
  const favCount = favorites.length;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">🎬</span>
          <span className="brand-text">Cine<span className="brand-accent">Flix</span></span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/favorites"
          className={`nav-link ${location.pathname === "/favorites" ? "active" : ""}`}
        >
          Favorites
          {favCount > 0 && <span className="nav-badge">{favCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
