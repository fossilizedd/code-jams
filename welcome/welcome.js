const _ = require('lodash');
const yargs = require('yargs').argv;
const fs = require('fs');

fs.readFile(yargs.input, welcome);

const phrase = 'welcome to code jam';
const phraseTest = [...phrase];
const phraseChars = [...new Set(phraseTest)];

function welcome(err, data) {
    const lines = data.toString().split('\n');
    const cases = parseInt(lines[0]);

    for (let i = 1; i < cases + 1; i++) {
        handleCase(i, lines[i]);
    }
}

function handleCase (caseNum, testCase) {
    let count = 0;

    count = countWelcome(testCase.replace(/[^acdejlmotw\s]/g, ''), phraseTest);
    const pad = ['0', '0', '0', '0', ...count.toString()].splice(-4).join('');
    console.log(`Case #${caseNum}: ${pad}`);
}

function countWelcome(testCase, remaining) {
    const casePhrase = [...testCase]

    if(remaining.length == 0) {
        return 1;
    } else if (testCase.length == 0 || testCase.length < remaining.length) {
        return 0;  
    } else if (testCase[0] !== remaining[0]) {
        return countWelcome(testCase.slice(1), remaining) % 10000;
    } else if (testCase[0] === remaining[0]) {
        return (countWelcome(testCase.slice(1), remaining.slice(1)) + countWelcome(testCase.slice(1), remaining)) % 10000;
    } else {
        console.log('something else');
    }
}

// function breakPhrase(testCase, broken) {
//     return broken.reduce((acc, curr) => {
//         acc.lastIndex = testCase.indexOf(curr, acc.lastIndex);

//         acc.indexes.push({
//             letter: curr,
//             index: acc.lastIndex
//         });

//         return acc;
//     }, {
//         indexes: [],
//         lastIndex: 0
//     }).indexes;
// }