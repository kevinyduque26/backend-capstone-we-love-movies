const knex = require("./../db/connection");
const reduceProperties = require("./../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    movies_created_at: ["movies", null, "created_at"],
    movies_updated_at: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
    movies_theater_id: ["movies", null, "theater_id"],   
});

function list() {
    return knex("theaters")
    .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
        .join("movies", "movies_theaters.movie_id", "movies.movie_id")
        .select("theaters.*", 
            "movies.movie_id",
            "movies.title",
            "movies.runtime_in_minutes",
            "movies.rating",
            "movies.description",
            "movies.image_url",
            "movies.created_at as movies_created_at",
            "movies.updated_at as movies_updated_at",
            "movies_theaters.is_showing",
            "movies_theaters.theater_id as movies_theater_id",
        )
        .where({ "movies_theaters.is_showing": true })
        .then((theaters) => reduceMovies(theaters))
};

module.exports = {
    list,
}