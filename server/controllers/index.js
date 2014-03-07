/**
 * Main routes
 * @param app Express application
 */
module.exports = function( app ) {
    app.get( '/', mainIndex );
    app.get( '/app', angularApp );
};

/**
 * Main index
 */
function mainIndex( req, res ) {
    res.render( 'index' );
}

/**
 * Angular test application
 */
function angularApp( req, res ) {
    res.render( 'app-test' );
}