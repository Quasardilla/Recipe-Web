/* Recipe Units */

export let standardUnits = {
    fluid: [{
        name: 'Fluid Ounce',
        abbreviation: 'fl oz',
        toCups: 8,
        toLiters: 35.19508,
    },
    {
        name: 'Pint',
        abbreviation: 'pt',
        toCups: 0.5,
        toLiters: 1.759754,
    },
    {
        name: 'Quart',
        abbreviation: 'qt',
        toCups: 0.25,
        toLiters: 0.8798771,
    },
    {
        name: 'Gallon',
        abbreviation: 'gal',
        toCups: 0.0625,
        toLiters: 0.2199693,
    }],
    dry: [{
        name: 'Cup',
        abbreviation: 'C',
        toCups: 1,
        toLiters: 3.519508,
    },
    {
        name: 'Tablespoon',
        abbreviation: 'Tbsp',
        toCups: 16,
        toLiters: 56.31213,
    },
    {
        name: 'Teaspoon',
        abbreviation: 'tsp',
        toCups: 48,
        toLiters: 168.9364,
    }],
    weight: [{
        name: 'Ounce',
        abbreviation: 'oz',
        toPounds: 16,
        toKilograms: 35.27396,
    },
    {
        name: 'Pound',
        abbreviation: 'lb',
        toPounds: 1,
        toKilograms: 2.204623,
    }],
    estimate: [{
        name: 'Pinch',
        abbreviation: 'pinch',
    },
    {
        name: 'Dash',
        abbreviation: 'dash',
    },
    {
        name: 'Handful',
        abbreviation: 'handful',
    },
    {
        name: 'Sprinkle',
        abbreviation: 'sprinkle',
    },
    {
        name: 'Dollop',
        abbreviation: 'dollop',
    },
    {
        name: 'Clove',
        abbreviation: 'clove',
    },
    {
        name: 'Piece',
        abbreviation: 'piece',
    },
    {
        name: 'Slice',
        abbreviation: 'slice',
    },
    {
        name: 'Leaf',
        abbreviation: 'leaf',
    },
    {
        name: 'Stalk',
        abbreviation: 'stalk',
    },
    {
        name: 'Bunch',
        abbreviation: 'bunch',
    },
    {
        name: 'Head',
        abbreviation: 'head',
    }],
};

export let metricUnits = {
    fluid: [{
        name: 'Milliliter',
        abbreviation: 'mL',
        toLiters: 1000,
        toCups: 236.5882,
    },
    {
        name: 'Liter',
        abbreviation: 'L',
        toLiters: 1,
        toCups: 0.2365882, 
    }],
    dry: [{
        name: 'Milliliter',
        abbreviation: 'mL',
        toLiters: 1000,
        toCups: 236.5882,
    },
    {
        name: 'Tablespoon',
        abbreviation: 'Tbsp',
        toLiters: 66.6667,
        toCups: 16,
    }],
    weight: [{
            name: 'Gram',
            abbreviation: 'g',
            toKilograms: 1000,
            toPounds: 454,
    },
    {
            name: 'Kilogram',
            abbreviation: 'kg',
            toKilograms: 1,
            toPounds: 0.454,
    }],
    estimate: [{
        name: 'Pinch',
        abbreviation: 'pinch',
    },
    {
        name: 'Dash',
        abbreviation: 'dash',
    },
    {
        name: 'Handful',
        abbreviation: 'handful',
    },
    {
        name: 'Sprinkle',
        abbreviation: 'sprinkle',
    },
    {
        name: 'Dollop',
        abbreviation: 'dollop',
    },
    {
        name: 'Clove',
        abbreviation: 'clove',
    },
    {
        name: 'Piece',
        abbreviation: 'piece',
    },
    {
        name: 'Slice',
        abbreviation: 'slice',
    },
    {
        name: 'Leaf',
        abbreviation: 'leaf',
    },
    {
        name: 'Stalk',
        abbreviation: 'stalk',
    },
    {
        name: 'Bunch',
        abbreviation: 'bunch',
    },
    {
        name: 'Head',
        abbreviation: 'head',
    }],
};


/* REQUEST FUNCTIONS */

/* Request function that handles potentially dangerous requests
   Ensures the user is logged in & redirects otherwise */
export async function protectedRequest(url, method, data) {    
    let response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if(response.status == 403) {
        this.refreshToken();
        await sleep(200)
        return redirectRequest(url, method, data);
    }
    else if (response.status == 401 || response.status == 400) {
        loginRedirect();
        return;
    }

    return response;
}

/* Request function that redirects if user isn't logged in */
async function redirectRequest(url, method, data) {
    let response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.status == 403) {
        loginRedirect();
        return;
    }

    return response;
}

export async function requestWithToken(url, method, data) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async response => {
        if(response.status == 403 || response.status == 401) {
            if (await this.refreshToken())
                return this.requestWithToken(url, method, data);
            else if (localStorage.getItem('refreshingToken') === 'true') {
                // wait for token to be refreshed
                // needs to be a while loop for slower connections
                while(localStorage.getItem('refreshingToken') === 'true') {
                    await sleep(100);
                }
                return this.requestWithToken(url, method, data);
            }
        }
        return response
    });
}

