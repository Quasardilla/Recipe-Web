const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op, QueryTypes, or } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const soap = require('../universal/sanitizer.js');
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid');
const { UUID } = require("sequelize");
const _ = require("underscore");

const Model = db[manager.fileName];
const TagMaps = db["tagmaps"];
const Tags = db["tags"];
const Users = db["users"];

exports.findOne = (req, res) => {
    let UUID = req.params.UUID;

    let user = jwtManager.deconstructToken(req);

    if(UUID == undefined || typeof UUID != "string") {
        res.status(400).send("Invalid UUID");
        return
    }

    Model.findOne({
        where: {
            UUID: UUID,
        },
        paranoid: false,
        include: Tags
    }).then(async (recipe) => {
        if(recipe == null || ((recipe.deletedAt && !user) || (recipe.deletedAt && user.UUID != recipe.owner))) {
            res.status(404).send("Recipe not found");
            return;
        }
        Users.findOne({
            attributes: ['username'],
            where: {
                UUID: recipe.owner
            }
        }).then((userInfo) => {

            res.status(200).send({recipe: recipe, user: userInfo});
        })
    })
}

exports.findAll = (req, res) => {
    let limit = req.body.limit;
    let offset = req.body.offset;

    if(limit == undefined || typeof limit != "number") limit = 10;
    else if(limit > 100) limit = 100;

    if(offset == undefined || typeof offset != "number") offset = 0;
    else if(offset < 0) offset = 0;


    Model.findAll({
        limit: limit,
        offset: offset,
        include: Tags,
    }).then((result) => {
        res.status(200).send(result);
    })
}

exports.findRandom = (req, res) => {

}

// Server doesn't know if user is using tags, query, or both
exports.search = (req, res) => {
    if(req.body.tags != undefined && req.body.query != undefined) {
        findAllWithQueryAndTags(req, res);
    } else if(req.body.tags == undefined && req.body.query != undefined) {
        findAllWithQuery(req, res);
    } else if(req.body.tags != undefined && req.body.query == undefined) {
        findAllWithTags(req, res);
    } else {
        this.findAll(req, res);
    }
}


async function findAllWithQuery(req, res) {
    res.status(404).send("Not implemented");
}

async function findAllWithTags(req, res) {
    let tags = req.body.tags;
    let limit = req.body.limit;
    let offset = req.body.offset;
    let sendIDs = req.body.formatAsIDs;

    if(limit == undefined || typeof limit != "number") limit = 10;
    else if(limit > 100) limit = 100;

    if(offset == undefined || typeof offset != "number") offset = 0;
    else if(offset < 0) offset = 0;

    if(tags == undefined ||  typeof tags != "object") {
        res.status(400).send("Invalid tags");
        return;
    }

    recipeUUIDs = []

    for(let i = 0; i < tags.length; i++) {
        let UUIDs = []
        let tag = await Tags.findOne({where: {name: tags[i]}})
        recipes = await tag.getRecipes();
        for(let j = 0; j < recipes.length; j++) {
            UUIDs.push(recipes[j].UUID)
        }
        recipeUUIDs.push(UUIDs)
    }

    let result = _.intersection.apply(_, recipeUUIDs)

    if(sendIDs) {
        res.status(200).send(result);
        return;
    } else {
        let recipes = await Model.findAll({
            where: {
                UUID: {
                    [Op.in]: result
                }
            },
            limit: limit,
            offset: offset,
            include: Tags,
        })
        res.status(200).send(recipes);
    }
}

async function findAllWithQueryAndTags(req, res) {

}

exports.findRandWithTags = async (req, res) => {

}

exports.findAllByUser = (req, res) => {
    let userUUID = req.params.UUID;
    let start = 0;

    console.log(userUUID);

    if(req.body) {
        start = req.body.start || 0;
    }
    
    if(userUUID == undefined || typeof userUUID != "string") {
        res.status(400).send("Invalid user UUID");
        return
    }

    Model.findAll({
        where: {
            owner: userUUID,
            
        },
        order: [['createdAt', 'DESC']],
        limit: 100,
        offset: start,
        include: Tags,
    }).then((recipes) => {
        res.status(200).send(recipes);
    })
}

