'use strict';
const argv  = require('yargs').argv;
const _ = require('lodash');
const fs = require('fs');

fs.readFile(argv.input, (err, readFile) => {
    const data = readFile.toString().split('\n');
    const [strNTokens, strNWords, strNCases] = data[0].split(' ');
    const nTokens = parseInt(strNTokens);
    const nWords = parseInt(strNWords);
    const nCases = parseInt(strNCases);
    const words = data.slice(1, 1 + nWords);
    const cases = data.slice(1 + nWords, 1 + nWords + nCases);
    alienLanguage(nTokens, words, cases);
});

function alienLanguage (nTokens, words, cases) {

    const testMap = cases.map((testCase) => {
        return [...testCase].reduce((acc, character) => {
            if (character === '(') {
                acc.capture = true;
                acc[acc.index] = [];
            } else if (character === ')') {
                acc.capture = false;
                acc.index++;   
            } else if (acc.capture) {
                acc[acc.index].push(character);
            } else {
                acc[acc.index++] = [character];                
            }
            return acc;
        }, {
            index: 0,
            capture: false
        });
    });

    const results = testMap.reduce((acc, test) => {
        acc.push(words.map((word) => {
            return testWord(word, test); 
        }, []));
        return acc;
    }, []);

    let i = 1;
    for(let result of results) {
        console.log(`Case #${i}: ${result.filter((item) => { return item === true; }).length}`)
        i++;
    }
}

function testWord(word, language) {
    return word.split('').every((item, index) => {
        return language[index].includes(item);
    });
}