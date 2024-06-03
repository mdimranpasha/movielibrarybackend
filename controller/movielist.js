const MovieList = require("../model/movielist");

const savePlaylist = async (req, res) => {
  const { name, movies } = req.body;
  const userId = req.user.userId;
  console.log("userid", userId);

  try {
    let movieList = await MovieList.findOne({ user: userId, name });

    console.log("movielist", movieList);
    if (!movieList) {
       
      const validMovies = movies.filter((movie) => movie); // Filter out null or undefined
      movieList = new MovieList({
        user: userId,
        name,
        movies: validMovies.map((movie) => movie),
      });
      await movieList.save();
      console.log("movielist", movieList);
      return res.json(movieList);
    } else {
      // If the playlist exists, check if any movie already exists in the playlist
      const validMovies = movies.filter((movie) => movie); // Filter out null or undefined

      // Check if movieList.movies is not null before accessing it
      const existingMovies = movieList.movies
        ? movieList.movies.map((imdbID) => imdbID.toString())
        : [];

      for (const movie of validMovies) {
        if (existingMovies.includes(movie.imdbID)) {
          // If movie already exists in the playlist, send a message
          return res
            .status(400)
            .json({
              message: `Movie with ID ${movie.imdbID} already exists in the playlist.`,
            });
        } else {
          // If not, add it to the playlist
          movieList.movies.push(movie);
        }
      }

      await movieList.save();
      console.log("movielist", movieList);
      return res.json(movieList);
    }
  } catch (err) {
    console.error("error", err);
    return res.status(400).json({ message: err.message });
  }
};

const getPlaylist = async (req, res) => {
  try {
    const movieLists = await MovieList.find({ user: req.user.userId });
    res.json(movieLists);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const movieList = await MovieList.findById(req.params.id);
    if (!movieList.isPublic && movieList.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(movieList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMovieFromList = async (req, res) => {
  const { listId, movieId } = req.params;
  console.log("listId:", listId, "movieId:", movieId);

  try {
    // Find the movie list by its ID
    const movieList = await MovieList.findById(listId);
    if (!movieList) {
      return res.status(404).json({ message: "Movie list not found" });
    }

    console.log("Movie List found:", movieList);

    // Check if the user is the owner of the list
    if (movieList.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if the movie exists in the list before attempting to delete it
    const movieIndex = movieList.movies.findIndex(
      (movie) => movie.imdbID === movieId
    );
    if (movieIndex === -1) {
      return res.status(404).json({ message: "Movie not found in the list" });
    }

    // Log the movie list before deletion
    console.log("Movie List before deletion:", movieList.movies);

    // Remove the movie from the list
    movieList.movies.splice(movieIndex, 1);
    await movieList.save();

    // Log the movie list after deletion
    console.log("Movie List after deletion:", movieList.movies);

    // Return the updated movie list
    res.json(movieList);
  } catch (err) {
    console.error("Error deleting movie from list:", err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  savePlaylist,
  getPlaylist,
  getPlaylistById,
  deleteMovieFromList,
};
