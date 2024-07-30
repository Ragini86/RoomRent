const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");
const listingSchema = new Schema({
    title :{
        type : String,
        required : true,
    },
    description : String,
    image: {
        // type: String,
        // default: "https://img.onmanorama.com/content/dam/mm/en/lifestyle/decor/images/2023/6/1/house-middleclass.jpg.transform/845x440/image.jpg",
        // set: function(v) {
        //     return v.trim() === "" ? "https://img.onmanorama.com/content/dam/mm/en/lifestyle/decor/images/2023/6/1/house-middleclass.jpg.transform/845x440/image.jpg" : v;
        // },
        url: String,
        filename: String,
    },
    
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
})
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;