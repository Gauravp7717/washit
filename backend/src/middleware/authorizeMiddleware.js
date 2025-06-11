const authorize = (roles = []) => {
    // roles can be a single role string (e.g., 'admin') or an array of roles (e.g., ['admin', 'manager'])
    if (typeof roles === 'string') {
        roles = [roles]; // Convert single role to array
    }

    return (req, res, next) => {
        // Check if user is authenticated (authMiddleware should run before this)
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, no user found (authMiddleware likely failed or was not applied)');
        }

        // Check if the user's role is included in the allowed roles
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            res.status(403); // Forbidden
            throw new Error(`Forbidden: User role '${req.user.role}' is not authorized to access this route.`);
        }
        next(); // User is authorized, proceed
    };
};

module.exports = authorize;