/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var auth = require('../middlewares/authorization');
var nconf = require('nconf');

/**
 * User routes
 * @param app Express application
 */
module.exports = function( app ) {
    // Define url path prefix and helper function
    var prefixUri = nconf.get( 'prefix' ) || '';
    var localUrl = function( uri ) {
        return prefixUri + '/' + uri.replace( /^\//, '' );
    };

    // Login page route
    app.get( '/login', function(req, res) {
        res.render('login', { title: 'login' });
    });

    // Logout route
    app.get( '/logout', function(req, res) {
        req.logout();
        res.redirect( localUrl('/') );
    });

    /*
    app.get( '/signup', function(req, res) {
         res.render('users/signup', {
         title: 'Sign up',
         user: new User()
         });
    });
    */

    // Authenticate user from login page
    app.post(
        '/auth/local',
        passport.authenticate('local', {
            failureRedirect: localUrl( '/login' ),
            failureFlash: 'Invalid email or password.'
        }), function(req, res) {
            res.redirect( localUrl('/') );
        }
    );


    //Setting up the users api
    //app.post('/users', users.create);

    // User API
    app.get( '/users/me', auth.requiresLogin, function(req, res) {
        res.json( req.user || null );
    });

    app.get( '/users/:userId', auth.requiresLogin, function(req, res) {
        res.json( req.profile || null );
    });

    app.post( '/users/', auth.requiresAdmin, function(req, res) {
         var user = new User(req.body);
         user.provider = 'local';
         user.save(function(err) {
             if (err) {
                 return res.render('users/signup', {
                 errors: err.errors,
                 user: user
                 });
             }
             req.logIn(user, function(err) {
                 if (err) return next(err);
                 return res.redirect(  localUrl('/') );
             });
         });
    });

    // Finish with setting up the userId param
    app.param( 'userId', function(req, res, next, id) {
        User
            .findOne({
                _id: id
            })
            .exec(function(err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + id));
                req.profile = user;
                next();
            });
    });
};