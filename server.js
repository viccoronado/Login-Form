const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('my secret'));

app.use(session({
    secret: 'my secret',
    resave: true,
    saveUnitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function (username, password, done) {
    if (username === "Victoria" && password === "123456")
        return done(null, { id: 1, name: "Victoria" });

    done(null, false);
}));

//Serialización
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Deserialización
passport.deserializeUser(function (id, done) {
    done(null, { id: 1, name: "Victoria" });
});

app.set('view engine', 'ejs');

app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}, (req, res) => {

    res.send("Hola");
});

app.get("/login", (req, res) => {
    //Mostrar formulario de login
    res.render("login");
})

app.post("/login", passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.listen(3001, () => console.log("Server started"));