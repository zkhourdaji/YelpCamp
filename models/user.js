var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: { type: Boolean, default: false }
});

// add methods for authentication which can be used from the model after exporting
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
