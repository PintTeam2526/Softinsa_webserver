const requireAuth = (req, res, next) => {
    if (req.user.role === 'guest') {
        return res.status(401).json({ message: 'Login necessário' });
    }
    next();
};


module.exports = requireAuth;