export async function request(url, method, data, signal) {
    let res = await fetch(url, {
        method: method,
        signal: signal,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    return res;
}

export async function refreshTokenRedirect() {
    this.request('https://kitchen.quasardilla.com/api/tokens/', 'POST')
    .then(response => {
        if (response.status == 401 || response.status == 403)
            loginRedirect();
    })
}

export async function refreshToken() {
    if(localStorage.getItem('refreshingToken') === 'true') {
        return false;
    } else {
        localStorage.setItem('refreshingToken', 'true');
    }
    let response = await this.request('https://kitchen.quasardilla.com/api/tokens/', 'POST')
    localStorage.setItem('refreshingToken', 'false');
    return response.status == 200;
}

function loginRedirect() {
    window.location.href = 'https://kitchen.quasardilla.com/#/auth/user/login?redirect=' + location.hash;
}

/* TAG AUTOCOMPLETE FUNCTIONALITY */

let controller = new AbortController();
let signal = controller.signal;
let refreshingTag = false;

export async function refreshTagAutoComplete(event, suggestionContainerID) {
    let tags = event.srcElement.value.split(' ');
    let suggestionContainer = document.getElementById(suggestionContainerID);

    if(refreshingTag || controller.signal.aborted) {
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;
    } else {
        refreshingTag = true;
    }

    if(!tags || tags[tags.length - 1].length < 1 || !tags[tags.length - 1]) {
        suggestionContainer.innerHTML = '';
        refreshingTag = false;
        return;
    }

    request('https://kitchen.quasardilla.com/api/recipes/autocomplete/tag/', 'POST', {query: tags[tags.length - 1]}, signal)
    .then(async (response) => {
        if(response.status == 200) {
            suggestionContainer.innerHTML = '';
            let suggestedTags = await response.json();

            console.log(suggestedTags)

            suggestedTags.forEach(tag => {
                let tagElement = document.createElement('div');
                tagElement.innerHTML = tag.name + " (" + tag.count + ")";
                
                tagElement.onclick = () => {
                    tags[tags.length - 1] = tag.name;
                    let tagInput = document.getElementById('tags')
                    tagInput.value = tags.join(' ') + ' ';
                    tagInput.focus();

                    suggestionContainer.innerHTML = '';
                }

                suggestionContainer.appendChild(tagElement);
                console.log(suggestionContainer)
            });
        } else {
            suggestionContainer.innerHTML = '';
        }

        refreshingTag = false;
    })
    .catch((error) => {
        refreshingTag = false;
    })
}

/* SANITIZATION FUNCTIONS */

export function sanitizeRecipeData(string) {
    return escapeInput(string);
}

export function sanitizeTagData(string) {
    return escapeTag(string);
}

export function unEscapeInput(string) {
    var entityMap = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#96;': '`',
        '&#47;': '/',
        '&#92;': '\\',
        '&#124;': '|',
        '&#61;': '='
    };

    return String(string).replace(/&(lt|gt|quot||#39|#96|#47|#92|#124|#61);/g, function (s) {
        return entityMap[s];
    });
}

export function unEscapeRecipe(recipe) {
    recipe.recipe.title = unEscapeInput(recipe.recipe.title)
    recipe.recipe.description = unEscapeInput(recipe.recipe.description)
    recipe.recipe.notes = unEscapeInput(recipe.recipe.notes)

    console.log(recipe.recipe.description)

    for(let i = 0; i < recipe.recipe.ingredients.length; i++) {
        recipe.recipe.ingredients[i].name = unEscapeInput(recipe.recipe.ingredients[i].name)
    }

    for(let i = 0; i < recipe.recipe.steps.length; i++) {
        recipe.recipe.steps[i] = unEscapeInput(recipe.recipe.steps[i])
    }

    return recipe;
}

export function escapeInput(string) {
    var entityMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
        '/': '&#47;',
        '\\': '&#92;',
        '|': '&#124;',
        '=': '&#61;',
    };

    return String(string).replace(/[<>"'`\/\\|=]/g, function (s) {
        return entityMap[s];
    });
}

export function onlyAlphaNumericAndChars(string) {
    return String(string).replace(/[^a-zA-Z0-9 -._~!@#$%^&*:()[]{}+="']/g, '');
}

export function onlyAlphaNumericAndAcceptedChars(string) {
    return String(string).replace(/[^a-zA-Z0-9 -]/g, '');
}

export function onlyAlphaNumeric(string) {
    return String(string).replace(/[^a-zA-Z0-9]/g, '');
}
 
export function onlyAlpha(string) {
    return String(string).replace(/[^a-zA-Z]/g, '');
}

export function escapeTag(string) {
    let str = String(string).replace(/[^a-z_ ]/g, '');
    let tags = str.split(' ');
    for(let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
        
        if (tags[i] == '') {
            tags.splice(tags.indexOf(tags[i]), 1);
        }
    }
    return tags.join(' ');
}

export function onlyNumeric(string) {
    return String(string).replace(/[^0-9.]/g, '');
}

export function validateTags(string) {
    let tags = String(string).split(' ');

    if(tags.length > 50) {
        return "There are too many tags! There can only be 50 tags per recipe.";
    }

    tags.forEach(tag => {
        if(tag.length > 32) {
            return "A tag is too long! Tags can only be 32 characters long.";
        }
        if(/[^a-z_]/.test(tag)) {
            return "A tag contains invalid characters! Tags can only contain lowercase letters and underscores.";
        }
    });

    return '';
}

export function sanitizeImage() {
    //to be implemented
}

/* Basic Utility Functions */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getTime() {
    let d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let str = "";

    str += months[d.getMonth()];
    str += " " + d.getDate();
    str += ", " + d.getFullYear();
    return str;
}

/* Resizes text area to current text */
export function textareaChanged(event) {
    let textarea = event.srcElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}