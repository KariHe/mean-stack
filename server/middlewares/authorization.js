/**
 * Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
};

exports.requiresAdmin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401);
    }
    next();
};
