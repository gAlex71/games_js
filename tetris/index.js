import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex } from "./helpers.js";
import { Tetris } from "./tetris.js";

const gridElement = document.querySelector('.grid');

for(let i = 0; i < 200; i++){
    const newDiv = document.createElement('div');
    gridElement.appendChild(newDiv);
}

const tetris = new Tetris();
//Получаем все ячейки поля
const cells = document.querySelectorAll('.grid>div');
let timeoutId;
let requestId;

moveDown();

initKeyDown();

function initKeyDown() {
    document.addEventListener('keydown', onKeyDown);
}

function onKeyDown(event) {
    switch(event.key) {
        case('ArrowUp'):
            rotate();
            break;
        case('ArrowDown'):
            moveDown();
            break;
        case('ArrowLeft'):
            moveLeft();
            break;
        case('ArrowRight'):
            moveRight();
            break;
        case(' '):
            dropDown();
            break;
        default:
            break;
    };
};

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if(tetris.isGameOver){
        gameOver();
    }
};

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
};

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
};

function dropDown() {
    tetris.dropTetrominoDown();
    draw();

    stopLoop();
    startLoop();

    if(tetris.isGameOver){
        gameOver();
    }
}

function startLoop() {
    // Используем requestAnimationFrame для запланированной перерисовки кадра
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 500);
};

function stopLoop() {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}

function draw() {
    //Очищаем от всех стилей ячейки
    cells.forEach(cell => cell.removeAttribute('class'));

    drawPlayField();
    drawTetramino();
    drawGhostTetramino();
};

function drawPlayField() {
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(!tetris.playfield[row][column]) continue;

            const name = tetris.playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

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

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
}

function drawGhostTetramino() {
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.row + row < 0) continue;
            //Пересчитываем индекс из матрицы в индекс div элементов
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            //Добавляем к div класс с именем фигуры
            cells[cellIndex].classList.add('ghost');
        }
    }
}