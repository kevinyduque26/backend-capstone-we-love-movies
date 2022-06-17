const { QueryBuilder } = require("knex");
const knex = require("./../db/connection");
const mapProperties = require("./../utils/map-properties");


function read(review_id) {
    return knex("reviews")
        .select("*")
        .where({ review_id });
};

function destroy(review_id) {
    return knex("reviews")
        .select("*")
        .where({ review_id })
        .del();
};

const addCritics = mapProperties({
    critics_critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    critics_created_at: "critic.created_at",
    critics_updated_at: "critic.updated_at"
});

function update(review) {
    return knex("reviews")
        .select("reviews.*")
        .where({ "reviews.review_id": review.review_id })
        .update(review)
};

function readReviewCritics(review_id) {
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
        .where({ "reviews.review_id": review_id })
        .then((reviews) => {
            return reviews.map((review) => addCritics(review));
        });
};

module.exports = {
    read,
    destroy,
    update,
    readReviewCritics,
}