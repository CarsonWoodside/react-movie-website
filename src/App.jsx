// In src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import ActorDetails from "./pages/ActorDetails"; // Add this line
import NavBar from "./components/NavBar";
import { MovieProvider } from "./contexts/MovieContext";

function App() {
  const location = useLocation();

  return (
    <MovieProvider>
      <NavBar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/actor/:id" element={<ActorDetails />} />{" "}
          </Routes>
        </AnimatePresence>
      </main>
    </MovieProvider>
  );
}

export default App;
