module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {

	tagmapUUID: {
        type: Sequelize.STRING(36),
    },
    recipeUUID: {
        type: Sequelize.STRING(36),
    },
    tagUUID: {
        type: Sequelize.STRING(36),
    },

	},
    {
        //disables the default timestamp columns (createdAt and updatedAt)
        timestamps: false,
    });
};