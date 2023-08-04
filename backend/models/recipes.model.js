module.exports = (conn, Sequelize) => {
	const manager = require("../config/manager.config.js")(__filename);
	return conn.define(manager.fileName, {

		
	/* START OF MODEL */


	/* END OF MODEL */
		
		
	}, {
        timestamps: false,
    });
};