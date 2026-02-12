// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }
    res.redirect('/admin/login');
}

// Middleware to check if user is already logged in
function isNotAuthenticated(req, res, next) {
    if (req.session && req.session.adminId) {
        return res.redirect('/admin/dashboard');
    }
    next();
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
