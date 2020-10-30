const size: number = parseInt(readline()); // the size of the board
const moves: number = parseInt(readline()); // the number of moves to be made

const NOT_VALID = "NOT_VALID";

enum CellType {
    EMPTY = ".",
    BLACK = "B",
    WHITE = "W",
}

class Cell {
    type: CellType;
    x: number;
    y: number;
    neighbours: Cell[];
    stoneGroup: StoneGroup;

    constructor(type: CellType, x: number, y: number) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.neighbours = [];
        this.stoneGroup = null;
    }

    setGroup(group: StoneGroup) {
        this.stoneGroup = group;
    }

    clear() {
        this.type = CellType.EMPTY;
        this.stoneGroup = null;
    }

    sametype(otherCell: Cell): boolean {
        return this.type == otherCell.type;
    }

    isEmpty() {
        return this.type == CellType.EMPTY;
    }

    increaseFreeCellsOfNeighbours() {
        const groups = new Set<StoneGroup>();
        for (const neighbour of this.neighbours) {
            groups.add(neighbour.stoneGroup);
        }
        for (const group of groups.values()) {
            group && group.increaseFreeCells();
        }
    }

    toString() {
        return this.type;
    }
}

class StoneGroup {
    stones: Cell[];
    freeCells: number;

    constructor(cell: Cell, freeCells: number) {
        this.stones = [cell];
        this.freeCells = freeCells;
        cell.stoneGroup = this;
    }

    decreaseFreeCells() {
        this.freeCells--;
        if (this.freeCells == 0) {
            for (const stone of this.stones) {
                stone.increaseFreeCellsOfNeighbours();
                stone.clear();
            }
        }
    }

    increaseFreeCells() {
        this.freeCells++;
    }

    switchGroupOfStones(group: StoneGroup) {
        for (const stone of this.stones) {
            stone.stoneGroup = group;
        }
    }

    merge(groups: StoneGroup[]) {
        for (let group of groups) {
            this.freeCells += group.freeCells;
            group.switchGroupOfStones(this);
            this.stones.push(...group.stones);
        }
    }
}

type BoardPosition = {
    x: number;
    y: number;
}

class Board {
    private content: Cell[][];

    constructor(boardSize: number) {
        this.content = Array.from(
            Array(boardSize),
            (_, row: number) => Array.from(
                Array(boardSize),
                (_, column: number) => new Cell(CellType.EMPTY, row, column)
            )
        );
        this.connectCells();
    }

    connectCells() {
        for (let i = 0; i < this.content.length; ++i) {
            for (let j = 0; j < this.content[i].length; ++j) {
                const cell = this.content[i][j];
                if (j > 0) {
                    cell.neighbours.push(this.content[i][j-1]);
                }
                if (j < this.content[i].length - 1) {
                    cell.neighbours.push(this.content[i][j+1]);
                }
                if (i > 0) {
                    cell.neighbours.push(this.content[i-1][j]);
                }
                if (i < this.content.length - 1) {
                    cell.neighbours.push(this.content[i+1][j]);
                }
            }
        }
    }

    groupNeighbours(cell: Cell) {
        const groupsOfSameKind = new Set<StoneGroup>();
        const groupsOfDifferentKind: StoneGroup[] = [];
        let sameCells = 0;
        let freeCells = 0;
        for (const neighbour of cell.neighbours) {
            if (neighbour.isEmpty()) {
                freeCells++;
            }
            else if (neighbour.sametype(cell)) {
                sameCells++;
                groupsOfSameKind.add(neighbour.stoneGroup);
            }
            else {
                groupsOfDifferentKind.push(neighbour.stoneGroup);
            }
        }
        const group = new StoneGroup(cell, freeCells - sameCells);
        group.merge([...groupsOfSameKind.values()]);
        for (const groupOfDifferentKind of groupsOfDifferentKind) {
            groupOfDifferentKind.decreaseFreeCells();
        }
        return group.freeCells > 0;
    }

    play(cellType: CellType, x: number, y: number): boolean {
        const cell = this.content[x][y];
        const cellEmpty = cell.type == CellType.EMPTY;
        if (cellEmpty) {
            cell.type = cellType;
        } else {
            return false;
        }
        const isMovementValid = this.groupNeighbours(cell);
        return isMovementValid;
    }

    print() {
        for (const row of this.content) {
            console.log(row.join(""));
        }
    }

    save() {
        return this.content.toString();
    }
}

const board = new Board(size);

for (let row = 0; row < size; ++row) {
    const rowString: string = readline(); // a single row in the input board
    for (let column = 0; column < rowString.length; ++column) {
        const character = rowString[column];
        if (character != CellType.EMPTY) {
            board.play(
                character as CellType,
                row,
                column,
            );
        }
    }
}

let wasAbleToPlay: boolean;
let ko: boolean;
let previousOpponentState: string;
let previousBoardState: string;

for (let i = 0; i < moves; i++) {
    const move: string = readline(); // a string representation of a move
    const [stoneCharacter, row, column] = move.split(" ");
    wasAbleToPlay = board.play(
        stoneCharacter as CellType,
        +row,
        +column,
    );
    if (!wasAbleToPlay) {
        console.log(NOT_VALID);
        break;
    }
    const save = board.save();
    ko = save == previousOpponentState;
    if (ko) {
        console.log(NOT_VALID);
        break;
    } else {
        previousOpponentState = previousBoardState;
        previousBoardState = save;
    }
}

if (wasAbleToPlay && !ko) {
    board.print();
}