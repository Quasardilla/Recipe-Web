const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config.js");

const Model = db["tokens"];

// Sign a JWT token with user information
exports.GenerateAccessToken = (user, fromRefreshToken) => {	
    userLite = {
        UUID: user.UUID,
        username: user.username,
        email: user.email,
        origin: fromRefreshToken ? 1 : 0,
    }
    
    return jwt.sign(userLite, jwtConfig.ACCESSSECRET, { expiresIn : "30s" });
}

exports.GenerateRefreshToken = (user) => {	
    userLite = {
        UUID: user.UUID,
        username: user.username,
        email: user.email,
    }

    const refreshToken = jwt.sign(userLite, jwtConfig.REFRESHSECRET, { expiresIn : "7d" });

    Model.findOne({
        where: {
            UUID: user.UUID,
        }
    }).then(async token => {
        if(token)
            Model.update({token: refreshToken}, {
                where: {
                    UUID: user.UUID,
                }
            })
        else
            Model.create({UUID: user.UUID, token: refreshToken})
    })
    return refreshToken;
}

// Verifies JWT token
exports.VerifyRefreshToken = (token, req, res) => {	
    let shouldAbort = false;

    console.log("verifying token:" + token)

    jwt.verify(token, jwtConfig.REFRESHSECRET, (err, user) => {
        if(err) {
            console.log(err)
            res.sendStatus(403).send({
                message: "Token is invalid!"
            });
            shouldAbort = true;
            return shouldAbort;
        }

        const accessToken = this.GenerateAccessToken(user, true);
        res.json({ accessToken: accessToken });
    });

    return shouldAbort;
}

exports.VerifyAccessToken = (req, res) => {	
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    let shouldAbort = false;

    console.log(token)

    if(token == null) {
        res.status(400).send({
            message: "User is not logged in!"
        });
        shouldAbort = true;
        return shouldAbort;
    }


    jwt.verify(token, jwtConfig.ACCESSSECRET, (err, user) => {
        if(err) {
            res.status(403).send({
                message: "Token is invalid!"
            });
            shouldAbort = true;
            return shouldAbort;
        }

        req.user = user;
    });

    return shouldAbort;
}