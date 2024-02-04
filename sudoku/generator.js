import { BOX_SIZE, GRID_SIZE } from './helpers.js';

export function generateSudoku() {
    const sudoku = createEmptyGrid();
    resolveSudoku(sudoku);
    console.table(sudoku);
}

function createEmptyGrid() {
    //Генерируем двумерный массив
    return new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(null));
}

function resolveSudoku(grid) {
    const emptyCell = findEmptyCell(grid);

    if(!emptyCell) return true;

    const numbers = getRandomNumbers();

    for(let i = 0; i < numbers.length; i++) {
        if(!validate(grid, emptyCell.row, emptyCell.column, numbers[i])) continue;
        //Присваиваем пустой ячейке значение
        grid[emptyCell.row][emptyCell.column] = numbers[i];
        //Создаем рекурсию для выхода из функции
        if(resolveSudoku(grid)) return true;
        //Иначе мы заполнили пустую ячейку неверно
        grid[emptyCell.row][emptyCell.column] = null;
    }
}

function findEmptyCell(grid) {
    for(let row = 0; row < GRID_SIZE; row++){
        for(let column = 0; column < GRID_SIZE; column++){
            //Возвращаем координаты пустой ячейки
            if(grid[row][column] === null) return { row, column };
        }
    }
    return null;
}

function getRandomNumbers() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    //Перемешиваем массив чисел, идя с конца(i+1 - не включая это число)
    for(let i = numbers.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i+1));
        [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
    }

    return numbers;
}

function validate(grid, row, column, value) {
    return validateRow(grid, row, column, value)
        && validateColumn(grid, row, column, value)
        && validateBox(grid, row, column, value)
}

function validateRow(grid, row, column, value) {
    for(let iColumn = 0; iColumn < GRID_SIZE; iColumn++) {
        if(grid[row][iColumn] === value && iColumn !== column) return false;
    }
    return true;
}

function validateColumn(grid, row, column, value) {
    //Проверяем значения столбца сетки
    for(let iRow = 0; iRow < GRID_SIZE; iRow++) {
        if(grid[iRow][column] === value && iRow !== row) return false;
    }
    return true;
}

function validateBox(grid, row, column, value) {
    //Находим нулевые координаты ячейки в отдельном боксе
    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    //Проходимся по всем ячейкам бокса
    for(let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
        for(let iColumn = firstColumnInBox; iColumn< firstColumnInBox + BOX_SIZE; iColumn++) {
            if(grid[iRow][iColumn] === value && iRow !== row && iColumn !== column) return false;
        }
    }
    return true;
}