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
		spanAbove: boolean,
		spanBelow: boolean;
	const stack: [cellI: number, dist: number][] = []; // working positions to test
	const positions: [cellI: number, dist: number][] = []; // final positions to return
	const shouldExpand = (pos: Position, dist: number) =>
		pos.isValid() &&
		!positions.find(([cellI]) => cellI === pos.sectorIndex) &&
		_shouldExpand(pos, dist);

	if (shouldExpand(startPos, dist)) stack.push([pos.sectorIndex, dist]);

	while (stack.length) {
		[pos.sectorIndex, dist] = stack[0]; // don't shift() off now, will need again later

		// check initial above and below cells
		pos.offset(0, -1); // switch to above cell for tests
		if (shouldExpand(pos, dist + 1)) stack.push([pos.sectorIndex, dist + 1]);
		pos.offset(0, 2); // switch from above to below cell for tests
		if (shouldExpand(pos, dist + 1)) stack.push([pos.sectorIndex, dist + 1]);
		pos.offset(0, -1); // restore position

		reverse = spanAbove = spanBelow = true; // 1st above/below is handled, assume span to start

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
				if (!reverse) break; // end since we start going in reverse and its already going forward
				reverse = !reverse;

				[pos.sectorIndex, dist] = stack[0]; // grab starting cell data again
				pos.offset(1, 0), dist++; // move to next cell in row on forward side
				if (!shouldExpand(pos, dist)) break; // can't go forward here, end this row
			}
		}

		stack.shift(); // remove the cell from the list
	}

	return positions;
}
