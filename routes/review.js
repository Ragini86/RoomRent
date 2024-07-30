const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../util/wrapFun.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const controllerReview = require("../Controllers/reviews.js");

//Review Post route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(controllerReview.createReview)
);
//Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(controllerReview.destroyReview)
);

module.exports= router;