var express = require("express");
var app = express();
var Sequelize = require("sequelize");
var passport = require("passport");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passportLocalSequelize = require("passport-local-sequelize");
var User = require("./models/user");

app.set("view engine", "ejs");
if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
  secret: "process.env.SESSION_SECRET",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res) {
  res.render("home");
})

app.get("/secret", isLoggedIn, function(req, res) {
  res.render("secret");
})

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("/register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/secret");
    });
  })
})

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req, res) {});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function(req, res) {
  console.log("App on port ", app.get('port'));
});
