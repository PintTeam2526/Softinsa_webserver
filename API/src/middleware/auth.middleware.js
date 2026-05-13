const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.user = { role: "guest" };
        return next();
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        req.user = { role: "guest" };
        return next();
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        req.user = { role: "guest" };
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = { role: "guest" };
            return next();
        }

        req.user = decoded;
        return next();
    });
};

module.exports = authMiddleware;