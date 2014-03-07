/**
 * View helper middleware.
 *
 * <pre>
 *     var helpers = require('./middleware/view-helpers');
 *     app.use( helpers( config ) );
 * </pre>
 *
 * After this all request have view helpers set and to be used when rendering view. Example, index.ejs can use
 * variable appName, which contains config object app.name.
 *
 * Add more locals here to get values from configuration to views.
 */

var package = require( '../../package.json' );

/**
 * Create helper middleware based on configuration.
 *
 * @param config {object} Application configuration
 * @returns {viewHelper}
 */
function helpers( config ) {
    /**
     * Middleware function for defining locals for view rendering
     */
    return function viewHelper( req, res, next ) {
        res.locals.appName = config.app.name || '';
        res.locals.title = config.app.name || '';
        res.locals.copyright = config.app.copyright || '';

        res.locals.pkg = package;
        res.locals.uriPrefix = config.prefix || '';

        // Helper function to use local urls, with prefix
        res.locals.localUrl = function localUrl( uri ) {
            if( typeof uri !== 'string' )
                return '';
            if( ! uri.length )
                return res.locals.uriPrefix;

            return res.locals.uriPrefix + '/' + uri.replace( /^\//, '' );
        };

        // Helper function for static assets
        res.locals.assetUrl = function assetUrl( uri ) {
            if( !uri ) throw new Error( 'uri path argument not given' );
            return res.locals.localUrl( '/static/' + uri.replace(/^\//, '') );
        };


        res.locals.req = req;
        if (typeof req.flash !== 'undefined') {
            res.locals.info = req.flash('info');
            res.locals.errors = req.flash('error');
            res.locals.success = req.flash('success');
            res.locals.warning = req.flash('warning');
        }


        next();
    };
}

module.exports = helpers;