import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import { motion } from "framer-motion";

function Favorites() {
  const { favorites } = useMovieContext();

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="favorites"
    >
      {favorites.length > 0 ? (
        <div className="favorites">
          <h2>Your Favorites</h2>
          <div className="movies-grid">
            {favorites.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="favorites-empty">
          <h2>No Favorite Movies Yet</h2>
          <p>
            Start adding movies to your favorites and they will appear here!
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default Favorites;
