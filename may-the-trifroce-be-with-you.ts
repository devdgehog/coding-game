const triforceSize: number = parseInt(readline());

let spaces = `.${" ".repeat(2*triforceSize - 2)}`;
let stars = "*";

console.log(`${spaces}${stars}`);

for (let row = 1; row < triforceSize; ++row) {
    spaces = " ".repeat(2*triforceSize - 1 - row);
    stars = "*".repeat(2*row+1);
    console.log(`${spaces}${stars}`);
}

let middleSpaces: string;
for (let row = triforceSize; row < 2*triforceSize; ++row) {
    spaces = " ".repeat(2 * triforceSize - row - 1);
    stars = "*".repeat(2 * (row - triforceSize) + 1);
    middleSpaces = " ".repeat(2 * (2 * triforceSize - row) - 1);
    console.log(`${spaces}${stars}${middleSpaces}${stars}`);
}