module.exports = app => {
	const manager = require("../config/manager.config.js")(__filename);
	const express = require("express");

	const Router = express.Router();
  	const Controller = require("../controllers/" + manager.fileName + ".controller.js");

	
	/* START OF ROUTES */

	Router.post("/", Controller.validateUser);

	Router.post("/google", Controller.validateGoogleUser);

	Router.post("/logout", Controller.logoutUser);
	
	/* END OF ROUTES */

	
  	app.use('/api/' + manager.fileName, Router);
};
