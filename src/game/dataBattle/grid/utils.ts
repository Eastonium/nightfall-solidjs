import { Position } from "./position";

// Returns an array of positions scanned using and adapted version of the algorithm below
// https://lodev.org/cgtutor/floodfill.html#Scanline_Floodfill_Algorithm_With_Stack
export function floodFindPositions(
	startPos: Position,
	_shouldExpand: (pos: Position, dist: number) => boolean
) {
	let pos = startPos.clone(), // current position being tested
		dist = 0, // current distance from starting position
		reverse: boolean, // check going backwards
		spanAbove: boolean, // trackers to see if we need to check above/below
		spanBelow: boolean; // true means don't check, already will be handled
	const stack: [cellI: number, dist: number][] = []; // working positions to test
	const positions: [cellI: number, dist: number][] = []; // final positions to return
	const shouldExpand = (pos: Position, dist: number) =>
		pos.isValid() &&
		!positions.find(([cellI]) => cellI === pos.sectorIndex) &&
		_shouldExpand(pos, dist);

	if (shouldExpand(startPos, dist)) stack.push([pos.sectorIndex, dist]);

	while (stack.length) {
		[pos.sectorIndex, dist] = stack[0]; // don't shift() off now, will need again later

		reverse = spanAbove = spanBelow = false;

		while (true) {
			positions.push([pos.sectorIndex, dist]);

			pos.offset(0, -1); // switch to above cell for tests
			if (!spanAbove && shouldExpand(pos, dist + 1)) {
				stack.push([pos.sectorIndex, dist + 1]);
				spanAbove = true;
			} else if (spanAbove && !shouldExpand(pos, dist + 1)) {
				spanAbove = false;
			}
			pos.offset(0, 2); // switch from above to below cell for tests
			if (!spanBelow && shouldExpand(pos, dist + 1)) {
				stack.push([pos.sectorIndex, dist + 1]);
				spanBelow = true;
			} else if (spanBelow && !shouldExpand(pos, dist + 1)) {
				spanBelow = false;
			}
			pos.offset(reverse ? -1 : 1, -1), dist++; // restore y position and move to next cell in row

			// go no further, check if need to reverse
			if (!shouldExpand(pos, dist)) {
				if (reverse) break; // end since it's already reversed
				reverse = !reverse; // reverse it
				[pos.sectorIndex, dist] = stack[0]; // grab starting cell data again

				// check initial position's above and below cells
				pos.offset(0, -1); // switch to above cell for test
				spanAbove = shouldExpand(pos, dist + 1);
				pos.offset(0, 2); // switch from above to below cell for test
				spanBelow = shouldExpand(pos, dist + 1);
				pos.offset(-1, -1), dist++; // restore position and move to next cell in row on forward side
				if (!shouldExpand(pos, dist)) break; // can't go forward here, end this row
			}
		}

		stack.shift(); // remove the cell from the list
	}

	return positions;
}
/**
 * Generates a set of positions N-distance away from the starting positions over each iteration
 */
export function* spreadFromPositions(
	startPositions: number[] | Set<number>,
	gridWidth: number,
	gridHeight: number
) {
	const utilPos = new Position(0, gridWidth, gridHeight);
	const positions: Set<number>[] = [
		Array.isArray(startPositions)
			? new Set(startPositions)
			: startPositions,
	];

	for (let dist = 1; ; dist++) {
		positions[dist] = new Set();
		for (let sectorIndex of positions[dist - 1]) {
			utilPos.sectorIndex = sectorIndex;
			utilPos.getSurroundingSectorIndexes().forEach((sectorIndex) => {
				if (
					positions[dist - 1].has(sectorIndex) ||
					positions[dist - 2]?.has(sectorIndex)
				) {
					return;
				}
				positions[dist].add(sectorIndex);
			});
		}
		if (positions[dist].size) yield positions[dist];
		else return positions.slice(0, -1);
	}
}

export function tracePathToPosition(
	targetPosition: Position,
	navigablePositions: ReturnType<typeof floodFindPositions>
) {
	const endPosition = navigablePositions.find(
		([sectorIndex]) => sectorIndex === targetPosition.sectorIndex
	);
	if (!targetPosition.isValid() || !endPosition) return null;
	if (endPosition[1] === 0) return [];

	const utilPos = targetPosition.clone();
	const navPath = [endPosition];
	while (navPath[0][1] > 1) {
		utilPos.sectorIndex = navPath[0][0];
		const surroundingSectorIndexes = utilPos.getSurroundingSectorIndexes();
		const nextClosestSectorIndexes = navigablePositions.filter(
			([sectorIndex, dist]) =>
				dist === navPath[0][1] - 1 &&
				surroundingSectorIndexes.includes(sectorIndex)
		);
		navPath.unshift(
			nextClosestSectorIndexes[
				Math.floor(Math.random() * nextClosestSectorIndexes.length)
			]
		);
	}
	return navPath;
}
