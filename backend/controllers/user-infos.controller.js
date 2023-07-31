const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const argon2 = require("argon2");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");

const Model = db[manager.fileName];
const UserModel = db["users"];

// Verify User Information (username and password)
exports.validateUser = (req, res) => {	
  console.log(req.body)
  
    // Validate request
    if (!req.body.username || !req.body.password) {
      res.status(400).send({
        message: "You're missing a field!"
      });
      return;
    }

    // Verify Request

    UserModel.findOne({
        where: {
            username: req.body.username,
        }
    }).then(async user => {
        let userinfo = await Model.findOne({
            where: {
                UUID: user.UUID,
            }
        })

        if(argon2.verify(userinfo.password, req.body.password)) {
            res.status(200).send({
                message: "User was validated successfully.",
                accessToken: jwtManager.GenerateAccessToken(user, false),
                refreshToken: jwtManager.GenerateRefreshToken(user),
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
            message: "Username is invalid."
        });
    });
  
  };
