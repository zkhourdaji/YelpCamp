var mongoose = require("mongoose");

// connect to the yelp_camp database if it exists
// otherwise it creates it
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
var campgroundSchema = mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		// the name of the model that were referencing
		ref: "Comment"
	}]

});

// compile the schema into a model
var Campground = mongoose.model("Campground", campgroundSchema);


module.exports = Campground;