exports.createRecipe = async (req, res) => {
    if(jwtManager.VerifyAccessToken(req, res))
        return;

    let title = soap.sanitizeRecipeData(req.body.title);
    // let thumbnail = req.body.thumbnail; //not required
    let description = soap.sanitizeRecipeData(req.body.description);
    let ingredients = req.body.ingredients;
    let steps = req.body.steps;
    let cooktime = soap.onlyNumeric(req.body.cooktime);
    let preptime = soap.onlyNumeric(req.body.preptime);
    let servings = soap.onlyNumeric(req.body.servings);
    let notes = soap.sanitizeRecipeData(req.body.notes); //not required
    let tags = req.body.tags;
    let recipeUUID = uuidv4();

    if(title == undefined || description == undefined || tags == undefined || typeof tags != "object" || tags[0] == undefined
        || ingredients == undefined || steps == undefined || cooktime == undefined || preptime == undefined) {
        res.status(400).send("Invalid request body");
        return;
    }

    if(notes.length > 500 || description.length > 500 || title.length > 30) {
        res.status(400).send("A submitted string is too long! Check your lengths and try again.");
        return;
    }

    if(ingredients.length > 50 || steps.length > 50) { 
        res.status(400).send("There are too many ingredients or steps! There can only be 50 ingredients or steps per recipe.");
        return;
    }

    if(servings > 500 || cooktime > 10080 || preptime > 10080 || servings < 1 || cooktime < 1 || preptime < 1) {
        res.status(400).send("A submitted number is invalid! Check your numbers and try again.");
        return;
    }

    for(let i = 0; i < ingredients.length; i++) {
        ingredients[i].amount = await soap.onlyNumeric(ingredients[i].amount);
        ingredients[i].name = await soap.sanitizeRecipeData(ingredients[i].name);
        ingredients[i].unit = await soap.sanitizeRecipeData(ingredients[i].unit);
    }

    for(let i = 0; i < steps.length; i++) {
        steps[i] = await soap.sanitizeRecipeData(steps[i]);
    }

    if(tags.length > 50) {
        res.status(400).send("There are too many tags! There can only be 50 tags per recipe.");
        return;
    }

    let tagError = false;

    tags.forEach(tag => {
        if(tag.length > 32) {
            res.status(400).send("A tag is too long! Tags can only be 32 characters long.");
            tagError = true;
            return;
        }
        if(/[^a-z_]/.test(tag)) {
            res.status(400).send("A tag contains invalid characters! Tags can only contain lowercase letters and underscores.")
            tagError = true;
            return;
        }
    });

    if(tagError) return;

    let user = jwtManager.deconstructToken(req)

    console.log(user);

    Model.create(
        {
            UUID: recipeUUID,
            owner: user.UUID,
            title: title,
            // thumbnail: thumbnail,
            description: description,
            ingredients: JSON.stringify(ingredients),
            steps: JSON.stringify(steps),
            cooktime: cooktime,
            preptime: preptime,

            servings: servings,
            notes: notes,

            tags: tagsListToObjects(tags),

            saves: 0,
        },
        {
            include: Tags
        }
    )
    .then((result) => {
        res.status(200).send(result);
        manageTagMapRelationships(recipeUUID, tags);
    })
    .catch(err => {
        if(err.original.code == "ER_DUP_ENTRY") {
            recipe = Model.findByPk(recipeUUID)
            .then((recipe) => {
                res.status(200).send(recipe);
                manageTagMapRelationships(recipeUUID, tags);
            })
        }
        else {
            console.log(err)
            res.status(500).send("Error creating recipe");
        }
    })
}

