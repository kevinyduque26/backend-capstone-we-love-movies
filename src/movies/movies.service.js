const knex = require("./../db/connection");
const mapProperties = require("./../utils/map-properties");

// /movies Route 

function list(is_showing) {
    return knex("movies")
        .select("movies.*")
        .modify((queryBuilder) => {
            if(is_showing) {
                queryBuilder
                    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
                    .where({ "movies_theaters.is_showing": true })
                    .groupBy("movies.movie_id")
            }
        });
};

/*

function list() {
    return knex("movies").select("*");
};

function listMoviesShowing() {
    return knex("movies")
        .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
        .select("movies.*")
        .where({ "movies_theaters.is_showing": true });
};

*/

// /movies/:movieId Route 

function readMovie(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .first();
};

function readTheaters(movieId) {
    return knex("theaters")
        .join("movies_theaters", "theaters.theater_id", "movies_theaters.theater_id")
        .select("theaters.*", "movies_theaters.movie_id", "movies_theaters.is_showing")
        .where({ "movies_theaters.movie_id": movieId })
        .groupBy("theaters.theater_id");
};

const addCritics = mapProperties({
    critics_critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    critics_created_at: "critic.created_at",
    critics_updated_at: "critic.updated_at"
});

function readReviews(movieId) {
    return knex("reviews")
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .select(
            "reviews.*", 
            "critics.critic_id as critics_critic_id", 
            "critics.preferred_name",
            "critics.surname",
            "critics.organization_name",
            "critics.created_at as critics_created_at",
            "critics.updated_at as critics_updated_at",
        )
        .where({ "reviews.movie_id": movieId })
        .then((reviews) => {
            return reviews.map((review) => addCritics(review));
        });
};


module.exports = {
    list,
    readMovie,
    readTheaters,
    readReviews,
};