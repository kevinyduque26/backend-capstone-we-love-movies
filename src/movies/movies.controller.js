const service = require("./movies.service");
const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");

// /movies Route 

async function list(req, res) {

    const data = await service.list(req.query.is_showing);
    res.json({ data });

};

/*

async function list(req, res) {

    let data = "";

    if(req.query.is_showing) {
        data = await service.listMoviesShowing();
    } else {
        data = await service.list();
    }; 

    res.json({ data });
    
};

*/

// /movies/:movieId Route 

async function movieExists(req, res, next) {
    
    const movie = await service.readMovie(req.params.movieId);
    if(movie) {
        res.locals.movie = movie;
        return next();
    }
    next({
        status: 404,
        message: "Movie cannot be found."
    });

};

async function readMovie(req, res) {

    const data = res.locals.movie;
    res.json({ data })

};

async function readTheaters(req, res) {

    const theaters = await service.readTheaters(req.params.movieId);
    res.json({ data: theaters });

};

async function readReviews(req, res) {

    const reviews = await service.readReviews(req.params.movieId);
    res.json({ data: reviews });

};

module.exports = {
    list: asyncErrorBoundary(list),
    readMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readMovie)],
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)],
};