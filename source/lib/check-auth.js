// check-auth.js

const checkAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).send({ message: `401 Unauthorized`});
    }
}

export default checkAuth;
