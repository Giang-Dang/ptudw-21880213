'user strict';

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'aksdfdjf';

const sign = (email, expiresIn = "30m") => {
    return jwt.sign(
        { email },
        process.env.JWT_SECRET || JWT_SECRET,
        { expiresIn }
    )
}

const verify = (token) => {
    try {
        jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { sign, verify };