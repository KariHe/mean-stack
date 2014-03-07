/**
 * Command line tool for creating users
 *
 * @author Kari Heikkinen kari.heikkinen@iki.fi>
 * @licence MIT
 */


var path = require('path');
var nconf = require('nconf');
var mongoose = require('mongoose');


// Load command line arguments
nconf.argv();
// Define environment and which config to load
var env = process.env.NODE_ENV || nconf.get('conf') || 'development';
// Load configuration file
nconf.file( { file: path.join( __dirname, '../config', env + '.json' ) });


// Check command line arguments
var newUser = {};
newUser.username = nconf.get('user') || nconf.get('u');
newUser.name = nconf.get('name') || nconf.get('n') || newUser.username;
newUser.password = nconf.get('password') || nconf.get('p');

mongoose.connect( nconf.get('db') );

// Load user model
require('../server/models/user');
var User = mongoose.model( 'User' );

// Default error function
var func = function() {
    console.error('No action argument given');
    process.exit();
};

// Create new user
if( nconf.get('create') || nconf.get('c') ) {
    func = function( err, user ) {
        handleError( err );
        if( user ) {
            console.error('User is already defined');
            process.exit();
        }

        console.log( 'Adding new user...');
        console.log( newUser );
        user = new User( newUser );
        user.save( function(err) {
            handleError( err );
            console.log('Done.');
            process.exit();
        });
    };
}

// Delete user
if( nconf.get('delete') || nconf.get('d') ) {
    func = function( err, user ) {
        handleError( err );
        if( !user ) {
            console.error('User is not found');
            process.exit();
        }
        console.log( 'Removing user...');
        user.remove( function( err ) {
            handleError( err );
            console.log('Done.');
            process.exit();

        });
    };
}

///@todo Update password, name, email etc..



// First try to find user nad pass it to handler function
User.findOne( { username: newUser.username }, func );

// Error handler
function handleError( err ) {
    if( err ) {
        console.error( err );
        process.exit();
    }
}