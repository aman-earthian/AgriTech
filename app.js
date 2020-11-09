const express = require('express');
const mongoose = require('mongoose');
const body = require('body-parser');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

const PORT = 3000
const { MONGODB } = require('./config'); 
const User = require('./models/user');
const Commodity = require('./models/commodity');

app.set("view engine", "ejs");
app.use(express.static('views'));

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB up and runnning");
        return app.listen({ port: 5000 });
    
});

app.use(body.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "I love Virat and Arijit",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
    res.locals.currentuser = req.user;
    next();
})

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    Commodity.find({}, function (err, commodities) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("home", { commodities: commodities, currentUser: req.user });
        }
    })
});

app.post('/home', isLoggedIn, function (req, res) {
    Commodity.create(req.body.Commodity, (err, newComm) => {
        if (err) {
            console.log(err);
        }
        else {
            newComm.save();
            res.redirect('/home');
        }
    });
});


app.get("/commodity/:id", (req, res) => {
    Commodity.find({ category: req.params.id }, (err, found) => {
        if (err) {
            console.log("Error");
            res.redirect("/home")
        } else {
            res.render("catalogue", { commodities: found, currentUser: req.user })
        }
    })
});

app.get("/commodity/:id", (req, res) => {
    Commodity.findOne(req.params.id, (err, found) => {
        if(err){
            console.log(err);
            res.redirect("/home");
        } else{
            res.render("commodity", {Commodity: found, currentUser: req.user });
        }
    });
} );


app.get('/register', (req, res) => {
    res.render("register", {currentUser : req.user});
})
app.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.firstName, lastName: req.body.lastName, address: req.body.address, city: req.body.city, State: req.body.State, Zip: req.body.Zip });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render('register');
        } else {
            res.redirect("/login");
        }
    })
})
        
app.get('/login', (req, res) => {
    res.render("login");
})
app.post('/login', passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
}), (req, res) => {
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect("/home");
})



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/home");
}



app.listen(3000, () => {
    console.log(`Server is Started at ${PORT}`);
});