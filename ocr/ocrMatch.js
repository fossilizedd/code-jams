_ = require('lodash');
argv = require('yargs').argv;

var wordS = argv.S.toString();
var wordT = argv.T.toString();

console.log(isOCREqual(wordS, wordT));

function isOCREqual(S, T) {
    var sTokens = tokenize(S);
    var tTokens = tokenize(T);
    if (sTokens.length != tTokens.length) {
        return false;
    }
    return compareTokens(sTokens, tTokens);
}

function compareTokens(tokensS, tokensT) {
    var i = 0;
    for(i = 0; i < tokensS.length; i++){
        if (tokensS[i] !== tokensT[i] && (tokensT[i] !== '?' && tokensS[i] !== '?')) {
            return false;
        }
    }
    return true;
}

function tokenize(word) {
    var characters = word.split("");
    characters.push(null)
    var state = {
        tokens: [],
        number: ""
    };
    var reduced = _.reduce(characters, function(tokens, token) {
        if (token === null) {
            if (state.number.length > 0) {
                _.times(parseInt(state.number), function() { state.tokens.push("?");});
            }
        }
        else if (token.match(/[a-z]/i)) {
            if (state.number.length != 0) {
                _.times(parseInt(state.number), function() { state.tokens.push("?")});
                state.number = "";
            }
            state.tokens.push(token);
        }
        else {
            state.number += token;
        }
        return tokens;
    }, state);
    return reduced.tokens;
}
