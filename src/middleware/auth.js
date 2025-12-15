// Authentication middleware

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Authentication required' });
}

function requireAuthHTML(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/admin/login.html');
}

module.exports = {
    requireAuth,
    requireAuthHTML
};

