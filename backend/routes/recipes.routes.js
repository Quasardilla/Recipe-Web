module.exports = app => {
	const manager = require("../config/manager.config.js")(__filename);
	const express = require("express");

	const Router = express.Router();
  	const Controller = require("../controllers/" + manager.fileName + ".controller.js");

	
	/* START OF ROUTES */

	Router.get('/:UUID', Controller.findOne)

	Router.get('/', Controller.findAll)

	Router.get('/user/:UUID', Controller.findAllByUser)

	// Router.get('/tag', Controller.findAllWithTags)

	Router.get('/query', Controller.search)

	Router.post('/', Controller.createRecipe)

	Router.patch('/edit/:UUID', Controller.createRecipe)

	// Router.post('/autocomplete/name', Controller.nameAutoComplete)

	Router.post('/autocomplete/tag', Controller.tagAutoComplete)

	Router.delete('/:UUID', Controller.deleteRecipe)
	
	/* END OF ROUTES */

	
  	app.use('/api/' + manager.fileName, Router);
};
