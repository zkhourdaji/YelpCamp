var middlewareObj = {};
var Comment = require("../models/comment.js");
var Campground = require("../models/campground")

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		// flash
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("/login");
	}
}

// check if the current logged in user created the comment referenced by the id
// in the request parameters comment_id
middlewareObj.checkCommentOwnership = function(req, res, next) {
	// check if user is logged in
	if (req.isAuthenticated()) {

		// find the comment to edit, and pass it to the edit template
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			}
			else {
				// does user own this campground?
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					// proceed to next
					next();
				}
				else {
					req.flash("error", "You don't have permission to do that.");
					// if user doest not own the campground then redirect
					res.redirect("back");
				}

			}
		});

	}
	else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

// check if the current logged in user created the campground post referenced by the id
// in the request parameters :id
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	// check if user is logged in
	if (req.isAuthenticated()) {
		// find the campground to edit, and pass it to the edit template
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			}
			else {
				// does user own this campground?
				if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
					// proceed to next
					next();
				}
				else {
					req.flash("error", "You dont have permission to do that.");
					// if user doest not own the campground then redirect
					res.redirect("back");
				}
			}
		});

	}
	else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}
module.exports = middlewareObj;
