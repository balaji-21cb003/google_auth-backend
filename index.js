const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const app = express();
require("./auth");

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookies: { sercure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "auth/google/failure",
  })
);

app.get("/auth/google/failure", isLoggedIn, (req, res) => {
  res.send("Something went wrong!");
});

app.get("/auth/protected", isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send(`hello ${name}`);
});

app.get("/auth/logout", (req, res) => {
  req.session.destroy();
  res.send("See you again");
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
