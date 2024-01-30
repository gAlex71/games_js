import { 
    PLAYFIELD_COLUMNS, 
    PLAYFIELD_ROWS, 
    TETROMINOES, 
    TETROMINONAMES, 
    getRandomElement,
    rotateMatrix
} from "./helpers.js";

export class Tetris {
    constructor() {
        this.playfield;
        this.tetromino;
        this.init();
    }

    init() {
        this.generatePlayField();
        this.generateTetromino();
    }

    generatePlayField() {
        //Создаем копию нашего поля
        this.playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));

        console.table(this.playfield);
    }

    generateTetromino() {
        const name = getRandomElement(TETROMINONAMES);
        const matrix = TETROMINOES[name];

        const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);
        // const row = -2;
        const row = 3;

        this.tetromino = {
            name,
            matrix,
            column,
            row
        }
    }

    moveTetrominoDown() {
        this.tetromino.row += 1;
        if(!this.isValid()){
            this.tetromino.row -= 1;
        }
    }

    moveTetrominoLeft() {
        this.tetromino.column -= 1;
        if(!this.isValid()){
            this.tetromino.column += 1;
        }
    }

    moveTetrominoRight() {
        this.tetromino.column += 1;
        if(!this.isValid()){
            this.tetromino.column -= 1;
        }
    }

    rotateTetromino() {
        const oldMatrix = this.tetromino.matrix;

        const rotateNewMatrix = rotateMatrix(this.tetromino.matrix);
        this.tetromino.matrix = rotateNewMatrix;

        if(!this.isValid()){
            this.tetromino.matrix = oldMatrix;
        }
    }

    isValid() {
        const matrixSize = this.tetromino.matrix.length;

        for(let row = 0; row < matrixSize; row++){
            for(let column = 0; column < matrixSize; column++){
                if(!this.tetromino.matrix[row][column]) continue;
                if(this.isOutsideOfGameBoard(row, column)) return false;
            }
        }

        return true;
    }

    isOutsideOfGameBoard(row, column) {
        return this.tetromino.column + column < 0 ||
        this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
        this.tetromino.row + row >= this.playfield.length
    }
}