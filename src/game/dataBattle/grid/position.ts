export class Position {
	gridWidth: number;
	gridHeight: number;
	row: number;
	column: number;

	constructor(pos: [number, number] | number, gridWidth: number, gridHeight: number) {
		// TODO: When/if the grid is a class, pass that in instead
		if (gridWidth == null) throw Error("No grid width specified for Position");
		if (gridHeight == null) throw Error("No grid height specified for Position");
		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;

		if (Array.isArray(pos)) {
			[this.column, this.row] = pos;
		} else {
			this.column = pos % gridWidth;
			this.row = Math.floor(pos / gridWidth);
		}
	}

	get sectorIndex() {
		if (
			(this.gridWidth && (this.column < 0 || this.column >= this.gridWidth)) ||
			(this.gridHeight && (this.row < 0 || this.row >= this.gridHeight))
		) {
			return NaN;
		}
		return this.column + this.row * this.gridWidth;
	}

	up = (sectors = 1) => this.down(-sectors);
	down = (sectors = 1) => {
		this.row += sectors;
		return this;
	};
	left = (sectors = 1) => this.right(-sectors);
	right = (sectors = 1) => {
		this.column += sectors;
		return this;
	};

	isValid = () => isNaN(this.sectorIndex);
	equals = (position: Position) =>
		this === position || (this.column === position.column && this.row === position.row);
	clone = () => new Position([this.column, this.row], this.gridWidth, this.gridHeight);

	static compare(
		positionA: Position,
		positionB: Position,
		reverseColumn = false,
		reverseRow = false,
	) {
		return Math.sign(
			(positionA.row - positionB.row) * (reverseRow ? -1 : 1) ||
				(positionA.column - positionB.column) * (reverseColumn ? -1 : 1),
		);
	}
}
