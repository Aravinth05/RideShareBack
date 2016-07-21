var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;

var mongoose         = require("mongoose");

module.exports = function(app) {

    var userModel = require("../../models/user/user.model.server.js")();

    var auth = authorized;
    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post  ('/api/logout',         logout);
    app.post  ('/api/register',       register);
    app.get   ('/api/loggedin',       loggedin);
    app.get   ('/api/user', findAllUsers);
    app.put   ('/api/user/:id', auth, updateUser);


 
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

   
    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials({username: username, password: password})
            .then(
                function(user) {
                        if (!user) {
                            return done(null, false);
                        }
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function register(req, res) {
        var newUser = req.body;
        // first check if a user already exists with the username
        userModel
            .findUserByUsername(newUser.username)
            .then(
            function (user) {
                if (user) {
                    res.json(null);
                } else {
                    return userModel.createUser(newUser);
                }
            },
                function (err) {
                res.status(400).send(err);
            }
        )
            .then(
            function (user) {
                if (user) {
                   
                            res.json(user);
                     
                }
            },
                function (err) {
                res.status(400).send(err);
            }
        );
           
    }

    function findAllUsers(req, res) {
      
            userModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function () {
                        res.status(400).send(err);
                    }
                );
       
    }

   
    function updateUser(req, res) {
        var newUser = req.body;
       
        userModel
            .updateUser(req.params.id, newUser)
            .then(
                function(user){
                    return userModel.findAllUsers();
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }



    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    };
}