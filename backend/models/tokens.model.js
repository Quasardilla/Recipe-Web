module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {

		
	/* START OF MODEL */
        UUID: {
            type: Sequelize.STRING(36),
        },
		token: {
			type: Sequelize.STRING(512)
		},
		valid: {
			type: Sequelize.BOOLEAN
		},	
		familyUUID: {
			type: Sequelize.STRING(36)
		}

	/* END OF MODEL */
		
		
	}, {
        timestamps: false,
    });
};