exports.editRecipe = async (req, res) => {
    if(jwtManager.VerifyAccessToken(req, res))
        return;

    let title = soap.sanitizeRecipeData(req.body.title);
    // let thumbnail = req.body.thumbnail; //not required
    let description = soap.sanitizeRecipeData(req.body.description);
    let ingredients = req.body.ingredients;
    let steps = req.body.steps;
    let cooktime = soap.onlyNumeric(req.body.cooktime);
    let preptime = soap.onlyNumeric(req.body.preptime);
    let servings = soap.onlyNumeric(req.body.servings);
    let notes = soap.sanitizeRecipeData(req.body.notes); //not required
    let tags = req.body.tags;
    
    let recipeUUID = req.params.UUID;

    if(recipeUUID == undefined || typeof recipeUUID != "string") {
        res.status(400).send("Invalid UUID");
        return;
    }

    if(title == undefined || description == undefined || tags == undefined || typeof tags != "object" || tags[0] == undefined
        || ingredients == undefined || steps == undefined || cooktime == undefined || preptime == undefined) {
        res.status(400).send("Invalid request body");
        return;
    }

    if(notes.length > 500 || description.length > 500 || title.length > 30) {
        res.status(400).send("A submitted string is too long! Check your lengths and try again.");
        return;
    }

    if(ingredients.length > 50 || steps.length > 50) { 
        res.status(400).send("There are too many ingredients or steps! There can only be 50 ingredients or steps per recipe.");
        return;
    }

    if(servings > 500 || cooktime > 10080 || preptime > 10080 || servings < 1 || cooktime < 1 || preptime < 1) {
        res.status(400).send("A submitted number is invalid! Check your numbers and try again.");
        return;
    }

    let user = jwtManager.deconstructToken(req)

    Model.findOne({
        where: {
            UUID: recipeUUID,
            owner: user.UUID,
        }
    }).then(async (recipe) => {
        if(recipe == null) {
            res.status(404).send("Recipe not found or you do not have permission to edit it");
            return;
        }

        recipe.title = title;
        // recipe.thumbnail = thumbnail;
        recipe.description = description;
        recipe.ingredients = JSON.stringify(ingredients);
        recipe.steps = JSON.stringify(steps);
        recipe.cooktime = cooktime;
        recipe.preptime = preptime;
        recipe.servings = servings;
        recipe.notes = notes;
        recipe.tags = tagsListToObjects(tags)
        
        await recipe.save();

        res.status(200).send(recipe);

        //manageTagMapRelationships(recipeUUID, tags);
    }).then((result) => {
        res.status(200).send(result);
        manageTagMapRelationships(recipeUUID, tags);
    })
    .catch(err => {
        console.log(err)
        res.status(500).send("Error editing recipe");
    })
}

exports.deleteRecipe = async (req, res) => {
    if(jwtManager.VerifyAccessToken(req, res))
        return;

    let recipeUUID = req.params.UUID;
    if(recipeUUID == undefined || typeof recipeUUID != "string") {
        res.status(400).send("Invalid UUID");
        return;
    }

    let user = jwtManager.deconstructToken(req)

    Model.findOne({
        where: {
            UUID: recipeUUID,
            owner: user.UUID,
        }
    }).then(async (recipe) => {
        if(recipe == null) {
            res.status(404).send("Recipe not found or you do not have permission to delete it");
            return;
        }

        await deleteRecipe(recipeUUID);

        res.status(200).send("Recipe deleted");
    });
}

async function deleteRecipe(recipeUUID) {
    await Model.destroy({
        where: {
            UUID: recipeUUID
        }
    });

    let tagMaps = await TagMaps.findAll({
        where: {
            recipeUUID: recipeUUID
        }
    });
    
    for(let i = 0; i < tagMaps.length; i++) {
        let tag = await Tags.findByPk(tagMaps[i].tagUUID);
        await tag.decrement('count');
    }

    await TagMaps.destroy({
        where: {
            recipeUUID: recipeUUID
        }
    });
}

function tagsListToObjects(tagsList) {
    let tags = [];

    for(let i = 0; i < tagsList.length; i++) {
        tags.push({
            UUID: uuidv4(),
            name: tagsList[i].replace(' ', '_'),
        })
    }
    return tags;
}

async function manageTagMapRelationships(recipeUUID, tags) {
    recipe = await Model.findByPk("" + recipeUUID)

    for(let i = 0; i < tags.length; i++) {
        console.log(tags[i])
        Tags.findOne({where: {name : tags[i]}})
        .then((tag) => {
            recipe.addTag(tag, { through: TagMaps })
            tag.increment('count')
        })
    }
}

exports.nameAutoComplete = (req, res) => {
    let query = req.body.query;

    if(query == undefined || typeof query != "string") {
        res.status(400).send("Invalid query");
        return;
    }

    Model.findAll({
        where: {
            title: {
                [Op.like]: query + "%"
            }
        },
        limit: 8
    })

}

exports.tagAutoComplete = (req, res) => {
    let tag = req.body.query;

    console.log(tag)

    if(tag == undefined || typeof tag != "string" || tag.length < 1) {
        res.status(400).send("Invalid query");
        return;
    }

    Tags.findAll({
        where: {
            name: {
                [Op.like]: tag + "%"
            }
        },
        order: [['count', 'DESC']],
        limit: 8
    })
    .then((tags) => {
        res.status(200).send(tags);
    })
    .catch(err => {
        res.status(500).send("Error getting tags");
    })

}