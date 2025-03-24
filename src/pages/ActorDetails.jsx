import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getActorCombinedDetails } from "../services/api";
import { motion } from "framer-motion";
import "../css/ActorDetails.css";

function ActorDetails() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("popularity"); // "popularity" or "recent"
  const [showFullBiography, setShowFullBiography] = useState(false);

  useEffect(() => {
    const loadActorDetails = async () => {
      try {
        setLoading(true);
        const data = await getActorCombinedDetails(id);
        setActor(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load actor details");
      } finally {
        setLoading(false);
      }
    };

    loadActorDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!actor) return <div className="error-message">Actor not found...</div>;

  // Calculate age
  const calculateAge = (birthday, deathday) => {
    if (!birthday) return "Unknown";
    const birthDate = new Date(birthday);
    const today = deathday ? new Date(deathday) : new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Calculate years in acting
  const calculateYearsInActing = (credits, deathday) => {
    if (!credits || credits.length === 0) return "Unknown";

    // Find the earliest movie with a valid release date
    const validCredits = credits.filter((movie) => movie.release_date);
    if (validCredits.length === 0) return "Unknown";

    const dates = validCredits.map((movie) => new Date(movie.release_date));
    const earliestDate = new Date(Math.min(...dates));
    const currentYear = deathday
      ? new Date(deathday).getFullYear()
      : new Date().getFullYear();

    return currentYear - earliestDate.getFullYear();
  };

  // Truncate biography for display
  const truncateBiography = (biography, limit = 300) => {
    if (!biography) return "";
    return biography.length > limit
      ? biography.substring(0, limit) + "..."
      : biography;
  };

  // Sort filmography
  const sortedFilmography = [...actor.movie_credits.cast].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.popularity - a.popularity;
    } else {
      // Sort by release date (most recent first)
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return new Date(b.release_date) - new Date(a.release_date);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="actor-details"
    >
      <div className="actor-content">
        <div className="actor-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
            onError={(e) => {
              e.target.src = "/placeholder-person.jpg"; // Fallback image
            }}
          />
        </div>

        <div className="actor-info">
          <h1>{actor.name}</h1>

          <div className="actor-meta">
            <div className="meta-item">
              <h4>Age</h4>
              <p>{calculateAge(actor.birthday, actor.deathday)}</p>
            </div>
            <div className="meta-item">
              <h4>Born</h4>
              <p>
                {actor.birthday
                  ? new Date(actor.birthday).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>

            {actor.deathday && (
              <div className="meta-item">
                <h4>Death</h4>
                <p>{new Date(actor.deathday).toLocaleDateString()}</p>
              </div>
            )}

            <div className="meta-item">
              <h4>Years in Acting</h4>
              <p>
                {calculateYearsInActing(
                  actor.movie_credits.cast,
                  actor.deathday
                )}
              </p>
            </div>

            <div className="meta-item">
              <h4>Place of Birth</h4>
              <p>{actor.place_of_birth || "Unknown"}</p>
            </div>
          </div>

          <h3>Biography</h3>
          <p className="actor-biography">
            {showFullBiography
              ? actor.biography
              : truncateBiography(actor.biography)}
          </p>
          {showFullBiography ? (
            <button
              className="read-more"
              onClick={() => setShowFullBiography(false)}
            >
              Read Less
            </button>
          ) : (
            actor.biography && (
              <button
                className="read-more"
                onClick={() => setShowFullBiography(true)}
              >
                Read more
              </button>
            )
          )}

          <div className="filmography-header">
            <h3>Filmography</h3>
            <div className="sort-controls">
              <button
                className={`sort-button ${
                  sortBy === "popularity" ? "active" : ""
                }`}
                onClick={() => setSortBy("popularity")}
              >
                Most Popular
              </button>
              <button
                className={`sort-button ${sortBy === "recent" ? "active" : ""}`}
                onClick={() => setSortBy("recent")}
              >
                Most Recent
              </button>
            </div>
          </div>

          <div className="filmography">
            {sortedFilmography.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="film-card"
              >
                <div className="film-poster">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="no-poster">No Image</div>
                  )}
                </div>
                <div className="film-info">
                  <h4>{movie.title}</h4>
                  <p className="character">
                    {movie.character || "Unknown Role"}
                  </p>
                  <p className="release-date">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "Unknown Year"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ActorDetails;
