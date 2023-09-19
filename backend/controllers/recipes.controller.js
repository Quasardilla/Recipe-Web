const manager = require("../config/manager.config.js")(__filename);
const db = require("../config/main.js");
const { Op } = require("sequelize");
const jwtManager = require("../universal/jwtManager.js");
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid');

const Model = db[manager.fileName];
const TagMap = db["tagmaps"];
const Tag = db["tags"];

exports.findAll = (req, res) => {
    let limit = req.body.limit;
    let offset = req.body.offset;

    if(typeof limit != "number" || typeof offset != "number") {
        res.status(400).send("Invalid limit or offset");
        return;
    } 

    if(limit == undefined) limit = 10;
    else if(limit > 100) limit = 100;

    if(offset == undefined) offset = 0;
    else if(offset < 0) offset = 0;


    let tags = req.body.tags;

    if(tags == undefined) {
        res.status(400).send("Invalid tags");
        return;
    }

    Model.findAll({
        attributes: [['recipeUUID', 'ID'], 'title', 'thumbnail', 'description', 'cooktime', 'preptime'],
        limit: limit,
        offset: offset,
    }).then((result) => {
        res.status(200).send(result);
    })
}

exports.findAllWithQuery = (req, res) => {
    res.status(404).send("Not implemented");
}

exports.findAllWithTags = (req, res) => {
    console.log(req.body)

    let tags = req.body.tags;
    let limit = req.body.limit;
    let offset = req.body.offset;

    if(typeof limit != "number" || typeof offset != "number" || typeof tags != "object") {
        res.status(400).send("Invalid limit or offset");
        return;
    } 

    if(limit == undefined) limit = 10;
    else if(limit > 100) limit = 100;

    if(offset == undefined) offset = 0;
    else if(offset < 0) offset = 0;

    if(tags == undefined) {
        res.status(400).send("Invalid tags");
        return;
    }

    Model.query(`
    SELECT r.recipeUUID AS ID, r.title, r.thumbnail, r.description, r.cooktime, r.preptime
    FROM recipes r, tagmaps tm, tags t
    LIMIT :limit OFFSET :offset
    WHERE tm.tagUUID = t.tagUUID
    AND (t.NAME IN (:tags))
    AND r.recipeUUID = tm.recipeUUID
    GROUP BY r.recipeUUID
    HAVING COUNT( t.id ) = :tagCount;
    `, {
        replacements: { tags: tags.toString(), tagCount: tags.length, limit: limit, offset: offset },
        type: QueryTypes.SELECT
    }).then((result) => {
        res.status(200).send(result);
    })
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
    let tags = req.body.tags; //not required

    if(title == undefined || description == undefined || tags == undefined
        || ingredients == undefined || steps == undefined || cooktime == undefined || preptime == undefined) {
        res.status(400).send("Invalid request body");
        return;
    }

    Model.create({
        recipeUUID: uuidv4(),
        owner: user.id,
        title: title,
        thumbnail: thumbnail,
        description: description,
        ingredients: ingredients,
        steps: steps,
        cooktime: cooktime,
        preptime: preptime,
        saves: 0,
    }).then((result) => {
        res.status(200).send(result);
        let recipeUUID = result.recipeUUID;
        for(let i = 0; i < tags.length; i++) {
            Tag.create({
                tagUUID: uuidv4(),
                name: tags[i],
            })
            .then((result1) => {
                TagMap.create({
                    tagmapUUID: uuidv4(),
                    recipeUUID: recipeUUID,
                    tagUUID: result1.tagUUID,
                })
            })
        }
        
    })
}