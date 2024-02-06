export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

export function findEmptyCell(grid) {
    for(let row = 0; row < GRID_SIZE; row++){
        for(let column = 0; column < GRID_SIZE; column++){
            //Возвращаем координаты пустой ячейки
            if(grid[row][column] === null) return { row, column };
        }
    }
    return null;
}

export function convertIndexToPosition(index) {
    return {
        row: Math.floor(index / GRID_SIZE),
        column: index % GRID_SIZE
    }
}