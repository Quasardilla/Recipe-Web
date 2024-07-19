const path = require("path");
const fs = require("fs");
const config = require("./db.config.js");

const Sequelize = require("sequelize");

// Establises connection with database
const conn = new Sequelize(config.DB, config.USER, config.PASSWORD, {
	host: config.HOST,
	dialect: config.dialect,
	operatorsAliases: false,

	pool: {
		max: config.pool.max,
		min: config.pool.min,
		acquire: config.pool.acquire,
		idle: config.pool.idle
	}
});

const db = {};

db.Sequelize = Sequelize;
db.conn = conn;

// Load models in model directory
let modelsDir = path.join(__dirname, "../models");
fs.readdirSync(modelsDir).forEach(function(file) {
	let model = file.substring(0, file.indexOf('.'));
	db[model] = require(modelsDir + "/" + file)(conn, Sequelize);
});

let tags = db['tags'];
let recipes = db['recipes'];
let tagmaps = db['tagmaps'];

tags.belongsToMany(recipes, { through: tagmaps, });
recipes.belongsToMany(tags, { through: tagmaps, });

recipes.sync();
tags.sync();
tagmaps.sync();

module.exports = db;