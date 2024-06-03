const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require("./connection/dbConnection");
const userRoutes = require("./routes/userRoutes");
const movieRoute = require("./routes/movieRoute");
const movieListRoutes = require("./routes/movieListRoute");
dotenv.config();

const app = express();
dbConnection;
app.use(bodyParser.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", movieRoute);
app.use("/api", movieListRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
