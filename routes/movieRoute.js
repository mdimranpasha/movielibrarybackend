const express = require("express");
const router = express.Router();
const { movieSearch, moviesearchById } = require("../controller/omdb");

router.get("/search", movieSearch);

router.get("/getmovie:id", moviesearchById);
module.exports = router;
