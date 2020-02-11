var jwt = require('jsonwebtoken');

const generateToken = (user) => {
    try {

        if (!user.email && !user.name && !user._id && !user.role) return false;

        const userSignature = {
            email: user.email,
            name: user.name,
            id: user._id,
            role: user.role
        };

        const key = process.env.jwtprivatekey;
        return jwt.sign(userSignature, key);

    } catch (error) {
        return false;
    }
}

const verifyToken = (token) => {
    try {
        decoded = jwt.verify(token, process.env.jwtprivatekey);
        return decoded;
    } catch (error) {
        return false;
    }
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
};