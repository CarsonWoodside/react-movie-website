import { Link } from "react-router-dom";
import "../css/ActorCard.css";

function ActorCard({ actor }) {
  return (
    <Link to={`/actor/${actor.id}`} className="actor-card-link">
      <div className="actor-card">
        <div className="actor-image">
          <img
            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
            alt={actor.name}
            onError={(e) => {
              e.target.src = "/placeholder-person.jpg"; // Fallback image
            }}
          />
        </div>
        <div className="actor-card-info">
          <p className="actor-name">{actor.name}</p>
          <p className="actor-character">{actor.character}</p>
        </div>
      </div>
    </Link>
  );
}

export default ActorCard;
