

function verifyAdmin(req, res, next) {
    return req.isAdmin ?
        next()
        :
        res.status(401).send("You are not authorized to access this resource.");
}


module.exports = verifyAdmin;