const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json()
    return data.results
};

export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json()
    return data.results
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch (`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,recommendations`);

        if (!response.ok) {
            throw new Error("Failed to fetch movie details...");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching movie details", error);
        throw error;
    }
}