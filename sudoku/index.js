import { Sudoku } from "./sudoku.js";

const gridElement = document.querySelector('.grid');

for(let i = 0; i < 81; i++){
    const newDiv = document.createElement('div');
    newDiv.classList.add('cell');
    gridElement.appendChild(newDiv);
}

const sudoku = new Sudoku();