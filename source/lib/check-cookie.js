// check-cookie.js

import jwt from 'jsonwebtoken'

const checkCookie = (req, res, next) => {
    console.log(`Checking authentication!`);
    if (typeof req.cookies.nToken === `undefined` || req.cookies.nToken === null) {
        req.user = null;
    } else {
        const token = req.cookies.nToken;
        const decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }
    next();
}
export default checkCookie;
