/**
 * Main server application entry module.
 * Setup all modules and components for starting server.
 *
 * @author Kari Heikkinen <kari.heikkinen@iki.fi>
 * @copyright Kari Heikkinen
 * @licence MIT
 */

var express = require('express');
var fs = require('fs');
var passport = require('passport');
var path = require('path');
var nconf = require('nconf');
var mongoose = require('mongoose');


/**
 * Get environment mode, defaults to development
 */
var env = process.env.NODE_ENV || 'development';

/**
 * Setup nconf to use (in-order):
 *   1. Command-line arguments
 *   2. A file located at 'path/to/config.json'
 */
nconf.argv()
    .file( { file: 'config/'+env+'.json' } );

/**
 * Add root path to configuration
 */
nconf.set('rootPath', __dirname );

/**
 * Fix prefix if first slash is missing
 */
var prefix = nconf.get('prefix');
if( prefix ) {
    if( ! /^\//.test( prefix ) ) {
        nconf.set('prefix', '/' + prefix );
    }
}


/**
 * Bootstrap db connection
 */
mongoose.connect( nconf.get('db') );

/**
 * Bootstrap mongoose models
 */
var models_path = path.join( __dirname, 'server', 'models' );
var walk = function( models_path ) {
    fs.readdirSync( models_path ).forEach( function( file ) {
        // If test file skip it
        if( /.*\.test\.js$/.test( file ) )
            return;

        // Check path and is it file
        var filepath = path.join( models_path, file );
        var stat = fs.statSync( filepath );

        // load if it is file
        if( stat.isFile() ) {
            // If not java script file then skip it
            if( ! /.*\.js$/.test( file ) )
                return;

            require( filepath );
            return;
        }

        // If directory then check it recursively
        if( stat.isDirectory() ) {
            walk( filepath );
            return;
        }
    });
};
walk( models_path );

/**
 * Bootstrap passport config
 */
require( './server/passport' )( passport, nconf.get('auth') );

/**
 * Create express application
 */
var app = express();

/**
 * express settings
 */
require('./server/express')( app, nconf.get() );

/**
 * Start application if this is main module
 */
if( require.main === module ) {
    //Start the app by listening on <port>
    var port = nconf.get('port') || process.env.PORT || 3000;

    // Create HTTP server object and start to listen port. Created
    // separate object, so that it can be passed to socketIO also.
    var server = require('http').createServer( app );
    server.listen(port);
}

exports = module.exports = app;
