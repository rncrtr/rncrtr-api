import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 60*60*24*30; // 30 days
const SECRET = "h1v3m1nd51v1510n";

let authenticate = expressJwt({ secret: SECRET });

let generateAccessToken = (req,res, next) => {
    req.token = req.token || {};
    req.token = jwt.sign({
        id: req.user.id,
    }, SECRET, {
        expiresIn: TOKENTIME
    });
    next();
}

let respond = (req, res) => {
    res.status(200).json({
       user: req.username,
       token: req.token
    });
}

module.exports = { authenticate, generateAccessToken, respond }