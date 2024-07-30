const Listing = require("../models/linking");
const Review = require("../models/review");

module.exports.createReview = (async (req,res) =>{
    let newListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newListing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await newListing.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${newListing._id}`);
});

module.exports.destroyReview = (async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
});