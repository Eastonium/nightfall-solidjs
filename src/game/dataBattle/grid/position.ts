export class Position {
	gridWidth: number;
	gridHeight: number;
	row: number;
	column: number;

	constructor(
		pos: [number, number] | number, // [x,y] pair or sectorIndex
		gridWidth: number,
		gridHeight: number
	) {
		// TODO: When/if the grid is a class, pass that in instead
		if (gridWidth == null)
			throw Error("No grid width specified for Position");
		if (gridHeight == null)
			throw Error("No grid height specified for Position");
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
		return this.isValid() ? this.column + this.row * this.gridWidth : NaN;
	}
	set sectorIndex(sectorIndex: number) {
		this.column = sectorIndex % this.gridWidth;
		this.row = Math.floor(sectorIndex / this.gridWidth);
	}

	offset = (xOffset: number, yOffset: number) => {
		this.column += xOffset;
		this.row += yOffset;
		return this;
	};

	isValid = () =>
		this.column >= 0 &&
		this.column < this.gridWidth &&
		this.row >= 0 &&
		this.row < this.gridHeight;
	equals = (position: Position) =>
		this === position ||
		(this.column === position.column && this.row === position.row);
	clone = (xOffset = 0, yOffset = 0) =>
		new Position(
			[this.column, this.row],
			this.gridWidth,
			this.gridHeight
		).offset(xOffset, yOffset);
	new = (sectorIndex: number) => {
		const pos = this.clone();
		pos.sectorIndex = sectorIndex;
		return pos;
	};

	static compare(
		positionA: Position,
		positionB: Position,
		reverseColumn = false,
		reverseRow = false
	) {
		return Math.sign(
			(positionA.row - positionB.row) * (reverseRow ? -1 : 1) ||
				(positionA.column - positionB.column) * (reverseColumn ? -1 : 1)
		);
	}
}
