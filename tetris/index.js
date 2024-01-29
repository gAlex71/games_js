import { convertPositionToIndex } from "./helpers.js";
import { Tetris } from "./tetris.js";

const gridElement = document.querySelector('.grid');

for(let i = 0; i < 200; i++){
    const newDiv = document.createElement('div');
    gridElement.appendChild(newDiv);
}

const tetris = new Tetris();
//Получаем все ячейки поля
const cells = document.querySelectorAll('.grid>div');

draw();

function draw() {
    //Очищаем от всех стилей ячейки
    cells.forEach(cell => cell.removeAttribute('class'));

    drawTetramino();
};

function drawTetramino() {
    const name = tetris.tetromino.name;
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.row + row < 0) continue;
            //Пересчитываем индекс из матрицы в индекс div элементов
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            //Добавляем к div класс с именем фигуры
            cells[cellIndex].classList.add(name);
        }
    }
}