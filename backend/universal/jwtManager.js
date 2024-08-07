const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config.js");
const cookie = require("cookie");
const { v4: uuidv4 } = require('uuid');

const Model = db["tokens"];

// Sign a JWT token with user information
exports.GenerateAccessToken = (user, fromRefreshToken) => {	
    userLite = {
        UUID: user.UUID,
        username: user.username,
        email: user.email,
        origin: !fromRefreshToken ? 1 : 0,
    }

    console.log("generated from refresh token: " + fromRefreshToken)
    
    return jwt.sign(userLite, jwtConfig.ACCESSSECRET, { expiresIn : "10m" });
}

exports.GenerateRefreshToken = (user) => {	
    userLite = {
        UUID: user.UUID,
        username: user.username,
        email: user.email,
    }

    const refreshToken = jwt.sign(userLite, jwtConfig.REFRESHSECRET, { expiresIn : "5d" });

    Model.findOne({
        where: {
            UUID: user.UUID,
        }
    }).then(async token => {
        if(token) {
            Model.update({valid: false}, {
                where: {
                    familyUUID: token.familyUUID,
                }
            })
            Model.create({UUID: user.UUID, token: refreshToken, valid: true, familyUUID: token.familyUUID})
        }
        else
            Model.create({UUID: user.UUID, token: refreshToken, valid: true, familyUUID: uuidv4()})
    })
    return refreshToken;
}

// Verifies JWT token
// https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#Refresh-Token-Automatic-Reuse-Detection
// This is called Automatic Reuse Detection, where the server stores refresh tokens in a database grouped by "families".
// refresh tokens only work once, and when they are used, the server invalidates all other refresh tokens in the same family
// and generates a new refresh token for the family. If a invalid refresh token is used, the server invalidates all other
// refresh tokens in the same family, and the user must login again. This is to stop malicious users from using a refresh token
// multiple times, and allows for quick revocation of stolen refresh tokens.

exports.VerifyRefreshToken = (token, req, res) => {	
    let shouldAbort = false;

    Model.findOne({
        where: {
            token : token,
        }}).then(async data => {
            if(!data) {
                res.status(401).send({
                    message: "Invalid Refresh Token."
                })
                shouldAbort = true;
                return shouldAbort;
            }
            else if(!data.valid) {
                // If the token is invalid, delete all tokens in the same family
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');

                Model.destroy({
                    where: {
                        familyUUID: data.familyUUID,
                    }
                }).then(async () => {
                    res.status(401).send({
                        message: "Invalid Refresh Token."
                    })
                    shouldAbort = true;
                    return shouldAbort;
                })
            }
            else {
                // If the token is valid, invalidate all other tokens in the same family
                // then generate a new refresh token for the family and send it to the user
                
                console.log('refreshing refresh token')
                jwt.verify(token, jwtConfig.REFRESHSECRET, (err, user) => {
                    if(err) {
                        console.log(err)
                        res.status(403).send({
                            message: "Token is invalid!"
                        });
                        shouldAbort = true;
                        return shouldAbort;
                    }

                    res.cookie(cookie.serialize('accessToken', this.GenerateAccessToken(user, true), {
                        httpOnly: true,
                        secure: true,
                        maxAge: 60 * 15 // 15 minutes
                    }));
                    res.cookie(cookie.serialize('refreshToken', this.GenerateRefreshToken(user), {
                        httpOnly: true,
                        secure: true,
                        maxAge: 60 * 60 * 24 * 5 // 5 days
                    }));
                    res.status(200).send({
                        message: "Refresh Token regenerated."
                    })
                })
            }
        })
    
    return shouldAbort;
}

// Verifies JWT token
// Returns true if token is invalid, meaning that the current process should abort
exports.VerifyAccessToken = (req, res) => {	
    var cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    const refreshToken = cookies.refreshToken;

    if(token == null && refreshToken == null) {
        res.status(401).send({
            message: "User is not logged in!"
        });
        return true;
    } else if (token == null) {
        res.status(403).send({
            message: "Token is invalid!"
        });
        return true;
    }

    return jwt.verify(token, jwtConfig.ACCESSSECRET, (err, user) => {
        if(err) {
            res.status(403).send({
                message: "Token is invalid!"
            });
            return true;
        }

        req.user = user;
        return false;
    });
}

exports.logoutUser = (req, res) => {
    var cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.refreshToken;

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    Model.findOne({
        where: {
            token: token,
        }
    }).then(async data => {
        console.log(data)
        Model.destroy({
            where: {
                familyUUID: data.familyUUID,
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "User was logged out successfully."
                })
            } else {
                res.status(400).send({
                    message: `Cannot logout user.`
                })
            }
        }).catch(err => {
            res.status(500).send({
                message: "Server Error."
            });
        })
    })
}

exports.deconstructToken = (req) => { 
    var cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;
    return jwt.decode(token);
}