module.exports = app => {
	const manager = require("../config/manager.config.js")(__filename);
	const express = require("express");

	const Router = express.Router();
  	const Controller = require("../controllers/" + manager.fileName + ".controller.js");

	
	/* START OF ROUTES */

	Router.post("/", Controller.refreshAccessToken);

    Router.delete("/", Controller.deleteToken);

	Router.get("/test", Controller.test);

	// Router.get("/", Controller.getAll);

	// Router.get("/:password", Controller.getInfo);
	
	/* END OF ROUTES */

	
  	app.use('/api/' + manager.fileName, Router);
};
