const API_KEY = "2ed1a9444e2b074358ea6c20b7459b93";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = "original") => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPopularMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch popular movies");
  const data = await response.json();
  return { results: data.results || [], totalPages: data.total_pages || 1, totalResults: data.total_results || 0 };
};

export const getTopRatedMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch top-rated movies");
  const data = await response.json();
  return { results: data.results || [], totalPages: data.total_pages || 1, totalResults: data.total_results || 0 };
};

export const getUpcomingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch upcoming movies");
  const data = await response.json();
  return { results: data.results || [], totalPages: data.total_pages || 1, totalResults: data.total_results || 0 };
};

export const getNowPlayingMovies = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch now playing movies");
  const data = await response.json();
  return { results: data.results || [], totalPages: data.total_pages || 1, totalResults: data.total_results || 0 };
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to fetch movies by genre");
  const data = await response.json();
  return { results: data.results || [], totalPages: data.total_pages || 1, totalResults: data.total_results || 0 };
};

export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.genres || [];
};

export const searchMovies = async (query, page = 1) => {
  if (!query || !query.trim()) return { results: [], totalPages: 0, totalResults: 0 };
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to search movies");
  const data = await response.json();
  return { results: data.results || [], totalPages: data.total_pages || 1, totalResults: data.total_results || 0 };
};

export const getMovieDetails = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,similar`
  );
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};
