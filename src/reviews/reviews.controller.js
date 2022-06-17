const service = require("./reviews.service");
const asyncErrorBoundary = require("./../errors/asyncErrorBoundary");


async function reviewExists(req, res, next) {

    const review = await service.read(req.params.reviewId);

    if(review.length) {
        res.locals.review = review[0];
        return next();
    };
    next({
        status: 404,
        message: "Review cannot be found.",
    });

};

async function destroy(req, res) {

    const { review_id } = res.locals.review;
    await service.destroy(review_id);
    res.sendStatus(204);

};

async function update(req, res) {

    const review = res.locals.review;
    const { data } = req.body;

    const updatedReview = {
        ...data,
        review_id: review.review_id,
    };

    const update = await service.update(updatedReview)
    const finalData = await service.readReviewCritics(review.review_id)

    res.json({ data: finalData[0] });

};


module.exports = {
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};