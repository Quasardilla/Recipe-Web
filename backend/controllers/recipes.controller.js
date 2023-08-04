const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const cookie = require('cookie');

const Model = db[manager.fileName];

