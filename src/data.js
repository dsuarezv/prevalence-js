

export function getRandomData(numElements, initialDate) {
    const initialEpoch = initialDate.getTime();    
    const max = 1000;
    const min = 300;    
    const result = [];

    for (let i = 0; i < numElements; i++) {
        const isOutlier = Math.random() > 0.92;
        var value = isOutlier ? getRndInteger(1, min / 20) : getRndInteger(min, max);
        result.push({ id: i, date: new Date(initialEpoch + 60000 * i), value, z: getRndInteger(0, 2) * 3 });
    }

    return result;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function getCalibrationData() {
    return [
        { id: 0, value: 0, z: 5},
        { id: 0, value: 1000, z: 5},
        { id: 3, value: 0, z: 5},
        { id: 3, value: 1000, z: 5},
        
        { id: 1, value: 10, z: 5},
        { id: 1, value: 100, z: 5},
        { id: 1, value: 500, z: 5},
    ]
}

export function getStaticData2() {
    return [
        { id: 0, value: 10, z: 10},
        { id: 1, value: 430, z: 10},
        { id: 2, value: 0, z: 10},
        { id: 3, value: 430, z: 10},
        { id: 4, value: 430, z: 11},
        { id: 5, value: 3, z: 20},
        { id: 6, value: 430, z: 10},
        { id: 7, value: 430, z: 10},
        { id: 8, value: 430, z: 10},
        { id: 9, value: 430, z: 21},
        { id: 10, value: 460, z: 10},
        { id: 11, value: 430, z: 25},
        { id: 12, value: 500, z: 10},
    ]
}