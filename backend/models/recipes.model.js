module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {

	recipeUUID: {
		type: Sequelize.STRING(36),
	},
	owner: {
		type: Sequelize.STRING(36),
	},
	title: {
		type: Sequelize.STRING,
	},
	thumbnail: {
		type: Sequelize.STRING,
	},
	description: {
		type: Sequelize.STRING,
	},
	ingredients: {
		type: Sequelize.STRING,
	},
	steps: {
		type: Sequelize.STRING,
	},
	cooktime: {
		type: Sequelize.INTEGER,
	},
	preptime: {
		type: Sequelize.INTEGER,
	},
	servings: {
		type: Sequelize.INTEGER,
	},
	note: {
		type: Sequelize.STRING(200),
	},
	saves: { //"favorites"
		type: Sequelize.INTEGER,
	},

	

	},
	{ paranoid: true, }
	);
};