
exports.sanitizeRecipeData = sanitizeRecipeData;
exports.sanitizeTagData = sanitizeTagData;
exports.escapeInput = escapeInput;
exports.onlyAlphaNumericAndChars = onlyAlphaNumericAndChars;
exports.onlyAlphaNumericAndAcceptedChars = onlyAlphaNumericAndAcceptedChars;
exports.onlyAlphaNumeric = onlyAlphaNumeric;
exports.onlyAlpha = onlyAlpha;
exports.escapeTag = escapeTag;
exports.onlyNumeric = onlyNumeric;
exports.validateTags = validateTags;
// exports.sanitizeImage = sanitizeImage;

function sanitizeRecipeData(string) {
    return escapeInput(string);
}

function sanitizeTagData(string) {
    return escapeTag(string);
}

function escapeInput(string) {
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

function onlyAlphaNumericAndChars(string) {
    return String(string).replace(/[^a-zA-Z0-9 -._~!@#$%^&*:<>()[]{}+="'`\\|]/g, '');
}

function onlyAlphaNumericAndAcceptedChars(string) {
    return String(string).replace(/[^a-zA-Z0-9 -]/g, '');
}

function onlyAlphaNumeric(string) {
    return String(string).replace(/[^a-zA-Z0-9]/g, '');
}
 
function onlyAlpha(string) {
    return String(string).replace(/[^a-zA-Z]/g, '');
}

function escapeTag(string) {
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

function onlyNumeric(string) {
    return String(string).replace(/[^0-9.]/g, '');
}

function validateTags(string) {
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

function sanitizeImage() {
    //to be implemented
}