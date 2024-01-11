import { Show } from "solid-js";
import { css, keyframes } from "solid-styled-components";

import { useDataBattle } from "../store";
import { gridUnitSize } from "./segment";

export const GridCursor = () => {
	const [{ selectionPosition }] = useDataBattle();

	return (
		<Show when={selectionPosition()}>
			<rect
				class={gridCursorStyles}
				transform={`translate(${
					selectionPosition()!.x * gridUnitSize
				} ${selectionPosition()!.y * gridUnitSize})`}
				x={1}
				y={1}
				width={gridUnitSize - 2}
				height={gridUnitSize - 2}
				data-ref="cursor"
			/>
		</Show>
	);
};
const gridCursorStyles = css`
	fill: none;
	stroke: #fff;
	stroke-width: 2;
	animation: 530ms infinite ${keyframes({ to: { stroke: "transparent" } })};
	pointer-events: none;
`;
