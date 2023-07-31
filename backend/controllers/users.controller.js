const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const argon2 = require("argon2");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const { v4: uuidv4 } = require('uuid');

const Model = db[manager.fileName];
const UserInfoModel = db["user-infos"]

// Create and Save a new User
exports.createUser = (req, res) => {	
  console.log(req.body)
  
  // Validate request
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.status(400).send({
        message: "You're missing a field!"
      });
      return;
    }
  
    // Create a User
    const user = {
        UUID: "" + uuidv4(),
        username: req.body.username,
        email: req.body.email,
    };
  
    // Save the User in the database
    Model.create(user)
      .then(async data => {
        const userInfo = {
            UUID: data.UUID,
            password: await argon2.hash(req.body.password, {    
                type: argon2.argon2i,
                hashLength: 50,
            }),
        };

        UserInfoModel.create(userInfo)
        .then(data => {
            res.status(200).send({
                message: "User was created successfully."
            })
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User. (2)"
          });
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User. (1)"
        });
      });
  };

exports.deleteUser = async (req, res) => {

    // Validate request
    if (!req.body.UUID || !req.body.password) {
        res.status(400).send({
            message: "You're missing a field!"
        });
        return;
    }

    // Validate Token
    if(jwtManager.VerifyToken(req, res))
        return;

    let user = {
        UUID: req.body.UUID,
        password: UserInfoModel.findOne({
            where: {
                UUID: req.body.UUID
            }
        })
    }

    if(await argon2.verify(user.password, req.body.password)) {
        Model.destroy({
            where: {UUID : user.UUID}
        })
        .then(num => {
            if (num == 1) {
                UserInfoModel.destroy({
                    where: {UUID : user.UUID}
                }).then(num => {
                    if (num == 1) {
                        res.send({
                            message: "User was deleted successfully."
                        });
                        }
                    else {
                        res.send({
                            message: `Cannot delete User with UUID of ${user.UUID}. Maybe User doesn't exist?`
                            });
                    }
                })
            } else {
            res.send({
                message: `Cannot delete User with UUID of ${user.UUID}. Maybe User doesn't exist?`
            });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error deleting User with UUID of" + UUID
            });
        });
    }
    else {
        res.status(400).send({
            message: "Password is incorrect."
        });
        return;
    }
  }

exports.checkUsernameTaken = async (req, res) => {

    // Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: "You're missing a field!"
        });
        return;
    }

    Model.findOne({
        where: {
            username: req.body.username,
        }
    }).then(user => {
        if(user == null) {
            res.status(200).send({
                message: "Username is available."
            })
        }
        else {
            res.status(400).send({
                message: "Username is taken."
            })
        }
    }).catch(err => {
        res.status(500).send({
            message: "Username is invalid."
        });
    });
  }