import { BOX_SIZE, GRID_SIZE, convertIndexToPosition, convertPositionToIndex } from "./helpers.js";
import { Sudoku } from "./sudoku.js";

const gridElement = document.querySelector('.grid');

for(let i = 0; i < 81; i++){
    const newDiv = document.createElement('div');
    newDiv.classList.add('cell');
    gridElement.appendChild(newDiv);
}

const sudoku = new Sudoku();
let cells;
let selectedCellIndex;
let selectedCell;
init();

function init() {
    initCells();
    initNumbers();
}

function initCells() {
    cells = document.querySelectorAll('.cell');
    fillCells();
    initCellsEvent();
}

function fillCells() {
    for(let i =0; i < GRID_SIZE * GRID_SIZE; i++) {
        const {row, column} = convertIndexToPosition(i);

        if(sudoku.grid[row][column] !== null) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = sudoku.grid[row][column];
        }
    }
}

function initCellsEvent() {
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => onCellClick(cell, index));
    })
}

function onCellClick(clickedCell, index) {
    cells.forEach(cell => cell.classList.remove('selected', 'highlighted', 'error', 'shake'));

    if(clickedCell.classList.contains('filled')) {
        selectedCellIndex = null;
        selectedCell = null;
    } else {
        //Если ячейка не была изначально предзаполнена
        selectedCellIndex = index;
        selectedCell = clickedCell;
        clickedCell.classList.add('selected');
        //Подсвечиваем рядом стоящие элементы
        highlightCellBy(index);
    }

    if(clickedCell.innerHTML === '') return;

    cells.forEach((cell) => {
        if(cell.innerHTML === clickedCell.innerHTML) cell.classList.add('selected'); 
    })
}

function highlightCellBy(index) {
    highlightColumnBy(index);
    highlightRowBy(index);
    highlightBoxBy(index);
}

function highlightColumnBy(index) {
    const column = index % GRID_SIZE;

    for(let row = 0; row < GRID_SIZE; row++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add('highlighted');
    }
}

function highlightRowBy(index) {
    const row = Math.floor(index / GRID_SIZE);

    for(let column = 0; column < GRID_SIZE; column++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add('highlighted');
    }
}

function highlightBoxBy(index) {
    const column = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);

    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    for(let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++){
        for(let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
            const cellIndex = convertPositionToIndex(iRow, iColumn);
            cells[cellIndex].classList.add('highlighted');
        }
    }
}

function highlightDuplicates(duplicatesPositions) {
    duplicatesPositions.forEach(duplicate => {
        const index = convertPositionToIndex(duplicate.row, duplicate.column);
        //Без setTimeout работать будет неверно
        setTimeout(() => cells[index].classList.add('error', 'shake'), 0);
    })
}

function initNumbers() {
    const numbers = document.querySelectorAll('.number');

    numbers.forEach(number => {
        number.addEventListener('click', () => onNumberClick(parseInt(number.innerHTML)));
    })
}

function onNumberClick(number) {
    if(!selectedCell) return;
    if(selectedCell.classList.contains('filled')) return;

    cells.forEach(cell => cell.classList.remove('error', 'shake', 'zoom', 'selected'));
    selectedCell.classList.add('selected');

    setValueInSelectedCell(number);
}

function setValueInSelectedCell(number) {
    const {row, column} = convertIndexToPosition(selectedCellIndex);
    const duplicatesPositions = sudoku.getDuplicatePositions(row, column, number);

    //Подсвечиваем дублирующие значения
    if(duplicatesPositions.length) {
        highlightDuplicates(duplicatesPositions);
        return;
    }
    //Добавляем значение в ячейку
    sudoku.grid[row][column] = number;
    selectedCell.innerHTML = number;
    setTimeout(() => selectedCell.classList.add('zoom'), 0);
}