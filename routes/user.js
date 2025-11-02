const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { route } = require("./listings.js");

//signup form
router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.login(registerUser, (er) => {
      if (er) {
        return req.flash("error", "signup error !");
      }
      req.flash("success", "welcome to the website !");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

//login form

router.get("/login", (req, res) => {
  res.render("./user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    console.log(req.body)
    req.flash("success", "welcome,you are loged in");
    res.redirect("/listings");
  }
);

//logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", err);
    }
    req.flash("success", "you are logged out !");
    res.redirect("/listings");
  });
});

module.exports = router;
