// running this file will create an admin in the database if it doesnt already exist

// connect to the database
var mongoose = require("mongoose");
var User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

var admin = {
	username: "khourdaji",
	password: "admin",
	isAdmin: true
};

function createAdmin() {
	User.findOne({ username: admin.username }, function(err, foundAdmin) {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		if (foundAdmin) {
			console.log("admin already exist");
			console.log(foundAdmin);
			process.exit(1);
		}
		else {
			console.log("Admin not found. Creating admin...");
			var adminUser = new User({ username: admin.username, isAdmin: true });
			User.register(adminUser, admin.password, function(err, registeredAdmin) {
				if (err) {
					console.log("could not register admin");
					console.log(err);
					process.exit(1);
				}
				else {

				}
			});
			User.create(admin, function(err, createdAdmin) {
				if (err) {
					console.log("Could not create admin....");
					console.log(err);
					process.exit(1);
				}
				else {
					console.log("Admin created!");
					console.log(createdAdmin);
					process.exit(0);
				}
			});
		}

	});

}
createAdmin();

// module.exports = createAdmin;
