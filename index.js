const express = require("express");
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

// Database Connections
const dbUrl = process.env.ATLASDB_URL;
main()
 .then(()=>{
    console.log("Connection successfully");
 })
 .catch((err)=>{
    console.log(err);
 })
async function main() {
    mongoose.connect(dbUrl);
}


//App Configuration
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",() =>{
    console.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*7*24*60*60,
        maxAge: 1000*7*24*60*60,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
//Root route
// app.get("/",(req,res)=>{
//     res.send("I am root route");
// })
//Add Routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
//Error Handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let {statusCode=505,message="Something went wrong"} = err;
    if (res.headersSent) {
        return next(err);
    }
    res.status(statusCode).render("./listings/error", { message });
})

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})