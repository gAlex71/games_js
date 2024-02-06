import { GRID_SIZE, convertIndexToPosition } from "./helpers.js";
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
    initCellsEvent();
}

function initCells() {
    cells = document.querySelectorAll('.cell');
    fillCells();
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
    cells.forEach(cell => cell.classList.remove('selected'));
    
    if(clickedCell.classList.contains('filled')) {
        selectedCellIndex = null;
        selectedCell = null;
    } else {
        //Если ячейка не была изначально предзаполнена
        selectedCellIndex = index;
        selectedCell = clickedCell;
        clickedCell.classList.add('selected')
    }
}