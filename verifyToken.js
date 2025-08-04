const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send("You are not authorized to access this resource.");
    }


    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send("You are not authorized to access this resource.");
    }


    jwt.verify(token, process.env.SECRET, (err, payload) => {

        if (err && err.message === "jwt expired") {
            return res.status(403).send("Your session has expired.");
        }

        if (err) {
            return res.status(401).send("You are not authorized to access this resource.");
        }

        req.id = payload.id;
        req.isAdmin = payload.isAdmin;
        next();
    });


}

module.exports = verifyToken;