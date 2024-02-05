module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({"message" : "Please log in to view that resource"})
        // req.flash('error_msg', 'Please log in to view that resource');
        // res.redirect('/auth/login');
    }
}