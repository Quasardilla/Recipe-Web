module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {

	UUID: {
        type: Sequelize.STRING(36),
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },

	},
    {
        //disables the default timestamp columns (createdAt and updatedAt)
        timestamps: false,
    });
};