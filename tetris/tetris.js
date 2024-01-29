import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from "./helpers.js";

export class Tetris {
    constructor() {
        this.playfield;
        this.tetromino;
        this.init();
    }

    init() {
        this.generatePlayField();
    }

    generatePlayField() {
        //Создаем копию нашего поля
        this.playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0));

        console.table(this.playfield);
    }
}