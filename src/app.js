if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();

// Imports
const moviesRouter = require("./movies/movies.router");

// JSON middleware
app.use(express.json());

// Routing
app.use("/movies", moviesRouter);


// Not found handler
app.use((req, res, next) => {
    next({
        status: 404,
        message: `Not found: ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).json({ error: message })
});

module.exports = app;
