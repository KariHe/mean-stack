var should = require('should');
var _ = require('underscore');

/**
 * Load test configuration and setup mongo db
 */
var conf = require('../../config/test.json');
var mongoose = require('mongoose');
mongoose.connect( conf.db );

// Load test library
require('./user');

// Define tests
describe('user model', function() {
    var User = mongoose.model('User');

    it('should create user and store it DB', function(done) {
        var newUser = new User( { name: 'jussi', password: 'salakala' } );
        newUser.should.have.property( 'name' );
        newUser.save(function(err) {
            should.not.exist( err );
            User.findOne({ name: 'jussi' }, function( err, user ) {
                should.not.exist( err );

                user.should.be.instanceOf( User );
                done();
            });
        });
    });

    it('should find user from DB and authenticate with correct password', function(done) {
        User.findOne({ name: 'jussi' }, function( err, user ) {
            should.not.exist( err );
            user.should.be.instanceOf( User );
            user.authenticate( 'foobar' ).should.be.equal( false );
            user.authenticate( 'salakala' ).should.be.equal( true );
            done();
        });
    });

    after( function(done) {
        // Find ...
        User.find( function( err, users ) {
            should.not.exist( err );

            // ... and remove created users
            _.each( users, function( user ) { user.remove() });
            done();
        } );
    });
})