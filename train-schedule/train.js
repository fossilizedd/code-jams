'use strict';
const _ = require('lodash');
const argv = require('yargs').argv;
const fs = require('fs');

fs.readFile(argv.input, breakData);

function breakData(err, data) {
    const lines = data.toString().split("\n");
    let index = 0;
    const cases = parseInt(lines[index++]);

    for(let i = 1; i <= cases; i++) {
        const turnaround = parseInt(lines[index++]);
        const [ aScheduleCount, bScheduleCount ] = lines[index++].split(' ').map((item) => { return parseInt(item) });
        const caseLines = lines.slice(index, index + aScheduleCount + bScheduleCount);
        handleCase(i, caseLines, aScheduleCount, bScheduleCount, turnaround)
        index = index + aScheduleCount + bScheduleCount;
    } 

}

function handleCase(caseNum, data, aScheduleCount, bScheduleCount, turnaround) {
    const aSchedule = data.slice(0, aScheduleCount).map(readSchedule).map((item) => {
        item.station = 'A';
        return item;  
    });
    const bSchedule = data.slice(aScheduleCount).map(readSchedule).map((item) => {
        item.station = 'B';
        return item;  
    });

    const engine = [...aSchedule, ...bSchedule].reduce(function(acc, curr) {
        publishDepartEvent(acc, curr, turnaround);
        return acc; 
    }, []);

    let events = _.sortBy(engine, ['time', 'priority']);
    const result = {
        startA: 0,
        startB: 0,
        A: 0,
        B: 0        
    }

    while(events.length > 0) {
        let curr = events.shift();
         if (curr.type === 'supply') {
            result[curr.station]++;
        } else if (curr.type === 'need') {
            if (result[curr.station] <= 0) {
                result[curr.station]++;
                result['start' + curr.station]++;
            }
            publishArriveEvent(events, curr.timeTable, turnaround);
            events = _.sortBy(events, ['time', 'priority']);
            result[curr.station]--;
        }
    }
    let { startA, startB } = result;

    console.log(`Case #${caseNum}: ${startA} ${startB}`);
}

function publishDepartEvent(events, item, turnaround) {
    const supplyStation = item.station === 'A' ? 'B' : 'A';

    events.push({
        type: 'need',
        priority: 1,
        station: item.station,
        time: item.depart,
        timeTable: item
    });

    return events;
}

function publishArriveEvent(events, item, turnaround) {
    const supplyStation = item.station === 'A' ? 'B' : 'A';
    
    events.push({
        type: 'supply',
        priority: 0,
        station: supplyStation,
        time: item.arrive + turnaround
    });
}

function readSchedule(line) {
    const [ departure, arrival ] = line.split(' ');
    return {
        depart: parseTime(departure),
        arrive: parseTime(arrival)
    }
}

function parseTime(time) {
    const [ hour, minutes ] = time.split(':');
    return parseInt(hour) * 60 + parseInt(minutes);
}