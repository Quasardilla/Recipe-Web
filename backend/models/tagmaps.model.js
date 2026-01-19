module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {
	},
	{ 
        paranoid: true,
        timestamps: false, //disables the default timestamp columns (createdAt and updatedAt)

    });
};