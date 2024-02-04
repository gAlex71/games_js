import { generateSudoku } from "./generator.js";

export class Sudoku {
    constructor() {
        this.grid = generateSudoku();
    }
}