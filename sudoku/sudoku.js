import { generateSudoku,  } from './generator.js';
import { GRID_SIZE, BOX_SIZE, findEmptyCell } from './helpers.js';

export class Sudoku {
	constructor() {
		this.grid = generateSudoku();
	}

	getDuplicatePositions(row, column, value) {
		const duplicatesInRow = this.getDuplicateInRow(row, column, value);
		const duplicatesInColumn = this.getDuplicateInColumn(row, column, value);
		const duplicatesInBox = this.getDuplicateInBox(row, column, value);

        const duplicates = [...duplicatesInRow, ...duplicatesInColumn];
        duplicatesInBox.forEach(duplicate => {
            //Избегаем повторного добавления ячейки
            if(duplicate.row !== row && duplicate.column !== column) duplicates.push(duplicate);
        })

        return duplicates;
	}

	getDuplicateInRow(row, column, value) {
		const duplicates = [];
		for (let iColumn = 0; iColumn < GRID_SIZE; iColumn++) {
			if (this.grid[row][iColumn] === value && iColumn !== column) {
				duplicates.push({ row, column: iColumn });
			}
		}
		return duplicates;
	}

	getDuplicateInColumn(row, column, value) {
		const duplicates = [];
		for (let iRow = 0; iRow < GRID_SIZE; iRow++) {
			if (this.grid[iRow][column] === value && iRow !== row) {
				duplicates.push({ row: iRow, column });
			}
		}
		return duplicates;
	}

	getDuplicateInBox(row, column, value) {
        const duplicates = [];
		//Находим нулевые координаты ячейки в отдельном боксе
		const firstRowInBox = row - (row % BOX_SIZE);
		const firstColumnInBox = column - (column % BOX_SIZE);

		//Проходимся по всем ячейкам бокса
		for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
			for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
				if (grid[iRow][iColumn] === value && iRow !== row && iColumn !== column) {
                    duplicates.push({ row: iRow, column: iColumn })
                }
			}
		}
		return duplicates;
	}

    //Проверка всех ячеек на пустоту
    hasEmptyCells() {
        return Boolean(findEmptyCell(this.grid));
    }
}
