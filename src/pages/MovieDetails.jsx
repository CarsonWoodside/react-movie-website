import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import { motion } from "framer-motion";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div className="error-message">Movie not found</div>;

  const favorite = isFavorite(movie.id);

  function handleFavoriteClick() {
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="movie-details"
    >
      <div
        className="backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="content">
        <div className="poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
          >
            {favorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        <div className="info">
          <h1>
            {movie.title}{" "}
            <span className="year">({movie.release_date?.split("-")[0]})</span>
          </h1>

          <div className="meta">
            <span className="rating">{movie.vote_average.toFixed(1)}/10</span>
            <span className="runtime">{movie.runtime} min</span>
            <span className="genres">
              {movie.genres.map((genre) => genre.name).join(", ")}
            </span>
          </div>

          <h3>Overview</h3>
          <p className="overview">{movie.overview}</p>

          <h3>Cast</h3>
          <div className="cast">
            {movie.credits.cast.slice(0, 5).map((person) => (
              <div key={person.id} className="cast-member">
                <img
                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                  alt={person.name}
                  onError={(e) => {
                    e.target.src = "/placeholder-person.jpg"; // Fallback image
                  }}
                />
                <p>{person.name}</p>
                <p className="character">{person.character}</p>
              </div>
            ))}
          </div>

          {movie.videos?.results?.length > 0 && (
            <>
              <h3>Trailer</h3>
              <div className="trailer">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                  title="Trailer"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </>
          )}

          <div className="movie-details-extra">
            <div>
              <h4>Budget</h4>
              <p>${movie.budget.toLocaleString()}</p>
            </div>
            <div>
              <h4>Revenue</h4>
              <p>${movie.revenue.toLocaleString()}</p>
            </div>
          </div>

          {movie.recommendations?.results?.length > 0 && (
            <>
              <h3>Similar Movies</h3>
              <div className="recommendations">
                {movie.recommendations.results
                  .slice(0, 4)
                  .map((recommendation) => (
                    <Link
                      to={`/movie/${recommendation.id}`}
                      key={recommendation.id}
                      className="recommendation"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${recommendation.poster_path}`}
                        alt={recommendation.title}
                      />
                      <p>{recommendation.title}</p>
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MovieDetails;
