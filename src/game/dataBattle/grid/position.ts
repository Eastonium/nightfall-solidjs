export class Position {
	readonly gridWidth: number;
	readonly gridHeight: number;
	x: number;
	y: number;

	constructor(
		pos: [number, number] | number, // [x,y] pair or sectorIndex
		gridWidth: number,
		gridHeight: number
	) {
		this.gridWidth = gridWidth;
		this.gridHeight = gridHeight;

		if (Array.isArray(pos)) {
			[this.x, this.y] = pos;
		} else {
			this.x = pos % gridWidth;
			this.y = Math.floor(pos / gridWidth);
		}
	}

	get xy() {
		return [this.x, this.y] as const;
	}
	get sectorIndex() {
		return this.isValid() ? this.x + this.y * this.gridWidth : NaN;
	}
	set sectorIndex(sectorIndex: number) {
		this.x = sectorIndex % this.gridWidth;
		this.y = Math.floor(sectorIndex / this.gridWidth);
	}
	getSurroundingSectorIndexes = () => {
		const sectorIndexes: typeof this.sectorIndex[] = [];
		if (this.y > 0) sectorIndexes.push(this.sectorIndex - this.gridWidth);
		if (this.x > 0) sectorIndexes.push(this.sectorIndex - 1);
		if (this.x < this.gridWidth - 1)
			sectorIndexes.push(this.sectorIndex + 1);
		if (this.y < this.gridHeight - 1)
			sectorIndexes.push(this.sectorIndex + this.gridWidth);
		return sectorIndexes;
	};

	offset = (xOffset: number, yOffset: number) => {
		this.x += xOffset;
		this.y += yOffset;
		return this;
	};

	isValid = () =>
		this.x >= 0 &&
		this.x < this.gridWidth &&
		this.y >= 0 &&
		this.y < this.gridHeight;
	equals = (position: Position) =>
		this === position || (this.x === position.x && this.y === position.y);
	clone = (xOffset = 0, yOffset = 0) =>
		new Position([this.x, this.y], this.gridWidth, this.gridHeight).offset(
			xOffset,
			yOffset
		);
	new = (sectorIndex: number) => {
		const pos = this.clone();
		pos.sectorIndex = sectorIndex;
		return pos;
	};

	static compare(
		positionA: Position,
		positionB: Position,
		invertX = false,
		invertY = false
	) {
		return Math.sign(
			(positionA.y - positionB.y) * (invertY ? -1 : 1) ||
				(positionA.x - positionB.x) * (invertX ? -1 : 1)
		);
	}
}
