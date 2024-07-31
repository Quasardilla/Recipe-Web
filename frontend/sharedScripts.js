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

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

export async function requestWithToken(url, method, data) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async response => {
        response.json()
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

export async function request(url, method, data) {
    let res = await fetch(url, {
        method: method,
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

export async function refreshTagAutoComplete(event) {
    let tags = event.srcElement.value.split(' ');
    let suggestionContainer = document.getElementById('tagSuggestions')

    if(!tags || tags[tags.length - 1].length < 1) {
        suggestionContainer.innerHTML = '';
        return;
    }

    request('https://kitchen.quasardilla.com/api/recipes/autocomplete/tag/', 'POST', {query: tags[tags.length - 1]})
    .then(async (response) => {
        if(response.status == 200) {
            suggestionContainer.innerHTML = '';
            let suggestedTags = await response.json();

            suggestedTags.forEach(tag => {
                let tagElement = document.createElement('div');
                tagElement.innerHTML = tag.name;
                
                tagElement.onclick = () => {
                    tags[tags.length - 1] = tag.name;
                    let tagInput = document.getElementById('tags')
                    tagInput.value = tags.join(' ') + ' ';
                    tagInput.focus();

                    suggestionContainer.innerHTML = '';
                }

                suggestionContainer.appendChild(tagElement);
            });
        } else {
            suggestionContainer.innerHTML = '';
        }
    })
    .catch((error) => {
        console.log(error);
    })
}

export async function sanitizeRecipeData(string) {
    return escapeInput(await onlyAlphaNumericAndChars(string));
}

export async function sanitizeTagData(string) {
    return escapeTag(string);
}

export async function escapeInput(string) {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

export async function onlyAlphaNumericAndChars(string) {
    return String(string).replace(/[^a-zA-Z0-9 -._~!@#$%^&*()+="']/g, '');
}

export async function onlyAlphaNumericAndAcceptedChars(string) {
    return String(string).replace(/[^a-zA-Z0-9 -]/g, '');
}

export async function onlyAlphaNumeric(string) {
    return String(string).replace(/[^a-zA-Z0-9]/g, '');
}

export async function onlyAlpha(string) {
    return String(string).replace(/[^a-zA-Z]/g, '');
}

export async function escapeTag(string) {
    str = String(string).replace(/[^a-z- ]/g, '');
    tags = str.split(' ');
    for(let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase();
        
        if (tag = '') {
            tags.splice(tags.indexOf(tag), 1);
        }
    }
    return tags.join(' ');
}

export async function onlyNumeric(string) {
    return String(string).replace(/[^0-9]/g, '');
}

export async function validateTags(string) {
    tags = String(string).split(' ');

    if(tags.length > 50) {
        return "There are too many tags! There can only be 50 tags per recipe.";
    }

    tags.forEach(tag => {
        if(tag.length > 32) {
            return "A tag is too long! Tags can only be 32 characters long.";
        }
    });

    return;
}