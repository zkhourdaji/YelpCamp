// to use enviroment variables from the .env file
require("dotenv").config();

var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	User = require("./models/user"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	flash = require("connect-flash");


// seperate files for yelp camp routes.
// exports router object
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

// connect to the mongo database
mongoose.connect(process.env.DATABASEURL);
console.log("process.env.DATABASEURL: " + process.env.DATABASEURL);

// use body parser to populate the req.body object for post requests
app.use(bodyParser.urlencoded({ extended: true }));
// set the view engine to ejs to omit the .ejs file extensions
app.set("view engine", "ejs");
// serve the public directory
app.use(express.static(__dirname + "/public"));
// method override to send put and delete requests from HTML forms
app.use(methodOverride("_method"));
// seed the database
// seedDB();

app.use(flash()); // for flash messages
// to be able to use moment inside ejs templates
app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "secret message can be anything",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
	// pass the req.user to all templates as currentUser
	res.locals.currentUser = req.user;
	// flash
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("Server started");
});
