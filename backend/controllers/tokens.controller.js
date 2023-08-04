const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const cookie = require('cookie');

const Model = db[manager.fileName];

// Verify User Information (username and password)
exports.refreshAccessToken = (req, res) => {	
    var cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.refreshToken;

    if(token) {
        jwtManager.VerifyRefreshToken(token, req, res)
    }
    else {
        res.status(401).send({
            message: "Missing refresh token."
        })
    }
}

exports.deleteToken = (req, res) => {	
    const refreshToken = req.body.token;
    Model.destroy({
        where: {
            token: refreshToken,
        }
    }).then(async token => {
        res.status(204).send({
            message: "User was logged out!"
        })
    })
};

exports.validateToken = (req, res) => {    
    if(jwtManager.VerifyAccessToken(req, res))
        return;
    
    res.status(200).send({
        message: "Token is valid.",
        user: req.user,
    })
}

