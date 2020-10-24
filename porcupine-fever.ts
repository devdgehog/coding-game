const numberOfCages: number = parseInt(readline());
const numberOfYears: number = parseInt(readline());

const numberOfPorcupinesAlivePerYear = new Array(numberOfYears).fill(0);

for (let cage = 0; cage < numberOfCages; cage++) {
    var inputs: string[] = readline().split(' ');
    const sick: number = parseInt(inputs[0]);
    const all: number = parseInt(inputs[2]);
    let stillAlive = all;
    for (let year = 0; year < numberOfYears; ++year) {
        stillAlive -= (sick << year);
        if (stillAlive < 0) {
            break;
        }
        numberOfPorcupinesAlivePerYear[year] += stillAlive;
    }
}

for (const numberOfPorcupinesAlive of numberOfPorcupinesAlivePerYear) {
    if (numberOfPorcupinesAlive <= 0) {
        console.log(0);
        break;
    }
    console.log(numberOfPorcupinesAlive);
}
