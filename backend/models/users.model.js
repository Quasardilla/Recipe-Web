module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);

	return conn.define(manager.fileName, {

		
	/* START OF MODEL */
		UUID: {
            primaryKey : true,
            type: Sequelize.STRING(36),
        },
		username: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},

	/* END OF MODEL */
		
		
	}, {
        timestamps: false,
    });
};