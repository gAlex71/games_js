import { BOX_SIZE, GRID_SIZE } from './helpers';

export function generateSudoku() {
    const sudoku = createEmptyGrid();
    resolveSudoku(sudoku);
}

function createEmptyGrid() {
    //Генерируем двумерный массив
    return new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(null));
}

function resolveSudoku(grid) {}