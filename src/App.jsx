import "./css/App.css";
import Home from "./pages/home";
import Favorites from "./pages/favorites";
import NavBar from "./components/NavBar";
import MovieDetailModal from "./components/MovieDetailModal";
import Toast from "./components/Toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";

function App() {
  return (
    <MovieProvider>
      <div className="app-layout">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>
            Powered by <strong>TMDB API</strong> | Designed & Built for Cinematic Movie Discovery
          </p>
        </footer>
        <MovieDetailModal />
        <Toast />
      </div>
    </MovieProvider>
  );
}

export default App;
