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
        this.isGameOver = false;
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
        const row = -2;

        this.tetromino = {
            name,
            matrix,
            column,
            row,
            ghostColumn: column,
            ghostRow: row
        }

        this.calculateGhostPosition();
    }

    moveTetrominoDown() {
        this.tetromino.row += 1;
        if(!this.isValid()){
            this.tetromino.row -= 1;
            this.placeTetromino();
        }
    }

    moveTetrominoLeft() {
        this.tetromino.column -= 1;
        if(!this.isValid()){
            this.tetromino.column += 1;
        }else{
            this.calculateGhostPosition();
        }
    }

    moveTetrominoRight() {
        this.tetromino.column += 1;
        if(!this.isValid()){
            this.tetromino.column -= 1;
        }else{
            this.calculateGhostPosition();
        }
    }

    rotateTetromino() {
        const oldMatrix = this.tetromino.matrix;

        const rotateNewMatrix = rotateMatrix(this.tetromino.matrix);
        this.tetromino.matrix = rotateNewMatrix;

        if(!this.isValid()){
            this.tetromino.matrix = oldMatrix;
        }else{
            this.calculateGhostPosition();
        }
    }

    dropTetrominoDown() {
        this.tetromino.row = this.tetromino.ghostRow;
        //Размещаем фигуру на игровом поле
        this.placeTetromino();
    }

    isValid() {
        const matrixSize = this.tetromino.matrix.length;

        for(let row = 0; row < matrixSize; row++){
            for(let column = 0; column < matrixSize; column++){
                if(!this.tetromino.matrix[row][column]) continue;
                if(this.isOutsideOfGameBoard(row, column)) return false;
                //Проверяем, не нализают ли падающие фигуры на уже имеющиеся на поле
                if(this.isCollides(row, column)) return false;
            }
        }

        return true;
    }

    isCollides(row, column) {
        //В случае, если мы во что то упираемся, вернем строку
        return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column];
    }

    isOutsideOfGameBoard(row, column) {
        return this.tetromino.column + column < 0 ||
        this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
        this.tetromino.row + row >= this.playfield.length;
    }

    isOutsideOfTopBoard(row) {
        return this.tetromino.row + row < 0;
    }

    placeTetromino() {
        const matrixSize = this.tetromino.matrix.length;

        for(let row = 0; row < matrixSize; row++){
            for(let column = 0; column < matrixSize; column++){
                if(!this.tetromino.matrix[row][column]) continue;
                //Проверяем выходит ли строка за верхние пределы поля
                if(this.isOutsideOfTopBoard(row)){
                    this.isGameOver = true;
                    return;
                }
                
                //Добавляем в поле название фигуры
                this.playfield[this.tetromino.row + row][this.tetromino.column + column] = this.tetromino.name;
            }
        }

        //Удаляем все заполненые строки
        this.processFilledRows();
        this.generateTetromino();
    }

    processFilledRows() {
        const filledLines = this.findFilledRows();
        this.removeFilledRows(filledLines);
    }

    findFilledRows() {
        const filledRows = [];

        for(let row = 0; row < PLAYFIELD_ROWS; row++) {
            //Проверяем каждый элемент строки
            if(this.playfield[row].every(cell => Boolean(cell))) {
                filledRows.push(row);
            }
        }

        return filledRows;
    }

    removeFilledRows(filledRows) {
        filledRows.forEach(row => {
            this.dropRowsAbove(row);
        });
    }

    dropRowsAbove(rowToDelete) {
        for(let row = rowToDelete; row > 0; row--){
            this.playfield[row] = this.playfield[row - 1];
        }

        //Заполняем самую верхнюю строку
        this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
    }

    calculateGhostPosition() {
        const tetrominoRow = this.tetromino.row;
        this.tetromino.row++;
        while(this.isValid()){
            this.tetromino.row++;
        }

        this.tetromino.ghostRow = this.tetromino.row - 1;
        this.tetromino.ghostColumn = this.tetromino.column;
        this.tetromino.row = tetrominoRow;
    }
}