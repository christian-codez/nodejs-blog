var jwt = require('jsonwebtoken');
var { User } = require("../models/user")

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

const verifyToken = async(token) => {
    try {
        decoded = jwt.verify(token, process.env.jwtprivatekey);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) throw new Error();
        return user;
    } catch (error) {
        return error;
    }
}

//set jwtprivatekey=jwtprivatekey

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
};