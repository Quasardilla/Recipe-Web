module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {

	UUID: {
		type: Sequelize.STRING(36),
		primaryKey: true,
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
		type: Sequelize.STRING(512),
	},
	ingredients: {
		type: Sequelize.TEXT,
	},
	steps: {
		type: Sequelize.TEXT('long'),
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
	notes: {
		type: Sequelize.STRING(512),
	},
	saves: { //"favorites"
		type: Sequelize.INTEGER,
	},
	// rating: {
	// 	type: Sequelize.FLOAT,
	// },
	// ratingCount: {
	// 	type: Sequelize.BIGINT,
	// },
	

	},
	{ paranoid: true, }
	);
};