/**
 * Module dependencies.
 */
var express = require('express');
var mongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var helpers = require('./middlewares/view-helpers');
var fs = require('fs');
var path = require('path');
var temp = require('temp');
var appsec = require('lusca');
var enrouten = require('express-enrouten');
var passport = require('passport');


module.exports = function(app, config) {
    app.set('showStackError', true);

    // -------------------------------------------------------------------------
    // Should be placed before express.static
    // -------------------------------------------------------------------------
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // -------------------------------------------------------------------------
    // Configure lusca application security features.
    // See: https://github.com/paypal/lusca
    // -------------------------------------------------------------------------
    if( config.appsec ) {
        app.use( appsec( config.appsec ) );
    }

    // -------------------------------------------------------------------------
    // Setting the fav icon and static folder
    // -------------------------------------------------------------------------
    var uriPrefix = (config.prefix || '');

    var favicon;
    if( config.favicon ) {
        favicon = path.join( config.rootPath, config.favicon );
    }
    app.use( uriPrefix + '/', express.favicon( favicon ) );

    // Public files ( compiled application )
    app.use( uriPrefix + '/static', express.static( config.rootPath + '/static' ) );

    // -------------------------------------------------------------------------
    // Don't use logger for test env
    // -------------------------------------------------------------------------
    if (process.env.NODE_ENV !== 'test') {
        app.use(express.logger('dev'));
    }

    // -------------------------------------------------------------------------
    // Set views path, template engine and default layout
    // -------------------------------------------------------------------------
    app.engine( 'ejs', require('ejs-locals') ); // Use ejs-locals as EJS engine, so we get partials/layouts
    app.set( 'views', path.join( config.rootPath, 'server', 'views') );
    app.set( 'view engine', 'ejs');


    app.configure(function() {
        //cookieParser should be above session
        app.use(express.cookieParser());

        //bodyParser should be above methodOverride
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        //express/mongo session storage
        app.use(express.session({
            secret: config.sessionKey || 'mean-stack',
            store: new mongoStore({
                url: config.db,
                collection: 'sessions'
            })
        }));

        //connect flash for flash messages
        app.use( flash() );

        //dynamic helpers
        app.use( helpers( config ) );

        //use passport session
        app.use(passport.initialize());
        app.use(passport.session());

        //routes should be at the last
        app.use( uriPrefix + '/', app.router );
        enrouten(app).withRoutes({
            directory: 'server/controllers'
        });


        // Assume "not found" in the error msgs is a 404. this is somewhat silly,
        // but valid, you can do whatever you like, set properties, use 
        // instanceof etc.
        app.use(function(err, req, res, next) {
            // Treat as 404
            if (~err.message.indexOf('not found')) return next();

            // Log it
            console.error(err.stack);

            // Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        //Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

    });
};
