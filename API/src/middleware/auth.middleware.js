const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 🟡 Se NÃO houver token → define como guest
    if (!authHeader) {
        req.user = {
            role: 'guest'
        };
        return next();
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        req.user = { role: 'guest' };
        return next();
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        req.user = { role: 'guest' };
        return next();
    }

    // 🔐 Verifica token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // token inválido → trata como guest
            req.user = { role: 'guest' };
            return next();
        }

        // token válido
        req.user = decoded;

        next();
    });
};

module.exports = authMiddleware;