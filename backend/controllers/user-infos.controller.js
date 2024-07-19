const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const argon2 = require("argon2");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const cookie = require("cookie");
const {OAuth2Client} = require('google-auth-library');

const Model = db[manager.fileName];
const UserModel = db["users"];

// Verify User Information (username and password)
exports.validateUser = (req, res) => {	 
    // Validate request
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        message: "You're missing a field!"
      });
      return;
    }

    // Verify Request
    UserModel.findOne({
        where: {
            email: req.body.email,
        }
    }).then(async user => {
        let usercreds = await Model.findOne({
            where: {
                UUID: user.UUID,
            }
        })

        if(usercreds == null) {
            res.status(400).send({
                message: "Email wasn't found. Try signing in with google?"
            })
            return;
        }

        if(argon2.verify(usercreds.password, req.body.password)) {
            res.cookie(cookie.serialize('accessToken', jwtManager.GenerateAccessToken(user, false), {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 15 // 15 minutes
            }));

            res.cookie(cookie.serialize('refreshToken', jwtManager.GenerateRefreshToken(user), {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 5 // 5 days
            }));
            res.status(200).send({
                message: "User was validated successfully.",
                user: user,
            })
        }
        else {
            res.status(401).send({
                message: "Password is invalid."
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            message: "Email is invalid."
        });
    });
  
};

exports.validateGoogleUser = async (req, res) => {
    let userInfo = await verifyGoogleToken({clientId: req.body.clientId, credential: req.body.credential})
    if(userInfo == null) {
        res.status(401).send({
            message: "Invalid Google Token."
        })
        return;
    }

    console.log(userInfo)
    
    UserModel.findOne({
        where: {
            UUID: userInfo.userId,
        }
    }).then(async user => {
        if(user == null) {
            res.status(401).send({
                message: "User does not exist."
            })
            return;
        }
        else {
            res.cookie(cookie.serialize('accessToken', jwtManager.GenerateAccessToken(user, false), {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 15 // 15 minutes
            }));
            res.cookie(cookie.serialize('refreshToken', jwtManager.GenerateRefreshToken(user), {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24 * 5 // 5 days
            }));
            res.status(200).send({
                message: "User was validated successfully.",
                user: user,
            })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            message: "Server Error."
        });
    });
}

async function verifyGoogleToken(info) {
    const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: info.credential,
            audience: info.clientId,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        }).catch(err => {
            console.log(err)
            return null;
        });

        const payload = ticket.getPayload();

        return {
            email: payload['email'],
            name: payload['name'],
            picture: payload['picture'],
            userId: payload['sub']
        };
}

exports.logoutUser = (req, res) => {
    jwtManager.logoutUser(req, res);
}