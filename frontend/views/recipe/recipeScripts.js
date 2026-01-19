let scripts = require('../../sharedScripts')

/* Ratings */
export function setRating(recipeData) {
    // gap is 15.5/596 total width between each star and the initial border
    // star width is 101/596 of the total width

    let rating = recipeData.recipe.rating || 0;

    let stars = document.getElementById('stars')

    let width = stars.width;

    let gapWidth = (15.5 / 596) * width;
    let starWidth = (101 / 596) * width;

    // let distance = gapWidth + gapWidth + gapWidth + starWidth + starWidth + starWidth/2;
    let distance = (Math.ceil(rating) * gapWidth) + (rating * starWidth);

    stars.style.clipPath = `rect(0 ${distance}px auto 0)`;
}

/* Multi-element input control*/
export function addIngredient(ingredients) {
    if(ingredients.length > 100) {
        document.getElementById('ingredient-err').innerText = 'There is a maximum of 100 ingredients per recipe. Please remove an ingredient before adding another.';
        document.getElementById('ingredient-err').classList.remove('hidden');
        return;
    } else {
        document.getElementById('ingredient-err').classList.add('hidden');
    }

    ingredients.push({
        unit: '',
        amount: null,
        name: ''
    });
}

export function removeIngredient(ingredients, index) {
    if(ingredients.length <= 1) return;

    ingredients.splice(index, 1)
}

export function addStep(steps) {
    if(steps.length > 50) {
        document.getElementById('step-err').innerText = 'There is a maximum of 50 steps per recipe. Please remove a step before adding another.';
        document.getElementById('step-err').classList.remove('hidden');
        return;
    } else {
        document.getElementById('step-err').classList.add('hidden');
    }

    steps.push("")
}

export function removeStep(steps, index) {
    if(steps.length <= 1) return;

    steps.splice(index, 1)
}

/* Recipe Saving/Loading in Cache */

export async function saveCurrentRecipe(ingredients, steps) {
    let recipe = await recipeToJSON(ingredients, steps);

    console.log("Saving recipe...");

    localStorage.setItem('unsavedRecipe', JSON.stringify(recipe));
}

export function getSavedRecipe() {
    let recipe = localStorage.getItem('unsavedRecipe');

    let ingredients = [{}];
    let steps = [''];

    if(recipe) {
        try {
            recipe = JSON.parse(recipe);
        } catch(e) {
            console.log('Error parsing saved recipe: ' + e);
            return;
        }

        console.log("loading recipe....")

        ingredients = recipe.ingredients || [{}];
        steps = recipe.steps || [''];

        document.getElementById('title').value = recipe.title || '';
        document.getElementById('cooktime').value = recipe.cooktime || '';
        document.getElementById('preptime').value = recipe.preptime || '';
        document.getElementById('servings').value = recipe.servings || '';
        document.getElementById('description').value = recipe.description || '';
        document.getElementById('notes').value = recipe.notes || '';
        document.getElementById('tags').value = recipe.tags.join(' ');
    }

    return [ingredients, steps]
}

export async function recipeToJSON(ingredients, steps) {
    let title = await document.getElementById('title').value;
    let cooktime = await document.getElementById('cooktime').value;
    let preptime = await document.getElementById('preptime').value;
    let servings = await document.getElementById('servings').value;
    let description = await document.getElementById('description').value;
    // let thumbnail
    let notes = await document.getElementById('notes').value;
    let tags = await document.getElementById('tags').value;

    if(tags && tags.length > 0) {
        tags =  scripts.sanitizeTagData(tags);

        let result =  scripts.validateTags(tags)
        if(result != '') {
            document.getElementById('tag-err').innerText = result;
            return;
        } else {
            document.getElementById('tag-err').innerText = '';
        }
    }

    if(ingredients && ingredients[0].name && ingredients[0].name != '') {
        for(let i = 0; i < ingredients.length; i++) {
            if(ingredients[i].amount > 0)
                ingredients[i].amount = scripts.onlyNumeric(ingredients[i].amount);
            if(ingredients[i].name != undefined || ingredients[i].name != '')
                ingredients[i].name = scripts.sanitizeRecipeData(ingredients[i].name);
            if(ingredients[i].unit)
                ingredients[i].unit = ingredients[i].unit;
        }
    } else {
        ingredients = [{}];
    }

    if(steps && steps[0] != '') {
        for(let i = 0; i < steps.length; i++) {
            steps[i] = scripts.sanitizeRecipeData(steps[i]);
        }
    }

    let recipe = {
        title: scripts.sanitizeRecipeData(title),
        cooktime: scripts.onlyNumeric(cooktime),
        preptime: scripts.onlyNumeric(preptime),
        servings: scripts.onlyNumeric(servings),
        description: scripts.sanitizeRecipeData(description),

        ingredients: ingredients,
        steps: steps,

        notes: scripts.sanitizeRecipeData(notes),
        tags: tags.split(' ')
    }

    console.log(recipe);

    return recipe
}