const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");

const Model = db[manager.fileName];

// Verify User Information (username and password)
exports.refreshAccessToken = (req, res) => {	
    const refreshToken = req.body.token;
    Model.findOne({
        where: {
            token: refreshToken,
        }
    }).then(async token => {
        if(token) {
            jwtManager.VerifyRefreshToken(refreshToken, req, res)
        }
        else {
            res.status(401).send({
                message: "Invalid Refresh Token."
            })
        }
    }).catch(err => {
        console.log(err)
    })
};

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

exports.test = (req, res) => {    
    if(jwtManager.VerifyAccessToken(req, res))
        return;
    console.log(req.user)
    res.status(200).send({
        message: "User was validated successfully.",
        user: req.user,
    })
}

