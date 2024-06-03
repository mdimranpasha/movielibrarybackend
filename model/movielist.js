const mongoose = require("mongoose");

const MovieListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  movies: [{ Title: String, imdbID: String, Poster: String }],
//   isPublic: { type: Boolean, default: false },
});

const Movie = mongoose.model("MovieList", MovieListSchema);
module.exports = Movie;
