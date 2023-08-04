// import { location } from 'svelte-spa-router';

// let location = require('svelte-spa-router').location;

export async function protectedRequest(url, method, data) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async response => {
        response.json()
        if(response.status == 403) {
            this.refreshToken();
            await sleep(200)
            return redirectRequest(url, method, data);
        }
        else if (response.status == 401 || response.status == 400) {
            loginRedirect();
        }
    });
}

async function redirectRequest(url, method, data) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(async response => {
        if (response.status == 403) {
            loginRedirect();
        }
    });
}

function sleep(ms) {
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
        }
        return response
    });
}

export async function request(url, method, data) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response
    });
}

export async function refreshTokenRedirect() {
    this.request('https://kitchen.quasardilla.com/api/tokens/', 'POST')
    .then(response => {
        if (response.status == 401 || response.status == 403)
            loginRedirect();
    })
}

export async function refreshToken() {
    let response = await this.request('https://kitchen.quasardilla.com/api/tokens/', 'POST')
    return response.status == 200;
}

function loginRedirect() {
    window.location.href = 'https://kitchen.quasardilla.com/#/auth/user/login?redirect=' + location.hash;
}