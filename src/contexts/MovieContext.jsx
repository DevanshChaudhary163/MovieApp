import { createContext, useState, useContext, useEffect, useCallback } from "react";

const MovieContext = createContext();

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("movieapp_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("movieapp_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const addToFavorites = useCallback((movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
    showToast(`Added "${movie.title}" to Favorites!`, "success");
  }, [showToast]);

  const removeFromFavorites = useCallback((movieId, title = "") => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    showToast(title ? `Removed "${title}" from Favorites` : "Removed from Favorites", "info");
  }, [showToast]);

  const clearAllFavorites = useCallback(() => {
    if (favorites.length === 0) return;
    setFavorites([]);
    showToast("Cleared all favorite movies", "info");
  }, [favorites.length, showToast]);

  const isFavorite = useCallback((movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  }, [favorites]);

  const openMovieDetail = useCallback((movieId) => {
    setSelectedMovieId(movieId);
    document.body.style.overflow = "hidden";
  }, []);

  const closeMovieDetail = useCallback(() => {
    setSelectedMovieId(null);
    document.body.style.overflow = "unset";
  }, []);

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
    selectedMovieId,
    openMovieDetail,
    closeMovieDetail,
    toast,
    showToast,
    hideToast,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
