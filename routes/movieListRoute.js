const express = require("express");
const router = express.Router();

const {
  savePlaylist,
  getPlaylist,
  getPlaylistById,
  deleteMovieFromList,
} = require("../controller/movielist");
const auth = require("../middleware/auth");

router.post("/save", auth, savePlaylist);

router.get("/get", auth, getPlaylist);

router.get("/get:id", auth, getPlaylistById);
router.delete("/movielist/:listId/:movieId", auth, deleteMovieFromList);

module.exports = router;
