const axios = require("axios");

const movieSearch = async (req, res) => {
  const { query } = req.query;

  try {
    console.log("apikey", process.env.OMDB_API_KEY);

    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const moviesearchById = async (req, res) => {
  const { imdbID } = req.query;

  console.log("imdbid", imdbID);

  if (!imdbID) {
    return res
      .status(400)
      .json({ Response: "False", Error: "No IMDb ID provided" });
  }

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.OMDB_API_KEY}`
    );
    if (response.data.Response === "True") {
      res.json(response.data);
    } else {
      res.status(404).json({ Response: "False", Error: response.data.Error });
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({
      Response: "False",
      Error: "An error occurred while fetching movie details",
    });
  }
};

module.exports = { movieSearch, moviesearchById };
