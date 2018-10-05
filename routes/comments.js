var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// Comment New
//shows form to add a new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		}
		else {
			console.log(foundCampground);
			res.render("comments/new", { campground: foundCampground });

		}
	});
});

// create a comment
router.post("/", middleware.isLoggedIn, function(req, res) {
	// look up campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			// create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash("error", "Something went wrong. Couldnt create comment.");
					console.log(err);
				}
				// associate the comment with the campground
				else {
					// add username and id to comment
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment.");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	// add the comment to the comments array in the campground
});

// COMMENT EDIT ROUTE
// SHOW FORM TO EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		}
		else {
			res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });

		}
	});
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});


router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		}
		else {
			req.flash("success", "Comment Successfully Deleted.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;
