import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  // Load favorites from localStorage on initial render
  const [favorites, setFavorites] = useState(() => {
    const storedFavs = localStorage.getItem("favorites");
    return storedFavs ? JSON.parse(storedFavs) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      const updatedFavorites = [...prev, movie];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Immediate update
      return updatedFavorites;
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((movie) => movie.id !== movieId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Immediate update
      return updatedFavorites;
    });
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
