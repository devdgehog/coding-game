const width: number = parseInt(readline());
const height: number = parseInt(readline());

type Cell = {
    x: number;
    y: number;
};

class PowerNode {
    position: Cell;
    rightNeighbour: PowerNode | undefined;
    bottomNeighbour: PowerNode | undefined;

    constructor(position: Cell) {
        this.position = position;
    }

    display() {
        let rightX = -1;
        let rightY = -1;
        let bottomX = -1;
        let bottomY = -1;
        if (this.rightNeighbour) {
            rightX = this.rightNeighbour.position.x;
            rightY = this.rightNeighbour.position.y;
        }
        if (this.bottomNeighbour) {
            bottomX = this.bottomNeighbour.position.x;
            bottomY = this.bottomNeighbour.position.y;
        }
        console.log(
            `${this.position.x} ${this.position.y} ${rightX} ${rightY} ${bottomX} ${bottomY}`
        );
    }
};

const NODE_CHARACTER = "0";

const lowestNodes = Array.from(
    Array(width),
    () => undefined as PowerNode | undefined,
);

let line: string;
for (let i = 0; i < height; ++i) {
    line = readline();
    let latestLeftNode: PowerNode | undefined;
    for (let j = 0; j < width; ++j) {
        if (line[j] == NODE_CHARACTER) {
            const currentNode = new PowerNode({x: j, y: i} as Cell);
            const topNode = lowestNodes[j];
            if (latestLeftNode) {
                latestLeftNode.rightNeighbour = currentNode;
            }
            if (topNode) {
                topNode.bottomNeighbour = currentNode;
                topNode.display();
            }
            latestLeftNode = currentNode;
            lowestNodes[j] = currentNode;
        }
    }
}

for (const node of lowestNodes) {
    node && node.display();
}