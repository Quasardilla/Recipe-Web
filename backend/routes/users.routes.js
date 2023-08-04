module.exports = app => {
	const manager = require("../config/manager.config.js")(__filename);
	const express = require("express");

	const Router = express.Router();
  	const Controller = require("../controllers/" + manager.fileName + ".controller.js");

	
	/* START OF ROUTES */

	Router.post("/", Controller.createUser);
	
	Router.post("/google", Controller.createGoogleUser);

    Router.post("/taken/", Controller.checkUsernameTaken);

	Router.delete("/", Controller.deleteUser)
	
	/* END OF ROUTES */

	
  	app.use('/api/' + manager.fileName, Router);
};
