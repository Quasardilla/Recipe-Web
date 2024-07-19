const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op, QueryTypes, or } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid');
const { UUID } = require("sequelize");
const _ = require("underscore");

const Model = db[manager.fileName];
const TagMaps = db["tagmaps"];
const Tags = db["tags"];

exports.findOne = (req, res) => {
    let UUID = req.params.UUID;

    if(UUID == undefined || typeof UUID != "string") {
        res.status(400).send("Invalid UUID");
        return
    }

    Model.findOne({
        where: {
            UUID: UUID
        },
        include: Tags
    }).then(async (recipe) => {
        if(recipe == null) {
            res.status(404).send("Recipe not found");
            return;
        }
        User = await db["users"]
        User.findOne({
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

exports.createRecipe = (req, res) => {
    if(jwtManager.VerifyAccessToken(req, res))
        return;

    let title = req.body.title;
    let thumbnail = req.body.thumbnail; //not required
    let description = req.body.description;
    let ingredients = req.body.ingredients;
    let steps = req.body.steps;
    let cooktime = req.body.cooktime;
    let preptime = req.body.preptime;
    let servings = req.body.servings;
    let notes = req.body.notes; //not required
    let tags = req.body.tags;
    let recipeUUID = uuidv4();

    if(title == undefined || description == undefined || tags == undefined || typeof tags != "object" || tags[0] == undefined
        || ingredients == undefined || steps == undefined || cooktime == undefined || preptime == undefined) {
        res.status(400).send("Invalid request body");
        return;
    }

    user = jwtManager.deconstructToken(req)

    Model.create(
        {
            UUID: recipeUUID,
            owner: user.UUID,
            title: title,
            thumbnail: thumbnail,
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
        limit: 8
    })
    .then((tags) => {
        res.status(200).send(tags);
    })
    .catch(err => {
        res.status(500).send("Error getting tags");
    })

}