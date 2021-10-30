/** @jsxImportSource @emotion/react */
// import { css } from "@emotion/react";
export default null;
// const Targets = (position: Position, type, cellTrueEmptyState, distance: number) => {};

// function floodFillScanline(startX: number, startY: number, newColor, oldColor) {
// 	if (oldColor === newColor) return;

// 	let x, spanAbove, spanBelow;

// 	const arr = [startX, startY];
// 	while (arr.length) {
// 		const y = arr.pop();

// 		while (x >= 0 && screenBuffer[x + y * w] === oldColor) x--;
// 		x++;
// 		spanAbove = spanBelow = false;

// 		while (x < w && screenBuffer[x + y * w] === oldColor) {
// 			screenBuffer[y * w + x] = newColor;

// 			if (!spanAbove && y > 0 && screenBuffer[x + (y - 1) * w] === oldColor) {
// 				arr.push(x, y - 1);
// 				spanAbove = true;
// 			} else if (spanAbove && y > 0 && screenBuffer[x + (y - 1) * w] !== oldColor) {
// 				spanAbove = false;
// 			}

// 			if (!spanBelow && y < h - 1 && screenBuffer[x + (y + 1) * w] === oldColor) {
// 				arr.push(x, y + 1);
// 				spanBelow = true;
// 			} else if (spanBelow && y < h - 1 && screenBuffer[x + (y + 1) * w] !== oldColor) {
// 				spanBelow = false;
// 			}

// 			x++;
// 		}
// 	}
// }
