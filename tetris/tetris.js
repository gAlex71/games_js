import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETROMINOES, TETROMINONAMES, getRandomElement } from "./helpers.js";

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
}