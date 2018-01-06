var express = require("express");
var passport = require("../config/passportConfig");
var db = ("../models")
var router = express.Router();


router.get("/login", function(req,res){
	res.render("auth/login")
});

// As a test, use req.body
//take a away the req res stuff, replace with call passport
router.post("login", passport.authenticate("local", {
	successRedirect: "/profile",
	successFlash: "Hell yea, login success!",
	failureRedirect: "/auth/login",
	failureFlash: "Invalid credentials"
}));

router.get("/signup", function(req,res){
	res.render("auth/signup");
});

router.post("/signup", function(req, res, next){
	console.log("req.body is " + req.body);
	db.user.findOrCreate({
		where: { email : req.body.email },
		//if existing user not found
		defaults: {
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			password: req.body.password
		}
		//once the user is found
	}).spread(function(user, wasCreated){
		if(wasCreated){
			//good job you didn't fuck up, we created your ass in the db
		passport.authenticate("local", {
			successRedirect: "/",
			successFlash: "Successfully logged in"
		})(req, res, next);
		} else {
			//bad job, you tried to sign up when you should login
			req.flash("error", "Email already exist");
			res.redirect("/auth/login");
		}}).catch(function(err){
			res.flash("error", err.message);
			res.redirect("/auth/signup");
	});
});


router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/");
});


module.exports=router;